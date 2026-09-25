async function loadDashboard() {

    try {

        // Get students
        const studentsResponse =
            await fetch("/api/students");

        const students =
            await studentsResponse.json();


        // Get attendance
        const attendanceResponse =
            await fetch("/api/attendance");

        const attendance =
            await attendanceResponse.json();


        // Get marks
        const marksResponse =
            await fetch("/api/marks");

        const marks =
            await marksResponse.json();


        // Total counts
        document.getElementById("totalStudents")
            .textContent = students.length;

        document.getElementById("totalAttendance")
            .textContent = attendance.length;

        document.getElementById("totalMarks")
            .textContent = marks.length;


        // Attendance calculation
        const present =
            attendance.filter(
                record => record.status === "Present"
            ).length;

        const absent =
            attendance.filter(
                record => record.status === "Absent"
            ).length;


        // Show attendance
        document.getElementById("presentCount")
            .textContent = present;

        document.getElementById("presentBox")
            .textContent = present;

        document.getElementById("absentBox")
            .textContent = absent;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }
}


// Load dashboard
loadDashboard();