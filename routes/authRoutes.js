const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const { authenticate, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const mode = String(req.body.mode || "password");
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (mode === "student") {
            let user = await User.findOne({ email, role: "student" }).populate("student");

            if (!user) {
                const student = await Student.findOne({ email });

                if (!student) {
                    return res.status(401).json({ message: "Student account not found for this Gmail" });
                }

                user = await User.create({
                    name: student.name,
                    email: student.email,
                    passwordHash: await bcrypt.hash(student.rollNumber, 10),
                    role: "student",
                    student: student._id
                });
            }

            if (!(await bcrypt.compare(password, user.passwordHash))) {
                return res.status(401).json({ message: "Invalid student password" });
            }

            const studentId = user.student?._id
                ? user.student._id.toString()
                : user.student?.toString() || null;

            const token = jwt.sign(
                {
                    id: user._id.toString(),
                    role: "student",
                    studentId
                },
                JWT_SECRET,
                { expiresIn: "8h" }
            );

            return res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: "student",
                    studentId
                }
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role,
                studentId: user.student ? user.student.toString() : null
            },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.student
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

router.get("/me", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch user", error: error.message });
    }
});

module.exports = router;
