// =========================================
// Game Engine
// =========================================

const TOTAL_TURNS = 20;
const STRESS_MAX = 100;

const state = {
    phase: 'intro',
    profile: null,
    idealLife: null,
    turn: 0,
    stats: { money: 0, relationships: 0, energy: 0, fulfillment: 0 },
    stress: 0,
    history: [],
    eventDeck: [],
    originalStats: null,
    originalStress: 0,
    gameOver: false,
    gameOverReason: ''
};

// Clamp value between 0 and 100
function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }

// Shuffle array
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// =========================================
// Game Flow
// =========================================

function selectProfile(profileId) {
    state.profile = PROFILES.find(p => p.id === profileId);
    state.originalStats = { ...state.profile.stats };
    state.originalStress = state.profile.stress;
    state.phase = 'rewrite';
    renderRewrite();
}

function selectIdealLife(idealId) {
    state.idealLife = IDEAL_LIVES.find(l => l.id === idealId);
    state.stats = { ...state.idealLife.stats };
    state.stress = state.idealLife.stress;
    state.turn = 0;
    state.history = [];
    state.gameOver = false;

    // Record initial state
    recordHistory();

    // Build shuffled event deck
    state.eventDeck = shuffle(EVENTS);

    state.phase = 'playing';
    renderGame();
}

function makeChoice(side) {
    const event = state.eventDeck[state.turn];
    const choice = side === 'left' ? event.left : event.right;

    // Apply effects
    Object.keys(choice.effect).forEach(key => {
        if (key === 'stress') {
            state.stress = clamp(state.stress + choice.effect[key]);
        } else {
            state.stats[key] = clamp(state.stats[key] + choice.effect[key]);
        }
    });

    // Apply maintenance costs from ideal life
    const mc = state.idealLife.maintenanceCost;
    Object.keys(mc).forEach(key => {
        state.stats[key] = clamp(state.stats[key] + mc[key]);
    });

    // Stress from extremes: any stat above 80 or below 15 adds stress
    let extremeStress = 0;
    Object.values(state.stats).forEach(v => {
        if (v > 80) extremeStress += (v - 80) * 0.3;
        if (v < 15) extremeStress += (15 - v) * 0.5;
    });
    state.stress = clamp(state.stress + extremeStress);

    // Natural stress growth (accelerates over time)
    state.stress = clamp(state.stress + 1 + state.turn * 0.3);

    state.turn++;
    recordHistory();

    // Check game over
    if (state.stress >= STRESS_MAX) {
        state.gameOver = true;
        state.gameOverReason = 'Burnout. The weight became unbearable.';
    } else if (state.stats.energy <= 0) {
        state.gameOver = true;
        state.gameOverReason = 'Collapse. Your body gave out before your ambition did.';
    } else if (state.stats.relationships <= 0) {
        state.gameOver = true;
        state.gameOverReason = 'Alone. Everyone who mattered has left.';
    } else if (state.stats.money <= 0 && state.stats.fulfillment <= 10) {
        state.gameOver = true;
        state.gameOverReason = 'Broke and empty. The dream became a trap.';
    } else if (state.turn >= TOTAL_TURNS) {
        state.gameOver = true;
        state.gameOverReason = 'Time\'s up. The years passed faster than you expected.';
    }

    if (state.gameOver) {
        state.phase = 'endgame';
        renderEndgame();
    } else {
        renderGame();
    }
}

function recordHistory() {
    state.history.push({
        turn: state.turn,
        stats: { ...state.stats },
        stress: state.stress
    });
}

// Simulate the "ordinary path" for comparison
function simulateOrdinaryPath() {
    const sim = [];
    const s = { ...state.originalStats };
    let stress = state.originalStress;
    const turns = state.history.length;

    for (let i = 0; i <= turns; i++) {
        sim.push({ turn: i, stats: { ...s }, stress });

        // Ordinary life: slow steady growth, low stress
        s.money = clamp(s.money + 2.5);
        s.relationships = clamp(s.relationships + 1.5);
        s.energy = clamp(s.energy - 1); // natural aging
        s.fulfillment = clamp(s.fulfillment + 2);
        stress = clamp(stress + 0.3);

        // Ordinary life auto-balances: if any stat is low, natural correction
        Object.keys(s).forEach(k => {
            if (s[k] < 30) s[k] = clamp(s[k] + 3);
            if (s[k] > 80) s[k] = clamp(s[k] - 1);
        });
    }

    return sim;
}

// =========================================
// Rendering
// =========================================

