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
    gameOverReason: '',
    flags: new Set(),
    currentEra: -1,
    showingEraIntro: false,
    showingReflection: false,
    // BaZi
    bazi: null,
    baziAnalysis: null,
    baziScores: null,
    supplements: []
};

function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getEraForTurn(turn) {
    return ERAS.findIndex(e => turn >= e.turns[0] && turn <= e.turns[1]);
}

function getEventText(event) {
    if (event.textFn) return event.textFn(state);
    if (event.text._default) return event.text._default;
    return event.text[state.idealLife.id] || event.text._default || '';
}

// =========================================
// Game Flow
// =========================================
function selectProfile(profileId) {
    state.profile = PROFILES.find(p => p.id === profileId);
    state.originalStats = { ...state.profile.stats };
    state.originalStress = state.profile.stress;
    state.phase = 'rewrite';
    render();
}

function selectIdealLife(idealId) {
    state.idealLife = IDEAL_LIVES.find(l => l.id === idealId);
    state.stats = { ...state.idealLife.stats };
    state.stress = state.idealLife.stress;
    state.turn = 0;
    state.history = [];
    state.flags = new Set();
    state.gameOver = false;
    state.currentEra = -1;

    recordHistory();

    // Build event deck: 5 events per era, shuffled within era
    state.eventDeck = [];
    for (let era = 0; era < 4; era++) {
        const eraEvents = EVENTS.filter(e => e.era === era);
        state.eventDeck.push(...shuffle(eraEvents));
    }

    state.phase = 'playing';
    render();
}

function makeChoice(side) {
    const event = state.eventDeck[state.turn];
    const choice = side === 'left' ? event.left : event.right;

    // Set flags for consequence tracking
    if (choice.flag) state.flags.add(choice.flag);

    // Apply effects
    Object.keys(choice.effect).forEach(key => {
        if (key === 'stress') {
            state.stress = clamp(state.stress + choice.effect[key]);
        } else {
            state.stats[key] = clamp(state.stats[key] + choice.effect[key]);
        }
    });

    // Maintenance costs
    const mc = state.idealLife.maintenanceCost;
    Object.keys(mc).forEach(key => {
        state.stats[key] = clamp(state.stats[key] + mc[key]);
    });

    // Stress from extremes
    let extremeStress = 0;
    Object.values(state.stats).forEach(v => {
        if (v > 80) extremeStress += (v - 80) * 0.3;
        if (v < 15) extremeStress += (15 - v) * 0.5;
    });
    state.stress = clamp(state.stress + extremeStress);
    state.stress = clamp(state.stress + 1 + state.turn * 0.3);

    state.turn++;
    recordHistory();

    // Show reflection
    state.showingReflection = true;
    state.lastReflection = choice.reflection || '';
    render();

    setTimeout(() => {
        state.showingReflection = false;
        checkGameState();
    }, 3500);
}

function checkGameState() {
    if (state.stress >= STRESS_MAX) {
        state.gameOver = true;
        state.gameOverReason = 'Burnout. The weight finally broke you — not all at once, but in the way water breaks stone. Slowly, then completely.';
    } else if (state.stats.energy <= 0) {
        state.gameOver = true;
        state.gameOverReason = 'Collapse. Your body kept the score your mind refused to read. It shut down to save you from yourself.';
    } else if (state.stats.relationships <= 0) {
        state.gameOver = true;
        state.gameOverReason = 'Alone. The last person left quietly. No fight. No goodbye. Just an empty room and the echo of everything you traded for this.';
    } else if (state.stats.money <= 0 && state.stats.fulfillment <= 10) {
        state.gameOver = true;
        state.gameOverReason = 'Bankrupt — in every sense. The dream spent everything you had and left you with the receipt.';
    } else if (state.turn >= TOTAL_TURNS) {
        state.gameOver = true;
        state.gameOverReason = 'Time\'s up. Twenty years passed in what felt like twenty minutes. The meter is running, but the ride is over.';
    }

    if (state.gameOver) {
        state.phase = 'endgame';
    }
    render();
}

function recordHistory() {
    state.history.push({ turn: state.turn, stats: { ...state.stats }, stress: state.stress });
}

