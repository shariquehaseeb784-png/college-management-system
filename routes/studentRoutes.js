const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Add student
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Student added successfully",
            student: savedStudent
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Roll number already exists"
            });
        }

        res.status(500).json({
            message: "Error adding student",
            error: error.message
        });
    }
});

// Get all students
router.get("/", async (req, res) => {
    try {
        const students = await Student
            .find()
            .sort({ createdAt: -1 });

        res.json(students);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
});

// Delete student
router.delete("/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});

module.exports = router;