const p1 = {
    score: 0,
    button: document.querySelector('#p1Button'),
    display: document.querySelector('#p1Display'),
}
const p2 = {
    score: 0,
    button: document.querySelector('#p2Button'),
    display: document.querySelector('#p2Display'),
}

const resetButton = document.querySelector('#reset')
const winnningScoreSelect = document.querySelector('#playto')
const deuce = document.querySelector('#isDeuce')

let winnningScore = 3;
let isGG = false;
let isDeuce = false;

function updateScores(player, opponent) {
    if (!isGG) {
        player.score += 1;
        if (!isDeuce) {
            if (player.score === winnningScore) {
                win(player, opponent);
            }

            if (player.score === winnningScore - 1 && opponent.score === winnningScore - 1) {
                isDeuce = true;
                deuce.classList.remove('is-invisible');
            }

        }
        else {
            if (player.score === opponent.score + 2) {
                win(player, opponent);
            }
            else if (player.score === opponent.score) {
                player.score -= 1;
                opponent.score -= 1;
            }
        }
        player.display.textContent = player.score;
        opponent.display.textContent = opponent.score;
    }

}
function win(player, opponent) {
    isGG = true;
    player.display.classList.add('has-text-success');
    opponent.display.classList.add('has-text-danger');
    player.button.disabled = true;
    opponent.button.disabled = true;
}
p1.button.addEventListener('click', function () {
    updateScores(p1, p2)
})
p2.button.addEventListener('click', function () {
    updateScores(p2, p1)
})
winnningScoreSelect.addEventListener('change', function () {
    winnningScore = parseInt(this.value);
    reset();
})
resetButton.addEventListener('click', reset)
function reset() {
    isGG = false;
    isDeuce = false;
    deuce.classList.add('is-invisible');
    for (let p of [p1, p2]) {
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('has-text-success', 'has-text-danger');
        p.button.disabled = false;

    }
}