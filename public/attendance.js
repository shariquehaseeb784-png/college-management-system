const studentSelect = document.getElementById("student");
const attendanceForm = document.getElementById("attendanceForm");
const attendanceList = document.getElementById("attendanceList");
const attendanceSummary = document.getElementById("attendanceSummary");


// Load students into dropdown
async function loadStudents() {

    const response = await fetch("/api/students");
    const students = await response.json();

    studentSelect.innerHTML =
        '<option value="">Select Student</option>';

    students.forEach(student => {

        const option = document.createElement("option");

        option.value = student._id;

        option.textContent =
            `${student.name} - ${student.rollNumber}`;

        studentSelect.appendChild(option);
    });
}


// Load attendance records
async function loadAttendance() {

    const response = await fetch("/api/attendance");

    const records = await response.json();

    attendanceList.innerHTML = "";

    records.forEach(record => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.student.name}</td>
            <td>${record.student.rollNumber}</td>
            <td>${record.date}</td>
            <td>${record.status}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteAttendance('${record._id}')"
                >
                    Delete
                </button>
            </td>
        `;

        attendanceList.appendChild(row);
    });

    calculateAttendance(records);
}


// Calculate attendance percentage
function calculateAttendance(records) {

    if (records.length === 0) {

        attendanceSummary.innerHTML =
            "<p>No attendance records available.</p>";

        return;
    }


    // Group records by student
    const studentAttendance = {};


    records.forEach(record => {

        const studentId =
            record.student._id;

        if (!studentAttendance[studentId]) {

            studentAttendance[studentId] = {

                name:
                    record.student.name,

                rollNumber:
                    record.student.rollNumber,

                total: 0,

                present: 0
            };
        }


        studentAttendance[studentId].total++;


        if (record.status === "Present") {

            studentAttendance[studentId].present++;
        }
    });


    attendanceSummary.innerHTML = "";


    Object.values(studentAttendance).forEach(student => {

        const percentage =
            (student.present / student.total) * 100;


        const box =
            document.createElement("div");

        box.className =
            "attendance-summary-item";


        box.innerHTML = `

            <h3>
                ${student.name}
            </h3>

            <p>
                Roll Number:
                ${student.rollNumber}
            </p>

            <p>
                Present:
                ${student.present}
                /
                ${student.total}
            </p>

            <strong>
                ${percentage.toFixed(2)}%
            </strong>

        `;


        attendanceSummary.appendChild(box);
    });
}


// Mark attendance
attendanceForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const attendance = {

            student:
                document.getElementById("student").value,

            date:
                document.getElementById("date").value,

            status:
                document.getElementById("status").value
        };


        const response = await fetch(
            "/api/attendance",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(attendance)
            }
        );


        const data = await response.json();


        if (response.ok) {

            alert(
                "Attendance marked successfully!"
            );

            attendanceForm.reset();

            loadAttendance();

        } else {

            alert(
                data.error ||
                "Something went wrong"
            );
        }
    }
);


// Delete attendance
async function deleteAttendance(id) {

    if (
        !confirm(
            "Are you sure you want to delete this attendance?"
        )
    ) {
        return;
    }


    await fetch(
        `/api/attendance/${id}`,
        {
            method: "DELETE"
        }
    );


    loadAttendance();
}


// Initial load
loadStudents();

loadAttendance();