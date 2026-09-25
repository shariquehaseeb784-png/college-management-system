const express = require("express");
const Marks = require("../models/Marks");

const router = express.Router();

// Add marks
router.post("/", async (req, res) => {
    try {
        const { student, subject, marks } = req.body;

        const result = new Marks({
            student,
            subject,
            marks
        });

        const savedResult = await result.save();

        res.status(201).json({
            message: "Marks added successfully",
            result: savedResult
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding marks",
            error: error.message
        });
    }
});


// Get all marks
router.get("/", async (req, res) => {
    try {
        const results = await Marks
            .find()
            .populate("student", "name rollNumber course")
            .sort({ createdAt: -1 });

        res.json(results);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching marks",
            error: error.message
        });
    }
});


// Delete marks
router.delete("/:id", async (req, res) => {
    try {
        await Marks.findByIdAndDelete(req.params.id);

        res.json({
            message: "Marks deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting marks",
            error: error.message
        });
    }
});

module.exports = router;