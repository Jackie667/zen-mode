// =========================================
// Life Script Profiles (Phase 1: Choose your baseline)
// =========================================
const PROFILES = [
    {
        id: 'dreamer',
        name: 'The Fresh Graduate',
        age: 23,
        desc: 'Full of energy and dreams. Empty wallet. A few close friends. The world feels wide open.',
        stats: { money: 15, relationships: 55, energy: 90, fulfillment: 35 },
        stress: 5
    },
    {
        id: 'worker',
        name: 'The 9-to-5',
        age: 30,
        desc: 'Stable income, decent social circle. Comfortable but quietly unfulfilled. Is this really it?',
        stats: { money: 45, relationships: 60, energy: 55, fulfillment: 30 },
        stress: 15
    },
    {
        id: 'crossroads',
        name: 'The Crossroads',
        age: 35,
        desc: 'Career plateau. Family expectations. A growing feeling that something must change.',
        stats: { money: 50, relationships: 45, energy: 45, fulfillment: 25 },
        stress: 30
    },
    {
        id: 'restart',
        name: 'The Late Bloomer',
        age: 40,
        desc: 'Starting over after losing some things. Less energy, but more perspective than ever.',
        stats: { money: 30, relationships: 35, energy: 40, fulfillment: 50 },
        stress: 20
    }
];

// =========================================
// Ideal Lives (Phase 2: Rewrite your script)
// =========================================
const IDEAL_LIVES = [
    {
        id: 'tycoon',
        name: 'The Tycoon',
        icon: '👑',
        desc: 'Unlimited wealth. Private jets. Penthouse views. Everything money can buy.',
        stats: { money: 95, relationships: 35, energy: 45, fulfillment: 55 },
        stress: 25,
        debuffs: [
            'Relationship maintenance cost ×3 — everyone around you wants something',
            'Energy drain +8/year — wealth demands constant vigilance',
            'Unlocks: "High Places Are Cold" — trust erodes naturally'
        ],
        maintenanceCost: { money: -3, relationships: -6, energy: -8, fulfillment: -2 }
    },
    {
        id: 'beloved',
        name: 'The Beloved',
        icon: '💕',
        desc: 'Surrounded by deep love. Everyone\'s confidant. The person people call at 3am.',
        stats: { money: 25, relationships: 95, energy: 40, fulfillment: 65 },
        stress: 20,
        debuffs: [
            'Energy drain ×3 — emotional labour is invisible but exhausting',
            'Financial stress +6/year — love doesn\'t pay rent',
            'Unlocks: "Compassion Fatigue" — caring for others at your own expense'
        ],
        maintenanceCost: { money: -2, relationships: -3, energy: -10, fulfillment: -2 }
    },
    {
        id: 'achiever',
        name: 'The Prodigy',
        icon: '🏆',
        desc: 'Genius-level talent. Awards. Global recognition. The work speaks for itself.',
        stats: { money: 60, relationships: 25, energy: 35, fulfillment: 95 },
        stress: 30,
        debuffs: [
            'Relationships crumble -6/year — no one can reach you on the pedestal',
            'Perfectionism stress +10/year — the bar only goes up',
            'Unlocks: "Lonely at the Top" — admiration is not the same as love'
        ],
        maintenanceCost: { money: -2, relationships: -7, energy: -6, fulfillment: -4 }
    },
    {
        id: 'elite',
        name: 'The Perfect Life',
        icon: '✨',
        desc: 'Everything above average. Health, wealth, love, purpose — the life everyone envies.',
        stats: { money: 78, relationships: 78, energy: 72, fulfillment: 78 },
        stress: 15,
        debuffs: [
            'ALL maintenance costs ×4 — perfection is the most expensive thing to maintain',
            'Stress +12/year — every small slip feels catastrophic',
            'Unlocks: "The Imposter" — you can never relax'
        ],
        maintenanceCost: { money: -6, relationships: -6, energy: -8, fulfillment: -5 }
    }
];

