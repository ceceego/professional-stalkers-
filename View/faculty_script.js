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

// Temporary faculty identifier — later this should come from login (localStorage)
const facultyUsername = localStorage.getItem("facultyUsername") || prompt("Enter your username:");

// === CHECK-IN / CHECK-OUT ===
checkin_button.addEventListener('click', function () {
  statustext.textContent = 'Currently Checked In';
  statustext.style.color = '#2ecc71';
  indicatorstatus.style.backgroundColor = '#2ecc71';
});

checkout_button.addEventListener('click', function () {
  statustext.textContent = 'Currently Checked Out';
  statustext.style.color = '#A41D36';
  indicatorstatus.style.backgroundColor = '#A41D36';
});

// === ADD / REMOVE TIME SLOT ===
addTimeSlotButton.addEventListener('click', () => {
  const currentSlots = timeSlotsContainer.querySelectorAll('.time-slot');
  if (currentSlots.length >= 5) return;

  const newTimeSlotDiv = document.createElement('div');
  newTimeSlotDiv.classList.add('time-slot');

  const daySelect = document.createElement('select');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  days.forEach(day => {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = day;
    daySelect.appendChild(option);
  });

  const startTimeInput = document.createElement('input');
  startTimeInput.type = 'time';
  const endTimeInput = document.createElement('input');
  endTimeInput.type = 'time';

  newTimeSlotDiv.append(daySelect, startTimeInput, document.createTextNode(' to '), endTimeInput);
  timeSlotsContainer.appendChild(newTimeSlotDiv);
});

removeTimeSlotButton.addEventListener('click', () => {
  const currentSlots = timeSlotsContainer.querySelectorAll('.time-slot');
  if (currentSlots.length > 0) {
    currentSlots[currentSlots.length - 1].remove();
  }
});

saveButton.addEventListener("click", async () => {
  const timeSlots = [...timeSlotsContainer.querySelectorAll('.time-slot')].map(slot => ({
    day_of_week: slot.querySelector('select').value,
    start_time: slot.querySelector('input[type="time"]:first-of-type').value,
    end_time: slot.querySelector('input[type="time"]:last-of-type').value,
    location: "Office 101" // make this dynamic if needed
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

    // Reload the table afterward
    loadOfficeHours();
  } catch (err) {
    console.error("Error saving office hours:", err);
    statusMessage.textContent = "❌ Server error while saving.";
    statusMessage.style.color = "red";
  }
});


// === LOAD EXISTING OFFICE HOURS ON PAGE LOAD ===
async function loadOfficeHours() {
  try {
    const res = await fetch(`http://localhost:5050/faculty/officehours?username=${facultyUsername}`);
    const hours = await res.json();

    timeSlotsContainer.innerHTML = ""; // Clear old slots

    hours.forEach(entry => {
      const newTimeSlotDiv = document.createElement('div');
      newTimeSlotDiv.classList.add('time-slot');

      const daySelect = document.createElement('select');
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        if (day === entry.day_of_week) option.selected = true;
        daySelect.appendChild(option);
      });

      const startTimeInput = document.createElement('input');
      startTimeInput.type = 'time';
      startTimeInput.value = entry.start_time.slice(0, 5);

      const endTimeInput = document.createElement('input');
      endTimeInput.type = 'time';
      endTimeInput.value = entry.end_time.slice(0, 5);

      newTimeSlotDiv.append(daySelect, startTimeInput, document.createTextNode(' to '), endTimeInput);
      timeSlotsContainer.appendChild(newTimeSlotDiv);
    });

    if (hours.length > 0) {
      nextOfficeHoursText.textContent = `${hours[0].day_of_week} ${hours[0].start_time} - ${hours[0].end_time}`;
    }
  } catch (err) {
    console.error("Error loading office hours:", err);
  }
}

// === INITIALIZE ===
loadOfficeHours();
