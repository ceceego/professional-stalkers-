<<<<<<< HEAD
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

=======
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

>>>>>>> fb799d1c8db0db472e26fbbf1062cd4368989ec6
