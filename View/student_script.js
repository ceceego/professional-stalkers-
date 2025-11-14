document.addEventListener("DOMContentLoaded", async () => {
  const allProfessorsContainer = document.getElementById("allProfessors");
  const favoriteProfessorsContainer = document.getElementById("favoriteProfessors");
  const searchInput = document.getElementById("searchInput");

  const studentUsername = localStorage.getItem("student_username");
  if (!studentUsername) {
    alert("No student logged in! Redirecting to login page...");
    window.location.href = "login_index.html";
    return;
  }

  const userInfo = document.querySelector(".user-info span");
  const avatar = document.querySelector(".avatar");
  if (userInfo) userInfo.textContent = `Welcome, ${studentUsername}`;
  if (avatar) avatar.textContent = studentUsername.charAt(0).toUpperCase();

  let professors = [];
  let favorites = [];

  async function fetchData() {
    try {
      const [facultyRes, favoritesRes] = await Promise.all([
        fetch("http://localhost:5050/faculty"),
        fetch(`http://localhost:5050/favorites/${studentUsername}`)
      ]);

      professors = await facultyRes.json();
      favorites = (await favoritesRes.json()).map(f => f.faculty_username);

      renderAll();
    } catch (err) {
      console.error("Error fetching data:", err);
      allProfessorsContainer.innerHTML = "<p>Error loading professors.</p>";
    }
  }

  // Optional: fetch student first name for header
  try {
    const studentRes = await fetch(`http://localhost:5050/students/${studentUsername}`);
    if (studentRes.ok) {
      const studentData = await studentRes.json();
      if (studentData.firstname && userInfo) {
        userInfo.textContent = `Welcome, ${studentData.firstname}`;
        if (avatar) avatar.textContent = studentData.firstname.charAt(0).toUpperCase();
      }
    }
  } catch { console.warn("Could not fetch student name."); }

  // 🔍 Live search
  searchInput.addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = professors.filter(
      (p) => p.firstname.toLowerCase().includes(searchValue) ||
             p.lastname.toLowerCase().includes(searchValue)
    );
    displayAllProfessors(filtered, favorites);
    attachFavoriteHandlers();
  });

  function createProfessorCard(prof, favorites) {
    const isFavorite = favorites.includes(prof.username);
    const statusClass = prof.current_status === 'checked_in' ? 'checked-in' : 'checked-out';
    const statusText = prof.current_status === 'checked_in' ? 'Currently Checked In' : 'Currently Checked Out';

    const officeHoursList = prof.office_hours?.length
      ? prof.office_hours.map(h => `
          <li>
            <span class="day">${h.day}</span>
            <span class="time">${h.start} - ${h.end}</span>
            <span class="location">(${h.location})</span>
          </li>`).join("")
      : "<li>No office hours listed</li>";

    return `
      <div class="professor-card">
        <div class="professor-header">
          <div class="professor-info">
            <h3>${prof.firstname} ${prof.lastname}</h3>
            <span class="faculty-status ${statusClass}">${statusText}</span>
          </div>
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-username="${prof.username}">★</button>
        </div>
        <div class="office-hours">
          <h4>Office Hours</h4>
          <ul class="office-hours-list">${officeHoursList}</ul>
        </div>
      </div>`;
  }

  function displayAllProfessors(list, favorites) {
    allProfessorsContainer.innerHTML = list.map(p => createProfessorCard(p, favorites)).join("");
  }

  function displayFavoriteProfessors(list, favorites) {
    const favs = list.filter(p => favorites.includes(p.username));
    favoriteProfessorsContainer.innerHTML = favs.length
      ? favs.map(p => createProfessorCard(p, favorites)).join("")
      : "<p>No favorites yet.</p>";
  }

  function attachFavoriteHandlers() {
    document.querySelectorAll(".favorite-btn").forEach(btn => {
      btn.onclick = async () => {
        const facultyUsername = btn.dataset.username;
        const isFavorited = btn.classList.contains("active");
        btn.classList.toggle("active", !isFavorited);

        try {
          await fetch(`http://localhost:5050/favorites/${isFavorited ? "remove" : "add"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ student_username: studentUsername, faculty_username: facultyUsername })
          });
          // Refresh favorites
          const updatedFavs = await fetch(`http://localhost:5050/favorites/${studentUsername}`);
          favorites = (await updatedFavs.json()).map(f => f.faculty_username);
          renderAll();
        } catch (err) { console.error("Favorite toggle error:", err); }
      };
    });
  }

  function renderAll() {
    displayAllProfessors(professors, favorites);
    displayFavoriteProfessors(professors, favorites);
    attachFavoriteHandlers();
  }

  // Initial load
  await fetchData();

  // Optional: auto-refresh every 15s to reflect live check-in/out
  setInterval(fetchData, 15000);
});
