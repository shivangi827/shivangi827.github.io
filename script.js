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

    // TIC-TAC-TOE
    let board = ["", "", "", "", "", "", "", "", ""];
    function makeMove(i) {
        if (board[i] === "") {
            board[i] = "X"; 
            document.getElementsByClassName('cell')[i].innerText = "X";
            checkWinner();
            setTimeout(botMove, 500);
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
}