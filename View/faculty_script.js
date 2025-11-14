// === DOM ELEMENTS ===
const checkin_button = document.getElementById('checkin-btn');
const checkout_button = document.getElementById('checkout-btn');
const statustext = document.querySelector('.status-text');
const indicatorstatus = document.querySelector('.indicator');
const timeSlotsContainer = document.getElementById('office-hours-container');
const addTimeSlotButton = document.getElementById('add-time-btn');
const removeTimeSlotButton = document.getElementById('remove-time-btn');
const saveButton = document.querySelector('.save-hours-btn');
const nextOfficeHoursText = document.querySelector('.next-office-hours');
const officeInput = document.querySelector(".office-btn-input");
const saveOfficeBtn = document.querySelector(".save-office-num");

// Header elements
const userInfo = document.querySelector(".user-info span");
const avatar = document.querySelector(".avatar");

// Faculty username
const facultyUsername = localStorage.getItem("facultyUsername") || prompt("Enter your username:");

// === FETCH FACULTY INFO FOR HEADER AND AVATAR ===
async function loadFacultyInfo() {
  try {
    const res = await fetch(`http://localhost:5050/faculty/${facultyUsername}`);
    if (!res.ok) throw new Error("Failed to fetch faculty info");

    const data = await res.json();
    if (userInfo) userInfo.textContent = `Dr. ${data.firstname} ${data.lastname}`;
    if (avatar && data.lastname) avatar.textContent = data.lastname.charAt(0).toUpperCase();

  } catch (err) {
    console.warn("Could not load faculty info — using fallback username");
    if (userInfo) userInfo.textContent = `Dr. ${facultyUsername}`;
    if (avatar) avatar.textContent = facultyUsername.charAt(0).toUpperCase();
  }
}

// === LOAD OFFICE HOURS AND STATUS ===
async function loadOfficeHours() {
  try {
    const res = await fetch(`http://localhost:5050/faculty/officehours?username=${facultyUsername}`);
    if (!res.ok) throw new Error("Failed to fetch office hours");

    const data = await res.json();
    const currentStatus = data.current_status || "checked_out";
    const officeHours = data.office_hours || [];

    // Update check-in/out indicator
    if (currentStatus === "checked_in") {
      statustext.textContent = "Currently Checked In";
      statustext.style.color = "#2ecc71";
      indicatorstatus.style.backgroundColor = "#2ecc71";
    } else {
      statustext.textContent = "Currently Checked Out";
      statustext.style.color = "#A41D36";
      indicatorstatus.style.backgroundColor = "#A41D36";
    }

    // Render office hours
    timeSlotsContainer.innerHTML = "";
    officeHours.forEach(entry => {
      const slotDiv = document.createElement('div');
      slotDiv.classList.add('time-slot');

      const daySelect = document.createElement('select');
      ['Monday','Tuesday','Wednesday','Thursday','Friday'].forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        if (day === entry.day_of_week) option.selected = true;
        daySelect.appendChild(option);
      });

      const startInput = document.createElement('input');
      startInput.type = 'time';
      startInput.value = entry.start_time.slice(0,5);

      const endInput = document.createElement('input');
      endInput.type = 'time';
      endInput.value = entry.end_time.slice(0,5);

      const locationInput = document.createElement('input');
      locationInput.type = 'text';
      locationInput.value = entry.location || "Office 101";
      locationInput.classList.add('time-slot-location');

      slotDiv.append(daySelect, startInput, document.createTextNode(' to '), endInput, locationInput);
      timeSlotsContainer.appendChild(slotDiv);
    });

    if (officeHours.length > 0) {
      nextOfficeHoursText.textContent = `${officeHours[0].day_of_week} ${officeHours[0].start_time} - ${officeHours[0].end_time}`;
    } else {
      nextOfficeHoursText.textContent = "------";
    }

  } catch (err) {
    console.error("Error loading office hours:", err);
  }
}

