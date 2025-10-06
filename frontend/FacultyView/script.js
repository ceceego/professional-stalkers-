const checkin_button = document.getElementById('checkin-btn');
const checkout_button = document.getElementById('checkout-btn')
const statustext = document.querySelector('.status-text');
const indicatorstatus = document.querySelector('.indicator');

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

const addTimeSlotButton = document.getElementById('add-time-btn');
// AI FIXED 10/6/2025, prompt: "help fix a problem where the add office hours goes into the save button": Changed from '.save-hours-btn' to '#office-hours-container'
const timeSlotsContainer = document.getElementById('office-hours-container');

addTimeSlotButton.addEventListener('click', () => {
  const newTimeSlotDiv = document.createElement('div');
  newTimeSlotDiv.classList.add('time-slot');

  const startTimeInput = document.createElement('input');
  startTimeInput.type = 'time';
  startTimeInput.name = 'startTime[]';

  const endTimeInput = document.createElement('input');
  endTimeInput.type = 'time';
  endTimeInput.name = 'endTime[]';

  newTimeSlotDiv.appendChild(startTimeInput);
  newTimeSlotDiv.appendChild(document.createTextNode(' - ')); 
  newTimeSlotDiv.appendChild(endTimeInput);

  timeSlotsContainer.appendChild(newTimeSlotDiv);
});

