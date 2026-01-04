// --- SECTION SWITCHER ---
function showSection(sectionId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    // Show selected tab
    const activeSection = document.getElementById(sectionId + '-view');
    if (activeSection) {
        activeSection.classList.add('active');
        activeSection.style.display = 'block';
    }

    // Update buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('nav-' + sectionId);
    if (activeBtn) activeBtn.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- STAT COUNTERS ---
function initCounters() {
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
                        if (target === 80) entry.target.innerText = `${count}%`;
                        else if (target === 1) entry.target.innerText = `$${count}B+`;
                        else entry.target.innerText = `$${count}M+`;
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
}

// Ensure the code runs ONLY after the page is fully loaded
window.addEventListener('load', () => {
    initCounters();
});

// --- RPS GAME ---
function playRPS(p) {
    const choices = ['👊', '🖐', '✌️'];
    const b = choices[Math.floor(Math.random() * 3)];
    const res = document.getElementById('rps-result');
    const display = document.getElementById('rps-display');
    
    if(display) display.innerText = `You: ${p} vs Shivangi: ${b}`;
    
    if (p === b) res.innerText = "Tie!";
    else if ((p === '👊' && b === '✌️') || (p === '🖐' && b === '👊') || (p === '✌️' && b === '🖐')) {
        res.innerText = "Win! 🎉";
    } else {
        res.innerText = "Loss! 💀";
    }
}

// TIC-TAC-TOE
    let board = ["", "", "", "", "", "", "", "", ""];
    function makeMove(i) {
        if (board[i] === "") {
            board[i] = "X"; 
            document.getElementsByClassName('cell')[i].innerText = "X";
            result = checkWinner()
            result ? resetTTT() : setTimeout(botMove, 500);
        }
    }
    function botMove() {
        let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        if (empty.length) {
            let m = empty[Math.floor(Math.random() * empty.length)];
            board[m] = "O"; 
            document.getElementsByClassName('cell')[m].innerText = "O";
            checkWinner();
        }
    }
    function checkWinner() {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let combo of wins) {
            if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
                document.getElementById('ttt-status').innerText = `${board[combo[0]]} Wins!`;
                return true;
            }
        }
    }
    function resetTTT() {
        board = ["", "", "", "", "", "", "", "", ""];
        Array.from(document.getElementsByClassName('cell')).forEach(c => c.innerText = "");
        document.getElementById('ttt-status').innerText = "Your turn (X)";
    }

    // --- RETRO SNAKE ---
    let snake, food, dx, dy, score, gameInterval;
    const canvas = document.getElementById('snakeGame');
    const ctx = canvas ? canvas.getContext('2d') : null;

    function startSnake() {
        clearInterval(gameInterval);
        snake = [{x: 10, y: 10}];
        food = {x: 5, y: 5};
        dx = 1; dy = 0; score = 0;
        gameInterval = setInterval(gameLoop, 100);
    }

    function gameLoop() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 30 || snake.some(s => s.x === head.x && s.y === head.y)) {
            clearInterval(gameInterval);
            alert("Game Over!");
            return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snake-score').innerText = `Score: ${score}`;
            food = {x: Math.floor(Math.random()*30), y: Math.floor(Math.random()*30)};
        } else { snake.pop(); }
        
        ctx.fillStyle = "#0a192f"; ctx.fillRect(0,0,300,300);
        ctx.fillStyle = "#64ffda"; snake.forEach(s => ctx.fillRect(s.x*10, s.y*10, 9, 9));
        ctx.fillStyle = "#ff4d4d"; ctx.fillRect(food.x*10, food.y*10, 9, 9);
    }
    // --- ON-CALL SIMULATOR ---
    let health = 100, resolved = 0, onCallActive = false;
    function startOnCall() {
        onCallActive = true; health = 100; resolved = 0;
        spawnBug();
    }
    function spawnBug() {
        if (!onCallActive || health <= 0) return;
        const bug = document.createElement('div');
        bug.innerHTML = "🐛";
        bug.style.cssText = `position:absolute; left:${Math.random()*80}%; top:${Math.random()*80}%; cursor:pointer; color:#ff4d4d; font-weight:bold;`;
        bug.onclick = () => { resolved++; bug.remove(); updateUI(); };
        document.getElementById('game-container').appendChild(bug);
        setTimeout(() => { if(bug.parentNode) { health -= 20; bug.remove(); updateUI(); } }, 2000);
        setTimeout(spawnBug, 1200);
    }
    function updateUI() {
        document.getElementById('score-board').innerText = `System Health: ${health}% | Resolved: ${resolved}`;
        if(health <= 0) { onCallActive = false; alert("Service Down! Resolved: " + resolved); }
    }

    // --- INITIALIZATION ---
    window.addEventListener('load', () => {
        initCounters();
        document.getElementById('start-snake')?.addEventListener('click', startSnake);
        document.getElementById('start-game-btn')?.addEventListener('click', startOnCall);
        window.addEventListener('keydown', e => {
            if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
            if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
            if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
            if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
        });
    });