document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  try {
    const response = await fetch("http://localhost:5050/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      message.textContent = "✅ Login successful!";
      message.style.color = "green";

      setTimeout(() => {
        if (data.userType === "faculty") {
          localStorage.setItem("facultyUsername", username);
          window.location.href = "./faculty_index.html";
        } else if (data.userType === "student") {
          window.location.href = "./student_index.html";
        } else {
          window.location.href = "./faculty_index.html";
        }
      }, 1000);
    } else {
      message.textContent = `❌ ${data.message || "Invalid credentials"}`;
      message.style.color = "red";
    }
  } catch (err) {
    console.error("Login error:", err);
    message.textContent = "❌ Server error. Please try again later.";
    message.style.color = "red";
  }
});