function simulateOrdinaryPath() {
    const sim = [];
    const s = { ...state.originalStats };
    let stress = state.originalStress;

    for (let i = 0; i < state.history.length; i++) {
        sim.push({ turn: i, stats: { ...s }, stress });
        s.money = clamp(s.money + 2.5);
        s.relationships = clamp(s.relationships + 1.5);
        s.energy = clamp(s.energy - 1);
        s.fulfillment = clamp(s.fulfillment + 2);
        stress = clamp(stress + 0.3);
        Object.keys(s).forEach(k => {
            if (s[k] < 30) s[k] = clamp(s[k] + 3);
            if (s[k] > 80) s[k] = clamp(s[k] - 1);
        });
    }
    return sim;
}

function restartGame() {
    Object.assign(state, {
        phase: 'intro', profile: null, idealLife: null, turn: 0,
        stats: { money: 0, relationships: 0, energy: 0, fulfillment: 0 },
        stress: 0, history: [], gameOver: false, flags: new Set(),
        currentEra: -1, showingReflection: false
    });
    document.body.style.filter = '';
    render();
}

// =========================================
// Render
// =========================================
// =========================================
// BaZi Flow
// =========================================
function submitBazi() {
    const y = parseInt(document.getElementById('bazi-year').value);
    const m = parseInt(document.getElementById('bazi-month').value);
    const d = parseInt(document.getElementById('bazi-day').value);
    const h = parseInt(document.getElementById('bazi-hour').value);

    if (!y || !m || !d) return;

    state.bazi = calculateBaZi(y, m, d, h);
    state.baziAnalysis = analyzeElements(state.bazi);
    state.baziScores = scoreLife(state.bazi, state.baziAnalysis);

    const gameStats = baziToGameStats(state.baziScores);
    state.originalStats = { ...gameStats };
    state.originalStress = 10;

    // Create a profile from BaZi
    const age = new Date().getFullYear() - y;
    state.profile = {
        id: 'bazi',
        name: `${STEMS[state.bazi.day.stem]}${BRANCHES[state.bazi.day.branch]} · ${ANIMAL_EN[state.bazi.animal]}`,
        age: age,
        desc: 'Your natural life script, decoded from your birth chart.',
        stats: { ...gameStats },
        stress: 10
    };

    state.phase = 'bazi-results';
    render();
}

function selectSupplement(aspectIndex) {
    const sup = SUPPLEMENT_OPTIONS[aspectIndex];
    if (state.supplements.includes(aspectIndex)) return;
    if (state.supplements.length >= 2) return; // max 2 supplements

    state.supplements.push(aspectIndex);
    render();
}

function removeSupplement(aspectIndex) {
    state.supplements = state.supplements.filter(i => i !== aspectIndex);
    render();
}

function startGameFromBazi() {
    const gameStats = baziToGameStats(state.baziScores);
    let stress = 10;

    // Apply supplements as the "ideal life" modifications
    state.supplements.forEach(idx => {
        const sup = SUPPLEMENT_OPTIONS[idx];
        Object.keys(sup.boost).forEach(k => {
            if (k !== 'stress') gameStats[k] = clamp((gameStats[k] || 0) + sup.boost[k]);
        });
        Object.keys(sup.cost).forEach(k => {
            if (k === 'stress') stress = clamp(stress + sup.cost[k]);
            else gameStats[k] = clamp((gameStats[k] || 0) + sup.cost[k]);
        });
    });

    state.stats = { ...gameStats };
    state.stress = stress;
    state.turn = 0;
    state.history = [];
    state.flags = new Set();
    state.gameOver = false;
    state.currentEra = -1;

    // Create idealLife object for maintenance costs (scaled by number of supplements)
    const supCount = state.supplements.length || 1;
    state.idealLife = {
        id: 'bazi-supplement',
        name: state.supplements.map(i => SUPPLEMENT_OPTIONS[i].label.split(' · ')[1]).join(' + ') || 'Natural Script',
        icon: '☯',
        maintenanceCost: {
            money: -2 * supCount,
            relationships: -3 * supCount,
            energy: -4 * supCount,
            fulfillment: -2 * supCount
        }
    };

    recordHistory();
    state.eventDeck = [];
    for (let era = 0; era < 4; era++) {
        state.eventDeck.push(...shuffle(EVENTS.filter(e => e.era === era)));
    }

    state.phase = 'playing';
    render();
}

