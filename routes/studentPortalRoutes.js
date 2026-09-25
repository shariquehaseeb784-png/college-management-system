const express = require("express");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, authorize("student"));

router.get("/profile", async (req, res) => {
    const student = await Student.findById(req.user.studentId).select("-password");
    if (!student) return res.status(404).json({ message: "Student profile not found" });
    res.json(student);
});

router.get("/attendance", async (req, res) => {
    const records = await Attendance.find({ student: req.user.studentId }).sort({ date: -1, createdAt: -1 });
    const present = records.filter(r => r.status === "Present").length;
    res.json({ records, summary: { total: records.length, present, absent: records.length - present, percentage: records.length ? (present / records.length) * 100 : 0 } });
});

router.get("/marks", async (req, res) => {
    const records = await Marks.find({ student: req.user.studentId }).sort({ subject: 1 });
    const total = records.reduce((sum, r) => sum + Number(r.marks), 0);
    const percentage = records.length ? total / records.length : 0;
    const grade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "F";
    res.json({ records, summary: { total, subjects: records.length, percentage, grade, result: percentage >= 40 ? "PASS" : "FAIL" } });
});

router.get("/dashboard", async (req, res) => {
    const [student, attendance, marks] = await Promise.all([
        Student.findById(req.user.studentId).select("-password"),
        Attendance.find({ student: req.user.studentId }),
        Marks.find({ student: req.user.studentId })
    ]);
    if (!student) return res.status(404).json({ message: "Student profile not found" });
    const present = attendance.filter(r => r.status === "Present").length;
    const totalMarks = marks.reduce((s, r) => s + Number(r.marks), 0);
    const percentage = marks.length ? totalMarks / marks.length : 0;
    res.json({
        student,
        attendance: { total: attendance.length, present, absent: attendance.length - present, percentage: attendance.length ? (present / attendance.length) * 100 : 0 },
        marks: { total: totalMarks, subjects: marks.length, percentage, grade: percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "F", result: percentage >= 40 ? "PASS" : "FAIL" }
    });
});

module.exports = router;
