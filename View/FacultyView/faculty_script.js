<<<<<<< HEAD
const checkin_button = document.getElementById('checkin-btn');
const checkout_button = document.getElementById('checkout-btn')
const statustext = document.querySelector('.status-text');
const indicatorstatus = document.querySelector('.indicator');
const timeSlotsContainer = document.getElementById('office-hours-container');
const addTimeSlotButton = document.getElementById('add-time-btn');
const removeTimeSlotButton = document.getElementById('remove-time-btn')

checkin_button.addEventListener('click', function() {
    statustext.textContent = 'Currently Checked In'
    statustext.style.color = '#2ecc71'
    indicatorstatus.style.backgroundColor = '#2ecc71'
});

checkout_button.addEventListener('click', function() {
    statustext.textContent = 'Currently Checked Out'
    statustext.style.color = '#A41D36'
    indicatorstatus.style.backgroundColor = '#A41D36'
});

addTimeSlotButton.addEventListener('click', () => {
  const currentSlots = timeSlotsContainer.querySelectorAll('.time-slot');
  if (currentSlots.length >= 4) {
    return;
  }
  const newTimeSlotDiv = document.createElement('div');
  newTimeSlotDiv.classList.add('time-slot');

  const daySelect = document.createElement('select');
  daySelect.name = 'dayOfWeek[]';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.forEach(day => {
    const option = document.createElement('option');
    option.value = day.toLowerCase();
    option.textContent = day;
    daySelect.appendChild(option);
  });

  const startTimeInput = document.createElement('input');
  startTimeInput.type = 'time';
  startTimeInput.name = 'startTime[]';

  const endTimeInput = document.createElement('input');
  endTimeInput.type = 'time';
  endTimeInput.name = 'endTime[]';

  newTimeSlotDiv.appendChild(daySelect);
  newTimeSlotDiv.appendChild(startTimeInput);
  newTimeSlotDiv.appendChild(document.createTextNode(' to '));
  newTimeSlotDiv.appendChild(endTimeInput);

  timeSlotsContainer.appendChild(newTimeSlotDiv);
});

removeTimeSlotButton.addEventListener('click', () =>{
  const currentSlots = timeSlotsContainer.querySelectorAll('.time-slot');
  if (currentSlots.length > 0) {
    const lastSlot = currentSlots[currentSlots.length - 1];
    lastSlot.remove();
  }
});
>>>>>>> fb799d1c8db0db472e26fbbf1062cd4368989ec6