function render() {
    const c = document.getElementById('game-content');

    if (state.phase === 'intro') return renderIntro(c);
    if (state.phase === 'bazi-input') return renderBaziInput(c);
    if (state.phase === 'bazi-results') return renderBaziResults(c);
    if (state.phase === 'supplement') return renderSupplement(c);
    if (state.phase === 'setup') return renderSetup(c);
    if (state.phase === 'rewrite') return renderRewrite(c);
    if (state.phase === 'endgame') return renderEndgame(c);

    // Playing phase: check era transitions
    const era = getEraForTurn(state.turn);
    if (era !== state.currentEra && !state.showingReflection && !state.gameOver) {
        state.currentEra = era;
        return renderEraIntro(c, era);
    }

    if (state.showingReflection) return renderReflection(c);
    renderGame(c);
}

function renderIntro(c) {
    c.innerHTML = `
        <div class="intro-screen">
            <p class="intro-epigraph">"不要美化另一条路。"</p>
            <h1 class="intro-title">The Life<br>Script</h1>
            <p class="intro-sub">An interactive experience about the life you have<br>and the life you think you want.</p>
            <p class="intro-desc">Enter your birth details and discover your natural life script through BaZi (八字).<br>Then decide what to "fix" — and learn why fixing comes with a price.</p>
            <div class="intro-actions">
                <button class="btn btn-primary" onclick="state.phase='bazi-input'; render();">Read My Birth Chart</button>
                <button class="btn btn-secondary" onclick="state.phase='setup'; render();">Skip — Use Preset Profile</button>
            </div>
            <p class="intro-credit">By <a href="../">JSU</a> · Zen Mode</p>
        </div>`;
}

function renderBaziInput(c) {
    c.innerHTML = `
        <div class="bazi-input-screen">
            <p class="phase-label">Your Birth Chart</p>
            <h2>Enter Your Birth Details</h2>
            <p class="phase-desc">The Four Pillars of Destiny (八字) are calculated from your birth year, month, day, and hour. If you don't know the exact hour, choose the closest.</p>
            <div class="bazi-form">
                <div class="bazi-field">
                    <label>Year</label>
                    <input type="number" id="bazi-year" min="1940" max="2010" placeholder="e.g. 1990">
                </div>
                <div class="bazi-field">
                    <label>Month</label>
                    <select id="bazi-month">
                        <option value="1">January</option><option value="2">February</option>
                        <option value="3">March</option><option value="4">April</option>
                        <option value="5">May</option><option value="6">June</option>
                        <option value="7">July</option><option value="8">August</option>
                        <option value="9">September</option><option value="10">October</option>
                        <option value="11">November</option><option value="12">December</option>
                    </select>
                </div>
                <div class="bazi-field">
                    <label>Day</label>
                    <input type="number" id="bazi-day" min="1" max="31" placeholder="1-31">
                </div>
                <div class="bazi-field">
                    <label>Hour</label>
                    <select id="bazi-hour">
                        <option value="0">23:00-01:00 (子)</option>
                        <option value="2">01:00-03:00 (丑)</option>
                        <option value="4">03:00-05:00 (寅)</option>
                        <option value="6">05:00-07:00 (卯)</option>
                        <option value="8">07:00-09:00 (辰)</option>
                        <option value="10">09:00-11:00 (巳)</option>
                        <option value="12" selected>11:00-13:00 (午)</option>
                        <option value="14">13:00-15:00 (未)</option>
                        <option value="16">15:00-17:00 (申)</option>
                        <option value="18">17:00-19:00 (酉)</option>
                        <option value="20">19:00-21:00 (戌)</option>
                        <option value="22">21:00-23:00 (亥)</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-primary" onclick="submitBazi()">Decode My Script</button>
            <button class="btn btn-ghost" onclick="state.phase='setup'; render();">Skip — Use Preset</button>
        </div>`;
}

