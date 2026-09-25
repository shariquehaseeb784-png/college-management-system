const studentSelect = document.getElementById("student");


// Load students
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


// Show result
async function showResult() {

    const studentId = studentSelect.value;

    if (!studentId) {
        alert("Please select a student");
        return;
    }


    // Get all students
    const studentsResponse =
        await fetch("/api/students");

    const students =
        await studentsResponse.json();


    // Find selected student
    const student =
        students.find(s => s._id === studentId);


    // Get all marks
    const marksResponse =
        await fetch("/api/marks");

    const marks =
        await marksResponse.json();


    // Get marks of selected student
    const studentMarks =
        marks.filter(
            record => record.student._id === studentId
        );


    if (studentMarks.length === 0) {

        alert("No marks found for this student");

        return;
    }


    // Calculate total
    let total = 0;

    studentMarks.forEach(record => {
        total += Number(record.marks);
    });


    // Calculate percentage
    const percentage =
        total / studentMarks.length;


    // Calculate grade
    let grade;

    if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else if (percentage >= 50) {
        grade = "D";
    } else {
        grade = "F";
    }


    // Pass / Fail
    const result =
        percentage >= 40
            ? "PASS"
            : "FAIL";


    // Display student information
    document.getElementById("studentName").textContent =
        student.name;

    document.getElementById("rollNumber").textContent =
        student.rollNumber;


    // Display subjects
    const resultList =
        document.getElementById("resultList");

    resultList.innerHTML = "";


    studentMarks.forEach(record => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${record.subject}</td>
            <td>${record.marks}</td>
        `;

        resultList.appendChild(row);
    });


    // Display summary
    document.getElementById("totalMarks").textContent =
        total;

    document.getElementById("percentage").textContent =
        percentage.toFixed(2);

    document.getElementById("grade").textContent =
        grade;

    document.getElementById("result").textContent =
        result;


    // Show result card
    document.getElementById("resultCard").style.display =
        "block";
}


// Load students when page opens
loadStudents();