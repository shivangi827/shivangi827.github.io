// --- SECTION SWITCHER ---
function showSection(sectionId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(sectionId + '-view').classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- ROCK PAPER SCISSORS ---
function playRPS(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const botChoice = choices[Math.floor(Math.random() * 3)];
    const display = document.getElementById('rps-display');
    const result = document.getElementById('rps-result');
    const icons = { rock: '✊', paper: '✋', scissors: '✌️' };
    
    display.innerHTML = `You: ${icons[playerChoice]} vs Bot: ${icons[botChoice]}`;
    
    if (playerChoice === botChoice) {
        result.innerText = "It's a Tie!";
        result.style.color = "var(--text-dim)";
    } else if (
        (playerChoice === 'rock' && botChoice === 'scissors') ||
        (playerChoice === 'paper' && botChoice === 'rock') ||
        (playerChoice === 'scissors' && botChoice === 'paper')
    ) {
        result.innerText = "You Win! 🎉";
        result.style.color = "var(--accent)";
    } else {
        result.innerText = "Bot Wins! 🤖";
        result.style.color = "#ff00c1";
    }
}

// --- ON-CALL SIMULATOR GAME ---
let health = 100;
let resolved = 0;
let gameActive = false;

const startBtn = document.getElementById('start-game-btn');
const scoreBoard = document.getElementById('score-board');
const gameMsg = document.getElementById('game-msg');
const gameContainer = document.getElementById('game-container');

if (startBtn) {
    startBtn.addEventListener('click', () => {
        if (gameActive) return;
        gameActive = true;
        health = 100;
        resolved = 0;
        startBtn.style.display = 'none';
        gameMsg.innerText = "SEV-2 in progress! Click the bugs 🐛 to resolve!";
        gameLoop();
    });
}

function gameLoop() {
    if (!gameActive) return;

    // Create a bug element
    const bug = document.createElement('div');
    bug.className = 'bug';
    bug.innerHTML = '🐛';
    bug.style.left = Math.random() * (gameContainer.clientWidth - 40) + 'px';
    bug.style.top = Math.random() * (gameContainer.clientHeight - 40) + 'px';
    
    // Bug click logic
    bug.onclick = () => {
        resolved++;
        bug.remove();
        updateScore();
    };

    gameContainer.appendChild(bug);

    // If bug isn't clicked in 1.5 seconds, lose health
    setTimeout(() => {
        if (bug.parentElement) {
            health -= 15;
            bug.remove();
            updateScore();
            if (health <= 0) endGame();
        }
    }, 1500);

    // Spawn next bug
    if (gameActive) setTimeout(gameLoop, 800);
}

function updateScore() {
    scoreBoard.innerText = `System Health: ${health}% | Bugs Resolved: ${resolved}`;
    if (health < 50) scoreBoard.style.color = "#ff00c1";
    else scoreBoard.style.color = "var(--accent)";
}

function endGame() {
    gameActive = false;
    startBtn.style.display = 'inline-block';
    startBtn.innerText = 'Restart Shift';
    gameMsg.innerText = `System Crashed! You resolved ${resolved} bugs before the SEV-1.`;
    
    // Remove any remaining bugs
    document.querySelectorAll('.bug').forEach(b => b.remove());
}

// --- STAT COUNTER LOGIC ---
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
                    entry.target.innerText = target === 80 ? `${count}%` : (target === 1 ? `$${count}B+` : `$${count}M+`);
                    setTimeout(updateCount, 40);
                } else {
                    entry.target.innerText = target === 80 ? "80%" : (target === 1 ? "$1B+" : `$${target}M+`);
                }
            };
            updateCount();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
stats.forEach(s => observer.observe(s));