function renderBaziResults(c) {
    const b = state.bazi;
    const a = state.baziAnalysis;
    const s = state.baziScores;
    const pillars = ['hour','day','month','year'];
    const pillarLabels = ['时柱 Hour','日柱 Day','月柱 Month','年柱 Year'];

    const elBars = a.count.map((cnt, i) =>
        `<div class="el-bar-row">
            <span class="el-label">${EL_EMOJI[i]} ${EL_CN[i]} ${EL_EN[i]}</span>
            <div class="el-track"><div class="el-fill" style="width:${cnt*12.5}%"></div></div>
            <span class="el-val">${cnt}</span>
        </div>`
    ).join('');

    const scoreCards = ['career','wealth','relationships','health','family'].map(key => {
        const sc = s[key];
        const labels = { career:'事业 Career', wealth:'财富 Wealth', relationships:'感情 Relationships', health:'健康 Health', family:'家庭 Family' };
        const color = sc.score >= 65 ? '#00ffcc' : sc.score >= 45 ? '#ffaa33' : '#ff6b6b';
        return `<div class="score-card">
            <div class="score-header">
                <span class="score-label">${labels[key]}</span>
                <span class="score-number" style="color:${color}">${sc.score}</span>
            </div>
            <div class="score-bar"><div class="score-fill" style="width:${sc.score}%;background:${color}"></div></div>
            <p class="score-note">${sc.note}</p>
        </div>`;
    }).join('');

    c.innerHTML = `
        <div class="bazi-results-screen">
            <p class="phase-label">Your Natural Script</p>
            <h2>${STEMS[b.day.stem]}${BRANCHES[b.day.branch]}日主 · ${ANIMAL_EN[b.animal]} Year</h2>
            <p class="phase-desc">Day Master: ${EL_EMOJI[a.dayEl]} ${EL_CN[a.dayEl]} (${EL_EN[a.dayEl]}) — ${a.isStrong ? 'Strong constitution' : 'Gentle constitution'}</p>

            <div class="pillars-display">
                ${pillars.map((p, i) => {
                    const fp = formatPillar(b[p]);
                    return `<div class="pillar">
                        <span class="pillar-label">${pillarLabels[i]}</span>
                        <span class="pillar-stem">${fp.stem}</span>
                        <span class="pillar-branch">${fp.branch}</span>
                        <span class="pillar-el">${fp.stemEl} ${fp.branchEl}</span>
                    </div>`;
                }).join('')}
            </div>

            <h3 class="subsection-title">Five Elements Distribution</h3>
            <div class="el-bars">${elBars}</div>
            ${a.missing.length > 0 ? `<p class="missing-note">缺 Missing: ${a.missing.map(i => `${EL_EMOJI[i]} ${EL_CN[i]}`).join(', ')}</p>` : '<p class="missing-note" style="color:#00ffcc">✓ All five elements present</p>'}

            <h3 class="subsection-title">Life Aspect Scores</h3>
            <div class="score-cards">${scoreCards}</div>

            <div class="bazi-actions">
                <button class="btn btn-primary" onclick="state.supplements=[]; state.phase='supplement'; render();">What Can I Fix? →</button>
            </div>
        </div>`;
}

function renderSupplement(c) {
    const s = state.baziScores;
    const gameStats = baziToGameStats(s);

    // Calculate modified stats preview
    const preview = { ...gameStats };
    let previewStress = 10;
    state.supplements.forEach(idx => {
        const sup = SUPPLEMENT_OPTIONS[idx];
        Object.keys(sup.boost).forEach(k => { if (k !== 'stress') preview[k] = clamp((preview[k] || 0) + sup.boost[k]); });
        Object.keys(sup.cost).forEach(k => {
            if (k === 'stress') previewStress = clamp(previewStress + sup.cost[k]);
            else preview[k] = clamp((preview[k] || 0) + sup.cost[k]);
        });
    });

    const cards = SUPPLEMENT_OPTIONS.map((sup, idx) => {
        const sc = s[sup.aspect];
        const isSelected = state.supplements.includes(idx);
        const isLow = sc.score < 55;
        return `<div class="sup-card ${isSelected ? 'selected' : ''} ${isLow ? 'recommended' : ''}"
                     onclick="${isSelected ? `removeSupplement(${idx})` : `selectSupplement(${idx})`}">
            <div class="sup-header">
                <span class="sup-label">${sup.label}</span>
                <span class="sup-score">${sc.score}</span>
            </div>
            <p class="sup-desc">${sup.desc}</p>
            <p class="sup-warning">${sup.warning}</p>
            ${isSelected ? '<span class="sup-badge">Selected ✓</span>' : isLow ? '<span class="sup-badge rec">Recommended</span>' : ''}
        </div>`;
    }).join('');

    c.innerHTML = `
        <div class="supplement-screen">
            <p class="phase-label">The Temptation</p>
            <h2>What Do You Want to Fix?</h2>
            <p class="phase-desc">Your natural script has gaps. You can choose up to <strong>2</strong> areas to boost — but every boost has a cost. Choose wisely. Or don't choose at all.</p>

            <div class="sup-grid">${cards}</div>

            <div class="preview-block">
                <h3 class="subsection-title">Your Modified Script</h3>
                <div class="stat-bars">
                    ${renderStatBar('💰', 'Money', preview.money)}
                    ${renderStatBar('❤️', 'Bonds', preview.relationships)}
                    ${renderStatBar('🧠', 'Energy', preview.energy)}
                    ${renderStatBar('🌟', 'Purpose', preview.fulfillment)}
                </div>
                <div class="stress-bar">
                    <span>🌪️ Starting Stress</span>
                    <div class="stress-track"><div class="stress-fill" style="width:${previewStress}%"></div></div>
                    <span class="stat-val">${previewStress}</span>
                </div>
            </div>

            <div class="bazi-actions">
                <button class="btn btn-primary" onclick="startGameFromBazi()">
                    ${state.supplements.length > 0 ? 'Live the Modified Life →' : 'Live My Natural Script →'}
                </button>
                ${state.supplements.length === 0 ? '<p class="sup-hint">You can also play without changing anything — and see what happens.</p>' : ''}
            </div>
        </div>`;
}

