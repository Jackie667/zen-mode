document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Screen Management
    // =========================================
    const screens = document.querySelectorAll('.screen');

    function showScreen(id) {
        screens.forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo(0, 0);
    }

    // =========================================
    // Navigation Buttons
    // =========================================
    document.getElementById('btn-cast').addEventListener('click', () => {
        resetCasting();
        showScreen('screen-cast');
    });

    document.getElementById('btn-journey').addEventListener('click', () => {
        renderJourneyMap();
        showScreen('screen-journey');
    });

    document.getElementById('btn-recast').addEventListener('click', () => {
        resetCasting();
        showScreen('screen-cast');
    });

    document.getElementById('btn-to-journey').addEventListener('click', () => {
        renderJourneyMap();
        showScreen('screen-journey');
    });

    document.getElementById('btn-back-home').addEventListener('click', () => {
        showScreen('screen-intro');
    });

    document.getElementById('btn-journey-cast').addEventListener('click', () => {
        resetCasting();
        showScreen('screen-cast');
    });

    document.getElementById('btn-journey-home').addEventListener('click', () => {
        showScreen('screen-intro');
    });

    document.getElementById('btn-detail-back').addEventListener('click', () => {
        renderJourneyMap();
        showScreen('screen-journey');
    });

    document.getElementById('btn-detail-cast').addEventListener('click', () => {
        resetCasting();
        showScreen('screen-cast');
    });

    // =========================================
    // Casting Logic
    // =========================================
    let castLines = [];
    let castStep = 0;

    const coinBtn = document.getElementById('coin-btn');
    const castInstruction = document.getElementById('cast-instruction');
    const castStepLabel = document.getElementById('cast-step');
    const slots = document.querySelectorAll('.trigram-line-slot');

    const instructions = [
        'Focus on a question in your mind. When ready, tap to cast your first line.',
        'The first line is set. Breathe. Tap again for the second.',
        'Two lines revealed. One more to complete the trigram. Tap when ready.',
    ];

    function resetCasting() {
        castLines = [];
        castStep = 0;
        castInstruction.textContent = instructions[0];
        castStepLabel.textContent = 'Line 1 of 3';
        coinBtn.disabled = false;

        slots.forEach(slot => {
            slot.classList.remove('yang', 'yin', 'revealed');
        });
    }

    coinBtn.addEventListener('click', () => {
        if (castStep >= 3) return;

        coinBtn.classList.add('casting');
        coinBtn.disabled = true;

        setTimeout(() => {
            coinBtn.classList.remove('casting');

            // Generate line: 0 = yin, 1 = yang
            const line = Math.random() < 0.5 ? 0 : 1;
            castLines.push(line);

            // Reveal the line (bottom to top: index 0 is bottom)
            const slot = document.querySelector(`.trigram-line-slot[data-index="${castStep}"]`);
            slot.classList.add(line === 1 ? 'yang' : 'yin', 'revealed');

            castStep++;

            if (castStep < 3) {
                castInstruction.textContent = instructions[castStep];
                castStepLabel.textContent = `Line ${castStep + 1} of 3`;
                coinBtn.disabled = false;
            } else {
                castInstruction.textContent = 'Your trigram is complete.';
                castStepLabel.textContent = 'Revealing...';

                setTimeout(() => {
                    const key = castLines.join('');
                    const trigram = getTrigram(key);
                    if (trigram) {
                        renderReading(trigram, 'screen-reading');
                        showScreen('screen-reading');
                    }
                }, 1200);
            }
        }, 650);
    });

    // =========================================
    // Render Reading
    // =========================================
    function renderReading(t, screenId) {
        const prefix = screenId === 'screen-reading' ? 'reading' : 'detail';

        // Trigram visual (lines top to bottom = index 2, 1, 0)
        const visualEl = document.getElementById(`${prefix}-trigram-visual`);
        visualEl.innerHTML = '';
        for (let i = 2; i >= 0; i--) {
            const div = document.createElement('div');
            div.className = `tri-line ${t.lines[i] === 1 ? 'yang' : 'yin'}`;
            visualEl.appendChild(div);
        }

        document.getElementById(`${prefix}-phase`).textContent = `${t.phase} — ${t.phaseDesc}`;
        document.getElementById(`${prefix}-name`).textContent = `${t.symbol} ${t.name} ${t.pinyin} · ${t.nature}`;
        document.getElementById(`${prefix}-element`).textContent = t.element;
        document.getElementById(`${prefix}-text`).textContent = t.reading;
        document.getElementById(`${prefix}-shadow`).textContent = t.shadow;
        document.getElementById(`${prefix}-jsu`).textContent = t.jsuNote;
        document.getElementById(`${prefix}-question`).textContent = t.question;
    }

    // =========================================
    // Journey Map
    // =========================================
    function renderJourneyMap() {
        const grid = document.getElementById('journey-grid');
        grid.innerHTML = '';

        const all = getAllTrigrams();
        all.forEach(t => {
            const card = document.createElement('div');
            card.className = 'journey-card';
            card.innerHTML = `
                <span class="journey-card-symbol">${t.symbol}</span>
                <h4>${t.name} ${t.pinyin}</h4>
                <p class="journey-card-nature">${t.nature}</p>
                <p class="journey-card-phase">${t.phase}</p>
            `;

            card.addEventListener('click', () => {
                renderReading(t, 'screen-detail');
                showScreen('screen-detail');
            });

            grid.appendChild(card);
        });
    }
});
