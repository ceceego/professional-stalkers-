let userDB = {
    "cperry": "Head",
    "cmadlock": "RightHand",
    "tseislove": "LeftHand"
};

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Stop form from submitting

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  if (userDB[username] && password === userDB[username]) {
    message.textContent = "✅ Login successful!";
    message.style.color = "green";
    document.getElementById("username").value = ''
    document.getElementById("password").value = ''
    window.location.href = "index.html";
  } else if (!userDB[username]){
    message.textContent = "❌ Invalid username.";
    message.style.color = "red";
  } else {
    message.textContent = "❌ Incorrect password.";
    message.style.color = "red";
  }
});