// =========================================
// Event Cards (Phase 3: Living the dream)
// =========================================
const EVENTS = [
    // --- EARLY GAME (Turns 1-5): Honeymoon phase ---
    {
        id: 'new_opportunity',
        title: 'A Door Opens',
        text: 'An exciting opportunity lands in your lap — but it demands full commitment.',
        left: { label: 'Go all in', effect: { money: 12, fulfillment: 10, energy: -15, relationships: -8, stress: 5 } },
        right: { label: 'Pass. Protect what I have.', effect: { money: -3, fulfillment: -5, energy: 5, relationships: 5, stress: -3 } }
    },
    {
        id: 'social_invite',
        title: 'The Inner Circle',
        text: 'You\'re invited to an exclusive gathering. The right connections could change everything.',
        left: { label: 'Attend and network', effect: { money: 8, relationships: -5, energy: -10, fulfillment: 5, stress: 8 } },
        right: { label: 'Stay home with real friends', effect: { money: -2, relationships: 10, energy: 5, fulfillment: 3, stress: -5 } }
    },
    {
        id: 'upgrade_lifestyle',
        title: 'Level Up',
        text: 'You can afford a better lifestyle now. Nicer apartment, better car, finer things.',
        left: { label: 'Upgrade everything', effect: { money: -15, fulfillment: 12, energy: -5, relationships: 3, stress: 6 } },
        right: { label: 'Live below my means', effect: { money: 10, fulfillment: -3, energy: 3, relationships: 0, stress: -4 } }
    },
    {
        id: 'first_win',
        title: 'The First Win',
        text: 'Something you worked hard for finally pays off. People notice.',
        left: { label: 'Celebrate and push harder', effect: { money: 8, fulfillment: 15, energy: -12, relationships: -3, stress: 5 } },
        right: { label: 'Appreciate it quietly', effect: { money: 3, fulfillment: 8, energy: 3, relationships: 5, stress: -5 } }
    },
    {
        id: 'travel',
        title: 'The Escape',
        text: 'You have a chance to travel somewhere you\'ve always dreamed of visiting.',
        left: { label: 'Book it. Life is short.', effect: { money: -12, fulfillment: 15, energy: 8, relationships: 5, stress: -8 } },
        right: { label: 'Save the money for later', effect: { money: 8, fulfillment: -5, energy: -3, relationships: -2, stress: 5 } }
    },

    // --- MID GAME (Turns 6-10): Cracks appear ---
    {
        id: 'partner_sick',
        title: 'A Call From the Hospital',
        text: 'Someone you love is seriously ill. They need you — but your schedule is already impossible.',
        left: { label: 'Drop everything. Be there.', effect: { money: -10, relationships: 18, energy: -20, fulfillment: 5, stress: 10 } },
        right: { label: 'Send money. Keep working.', effect: { money: -20, relationships: -15, energy: -5, fulfillment: -10, stress: 15 } }
    },
    {
        id: 'burnout_signs',
        title: 'The Warning',
        text: 'You haven\'t slept properly in weeks. Your body is sending signals you\'ve been ignoring.',
        left: { label: 'Push through. No time to stop.', effect: { money: 5, energy: -18, fulfillment: -5, relationships: -5, stress: 15 } },
        right: { label: 'Slow down. Something has to give.', effect: { money: -8, energy: 12, fulfillment: -3, relationships: 5, stress: -10 } }
    },
    {
        id: 'betrayal',
        title: 'The Mask Falls',
        text: 'Someone you trusted has been using you. The evidence is undeniable.',
        left: { label: 'Cut them off completely', effect: { relationships: -12, energy: -5, fulfillment: -8, stress: 12, money: 0 } },
        right: { label: 'Confront and try to understand', effect: { relationships: -5, energy: -10, fulfillment: 3, stress: 8, money: 0 } }
    },
    {
        id: 'comparison',
        title: 'The Scroll',
        text: 'Late at night, you scroll through social media. Everyone else seems to have it figured out.',
        left: { label: 'Work harder. Close the gap.', effect: { energy: -12, fulfillment: -8, stress: 12, money: 3, relationships: -5 } },
        right: { label: 'Put the phone down. Breathe.', effect: { energy: 5, fulfillment: 3, stress: -5, money: 0, relationships: 3 } }
    },
    {
        id: 'parent_aging',
        title: 'The Phone Call',
        text: 'Your parent calls. They sound older than you remember. They ask when you\'re coming home.',
        left: { label: 'Visit this weekend', effect: { relationships: 15, energy: -10, money: -8, fulfillment: 8, stress: 3 } },
        right: { label: '"Soon, I promise."', effect: { relationships: -12, energy: 0, money: 0, fulfillment: -10, stress: 10 } }
    },

    // --- LATE GAME (Turns 11-15): The unraveling ---
    {
        id: 'identity_crisis',
        title: 'The Mirror',
        text: 'You catch your reflection and don\'t recognise the person staring back. Who is this?',
        left: { label: 'Reinvent myself. Again.', effect: { fulfillment: -5, energy: -15, stress: 15, money: -10, relationships: -8 } },
        right: { label: 'Sit with the discomfort', effect: { fulfillment: 8, energy: -5, stress: 5, money: 0, relationships: 3 } }
    },
    {
        id: 'financial_shock',
        title: 'The Invoice',
        text: 'An unexpected cost wipes out your safety net. The lifestyle you built is suddenly fragile.',
        left: { label: 'Borrow to maintain appearances', effect: { money: -20, stress: 18, relationships: -3, energy: -5, fulfillment: -8 } },
        right: { label: 'Downsize. Accept the reality.', effect: { money: -8, stress: 5, relationships: 5, energy: 3, fulfillment: -3 } }
    },
    {
        id: 'old_friend',
        title: 'A Message From the Past',
        text: 'An old friend you drifted from reaches out. "I miss who we used to be."',
        left: { label: 'Reconnect. Make time.', effect: { relationships: 15, energy: -8, fulfillment: 10, money: -3, stress: -5 } },
        right: { label: 'Leave it on read', effect: { relationships: -8, energy: 0, fulfillment: -8, money: 0, stress: 5 } }
    },
    {
        id: 'health_crisis',
        title: 'The Diagnosis',
        text: 'The doctor looks at you seriously. "We need to talk about your test results."',
        left: { label: 'Full treatment. Whatever it takes.', effect: { energy: -15, money: -25, stress: 15, relationships: 5, fulfillment: -5 } },
        right: { label: 'Ignore it. Keep going.', effect: { energy: -25, money: 0, stress: 20, relationships: -10, fulfillment: -10 } }
    },
    {
        id: 'meaning_crisis',
        title: 'The Question',
        text: 'Lying awake at 3am, the thought arrives unbidden: "What is all this actually for?"',
        left: { label: 'Double down. Achievement IS meaning.', effect: { fulfillment: -10, energy: -10, stress: 15, money: 5, relationships: -8 } },
        right: { label: 'Let the question sit. No answer needed.', effect: { fulfillment: 8, energy: 5, stress: -8, money: -3, relationships: 5 } }
    },

    // --- ENDGAME (Turns 16-20): Final stretch ---
    {
        id: 'legacy',
        title: 'The Legacy Question',
        text: 'Someone asks you: "What do you want to be remembered for?" You don\'t have an answer.',
        left: { label: 'Build something that outlasts me', effect: { fulfillment: 5, energy: -15, money: -10, stress: 12, relationships: -5 } },
        right: { label: '"Being present for the people I love"', effect: { fulfillment: 10, energy: -3, money: 0, stress: -5, relationships: 10 } }
    },
    {
        id: 'letting_go',
        title: 'The Release',
        text: 'You realise you\'ve been gripping something so tightly your hands are numb. What if you just... let go?',
        left: { label: 'Let go. See what remains.', effect: { fulfillment: 15, energy: 10, stress: -15, money: -5, relationships: 8 } },
        right: { label: 'No. I\'ve come too far.', effect: { fulfillment: -10, energy: -10, stress: 15, money: 3, relationships: -8 } }
    },
    {
        id: 'quiet_moment',
        title: 'The Silence',
        text: 'For the first time in years, there\'s nothing scheduled. No notifications. Just silence.',
        left: { label: 'Fill it immediately', effect: { energy: -8, stress: 8, fulfillment: -5, money: 3, relationships: -3 } },
        right: { label: 'Stay in the silence', effect: { energy: 10, stress: -12, fulfillment: 12, money: 0, relationships: 5 } }
    },
    {
        id: 'full_circle',
        title: 'The Notebook',
        text: 'You find an old notebook. In it, your younger self wrote: "I just want to be happy and free."',
        left: { label: 'I\'ve outgrown that naivety', effect: { fulfillment: -12, stress: 10, energy: -5, money: 0, relationships: -5 } },
        right: { label: 'Maybe they were right all along', effect: { fulfillment: 15, stress: -10, energy: 8, money: -3, relationships: 8 } }
    },
    {
        id: 'final_choice',
        title: 'The Crossroads (Again)',
        text: 'You stand at another crossroads. But this time, you know the weight of choosing.',
        left: { label: 'Chase what I still don\'t have', effect: { stress: 20, energy: -15, fulfillment: -8, money: -5, relationships: -10 } },
        right: { label: 'Water what I already planted', effect: { stress: -10, energy: 5, fulfillment: 15, money: 3, relationships: 12 } }
    }
];
