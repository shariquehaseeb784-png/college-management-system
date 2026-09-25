const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

// Load students
async function loadStudents() {
    const response = await fetch("/api/students");
    const students = await response.json();

    studentList.innerHTML = "";

    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.semester}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteStudent('${student._id}')"
                >
                    Delete
                </button>
            </td>
        `;

        studentList.appendChild(row);
    });
}


// Add student
studentForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        rollNumber: document.getElementById("rollNumber").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value,
        semester: document.getElementById("semester").value
    };

    const response = await fetch("/api/students", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)
    });

    const data = await response.json();

    if (response.ok) {

        alert("Student added successfully!");

        studentForm.reset();

        loadStudents();

    } else {

        alert(data.error || "Something went wrong");

    }
});


// Delete student
async function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    await fetch(`/api/students/${id}`, {
        method: "DELETE"
    });

    loadStudents();
}


// Load students when page opens
loadStudents();