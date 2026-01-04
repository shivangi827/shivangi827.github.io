// 1. Counter Animation for Impact Stats
const stats = document.querySelectorAll('.stat');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            let count = 0;
            const updateCount = () => {
                const speed = target / 50;
                if (count < target) {
                    count += Math.ceil(speed);
                    entry.target.innerText = entry.target.innerText.includes('$') ? `$${count}M+` : `${count}%`;
                    setTimeout(updateCount, 40);
                } else {
                    entry.target.innerText = entry.target.innerText.includes('$') ? `$${target}M+` : `${target}%`;
                }
            };
            updateCount();
        }
    });
}, { threshold: 1 });

stats.forEach(s => observer.observe(s));

// 2. Bug Smasher Game Logic
let score = 0;
let health = 100;
let gameActive = false;
let bugInterval;

const startBtn = document.getElementById('start-game-btn');
const board = document.getElementById('score-board');
const msg = document.getElementById('game-msg');

startBtn.addEventListener('click', () => {
    gameActive = true;
    score = 0;
    health = 100;
    startBtn.style.display = 'none';
    msg.innerText = "SQUASH THE BUGS!";
    bugInterval = setInterval(createBug, 700);
});

function createBug() {
    if (!gameActive) return;
    const bug = document.createElement('div');
    bug.className = 'bug';
    bug.innerHTML = '🐛';
    const container = document.getElementById('game-container');
    
    bug.style.left = Math.random() * (container.offsetWidth - 50) + 'px';
    bug.style.top = Math.random() * (container.offsetHeight - 100) + 50 + 'px';

    bug.onclick = () => {
        score++;
        bug.remove();
        board.innerText = `System Health: ${health}% | Bugs Resolved: ${score}`;
    };

    container.appendChild(bug);

    setTimeout(() => {
        if (bug.parentNode) {
            bug.remove();
            health -= 20;
            board.innerText = `System Health: ${health}% | Bugs Resolved: ${score}`;
            if (health <= 0) endGame();
        }
    }, 1500);
}

function endGame() {
    gameActive = false;
    clearInterval(bugInterval);
    msg.innerText = `SEV 2! You resolved ${score} bugs before the system crashed.`;
    startBtn.style.display = 'inline-block';
    startBtn.innerText = 'Restart Shift';
}