const studentSelect = document.getElementById("student");
const marksForm = document.getElementById("marksForm");
const marksList = document.getElementById("marksList");

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


// Load marks records
async function loadMarks() {
    const response = await fetch("/api/marks");
    const records = await response.json();

    marksList.innerHTML = "";

    records.forEach(record => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.student.name}</td>

            <td>${record.student.rollNumber}</td>

            <td>${record.subject}</td>

            <td>${record.marks}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteMarks('${record._id}')"
                >
                    Delete
                </button>
            </td>
        `;

        marksList.appendChild(row);
    });
}


// Add marks
marksForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const marksData = {

        student:
            document.getElementById("student").value,

        subject:
            document.getElementById("subject").value,

        marks:
            document.getElementById("marks").value
    };


    const response = await fetch(
        "/api/marks",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(marksData)
        }
    );


    const data = await response.json();


    if (response.ok) {

        alert("Marks added successfully!");

        marksForm.reset();

        loadMarks();

    } else {

        alert(
            data.error ||
            "Something went wrong"
        );
    }

});


// Delete marks
async function deleteMarks(id) {

    if (
        !confirm(
            "Are you sure you want to delete these marks?"
        )
    ) {
        return;
    }


    await fetch(
        `/api/marks/${id}`,
        {
            method: "DELETE"
        }
    );


    loadMarks();
}


// Initial load
loadStudents();
loadMarks();