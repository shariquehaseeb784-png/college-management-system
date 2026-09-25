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
        if (mode === "student") {
            const rollNumber = String(req.body.rollNumber || "").trim();
            if (!email || !rollNumber) return res.status(400).json({ message: "Registered Gmail and roll number are required" });
            const student = await Student.findOne({ email, rollNumber });
            if (!student) return res.status(401).json({ message: "Invalid registered Gmail or roll number" });
            const user = await User.findOne({ student: student._id, role: "student" });
            if (!user) return res.status(401).json({ message: "Student login account not found. Ask admin to add the student." });
            const token = jwt.sign({ id: user._id.toString(), role: "student", studentId: student._id.toString() }, JWT_SECRET, { expiresIn: "8h" });
            return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: "student", studentId: student._id } });
        }
        const password = String(req.body.password || "");

        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id.toString(), role: user.role, studentId: user.student ? user.student.toString() : null },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.student }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

router.get("/me", authenticate, async (req, res) => {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

module.exports = router;
