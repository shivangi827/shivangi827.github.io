// --- SECTION SWITCHER ---
function showSection(sectionId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    // Show the selected tab
    const activeSection = document.getElementById(sectionId + '-view');
    if (activeSection) {
        activeSection.classList.add('active');
        activeSection.style.display = 'block';
    }

    // Update nav button states
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('nav-' + sectionId);
    if (activeBtn) activeBtn.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- STAT COUNTERS ---
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

// --- RPS GAME ---
function playRPS(p) {
    const choices = ['👊', '🖐', '✌️'];
    const b = choices[Math.floor(Math.random() * 3)];
    const res = document.getElementById('rps-result');
    document.getElementById('rps-display').innerText = `You: ${p} vs Shivangi: ${b}`;
    if (p === b) res.innerText = "Tie!";
    else if ((p === '👊' && b === '✌️') || (p === '🖐' && b === '👊') || (p === '✌️' && b === '🖐')) {
        res.innerText = "Win! 🎉";
    } else {
        res.innerText = "Loss! 💀";
    }
}

// --- TIC-TAC-TOE ---
let board = ["", "", "", "", "", "", "", "", ""];
function makeMove(i) {
    if (board[i] === "") {
        board[i] = "X"; 
        document.getElementsByClassName('cell')[i].innerText = "X";
        if (!checkWinner()) setTimeout(botMove, 500);
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
    return false;
}
function resetTTT() {
    board = ["", "", "", "", "", "", "", "", ""];
    Array.from(document.getElementsByClassName('cell')).forEach(c => c.innerText = "");
    document.getElementById('ttt-status').innerText = "Your turn (X)";
}

// --- SNAKE ---
const cvs = document.getElementById("snakeGame");
if (cvs) {
    const ctx = cvs.getContext("2d");
    let snk = [{x:10, y:10}], fd = {x:5, y:5}, dx=1, dy=0;
    
    window.addEventListener("keydown", e => {
        if(e.key === "ArrowUp" && dy === 0) { dx=0; dy=-1; }
        if(e.key === "ArrowDown" && dy === 0) { dx=0; dy=1; }
        if(e.key === "ArrowLeft" && dx === 0) { dx=-1; dy=0; }
        if(e.key === "ArrowRight" && dx === 0) { dx=1; dy=0; }
    });

    document.getElementById('start-snake').onclick = () => {
        const game = setInterval(() => {
            let h = {x: snk[0].x + dx, y: snk[0].y + dy};
            if (h.x<0 || h.x>19 || h.y<0 || h.y>19) {
                clearInterval(game); alert("Game Over!"); return;
            }
            snk.unshift(h);
            if(h.x === fd.x && h.y === fd.y) {
                fd = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
                document.getElementById('snake-score').innerText = `Score: ${snk.length - 1}`;
            } else {
                snk.pop();
            }
            ctx.fillStyle = "#020c1b"; ctx.fillRect(0,0,300,300);
            ctx.fillStyle = "#64ffda"; snk.forEach(s => ctx.fillRect(s.x*15, s.y*15, 14, 14));
            ctx.fillStyle = "red"; ctx.fillRect(fd.x*15, fd.y*15, 14, 14);
        }, 150);
    };
}

// --- ON-CALL SIMULATOR ---
let health = 100, bugs = 0;
const startOnCall = document.getElementById('start-game-btn');
if (startOnCall) {
    startOnCall.onclick = () => {
        startOnCall.style.display = 'none';
        const gameInterval = setInterval(() => {
            if (health <= 0) {
                clearInterval(gameInterval);
                alert(`System Crash! You resolved ${bugs} bugs.`);
                location.reload();
                return;
            }
            const bug = document.createElement('div');
            bug.className = 'bug'; bug.innerHTML = '🐛';
            bug.style.left = Math.random() * 80 + '%';
            bug.style.top = Math.random() * 80 + '%';
            bug.onclick = () => {
                bugs++;
                bug.remove();
                document.getElementById('score-board').innerText = `System Health: ${health}% | Bugs Resolved: ${bugs}`;
            };
            document.getElementById('game-container').appendChild(bug);
            setTimeout(() => {
                if (bug.parentElement) {
                    health -= 10;
                    bug.remove();
                    document.getElementById('score-board').innerText = `System Health: ${health}% | Bugs Resolved: ${bugs}`;
                }
            }, 2000);
        }, 1000);
    };
}