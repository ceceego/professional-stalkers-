const checkin_button = document.getElementById('checkin-btn');
const checkout_button = document.getElementById('checkout-btn')
const statustext = document.querySelector('.status-text');

checkin_button.addEventListener('click', function() {
    statustext.textContent = 'Currently Checked In'
    status_text.style.color = 'green'
});

checkout_button.addEventListener('click', function() {
    statustext.textContent = 'Currently Checked Out'
    status_text.style.color = 'red'
});
