// =========================================
// BaZi (八字) Four Pillars Calculator
// =========================================

const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const STEM_EL = [0,0,1,1,2,2,3,3,4,4]; // 0=Wood,1=Fire,2=Earth,3=Metal,4=Water
const BRANCH_EL = [4,2,0,0,2,1,1,2,3,3,2,4];
const EL_CN = ['木','火','土','金','水'];
const EL_EN = ['Wood','Fire','Earth','Metal','Water'];
const EL_EMOJI = ['🌿','🔥','⛰️','🪙','💧'];

const BRANCH_ANIMALS = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const ANIMAL_EN = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];

// Approximate solar term start dates (month, day) for each Chinese month
const MONTH_STARTS = [
    [2,4],[3,6],[4,5],[5,6],[6,6],[7,7],
    [8,8],[9,8],[10,8],[11,7],[12,7],[1,6]
];

// Julian Day Number from Gregorian date
function toJDN(y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
           Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

// Calculate Four Pillars
function calculateBaZi(year, month, day, hour) {
    // --- Year Pillar ---
    // Chinese year starts at 立春 (~Feb 4)
    let cYear = year;
    if (month < 2 || (month === 2 && day < 4)) cYear--;

    const yearStem = ((cYear - 4) % 10 + 10) % 10;
    const yearBranch = ((cYear - 4) % 12 + 12) % 12;

    // --- Month Pillar ---
    let monthIndex = 0;
    for (let i = 0; i < 12; i++) {
        const [sm, sd] = MONTH_STARTS[i];
        const [nm, nd] = MONTH_STARTS[(i + 1) % 12];
        let inRange = false;
        if (sm <= nm || (sm === 12 && nm === 1)) {
            // Normal case or Dec→Jan wrap
            if (sm < nm) inRange = (month > sm || (month === sm && day >= sd)) && (month < nm || (month === nm && day < nd));
            else inRange = (month === sm && day >= sd) || (month > sm) || (month < nm) || (month === nm && day < nd);
        }
        if (month === sm && day >= sd && (i < 11 || month !== 1)) { monthIndex = i; break; }
        if (i === 11 && ((month === 1 && day >= 6) || (month === 2 && day < 4))) { monthIndex = 11; break; }
    }

    // Simplified: calculate month index from date
    const dateNum = month * 100 + day;
    if (dateNum >= 204 && dateNum < 306) monthIndex = 0;
    else if (dateNum >= 306 && dateNum < 405) monthIndex = 1;
    else if (dateNum >= 405 && dateNum < 506) monthIndex = 2;
    else if (dateNum >= 506 && dateNum < 606) monthIndex = 3;
    else if (dateNum >= 606 && dateNum < 707) monthIndex = 4;
    else if (dateNum >= 707 && dateNum < 808) monthIndex = 5;
    else if (dateNum >= 808 && dateNum < 908) monthIndex = 6;
    else if (dateNum >= 908 && dateNum < 1008) monthIndex = 7;
    else if (dateNum >= 1008 && dateNum < 1107) monthIndex = 8;
    else if (dateNum >= 1107 && dateNum < 1207) monthIndex = 9;
    else if (dateNum >= 1207 || dateNum < 106) monthIndex = 10;
    else monthIndex = 11;

    const monthBranch = (monthIndex + 2) % 12;
    const monthStem = (((yearStem % 5) * 2 + 2) % 10 + monthIndex) % 10;

    // --- Day Pillar ---
    const jdn = toJDN(year, month, day);
    const dayStem = ((jdn + 9) % 10 + 10) % 10;
    const dayBranch = ((jdn + 1) % 12 + 12) % 12;

    // --- Hour Pillar ---
    const hourIndex = Math.floor(((hour + 1) % 24) / 2);
    const hourBranch = hourIndex;
    const hourStem = ((dayStem % 5) * 2 + hourIndex) % 10;

    return {
        year: { stem: yearStem, branch: yearBranch },
        month: { stem: monthStem, branch: monthBranch },
        day: { stem: dayStem, branch: dayBranch },
        hour: { stem: hourStem, branch: hourBranch },
        dayMaster: dayStem,
        animal: yearBranch
    };
}

// =========================================
// Five Elements Analysis
// =========================================
function analyzeElements(bazi) {
    const count = [0, 0, 0, 0, 0]; // Wood, Fire, Earth, Metal, Water
    const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];

    pillars.forEach(p => {
        count[STEM_EL[p.stem]]++;
        count[BRANCH_EL[p.branch]]++;
    });

    const dayEl = STEM_EL[bazi.dayMaster];

    // Ten Gods (十神) relative to Day Master
    // generates[i] = element i generates; controls[i] = element i controls
    const generates = [1, 2, 3, 4, 0]; // Wood→Fire, Fire→Earth...
    const controls = [2, 3, 4, 0, 1];  // Wood→Earth, Fire→Metal...

    // Count the "gods"
    const siblings = count[dayEl];                              // 比劫
    const resource = count[(dayEl + 4) % 5];                    // 印 (generates me)
    const output = count[generates[dayEl]];                     // 食伤 (I generate)
    const wealth = count[controls[dayEl]];                      // 财 (I control)
    const officer = count[(dayEl + 3) % 5 === controls.indexOf(dayEl) ? controls.findIndex((v,i) => generates[i] === dayEl) : (() => { for(let i=0;i<5;i++) if(controls[i]===dayEl) return i; return 0; })()]; // 官 (controls me)

    // Simpler: who controls me?
    let officerEl = -1;
    for (let i = 0; i < 5; i++) { if (controls[i] === dayEl) { officerEl = i; break; } }
    const officerCount = count[officerEl];

    // Who do I control?
    const wealthEl = controls[dayEl];
    const wealthCount = count[wealthEl];

    // Who generates me?
    let resourceEl = -1;
    for (let i = 0; i < 5; i++) { if (generates[i] === dayEl) { resourceEl = i; break; } }
    const resourceCount = count[resourceEl];

    // What do I generate?
    const outputEl = generates[dayEl];
    const outputCount = count[outputEl];

    const dayMasterStrength = siblings + resourceCount;
    const isStrong = dayMasterStrength >= 4;

    // Find missing/weak elements
    const missing = [];
    const weak = [];
    count.forEach((c, i) => {
        if (c === 0) missing.push(i);
        else if (c === 1) weak.push(i);
    });

    return {
        count, dayEl, isStrong, dayMasterStrength,
        siblings, resourceCount, resourceEl,
        outputCount, outputEl,
        wealthCount, wealthEl,
        officerCount, officerEl,
        missing, weak
    };
}

