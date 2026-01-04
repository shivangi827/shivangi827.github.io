// 1. Counter Animation
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
                    if (target === 1) { // Special case for $1B
                        entry.target.innerText = `$${count}B+`;
                    } else {
                        entry.target.innerText = entry.target.innerText.includes('$') ? `$${count}M+` : `${count}%`;
                    }
                    setTimeout(updateCount, 40);
                } else {
                    entry.target.innerText = target === 1 ? "$1B+" : (target === 80 ? "80%" : `$${target}M+`);
                }
            };
            updateCount();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
stats.forEach(s => observer.observe(s));

// 2. Bug Smasher Game
const startBtn = document.getElementById('start-game-btn');
const board = document.getElementById('score-board');
const msg = document.getElementById('game-msg');
const container = document.getElementById('game-container');
let score = 0, health = 100, gameActive = false, bugInterval;

startBtn.addEventListener('click', () => {
    gameActive = true; score = 0; health = 100;
    startBtn.style.display = 'none';
    msg.innerText = "SQUASH THE BUGS!";
    bugInterval = setInterval(() => {
        if (!gameActive) return;
        const bug = document.createElement('div');
        bug.className = 'bug'; bug.innerHTML = '🐛';
        bug.style.left = Math.random() * (container.offsetWidth - 30) + 'px';
        bug.style.top = Math.random() * (container.offsetHeight - 50) + 'px';
        bug.onclick = () => { score++; bug.remove(); board.innerText = `System Health: ${health}% | Bugs Resolved: ${score}`; };
        container.appendChild(bug);
        setTimeout(() => { if (bug.parentNode) { bug.remove(); health -= 20; board.innerText = `System Health: ${health}% | Bugs Resolved: ${score}`; if (health <= 0) endGame(); } }, 1500);
    }, 800);
});

function endGame() {
    gameActive = false; clearInterval(bugInterval);
    msg.innerText = `SEV 2! You resolved ${score} bugs.`;
    startBtn.style.display = 'inline-block'; startBtn.innerText = 'Restart Shift';
}