function renderSetup() {
    const container = document.getElementById('game-content');
    container.innerHTML = `
        <div class="setup-screen">
            <p class="phase-label">Chapter 1</p>
            <h2>Your Current Script</h2>
            <p class="phase-desc">Every life starts somewhere. Choose the one closest to yours.</p>
            <div class="profile-grid">
                ${PROFILES.map(p => `
                    <div class="profile-card" onclick="selectProfile('${p.id}')">
                        <h3>${p.name}</h3>
                        <span class="profile-age">Age ${p.age}</span>
                        <p>${p.desc}</p>
                        <div class="mini-bars">
                            <div class="mini-bar"><span class="mini-icon">💰</span><div class="mini-fill" style="width:${p.stats.money}%"></div></div>
                            <div class="mini-bar"><span class="mini-icon">❤️</span><div class="mini-fill" style="width:${p.stats.relationships}%"></div></div>
                            <div class="mini-bar"><span class="mini-icon">🧠</span><div class="mini-fill" style="width:${p.stats.energy}%"></div></div>
                            <div class="mini-bar"><span class="mini-icon">🌟</span><div class="mini-fill" style="width:${p.stats.fulfillment}%"></div></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderRewrite() {
    const p = state.profile;
    const container = document.getElementById('game-content');
    container.innerHTML = `
        <div class="rewrite-screen">
            <p class="phase-label">Chapter 2</p>
            <h2>Rewrite Your Script</h2>
            <p class="phase-desc">You chose <strong>${p.name}</strong>. Now — if you could be anyone, who would you become?</p>
            <div class="ideal-grid">
                ${IDEAL_LIVES.map(l => `
                    <div class="ideal-card" onclick="selectIdealLife('${l.id}')">
                        <span class="ideal-icon">${l.icon}</span>
                        <h3>${l.name}</h3>
                        <p>${l.desc}</p>
                        <div class="mini-bars">
                            <div class="mini-bar"><span class="mini-icon">💰</span><div class="mini-fill" style="width:${l.stats.money}%"></div></div>
                            <div class="mini-bar"><span class="mini-icon">❤️</span><div class="mini-fill" style="width:${l.stats.relationships}%"></div></div>
                            <div class="mini-bar"><span class="mini-icon">🧠</span><div class="mini-fill" style="width:${l.stats.energy}%"></div></div>
                            <div class="mini-bar"><span class="mini-icon">🌟</span><div class="mini-fill" style="width:${l.stats.fulfillment}%"></div></div>
                        </div>
                        <div class="debuff-list">
                            ${l.debuffs.map(d => `<span class="debuff">⚠️ ${d}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderGame() {
    const event = state.eventDeck[state.turn];
    const s = state.stats;
    const stressPercent = state.stress;
    const yearLabel = `Year ${state.turn + 1} of ${TOTAL_TURNS}`;

    const container = document.getElementById('game-content');
    container.innerHTML = `
        <div class="game-screen">
            <div class="game-hud">
                <div class="stat-bars">
                    <div class="stat-bar-item">
                        <span class="stat-icon">💰</span>
                        <div class="stat-track"><div class="stat-fill" style="width:${s.money}%"></div></div>
                        <span class="stat-val">${s.money}</span>
                    </div>
                    <div class="stat-bar-item">
                        <span class="stat-icon">❤️</span>
                        <div class="stat-track"><div class="stat-fill" style="width:${s.relationships}%"></div></div>
                        <span class="stat-val">${s.relationships}</span>
                    </div>
                    <div class="stat-bar-item">
                        <span class="stat-icon">🧠</span>
                        <div class="stat-track"><div class="stat-fill" style="width:${s.energy}%"></div></div>
                        <span class="stat-val">${s.energy}</span>
                    </div>
                    <div class="stat-bar-item">
                        <span class="stat-icon">🌟</span>
                        <div class="stat-track"><div class="stat-fill" style="width:${s.fulfillment}%"></div></div>
                        <span class="stat-val">${s.fulfillment}</span>
                    </div>
                </div>
                <div class="stress-bar">
                    <span>🌪️ Stress</span>
                    <div class="stress-track"><div class="stress-fill" style="width:${stressPercent}%"></div></div>
                </div>
            </div>

            <div class="event-card">
                <p class="event-year">${yearLabel}</p>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-text">${event.text}</p>
            </div>

            <div class="choice-buttons">
                <button class="choice-btn choice-left" onclick="makeChoice('left')">
                    <span class="choice-label">${event.left.label}</span>
                </button>
                <button class="choice-btn choice-right" onclick="makeChoice('right')">
                    <span class="choice-label">${event.right.label}</span>
                </button>
            </div>
        </div>
    `;

    // Visual stress effects
    document.body.style.filter = stressPercent > 60
        ? `saturate(${1 - (stressPercent - 60) * 0.015}) brightness(${1 - (stressPercent - 60) * 0.003})`
        : '';
}

function renderEndgame() {
    document.body.style.filter = '';
    const ordinaryPath = simulateOrdinaryPath();
    const playerFinal = state.history[state.history.length - 1];
    const ordinaryFinal = ordinaryPath[ordinaryPath.length - 1];

    // Calculate total "life score" (average of 4 stats minus stress)
    const playerScore = Math.round(
        (playerFinal.stats.money + playerFinal.stats.relationships +
         playerFinal.stats.energy + playerFinal.stats.fulfillment) / 4 - playerFinal.stress * 0.5
    );
    const ordinaryScore = Math.round(
        (ordinaryFinal.stats.money + ordinaryFinal.stats.relationships +
         ordinaryFinal.stats.energy + ordinaryFinal.stats.fulfillment) / 4 - ordinaryFinal.stress * 0.5
    );

    const container = document.getElementById('game-content');
    container.innerHTML = `
        <div class="endgame-screen">
            <p class="phase-label">The Reckoning</p>
            <h2>${state.gameOverReason}</h2>

            <div class="comparison">
                <div class="comparison-col">
                    <h3>Your "Dream" Life</h3>
                    <p class="comparison-subtitle">${state.idealLife.name}</p>
                    <div class="final-stats">
                        <div class="final-stat">💰 <strong>${playerFinal.stats.money}</strong></div>
                        <div class="final-stat">❤️ <strong>${playerFinal.stats.relationships}</strong></div>
                        <div class="final-stat">🧠 <strong>${playerFinal.stats.energy}</strong></div>
                        <div class="final-stat">🌟 <strong>${playerFinal.stats.fulfillment}</strong></div>
                        <div class="final-stat stress-stat">🌪️ <strong>${playerFinal.stress}</strong></div>
                    </div>
                    <div class="life-score bad">Life Balance: ${playerScore}</div>
                </div>

                <div class="comparison-divider">
                    <span>VS</span>
                </div>

                <div class="comparison-col">
                    <h3>Your Original Script</h3>
                    <p class="comparison-subtitle">${state.profile.name} — played steadily</p>
                    <div class="final-stats">
                        <div class="final-stat">💰 <strong>${ordinaryFinal.stats.money}</strong></div>
                        <div class="final-stat">❤️ <strong>${ordinaryFinal.stats.relationships}</strong></div>
                        <div class="final-stat">🧠 <strong>${ordinaryFinal.stats.energy}</strong></div>
                        <div class="final-stat">🌟 <strong>${ordinaryFinal.stats.fulfillment}</strong></div>
                        <div class="final-stat stress-stat">🌪️ <strong>${ordinaryFinal.stress}</strong></div>
                    </div>
                    <div class="life-score good">Life Balance: ${ordinaryScore}</div>
                </div>
            </div>

            <div class="endgame-message">
                <blockquote>"You spent your whole life chasing someone else's script. But the original — your original — had everything you needed. Not because it was perfect. Because it was <em>yours</em>."</blockquote>
                <p class="endgame-zen">不要美化另一条路。学好用好自己的剧本。<br><span>Don't romanticise the road not taken. Learn to play your own hand.</span></p>
            </div>

            <div class="endgame-actions">
                <button class="btn btn-primary" onclick="restartGame()">Play Again</button>
                <a href="../zen-mode/" class="btn btn-secondary">Return to Zen Mode</a>
            </div>
        </div>
    `;
}

function restartGame() {
    state.phase = 'intro';
    state.profile = null;
    state.idealLife = null;
    state.turn = 0;
    state.stats = { money: 0, relationships: 0, energy: 0, fulfillment: 0 };
    state.stress = 0;
    state.history = [];
    state.gameOver = false;
    document.body.style.filter = '';
    renderIntro();
}

function renderIntro() {
    const container = document.getElementById('game-content');
    container.innerHTML = `
        <div class="intro-screen">
            <p class="intro-epigraph">"不要美化另一条路。"</p>
            <h1 class="intro-title">The Life<br>Script</h1>
            <p class="intro-sub">An interactive experience about the life you have<br>and the life you think you want.</p>
            <p class="intro-desc">You'll start with an ordinary life. Then you'll rewrite it into a dream. Then you'll discover why the dream breaks — and why the ordinary was enough all along.</p>
            <button class="btn btn-primary" onclick="state.phase='setup'; renderSetup();">Begin</button>
            <p class="intro-credit">By <a href="../zen-mode/">JSU</a> · Zen Mode</p>
        </div>
    `;
}

// Boot
document.addEventListener('DOMContentLoaded', renderIntro);
