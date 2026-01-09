/**
 * Ring Sort Puzzle - Level Definitions
 * 60 levels with progressive difficulty
 * V10.5: FIXED LOCKS (Max 1 per level to prevent deadlock) + CALIBRATED DIFFICULTY
 */

const RING_COLORS = {
    red: { main: '#FF4444', light: '#FF7777', dark: '#CC2222' },
    blue: { main: '#3399FF', light: '#66BBFF', dark: '#1166CC' },
    green: { main: '#44DD44', light: '#77FF77', dark: '#22AA22' },
    yellow: { main: '#FFDD00', light: '#FFEE66', dark: '#CCAA00' },
    purple: { main: '#BB44FF', light: '#DD88FF', dark: '#8822CC' },
    orange: { main: '#FF8800', light: '#FFAA44', dark: '#CC6600' },
    pink: { main: '#FF66AA', light: '#FF99CC', dark: '#DD4488' },
    cyan: { main: '#00CCDD', light: '#44EEFF', dark: '#0099AA' }
};

const COLOR_KEYS = Object.keys(RING_COLORS);

const LEVEL_CONFIGS = [
    // 1-20: Standard (4 Rings)
    { colors: 2, cylinders: 4, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 2, cylinders: 4, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 3, cylinders: 5, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 3, cylinders: 5, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 3, cylinders: 5, ringsPerColor: 4, emptyCylinders: 2, locked: [2] }, // Level 5
    { colors: 4, cylinders: 6, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 4, cylinders: 6, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 4, cylinders: 6, ringsPerColor: 4, emptyCylinders: 2, locked: [0] }, // Level 8
    { colors: 4, cylinders: 6, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 5, cylinders: 7, ringsPerColor: 4, emptyCylinders: 2, mystery: true }, // Level 10
    { colors: 5, cylinders: 7, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 5, cylinders: 7, ringsPerColor: 4, emptyCylinders: 2, locked: [1] }, // Level 12 (Reduced to 1 lock)
    { colors: 5, cylinders: 7, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 5, cylinders: 7, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 5, cylinders: 7, ringsPerColor: 4, emptyCylinders: 2, mystery: true }, // Level 15
    { colors: 6, cylinders: 8, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 6, cylinders: 8, ringsPerColor: 4, emptyCylinders: 2, locked: [0] }, // Level 17
    { colors: 6, cylinders: 8, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 6, cylinders: 8, ringsPerColor: 4, emptyCylinders: 2 },
    { colors: 6, cylinders: 8, ringsPerColor: 4, emptyCylinders: 2, mystery: true }, // Level 20

    // 21-40: Advanced (5 Rings)
    { colors: 4, cylinders: 6, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 4, cylinders: 6, ringsPerColor: 5, emptyCylinders: 2, locked: [2] }, // Level 22
    { colors: 5, cylinders: 7, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 5, cylinders: 7, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 5, cylinders: 7, ringsPerColor: 5, emptyCylinders: 2, mystery: true }, // Level 25
    { colors: 6, cylinders: 8, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 6, cylinders: 8, ringsPerColor: 5, emptyCylinders: 2, locked: [1] }, // Level 27 (Reduced to 1 lock)
    { colors: 6, cylinders: 8, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 7, cylinders: 9, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 7, cylinders: 9, ringsPerColor: 5, emptyCylinders: 2, mystery: true }, // Level 30
    { colors: 7, cylinders: 9, ringsPerColor: 5, emptyCylinders: 2, locked: [2] }, // Level 31 (Reduced to 1 lock)
    { colors: 8, cylinders: 10, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 5, emptyCylinders: 2, mystery: true }, // Level 35
    { colors: 8, cylinders: 10, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 7, cylinders: 9, ringsPerColor: 5, emptyCylinders: 2, locked: [3] }, // Level 37
    { colors: 7, cylinders: 9, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 6, cylinders: 8, ringsPerColor: 5, emptyCylinders: 2 },
    { colors: 6, cylinders: 9, ringsPerColor: 5, emptyCylinders: 3, mystery: true }, // Level 40

    // 41-60: Expert (6 Rings)
    { colors: 4, cylinders: 6, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 5, cylinders: 7, ringsPerColor: 6, emptyCylinders: 2, locked: [0] }, // Level 42
    { colors: 5, cylinders: 7, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 6, cylinders: 8, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 6, cylinders: 8, ringsPerColor: 6, emptyCylinders: 2, mystery: true }, // 45
    { colors: 6, cylinders: 8, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 7, cylinders: 9, ringsPerColor: 6, emptyCylinders: 2, locked: [2] }, // Level 47 (Reduced to 1 lock)
    { colors: 7, cylinders: 9, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2, mystery: true }, // 50
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2, locked: [1] }, // Level 52
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2, mystery: true }, // 55
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2 },
    { colors: 8, cylinders: 10, ringsPerColor: 6, emptyCylinders: 2, mystery: true } // 60
];

