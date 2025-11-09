document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registerForm");
  const messageEl = document.getElementById("loginMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const username = document.getElementById("username").value.trim();
    const usertype = document.getElementById("usertype").value;
    const password = document.getElementById("password").value;

    const data = { firstname, lastname, username, usertype, password };

    try {
      const response = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        messageEl.textContent = "✅ Registered successfully! Redirecting...";
        messageEl.style.color = "green";
        setTimeout(() => (window.location.href = "login_index.html"), 2000);
      } else {
        messageEl.textContent = `❌ ${result.message || "Registration failed"}`;
        messageEl.style.color = "red";
      }
    } catch (err) {
      messageEl.textContent = "❌ Server error. Please try again later.";
      messageEl.style.color = "red";
    }
  });
});
