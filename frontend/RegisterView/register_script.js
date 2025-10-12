

document.querySelector("#loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

    const firstname = document.getElementById("firstname").value
    const lastname = document.getElementById("lastname").value
    const username = document.getElementById("username").value
    const usertype = document.getElementById("usertype").value
    const password = document.getElementById("password").value

    if (usertype === "faculty"){
        window.location.href = "faculty_index.html";
    }
    else if (usertype === "student"){
        window.location.href = "student_index.html"; // replace this with student dashboard when done
    }
});