// === CHECK-IN / CHECK-OUT ===
checkin_button.addEventListener('click', async () => {
  try {
    const res = await fetch("http://localhost:5050/faculty/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: facultyUsername }),
    });
    if (!res.ok) throw new Error("Check-in failed");
    await loadOfficeHours();
  } catch (err) {
    console.error(err);
    alert("Error checking in. Please try again.");
  }
});

checkout_button.addEventListener('click', async () => {
  try {
    const res = await fetch("http://localhost:5050/faculty/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: facultyUsername }),
    });
    if (!res.ok) throw new Error("Check-out failed");
    await loadOfficeHours();
  } catch (err) {
    console.error(err);
    alert("Error checking out. Please try again.");
  }
});

// === ADD / REMOVE TIME SLOT ===
addTimeSlotButton.addEventListener('click', () => {
  const currentSlots = timeSlotsContainer.querySelectorAll('.time-slot');
  if (currentSlots.length >= 5) return;

  const newTimeSlotDiv = document.createElement('div');
  newTimeSlotDiv.classList.add('time-slot');

  const daySelect = document.createElement('select');
  ['Monday','Tuesday','Wednesday','Thursday','Friday'].forEach(day => {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = day;
    daySelect.appendChild(option);
  });

  const startInput = document.createElement('input'); startInput.type='time';
  const endInput = document.createElement('input'); endInput.type='time';
  const locationInput = document.createElement('input'); locationInput.type='text';
  locationInput.classList.add('time-slot-location');
  locationInput.placeholder = "Office location";

  newTimeSlotDiv.append(daySelect, startInput, document.createTextNode(' to '), endInput, locationInput);
  timeSlotsContainer.appendChild(newTimeSlotDiv);
});

removeTimeSlotButton.addEventListener('click', () => {
  const currentSlots = timeSlotsContainer.querySelectorAll('.time-slot');
  if (currentSlots.length > 0) currentSlots[currentSlots.length - 1].remove();
});

// === SAVE OFFICE HOURS ===
saveButton.addEventListener("click", async () => {
  const timeSlots = [...timeSlotsContainer.querySelectorAll('.time-slot')].map(slot => ({
    day_of_week: slot.querySelector('select').value,
    start_time: slot.querySelector('input[type="time"]:first-of-type').value,
    end_time: slot.querySelector('input[type="time"]:nth-of-type(2)').value,
    location: slot.querySelector('.time-slot-location').value || "Office 101"
  }));

  const payload = { username: facultyUsername, officeHours: timeSlots };
  const statusMessage = document.querySelector('.current-status p');

  try {
    const response = await fetch("http://localhost:5050/faculty/officehours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    statusMessage.textContent = result.message;
    statusMessage.style.color = response.ok ? "green" : "red";

    await loadOfficeHours();
  } catch (err) {
    console.error("Error saving office hours:", err);
    statusMessage.textContent = "❌ Server error while saving.";
    statusMessage.style.color = "red";
  }
});

// === SAVE OFFICE LOCATION (GLOBAL BUTTON) ===
saveOfficeBtn.addEventListener("click", async () => {
  const newLocation = officeInput.value.trim();
  if (!newLocation) {
    alert("Please enter a valid office location.");
    return;
  }

  // Update all existing time slots with the new location
  const timeSlots = [...timeSlotsContainer.querySelectorAll('.time-slot')].map(slot => ({
    day_of_week: slot.querySelector('select').value,
    start_time: slot.querySelector('input[type="time"]:first-of-type').value,
    end_time: slot.querySelector('input[type="time"]:nth-of-type(2)').value,
    location: newLocation
  }));

  try {
    const res = await fetch("http://localhost:5050/faculty/officehours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: facultyUsername, officeHours: timeSlots })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Office location updated successfully!");
      officeInput.value = "";
      await loadOfficeHours();
    } else {
      alert("Error updating office location: " + data.message);
    }
  } catch (err) {
    console.error("Error updating office location:", err);
    alert("Server error while updating office location.");
  }
});

// === INITIALIZE ===
loadFacultyInfo();
loadOfficeHours();
