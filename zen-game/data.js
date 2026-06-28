// =========================================
// Profiles
// =========================================
const PROFILES = [
    {
        id: 'dreamer', name: 'The Fresh Graduate', age: 23,
        desc: 'Full of energy and dreams. Empty wallet. A few close friends. The world feels wide open.',
        stats: { money: 15, relationships: 55, energy: 90, fulfillment: 35 }, stress: 5
    },
    {
        id: 'worker', name: 'The 9-to-5', age: 30,
        desc: 'Stable income, decent social circle. Comfortable but quietly unfulfilled. Is this really it?',
        stats: { money: 45, relationships: 60, energy: 55, fulfillment: 30 }, stress: 15
    },
    {
        id: 'crossroads', name: 'The Crossroads', age: 35,
        desc: 'Career plateau. Family expectations. A growing feeling that something must change.',
        stats: { money: 50, relationships: 45, energy: 45, fulfillment: 25 }, stress: 30
    },
    {
        id: 'restart', name: 'The Late Bloomer', age: 40,
        desc: 'Starting over after losing some things. Less energy, but more perspective than ever.',
        stats: { money: 30, relationships: 35, energy: 40, fulfillment: 50 }, stress: 20
    }
];

// =========================================
// Ideal Lives
// =========================================
const IDEAL_LIVES = [
    {
        id: 'tycoon', name: 'The Tycoon', icon: '👑',
        desc: 'Unlimited wealth. Private jets. Penthouse views. Everything money can buy.',
        stats: { money: 95, relationships: 35, energy: 45, fulfillment: 55 }, stress: 25,
        debuffs: [
            'Relationship maintenance cost ×3',
            'Energy drain +8/year',
            '"High Places Are Cold" — trust erodes naturally'
        ],
        maintenanceCost: { money: -3, relationships: -6, energy: -8, fulfillment: -2 }
    },
    {
        id: 'beloved', name: 'The Beloved', icon: '💕',
        desc: "Surrounded by deep love. Everyone's confidant. The person people call at 3am.",
        stats: { money: 25, relationships: 95, energy: 40, fulfillment: 65 }, stress: 20,
        debuffs: [
            'Energy drain ×3 — emotional labour is exhausting',
            'Financial stress +6/year',
            '"Compassion Fatigue" — caring at your own expense'
        ],
        maintenanceCost: { money: -2, relationships: -3, energy: -10, fulfillment: -2 }
    },
    {
        id: 'achiever', name: 'The Prodigy', icon: '🏆',
        desc: 'Genius-level talent. Awards. Global recognition. The work speaks for itself.',
        stats: { money: 60, relationships: 25, energy: 35, fulfillment: 95 }, stress: 30,
        debuffs: [
            'Relationships crumble -6/year',
            'Perfectionism stress +10/year',
            '"Lonely at the Top" — admiration ≠ love'
        ],
        maintenanceCost: { money: -2, relationships: -7, energy: -6, fulfillment: -4 }
    },
    {
        id: 'elite', name: 'The Perfect Life', icon: '✨',
        desc: 'Everything above average. Health, wealth, love, purpose — the life everyone envies.',
        stats: { money: 78, relationships: 78, energy: 72, fulfillment: 78 }, stress: 15,
        debuffs: [
            'ALL maintenance ×4 — perfection is expensive',
            'Stress +12/year',
            '"The Imposter" — you can never relax'
        ],
        maintenanceCost: { money: -6, relationships: -6, energy: -8, fulfillment: -5 }
    }
];