// =========================================
// Life Aspect Scoring
// =========================================
function scoreLife(bazi, analysis) {
    const a = analysis;
    const scores = {};

    // Career (官杀): controlled by officer star
    if (a.officerCount === 0) scores.career = { score: 35, note: 'Weak authority energy. You tend to resist structure and hierarchy — freelance or creative paths suit you better.' };
    else if (a.officerCount <= 2 && a.isStrong) scores.career = { score: 75, note: 'Strong self with moderate authority. You can handle pressure and lead. Career grows steadily with effort.' };
    else if (a.officerCount <= 2) scores.career = { score: 55, note: 'Authority is present but your foundation is thin. Career advances may feel exhausting without support.' };
    else scores.career = { score: 45, note: 'Too much external pressure. You feel controlled by systems, bosses, or expectations. Burnout risk is high.' };

    // Wealth (财星): what you control
    if (a.wealthCount === 0) scores.wealth = { score: 30, note: 'Wealth energy is absent. Money doesn\'t come naturally — but that also means you\'re not enslaved by it.' };
    else if (a.wealthCount <= 2 && a.isStrong) scores.wealth = { score: 80, note: 'Strong hands holding real wealth. You can earn AND keep. Financial stability is in your nature.' };
    else if (a.wealthCount <= 2) scores.wealth = { score: 50, note: 'Wealth flows in but slips out. You see opportunities but lack the energy to hold them.' };
    else scores.wealth = { score: 40, note: 'Too much wealth energy drains your core. You chase money at the expense of identity.' };

    // Relationships (based on balance + wealth/officer stars)
    const relBalance = Math.abs(a.wealthCount - a.officerCount);
    if (relBalance <= 1 && a.wealthCount > 0) scores.relationships = { score: 70, note: 'Balanced give-and-take. Relationships may not be dramatic, but they\'re real and sustainable.' };
    else if (a.wealthCount === 0 && a.officerCount === 0) scores.relationships = { score: 40, note: 'Low attraction energy. Deep connections are rare but when they happen, they transform you.' };
    else if (relBalance > 2) scores.relationships = { score: 35, note: 'Imbalanced dynamics. You either give too much or demand too much. Codependency risk.' };
    else scores.relationships = { score: 55, note: 'Relationships exist but require conscious effort. Nothing comes on autopilot.' };

    // Health (overall balance)
    const maxEl = Math.max(...a.count);
    const minEl = Math.min(...a.count);
    const imbalance = maxEl - minEl;
    if (a.missing.length === 0 && imbalance <= 2) scores.health = { score: 85, note: 'Excellent elemental balance. Your body and mind naturally self-regulate. Protect this gift.' };
    else if (a.missing.length === 0) scores.health = { score: 65, note: 'All elements present but unevenly distributed. Pay attention to the organs linked to your dominant element.' };
    else if (a.missing.length === 1) scores.health = { score: 50, note: `Missing ${EL_CN[a.missing[0]]} (${EL_EN[a.missing[0]]}). This creates a blind spot in your body's self-regulation. Conscious maintenance needed.` };
    else scores.health = { score: 35, note: 'Multiple missing elements. Your constitution needs active support — diet, movement, and rest are non-negotiable.' };

    // Family (印 resource + 食伤 output)
    if (a.resourceCount >= 1 && a.outputCount >= 1) scores.family = { score: 70, note: 'You both receive support and give back. Family dynamics are functional, if not perfect.' };
    else if (a.resourceCount >= 2) scores.family = { score: 60, note: 'Strong parental/mentor support, but you may struggle to express yourself in family contexts.' };
    else if (a.outputCount >= 2) scores.family = { score: 55, note: 'You give a lot to family but feel unsupported. The flow is one-directional.' };
    else scores.family = { score: 40, note: 'Thin family bonds or early independence. You build your own support systems from scratch.' };

    return scores;
}

