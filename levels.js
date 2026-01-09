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
        // 2. SCRAMBLE (ENHANCED V14.2)
        // Solvability Guarantee & High Entropy
        const baseMoves = 60 + (ringsPerColor - 4) * 20; // Significantly increased base moves
        const levelFactor = Math.floor(levelNum * 4.0);  // Higher multiplier for later levels
        const scrambleMoves = baseMoves + levelFactor;

        // SOLVABILITY: Pick a "Safety Color" that is forbidden from entering Locked Poles.
        // This ensures at least one color is always fully available in the open area to unlock the locks.
        const lockedPoles = config.locked || [];
        const hasLocks = lockedPoles.length > 0;
        const safetyColor = hasLocks ? selectedColors[0] : null;

        let lastFrom = -1;
        let lastTo = -1;
        let actualMoves = 0;
        let consecutiveSameColorMoves = 0;

        for (let i = 0; i < scrambleMoves; i++) {
            const moves = [];

            for (let from = 0; from < state.length; from++) {
                if (state[from].length === 0) continue;

                // Prevent immediate undo (back and forth)
                if (from === lastTo && Math.random() > 0.15) continue;

                const ring = state[from][state[from].length - 1];

                for (let to = 0; to < state.length; to++) {
                    if (from === to) continue;

                    // Rule 1: Capacity Check
                    const targetCyl = state[to];
                    if (targetCyl.length >= ringsPerColor) continue;

                    // Rule 2: Locked Pole Protection (CRITICAL FOR SOLVABILITY)
                    // If this is the "Safety Color", it MUST NOT go into a Locked Pole.
                    if (hasLocks && ring === safetyColor && lockedPoles.includes(to)) {
                        continue;
                    }

                    // Rule 3: Entropy Heuristic - Prefer Mixing
                    // We want to avoid placing a color on top of the SAME color during scramble
                    // because that makes the game look "already solved" or "clumped".
                    let weight = 1.0;

                    if (targetCyl.length > 0) {
                        const topColor = targetCyl[targetCyl.length - 1];
                        if (topColor === ring) {
                            // Punishment for stacking same color (unless it's the only option)
                            weight = 0.1;
                        } else {
                            // Reward for mixing different colors
                            weight = 2.0;
                        }
                    } else {
                        // Moving to empty is neutral/good
                        weight = 1.5;
                    }

                    moves.push({ from, to, weight });
                }
            }

            if (moves.length > 0) {
                // Weighted Random Selection
                const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
                let randomVal = Math.random() * totalWeight;
                let selectedMove = moves[0];

                for (const move of moves) {
                    randomVal -= move.weight;
                    if (randomVal <= 0) {
                        selectedMove = move;
                        break;
                    }
                }

                const ring = state[selectedMove.from].pop();
                state[selectedMove.to].push(ring);

                lastFrom = selectedMove.from;
                lastTo = selectedMove.to;
                actualMoves++;
            }
        }

        return {
            levelNum,
            config,
            cylinders: state,
            selectedColors,
            minMoves: actualMoves // V14.3: Hardcore Difficulty (1:1 Ratio for 3 Stars)
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