// =========================================
// Eras — narrative chapters
// =========================================
const ERAS = [
    {
        name: 'The Honeymoon',
        turns: [0, 4],
        intro: 'The new life feels like a drug. Everything is brighter, faster, more alive. You wonder why you ever settled for ordinary.',
        narrator: 'Enjoy this part. It doesn\'t last.'
    },
    {
        name: 'The Weight',
        turns: [5, 9],
        intro: 'The first cracks appear — not in the world, but in you. The life you chose demands payment. The currency is pieces of yourself you didn\'t know you\'d miss.',
        narrator: 'Every system has a maintenance cost. The question is whether you can afford it.'
    },
    {
        name: 'The Unraveling',
        turns: [10, 14],
        intro: 'You can\'t remember when it stopped feeling like a choice and started feeling like a cage. The same golden door that opened for you has locked behind you.',
        narrator: 'This is where most people start blaming the world. The world hasn\'t changed. You have.'
    },
    {
        name: 'The Reckoning',
        turns: [15, 19],
        intro: 'Every path converges eventually. The question was never "which life is better." It was always: "Who am I when everything I built falls silent?"',
        narrator: 'The last chapter writes itself. You just have to be honest enough to read it.'
    }
];

// =========================================
// Events — context-sensitive, with reflections and consequences
// =========================================
const EVENTS = [
    // ===== ERA 1: THE HONEYMOON (turns 0-4) =====
    {
        era: 0,
        title: 'A Door Opens',
        text: {
            tycoon: 'A billion-dollar deal lands on your desk. The kind of opportunity that makes careers. Your entire team is watching.',
            beloved: 'A childhood friend you lost touch with reaches out — they\'re going through hell and remembered you as the one safe person.',
            achiever: 'A prestigious award committee calls. You\'ve been nominated. The ceremony conflicts with your best friend\'s wedding.',
            elite: 'An investor, a charity, and a wellness retreat all want your time this weekend. You can only pick two.'
        },
        left: {
            label: 'Go all in — this is what I chose this life for',
            effect: { money: 12, fulfillment: 10, energy: -15, relationships: -8, stress: 5 },
            reflection: '"This is the life I wanted. The sacrifices are just the price of admission... right?"'
        },
        right: {
            label: 'Hold back. Protect what matters.',
            effect: { money: -3, fulfillment: -5, energy: 5, relationships: 5, stress: -3 },
            reflection: '"Restraint. A strange feeling in a life designed for excess."'
        }
    },
    {
        era: 0,
        title: 'The Upgrade',
        text: {
            tycoon: 'Your financial advisor says you can afford the penthouse now. Three floors. City views. A home worthy of your net worth.',
            beloved: 'Your partner wants to host a big gathering — invite everyone, cook for days. Your body says rest. Their eyes say please.',
            achiever: 'A gallery wants to feature your work exclusively. It means six months of isolation to create the collection.',
            elite: 'Your Instagram following just hit 100k. A brand offers a lifestyle sponsorship. All you have to do is keep looking perfect.'
        },
        left: {
            label: 'Upgrade. I deserve this.',
            effect: { money: -15, fulfillment: 12, energy: -5, relationships: 3, stress: 6 },
            reflection: '"The view from the top is beautiful. But who am I sharing it with?"'
        },
        right: {
            label: 'Stay grounded. This is enough.',
            effect: { money: 10, fulfillment: -3, energy: 3, relationships: 0, stress: -4 },
            reflection: '"Enough. When did that word start sounding like defeat?"'
        }
    },
    {
        era: 0,
        title: 'The First Win',
        text: {
            tycoon: 'Your investment triples. The financial news mentions your name. Strangers want to know your secret.',
            beloved: 'Someone you helped years ago writes you a letter. "You saved my life." You cry reading it at your kitchen table.',
            achiever: 'Your project wins international recognition. The standing ovation lasts two minutes. You feel... oddly empty afterwards.',
            elite: 'A magazine calls you "the person who has it all." The article goes viral. Your phone doesn\'t stop buzzing for days.'
        },
        left: {
            label: 'Celebrate and push harder',
            effect: { money: 8, fulfillment: 15, energy: -12, relationships: -3, stress: 5 },
            reflection: '"The high is real. But highs need higher highs to stay high."',
            flag: 'pushed_harder'
        },
        right: {
            label: 'Pause. Sit with this moment.',
            effect: { money: 3, fulfillment: 8, energy: 3, relationships: 5, stress: -5 },
            reflection: '"Gratitude. A strange luxury when the world keeps asking what\'s next."'
        }
    },
    {
        era: 0,
        title: 'Old Roots',
        text: {
            _default: 'Your mother calls on a Tuesday. Not for any reason — just to hear your voice. You almost let it go to voicemail.'
        },
        left: {
            label: 'Pick up. Twenty minutes won\'t kill me.',
            effect: { relationships: 12, energy: -5, money: 0, fulfillment: 8, stress: -3 },
            reflection: '"She asked what I had for lunch. I couldn\'t remember."',
            flag: 'called_mom'
        },
        right: {
            label: 'Text back: "In a meeting, call you later"',
            effect: { relationships: -8, energy: 0, money: 2, fulfillment: -5, stress: 3 },
            reflection: '"Later. The most dishonest word in any language."',
            flag: 'ignored_mom'
        }
    },
    {
        era: 0,
        title: 'The Comparison Trap',
        text: {
            tycoon: 'At a charity gala, someone richer than you walks in. Everyone shifts attention. For a second, you feel invisible.',
            beloved: 'Your closest friend posts about their solo trip — carefree, unburdened. You haven\'t been alone in months.',
            achiever: 'A younger talent emerges. Critics call them "the next you." They\'re 23. You feel your relevance flickering.',
            elite: 'You see someone at the grocery store — messy hair, laughing with their kid. They look genuinely happy. You feel a pang.'
        },
        left: {
            label: 'Work harder. Close the gap.',
            effect: { energy: -12, fulfillment: -8, stress: 12, money: 5, relationships: -5 },
            reflection: '"There\'s always a bigger house. A better story. A longer standing ovation. When does the race end?"'
        },
        right: {
            label: 'Let it go. Their path isn\'t mine.',
            effect: { energy: 5, fulfillment: 3, stress: -5, money: 0, relationships: 3 },
            reflection: '"For one moment, I stopped running. The world didn\'t end."'
        }
    },

    // ===== ERA 2: THE WEIGHT (turns 5-9) =====
    {
        era: 1,
        title: 'The Hospital Call',
        text: {
            tycoon: 'Your assistant calls during a board meeting: your partner collapsed at home. The board is waiting for your decision on the merger.',
            beloved: 'The one person who held YOU up is now the one who needs holding. But you\'re already holding everyone else.',
            achiever: 'Your partner is sick. You get the call during a live keynote. 2,000 people are watching. Your phone keeps vibrating.',
            elite: 'You were supposed to be at the hospital appointment but you were at the gym. You chose your routine over their results.'
        },
        left: {
            label: 'Drop everything. Be there.',
            effect: { money: -10, relationships: 18, energy: -20, fulfillment: 5, stress: 10 },
            reflection: '"I held their hand and realised I couldn\'t remember the last time I held anyone\'s hand without checking my phone."',
            flag: 'was_there_hospital'
        },
        right: {
            label: 'Send help. Keep going. I\'ll make it up.',
            effect: { money: -20, relationships: -15, energy: -5, fulfillment: -10, stress: 15 },
            reflection: '"I sent flowers and money. They wanted hours and presence. We don\'t speak the same language anymore."',
            flag: 'missed_hospital'
        }
    },
    {
        era: 1,
        title: 'The Warning',
        text: {
            _default: 'You haven\'t slept properly in three weeks. Your hands shake when you hold your coffee. A colleague asks if you\'re okay. You say "never better" on autopilot.'
        },
        left: {
            label: 'Push through. Winners don\'t stop.',
            effect: { money: 5, energy: -18, fulfillment: -5, relationships: -5, stress: 15 },
            reflection: '"I used to think rest was for people without ambition. Now I think it might be for people with wisdom."'
        },
        right: {
            label: 'Slow down. Something has to give.',
            effect: { money: -8, energy: 12, fulfillment: -3, relationships: 5, stress: -10 },
            reflection: '"I cancelled everything for a week. The silence was terrifying. But inside it, I heard something I\'d been drowning out."'
        }
    },
    {
        era: 1,
        title: 'The Mask Falls',
        text: {
            tycoon: 'Your business partner has been siphoning funds. The betrayal isn\'t the money — it\'s that you trusted someone in a world where trust is currency.',
            beloved: 'Someone you poured years of support into talks about you behind your back. "They\'re suffocating. They need everyone to need them."',
            achiever: 'A mentor takes credit for your early work in a public interview. The world applauds them. No one corrects it.',
            elite: 'Your "perfect" friend group has a group chat without you. Someone screenshots it by accident. They call you "exhausting."'
        },
        left: {
            label: 'Cut them off. I don\'t need this.',
            effect: { relationships: -12, energy: -5, fulfillment: -8, stress: 12, money: 0 },
            reflection: '"I burned the bridge. It felt powerful for an hour. Then I realised how few bridges I have left."'
        },
        right: {
            label: 'Sit with the pain. Try to understand.',
            effect: { relationships: -3, energy: -10, fulfillment: 5, stress: 5, money: 0 },
            reflection: '"Forgiveness isn\'t about them. It\'s about refusing to carry their weight in my body."'
        }
    },
    {
        era: 1,
        title: 'The Mirror',
        textFn: function(state) {
            if (state.flags.has('ignored_mom')) {
                return 'Your mother mentions on the phone — casually, the way parents do — that she\'s been feeling dizzy lately. "Don\'t worry about me." You realise you haven\'t visited in over a year.';
            }
            return 'You catch yourself in a mirror and don\'t recognise the expression. Not the face — you know the face. But the eyes look like someone performing a role they forgot they auditioned for.';
        },
        left: {
            label: 'I need to change something. Now.',
            effect: { fulfillment: 5, energy: -10, stress: 8, money: -5, relationships: 5 },
            reflection: '"Change. The word everyone celebrates until it requires actual loss."'
        },
        right: {
            label: 'It\'s just a bad week. Keep going.',
            effect: { fulfillment: -8, energy: -5, stress: 10, money: 3, relationships: -5 },
            reflection: '"I\'ve been saying \'just a bad week\' for six months now."'
        }
    },
    {
        era: 1,
        title: 'The Price Tag',
        text: {
            tycoon: 'Your accountant shows you the numbers: maintaining your lifestyle costs more per month than your parents earned in a year. It\'s sustainable. But is it sane?',
            beloved: 'You count: you said "yes" to 47 people this month. How many times did someone ask what YOU needed? Zero.',
            achiever: 'You calculate: 14-hour days, 6 days a week, for 3 years straight. The awards keep coming. So do the migraines.',
            elite: 'Your weekly schedule: gym at 5am, work by 7, networking lunch, therapy at 6, date night at 8, sleep at midnight. Repeat. No gaps. No accidents. No breathing room.'
        },
        left: {
            label: 'This is the cost. I chose this.',
            effect: { stress: 12, energy: -10, fulfillment: -5, money: -5, relationships: -3 },
            reflection: '"I chose this. I chose this. If I say it enough times, maybe it\'ll feel like freedom instead of a sentence."'
        },
        right: {
            label: 'Something has to be renegotiated.',
            effect: { stress: -5, energy: 5, fulfillment: 3, money: -8, relationships: 5 },
            reflection: '"I started saying no. The world didn\'t collapse. Some people left. The ones who stayed... those are the real ones."'
        }
    },

    // ===== ERA 3: THE UNRAVELING (turns 10-14) =====
    {
        era: 2,
        title: 'The Diagnosis',
        text: {
            _default: 'The doctor looks at you without the usual small talk. "Your body is telling you something you\'ve been refusing to hear. We need to talk about your test results."'
        },
        left: {
            label: 'Full treatment. Whatever it costs.',
            effect: { energy: -10, money: -25, stress: 10, relationships: 5, fulfillment: -5 },
            reflection: '"I spent my health earning money. Now I\'m spending money to earn back health. The universe has a dark sense of humour."'
        },
        right: {
            label: 'I don\'t have time for this right now.',
            effect: { energy: -25, money: 0, stress: 20, relationships: -10, fulfillment: -10 },
            reflection: '"I scheduled my own survival for \'later.\' If that\'s not a symptom, I don\'t know what is."'
        }
    },
    {
        era: 2,
        title: 'The 3am Question',
        text: {
            tycoon: 'You lie awake in a bed worth more than most people\'s apartments. The thought arrives: "If I lost everything tomorrow, who would still be here?"',
            beloved: 'You lie awake listening to your partner breathe. You\'ve given so much to everyone that you can\'t remember what you wanted for yourself. Did you ever know?',
            achiever: 'You stare at your awards on the shelf. Each one felt like oxygen when you won it. Now they\'re just objects. "What am I actually building?"',
            elite: 'You lie awake with the thought: "I have everything anyone could want. So why do I feel like I\'m watching my own life from outside the window?"'
        },
        left: {
            label: 'Achievement IS meaning. Double down.',
            effect: { fulfillment: -10, energy: -10, stress: 15, money: 5, relationships: -8 },
            reflection: '"I answered the question by working harder. But the question didn\'t go away. It just got quieter. And quieter questions are more dangerous."'
        },
        right: {
            label: 'Let the question sit. No answer yet.',
            effect: { fulfillment: 8, energy: 5, stress: -8, money: -3, relationships: 5 },
            reflection: '"I didn\'t answer. I just stayed with it. That night was the first honest night I\'d had in years."'
        }
    },
    {
        era: 2,
        title: 'The Debt',
        textFn: function(state) {
            if (state.flags.has('missed_hospital')) {
                return 'Your partner sits you down. They\'re calm — too calm. "I\'ve been thinking since the hospital. You sent money. I needed you. I think I\'ve been making excuses for you for years."';
            }
            return 'An unexpected financial shock hits — a lawsuit, a market crash, a miscalculation. The safety net you assumed was there turns out to be thinner than paper.';
        },
        left: {
            label: 'Fight to save what\'s left',
            effect: { money: -18, stress: 15, relationships: -8, energy: -10, fulfillment: -5 },
            reflection: '"I scrambled. I bargained. I performed the version of myself that fixes things. But some things can\'t be fixed. They can only be mourned."'
        },
        right: {
            label: 'Accept the loss. Rebuild smaller.',
            effect: { money: -10, stress: 5, relationships: 3, energy: -5, fulfillment: 3 },
            reflection: '"I let it fall. And in the wreckage, I found the shape of what actually mattered — it was smaller and simpler than I expected."'
        }
    },
    {
        era: 2,
        title: 'The Ghost',
        textFn: function(state) {
            if (state.flags.has('called_mom')) {
                return 'Your mother calls again. This time her voice is different. "I\'m proud of you," she says. "Not for what you\'ve done. For who you are." You realise she sees through all of it.';
            }
            return 'You run into someone from your old life — before the rewrite. They look at you with an expression you can\'t place. Pity? Envy? Concern? "You look... different," they say.';
        },
        left: {
            label: 'That old life is gone. I\'ve evolved.',
            effect: { fulfillment: -8, relationships: -5, stress: 8, energy: -3, money: 0 },
            reflection: '"Evolved. Or just armoured? Sometimes I can\'t tell the difference."'
        },
        right: {
            label: 'Tell them the truth: "I\'m not sure who I am anymore."',
            effect: { fulfillment: 8, relationships: 10, stress: -5, energy: 5, money: 0 },
            reflection: '"Honesty. The most terrifying luxury. But the only one that doesn\'t depreciate."'
        }
    },
    {
        era: 2,
        title: 'The Offer',
        text: {
            tycoon: 'Someone offers to buy your company. The number is absurd. You\'d be free. But your identity IS this company.',
            beloved: 'A therapist suggests you need to "stop being everyone\'s anchor." They might as well have asked you to stop breathing.',
            achiever: 'A younger version of yourself asks for mentorship. Their hunger reminds you of who you were. It hurts to see it.',
            elite: 'A friend says: "You know you\'re allowed to just be okay, right? Not great. Not optimised. Just... okay."'
        },
        left: {
            label: 'Hold on. This is who I am.',
            effect: { stress: 12, fulfillment: -5, energy: -8, relationships: -5, money: 3 },
            reflection: '"Identity is a prison you build yourself. The bars are made of the things you refuse to release."'
        },
        right: {
            label: 'Maybe it\'s time to let go of who I was.',
            effect: { stress: -8, fulfillment: 10, energy: 8, relationships: 5, money: -5 },
            reflection: '"I let go. Not of everything — just of the version of me that needed everything to stay the same."'
        }
    },

    // ===== ERA 4: THE RECKONING (turns 15-19) =====
    {
        era: 3,
        title: 'The Legacy Question',
        text: {
            _default: 'At a dinner, someone asks: "What do you want to be remembered for?" The table goes quiet. You open your mouth. Nothing comes out.'
        },
        left: {
            label: '"Building something that outlasts me."',
            effect: { fulfillment: 3, energy: -12, money: -8, stress: 10, relationships: -5 },
            reflection: '"Outlast me. As if the buildings, the brands, the numbers will whisper my name after I\'m gone. Will they? Or will they just whisper their own?"'
        },
        right: {
            label: '"Being present for the people I love."',
            effect: { fulfillment: 12, energy: -3, money: 0, stress: -8, relationships: 12 },
            reflection: '"A small answer. The simplest one I\'ve given in years. And somehow the truest."'
        }
    },
    {
        era: 3,
        title: 'The Letter',
        text: {
            _default: 'You find an old journal entry from before the rewrite. Your younger self wrote: "I just want to be happy and free. Is that too much to ask?"'
        },
        left: {
            label: 'I\'ve outgrown that naivety.',
            effect: { fulfillment: -12, stress: 10, energy: -5, money: 0, relationships: -5 },
            reflection: '"Naive. Or was it the most honest thing I ever wrote? Before I learned to want what the world told me to want."'
        },
        right: {
            label: 'Maybe they were the wisest version of me.',
            effect: { fulfillment: 15, stress: -10, energy: 8, money: -3, relationships: 8 },
            reflection: '"Happy and free. Not rich and admired. Not successful and envied. Happy. And free. How did I forget?"'
        }
    },
    {
        era: 3,
        title: 'The Silence',
        text: {
            _default: 'For the first time in years, there is nothing scheduled. No notifications. No demands. Just silence. It should feel like peace. It feels like drowning.'
        },
        left: {
            label: 'Fill it immediately. The silence is dangerous.',
            effect: { energy: -8, stress: 8, fulfillment: -5, money: 3, relationships: -3 },
            reflection: '"I filled the silence with noise because the silence asked questions I wasn\'t ready to answer."'
        },
        right: {
            label: 'Stay. Let the silence speak.',
            effect: { energy: 10, stress: -12, fulfillment: 12, money: 0, relationships: 5 },
            reflection: '"In the silence, I heard it: not what I want to have, but who I want to be. They\'re not the same thing."'
        }
    },
    {
        era: 3,
        title: 'The Release',
        text: {
            _default: 'You realise you\'ve been gripping something so tightly your hands are numb. Your reputation, your identity, your story. What if you just... opened your hands?'
        },
        left: {
            label: 'Let go. See what remains.',
            effect: { fulfillment: 15, energy: 10, stress: -15, money: -5, relationships: 8 },
            reflection: '"I opened my hands. Some things fell. The things that stayed — those were mine. Everything else was borrowed."'
        },
        right: {
            label: 'I can\'t. I\'ve come too far to lose this.',
            effect: { fulfillment: -10, energy: -10, stress: 18, money: 3, relationships: -8 },
            reflection: '"Too far. Sunk cost fallacy dressed in ambition. But I couldn\'t see it. Not yet."'
        }
    },
    {
        era: 3,
        title: 'The Final Crossroads',
        text: {
            _default: 'You stand at another crossroads. But this one is different. You\'re not choosing between paths. You\'re choosing between the person you became and the person you always were.'
        },
        left: {
            label: 'Chase what I still don\'t have.',
            effect: { stress: 20, energy: -15, fulfillment: -10, money: -5, relationships: -10 },
            reflection: '"I chose the hunger again. But this time, I knew it wouldn\'t end. Some appetites grow with feeding."'
        },
        right: {
            label: 'Water what I already planted.',
            effect: { stress: -10, energy: 5, fulfillment: 15, money: 3, relationships: 12 },
            reflection: '"I looked down. There were roots here all along — small, quiet, alive. I just hadn\'t been watering them."'
        }
    }
];