class LevelManager {
    constructor() {
        this.totalLevels = LEVEL_CONFIGS.length;
    }

    getConfig(levelNum) {
        const index = Math.min(levelNum - 1, LEVEL_CONFIGS.length - 1);
        return { ...LEVEL_CONFIGS[index] };
    }

    selectColors(count) {
        const shuffled = [...COLOR_KEYS].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    generateLevel(levelNum) {
        const config = this.getConfig(levelNum);
        const { colors, cylinders, ringsPerColor } = config;

        // 1. SOLVED STATE
        let state = [];
        const selectedColors = this.selectColors(colors);
        for (let i = 0; i < colors; i++) {
            const cylinder = [];
            for (let r = 0; r < ringsPerColor; r++) cylinder.push(selectedColors[i]);
            state.push(cylinder);
        }
        for (let i = 0; i < cylinders - colors; i++) state.push([]);

        // 2. SCRAMBLE
        // 2. SCRAMBLE (ENHANCED V12.4)
        // User complained levels are "lined up". We need MORE ENTROPY.
        const baseMoves = 25 + (ringsPerColor - 4) * 10; // Increased base from 10 to 25
        const levelFactor = Math.floor(levelNum * 2.5);  // Increased multiplier from 1.5 to 2.5
        const scrambleMoves = baseMoves + levelFactor;

        let lastFrom = -1;
        let lastTo = -1;
        let actualMoves = 0;

        for (let i = 0; i < scrambleMoves; i++) {
            const moves = [];
            for (let from = 0; from < state.length; from++) {
                if (state[from].length === 0) continue;
                // V12.4: Prevent immediate undo (moving back to where it came from)
                if (from === lastTo && Math.random() > 0.1) continue;

                const ring = state[from][state[from].length - 1];

                for (let to = 0; to < state.length; to++) {
                    if (from === to) continue;
                    const targetCyl = state[to];
                    if (targetCyl.length >= ringsPerColor) continue;

                    // V12.4: Heuristic - Prefer moves that don't just stack same colors unless necessary
                    // If target has top color == my color, try to avoid it slightly to ensure mixing
                    // But we must allow it sometimes otherwise it's unsolvable? 
                    // Actually, random is best, but we need MORE moves.

                    moves.push({ from, to });
                }
            }

            if (moves.length > 0) {
                const move = moves[Math.floor(Math.random() * moves.length)];
                const ring = state[move.from].pop();
                state[move.to].push(ring);

                lastFrom = move.from;
                lastTo = move.to;
                actualMoves++;
            }
        }

        return {
            levelNum,
            config,
            cylinders: state,
            selectedColors,
            minMoves: Math.max(5, Math.ceil(actualMoves * 0.5)) // V10.4: Heuristic Adjustment
        };
    }

    getColorProps(colorKey) {
        return RING_COLORS[colorKey];
    }
}

window.LevelManager = LevelManager;
window.RING_COLORS = RING_COLORS;
window.COLOR_KEYS = COLOR_KEYS;
window.TOTAL_LEVELS = LEVEL_CONFIGS.length;
