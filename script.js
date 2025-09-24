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
