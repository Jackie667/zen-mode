const TRIGRAMS = {
    '111': {
        name: '乾', pinyin: 'Qián', element: 'Heaven', symbol: '☰',
        nature: 'The Creative',
        lines: [1, 1, 1],
        phase: 'The Spark',
        phaseDesc: 'When you feel called to begin something new',
        reading: 'Pure creative energy. This is the moment before the first line is drawn, the building before the blueprint. Everything is possible. The universe is not asking you to be ready — it is asking you to begin. Heaven does not wait for permission to move.',
        shadow: 'But beware: pure creation without grounding becomes fantasy. The sky needs the earth.',
        jsuNote: "I've started over three times — architecture, marketing, and now whatever this is. Each time, the blank page terrified me. And each time, it was exactly where I needed to be. Starting isn't about knowing the end. It's about trusting the first step.",
        question: 'What would you begin if you already had permission?'
    },
    '000': {
        name: '坤', pinyin: 'Kūn', element: 'Earth', symbol: '☷',
        nature: 'The Receptive',
        lines: [0, 0, 0],
        phase: 'The Ground',
        phaseDesc: 'When you must receive, not push',
        reading: 'The earth does not compete with heaven. It receives, nurtures, and transforms. Sometimes the strongest move is to stop moving. Receptivity is not weakness — it is the power that turns a seed into a forest.',
        shadow: 'But pure receptivity without direction becomes drift. The earth needs heaven\'s rain to know where to grow.',
        jsuNote: "After years of forcing direction, I learned the most from the seasons I simply let happen. The ground doesn't choose what seed falls on it. But it grows everything. My most creative periods came after my emptiest ones.",
        question: 'What are you resisting receiving right now?'
    },
    '100': {
        name: '震', pinyin: 'Zhèn', element: 'Thunder', symbol: '☳',
        nature: 'The Arousing',
        lines: [1, 0, 0],
        phase: 'The Shake',
        phaseDesc: 'When everything you knew gets disrupted',
        reading: 'Thunder wakes you up. It is not punishment — it is an alarm clock. The structures you built were real, but they were also cages. Disruption feels like destruction, but look closer: it only breaks what was already cracking.',
        shadow: 'The danger is mistaking the shock for the message. Thunder announces rain — don\'t run from the water.',
        jsuNote: "Leaving architecture felt like thunder. Terrifying. But the walls I'd been building were also the walls I was hiding behind. Sometimes the most honest thing you can do is let your own creation collapse.",
        question: 'What structure in your life is asking to be rebuilt?'
    },
    '011': {
        name: '巽', pinyin: 'Xùn', element: 'Wind', symbol: '☴',
        nature: 'The Gentle',
        lines: [0, 1, 1],
        phase: 'The Drift',
        phaseDesc: 'When progress is invisible but constant',
        reading: 'Wind moves through everything without force. It erodes mountains given enough time. Your influence does not need to be loud to be profound. Gentle persistence reshapes the world — not in a day, but in a direction.',
        shadow: 'Wind without roots scatters. Make sure your gentleness has intention, not just motion.',
        jsuNote: "Marketing taught me this — the best campaigns don't shout. They whisper, and somehow everyone hears. The same is true for personal growth: the changes no one notices are the ones that actually last.",
        question: 'Where in your life is gentle persistence already working?'
    },
    '010': {
        name: '坎', pinyin: 'Kǎn', element: 'Water', symbol: '☵',
        nature: 'The Abysmal',
        lines: [0, 1, 0],
        phase: 'The Depth',
        phaseDesc: 'When you\'re in the dark and can\'t see the exit',
        reading: 'Water finds its way through any obstacle — not by fighting, but by flowing around it. You are in the depth. It is dark here. But the depth is where treasure lives. Every river was once underground.',
        shadow: 'Water without banks floods everything. Even in darkness, hold your shape.',
        jsuNote: "My darkest phase taught me the most. When you can't see the surface, you learn to breathe underwater. That's a skill no one can teach you in daylight. I wouldn't trade those years for anything — they're the foundation everything else stands on.",
        question: 'What is this darkness teaching you that the light never could?'
    },
    '101': {
        name: '离', pinyin: 'Lí', element: 'Fire', symbol: '☲',
        nature: 'The Clinging',
        lines: [1, 0, 1],
        phase: 'The Clarity',
        phaseDesc: 'When you suddenly see what was always there',
        reading: 'Fire illuminates but also burns. Clarity comes with a cost — once you see, you cannot unsee. This is a moment of truth. What you do with this vision will define your next chapter.',
        shadow: 'Fire needs fuel. Clarity without action is just frustration with extra steps.',
        jsuNote: "The moment I understood that architecture, UX, and marketing were the same thing — just different scales of the same question — everything simplified. Pattern recognition is the closest thing to a superpower. Once you see it, you can't go back to not seeing.",
        question: 'What have you recently understood that you can\'t un-understand?'
    },
    '001': {
        name: '艮', pinyin: 'Gèn', element: 'Mountain', symbol: '☶',
        nature: 'Keeping Still',
        lines: [0, 0, 1],
        phase: 'The Pause',
        phaseDesc: 'When doing nothing is the bravest choice',
        reading: 'The mountain does not move, and that is its power. In stillness, you hear what the noise was hiding. This is not inaction — this is the deepest form of action: choosing to be present without needing to perform.',
        shadow: 'A mountain that never moves becomes an obstacle. Know when stillness becomes stubbornness.',
        jsuNote: "禅. This is where Zen Mode lives. Not in doing, but in the space between doing. I built this entire site from a place of stillness — not knowing what comes next, but trusting that not-knowing is its own kind of knowing.",
        question: 'If you did absolutely nothing for a week, what would surface?'
    },
    '110': {
        name: '兑', pinyin: 'Duì', element: 'Lake', symbol: '☱',
        nature: 'The Joyous',
        lines: [1, 1, 0],
        phase: 'The Share',
        phaseDesc: 'When you overflow and give back',
        reading: 'A lake reflects the sky while nourishing the land around it. Joy is not selfish — it is the natural result of fullness. You have gathered enough. Now let it flow outward. Connection multiplies what hoarding diminishes.',
        shadow: 'A lake with no inlet eventually dries. Generosity requires replenishment.',
        jsuNote: "This website, this game — they exist because the lake finally had enough water to overflow. Maybe your lake is full too. What are you waiting for? The things I share imperfectly have connected more deeply than the things I polished to death.",
        question: 'What wisdom are you hoarding that someone else needs right now?'
    }
};

// Helper: convert 3-line array to key string
function linesToKey(lines) {
    return lines.join('');
}

// Get trigram by key
function getTrigram(key) {
    return TRIGRAMS[key] || null;
}

// Get all trigrams as array (for journey map)
function getAllTrigrams() {
    const order = ['111', '000', '100', '011', '010', '101', '001', '110'];
    return order.map(key => ({ key, ...TRIGRAMS[key] }));
}
