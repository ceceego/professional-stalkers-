
const checkin_button = document.getElementById('checkin-btn');
const checkout_button = document.getElementById('checkout-btn')
const statustext = document.querySelector('.status-text');

checkin_button.addEventListener('click', function() {
    statustext.textContent = 'Currently Checked In'
});

checkout_button.addEventListener('click', function() {
    statustext.textContent = 'Currently Checked Out'
});