function renderSetup(c) {
    c.innerHTML = `
        <div class="setup-screen">
            <p class="phase-label">Chapter 1</p>
            <h2>Your Current Script</h2>
            <p class="phase-desc">Every life starts somewhere. Choose the one closest to yours.</p>
            <div class="profile-grid">
                ${PROFILES.map(p => `
                    <div class="profile-card" onclick="selectProfile('${p.id}')">
                        <h3>${p.name}</h3><span class="profile-age">Age ${p.age}</span>
                        <p>${p.desc}</p>
                        <div class="mini-bars">
                            ${renderMiniBars(p.stats)}
                        </div>
                    </div>`).join('')}
            </div>
        </div>`;
}

function renderRewrite(c) {
    c.innerHTML = `
        <div class="rewrite-screen">
            <p class="phase-label">Chapter 2</p>
            <h2>Rewrite Your Script</h2>
            <p class="phase-desc">You chose <strong>${state.profile.name}</strong>. Now — if you could be anyone, who would you become?</p>
            <div class="ideal-grid">
                ${IDEAL_LIVES.map(l => `
                    <div class="ideal-card" onclick="selectIdealLife('${l.id}')">
                        <span class="ideal-icon">${l.icon}</span>
                        <h3>${l.name}</h3><p>${l.desc}</p>
                        <div class="mini-bars">${renderMiniBars(l.stats)}</div>
                        <div class="debuff-list">${l.debuffs.map(d => `<span class="debuff">⚠️ ${d}</span>`).join('')}</div>
                    </div>`).join('')}
            </div>
        </div>`;
}

function renderEraIntro(c, eraIndex) {
    const era = ERAS[eraIndex];
    c.innerHTML = `
        <div class="era-intro" onclick="render()">
            <p class="era-chapter">Chapter ${eraIndex + 3}</p>
            <h2 class="era-name">${era.name}</h2>
            <p class="era-text">${era.intro}</p>
            <p class="era-narrator">${era.narrator}</p>
            <p class="era-continue">Tap to continue</p>
        </div>`;
}

function renderReflection(c) {
    c.innerHTML = `
        <div class="reflection-screen">
            <p class="reflection-text">${state.lastReflection}</p>
        </div>`;
}

function renderGame(c) {
    const event = state.eventDeck[state.turn];
    if (!event) { state.gameOver = true; state.gameOverReason = "The story ends here."; state.phase = 'endgame'; return renderEndgame(c); }

    const s = state.stats;
    const era = ERAS[state.currentEra] || ERAS[0];
    const eventText = getEventText(event);

    // Stress visual
    const sp = state.stress;
    document.body.style.filter = sp > 50
        ? `saturate(${1 - (sp - 50) * 0.015}) brightness(${1 - (sp - 50) * 0.004})`
        : '';

    c.innerHTML = `
        <div class="game-screen">
            <div class="game-hud">
                <div class="hud-top">
                    <span class="era-badge">${era.name}</span>
                    <span class="turn-label">Year ${state.turn + 1} of ${TOTAL_TURNS}</span>
                </div>
                <div class="stat-bars">
                    ${renderStatBar('💰', 'Money', s.money)}
                    ${renderStatBar('❤️', 'Bonds', s.relationships)}
                    ${renderStatBar('🧠', 'Energy', s.energy)}
                    ${renderStatBar('🌟', 'Purpose', s.fulfillment)}
                </div>
                <div class="stress-bar">
                    <span>🌪️ Stress</span>
                    <div class="stress-track"><div class="stress-fill" style="width:${sp}%"></div></div>
                    <span class="stat-val">${sp}</span>
                </div>
            </div>

            <div class="event-card">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-text">${eventText}</p>
            </div>

            <div class="choice-buttons">
                <button class="choice-btn choice-left" onclick="makeChoice('left')">
                    <span class="choice-label">${event.left.label}</span>
                </button>
                <button class="choice-btn choice-right" onclick="makeChoice('right')">
                    <span class="choice-label">${event.right.label}</span>
                </button>
            </div>
        </div>`;
}

