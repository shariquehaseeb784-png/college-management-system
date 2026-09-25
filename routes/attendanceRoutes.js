const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// Mark attendance
router.post("/", async (req, res) => {
    try {
        const { student, date, status } = req.body;

        const attendance = new Attendance({
            student,
            date,
            status
        });

        const savedAttendance = await attendance.save();

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance: savedAttendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Error marking attendance",
            error: error.message
        });
    }
});


// Get all attendance
router.get("/", async (req, res) => {
    try {
        const attendance = await Attendance
            .find()
            .populate("student", "name rollNumber course")
            .sort({ createdAt: -1 });

        res.json(attendance);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching attendance",
            error: error.message
        });
    }
});


// Delete attendance
router.delete("/:id", async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);

        res.json({
            message: "Attendance deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting attendance",
            error: error.message
        });
    }
});

module.exports = router;