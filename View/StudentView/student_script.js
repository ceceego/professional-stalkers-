const favorite_star = document.querySelector('.favorite-btn');

favorite_star.addEventListener('click', function () {
    const gold = 'gold';
    const gray = '#A4A9AD';

    const currentColor = favorite_star.style.color;
    if (currentColor == 'gold') {
        favorite_star.style.color = gray;
    } else {
        favorite_star.style.color = gold;
    }
});