function renderEndgame(c) {
    document.body.style.filter = '';
    const ordinaryPath = simulateOrdinaryPath();
    const pf = state.history[state.history.length - 1];
    const of_ = ordinaryPath[ordinaryPath.length - 1];

    const pScore = Math.round((pf.stats.money + pf.stats.relationships + pf.stats.energy + pf.stats.fulfillment) / 4 - pf.stress * 0.5);
    const oScore = Math.round((of_.stats.money + of_.stats.relationships + of_.stats.energy + of_.stats.fulfillment) / 4 - of_.stress * 0.5);

    c.innerHTML = `
        <div class="endgame-screen">
            <p class="phase-label">The Reckoning</p>
            <h2 class="endgame-reason">${state.gameOverReason}</h2>

            <div class="comparison">
                <div class="comparison-col">
                    <h3>Your "Dream" Life</h3>
                    <p class="comparison-subtitle">${state.idealLife.icon} ${state.idealLife.name}</p>
                    <div class="final-stats">
                        <div class="final-stat">💰 Money <strong>${pf.stats.money}</strong></div>
                        <div class="final-stat">❤️ Bonds <strong>${pf.stats.relationships}</strong></div>
                        <div class="final-stat">🧠 Energy <strong>${pf.stats.energy}</strong></div>
                        <div class="final-stat">🌟 Purpose <strong>${pf.stats.fulfillment}</strong></div>
                        <div class="final-stat stress-stat">🌪️ Stress <strong>${pf.stress}</strong></div>
                    </div>
                    <div class="life-score bad">Balance: ${pScore}</div>
                </div>
                <div class="comparison-divider"><span>VS</span></div>
                <div class="comparison-col">
                    <h3>Your Original Script</h3>
                    <p class="comparison-subtitle">${state.profile.name} — played steadily</p>
                    <div class="final-stats">
                        <div class="final-stat">💰 Money <strong>${of_.stats.money}</strong></div>
                        <div class="final-stat">❤️ Bonds <strong>${of_.stats.relationships}</strong></div>
                        <div class="final-stat">🧠 Energy <strong>${of_.stats.energy}</strong></div>
                        <div class="final-stat">🌟 Purpose <strong>${of_.stats.fulfillment}</strong></div>
                        <div class="final-stat stress-stat">🌪️ Stress <strong>${of_.stress}</strong></div>
                    </div>
                    <div class="life-score good">Balance: ${oScore}</div>
                </div>
            </div>

            <div class="endgame-message">
                <blockquote>"You spent years chasing someone else's script. But the original — <em>your</em> original — had everything you needed. Not because it was perfect. Because it was <em>yours</em>. The cracks were yours. The growth was yours. The quiet victories no one applauded were <em>yours</em>."</blockquote>
                <p class="endgame-zen">不要美化另一条路。学好用好自己的剧本。<br><span>Don't romanticise the road not taken. Learn to play your own hand.</span></p>
            </div>

            <div class="endgame-actions">
                <button class="btn btn-primary" onclick="restartGame()">Play Again (Different Life)</button>
                <a href="../" class="btn btn-secondary">Return to Zen Mode</a>
            </div>
        </div>`;
}

// =========================================
// Helpers
// =========================================
function renderMiniBars(stats) {
    return ['money', 'relationships', 'energy', 'fulfillment'].map((k, i) => {
        const icons = ['💰', '❤️', '🧠', '🌟'];
        return `<div class="mini-bar"><span class="mini-icon">${icons[i]}</span><div class="mini-fill" style="width:${stats[k]}%"></div></div>`;
    }).join('');
}

function renderStatBar(icon, label, value) {
    const color = value < 20 ? '#ff6b6b' : '#00ffcc';
    return `<div class="stat-bar-item">
        <span class="stat-icon">${icon}</span>
        <div class="stat-track"><div class="stat-fill" style="width:${value}%;background:${color}"></div></div>
        <span class="stat-val">${value}</span>
    </div>`;
}

document.addEventListener('DOMContentLoaded', render);