// =========================================
// Supplement System: "补" with costs
// =========================================
const SUPPLEMENT_OPTIONS = [
    {
        aspect: 'career',
        label: '补事业 · Boost Career',
        desc: 'Add authority and ambition to your chart.',
        boost: { fulfillment: 20, money: 10 },
        cost: { relationships: -15, energy: -12, stress: 15 },
        warning: 'More career means less presence for the people who matter. The office light stays on while the home light goes dark.'
    },
    {
        aspect: 'wealth',
        label: '补财富 · Boost Wealth',
        desc: 'Strengthen your ability to attract and hold money.',
        boost: { money: 25 },
        cost: { energy: -15, fulfillment: -10, stress: 12 },
        warning: 'Wealth demands vigilance. Every asset becomes a liability you must protect. Sleep gets lighter.'
    },
    {
        aspect: 'relationships',
        label: '补感情 · Boost Relationships',
        desc: 'Deepen your capacity for love and connection.',
        boost: { relationships: 25 },
        cost: { money: -10, energy: -15, stress: 10 },
        warning: 'Deep connection costs energy you may not have. Loving fully means being fully vulnerable.'
    },
    {
        aspect: 'health',
        label: '补健康 · Boost Health',
        desc: 'Balance your elemental constitution.',
        boost: { energy: 20 },
        cost: { money: -10, fulfillment: -8, stress: 5 },
        warning: 'Health requires time — the one resource you can\'t buy back. Something else must wait.'
    },
    {
        aspect: 'family',
        label: '补家庭 · Boost Family',
        desc: 'Strengthen family bonds and support systems.',
        boost: { relationships: 15, fulfillment: 10 },
        cost: { money: -12, energy: -10, stress: 8 },
        warning: 'Family demands presence, not performance. You can\'t optimise a dinner table conversation.'
    }
];

// Convert BaZi scores to game starting stats
function baziToGameStats(scores) {
    return {
        money: Math.round(scores.wealth.score * 0.9 + scores.career.score * 0.1),
        relationships: Math.round(scores.relationships.score * 0.7 + scores.family.score * 0.3),
        energy: Math.round(scores.health.score * 0.8 + 20),
        fulfillment: Math.round(scores.career.score * 0.4 + scores.family.score * 0.3 + scores.relationships.score * 0.3)
    };
}

// Format a pillar for display
function formatPillar(pillar) {
    return {
        stem: STEMS[pillar.stem],
        branch: BRANCHES[pillar.branch],
        stemEl: EL_CN[STEM_EL[pillar.stem]],
        branchEl: EL_CN[BRANCH_EL[pillar.branch]],
        stemElEn: EL_EN[STEM_EL[pillar.stem]],
        branchElEn: EL_EN[BRANCH_EL[pillar.branch]]
    };
}
