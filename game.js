/**
 * Ring Sort Puzzle - Main Game Engine
 * V10.3: ULTRA ROBUST EDITION
 * Fixes: Crash Resilience, Strict Stars verified
 */

const getGlobals = () => ({
    RingColors: window.RING_COLORS || {},
    LevelMgr: window.LevelManager,
    Levels: window.TOTAL_LEVELS || 60
});

// ===== Localization =====
const TEXTS = {
    en: {
        play: "Play",
        levels: "Levels",
        settings: "Settings",
        stars_stat: "Stars",
        completed_stat: "Completed",
        select_level: "Select Level",
        level: "Level",
        moves: "Moves:",
        undo: "Undo",
        sound: "Sound Effects",
        congrats: "Congratulations!",
        level_completed: "Level {0} Completed!",
        moves_count: "{0} Moves",
        next_level: "Next Level",
        play_again: "Play Again",
        moves_count: "{0} Moves",
        next_level: "Next Level",
        play_again: "Play Again",
        mystery_mode: "MYSTERY MODE",
        language: "Language",
        game_title_main: "Ring Sort",
        game_title: "Ring Sort Puzzle",
        game_subtitle: "Puzzle Game"
    },
    ru: {
        play: "Играть",
        levels: "Уровни",
        settings: "Настройки",
        stars_stat: "Звезды",
        completed_stat: "Завершено",
        select_level: "Выбор уровня",
        level: "Уровень",
        moves: "Ходы:",
        undo: "Отмена",
        sound: "Звуки",
        congrats: "Поздравляем!",
        level_completed: "Уровень {0} пройден!",
        moves_count: "{0} Ходов",
        next_level: "След. уровень",
        play_again: "Играть снова",
        mystery_mode: "ТАЙНЫЙ РЕЖИМ",
        language: "Язык",
        game_title_main: "Сортировка Колец",
        game_title: "Ring Sort Puzzle",
        game_subtitle: "Игра-головоломка"
    },
    tr: {
        play: "Oyna",
        levels: "Seviyeler",
        settings: "Ayarlar",
        stars_stat: "Yıldız",
        completed_stat: "Tamamlanan",
        select_level: "Seviye Seç",
        level: "Seviye",
        moves: "Hamle:",
        undo: "Geri Al",
        sound: "Ses Efektleri",
        congrats: "Tebrikler!",
        level_completed: "Seviye {0} Tamamlandı!",
        moves_count: "{0} Hamle",
        next_level: "Sonraki Seviye",
        play_again: "Tekrar Oyna",
        mystery_mode: "GİZEMLİ MOD",
        language: "Dil",
        game_title_main: "Halka Sıralama",
        game_title: "Ring Sort Puzzle",
        game_subtitle: "Bulmaca Oyunu"
    }
};

class LanguageManager {
    constructor() {
        // V13.6: Priority: LocalStorage > Browser
        let saved = localStorage.getItem('rs_lang');
        this.lang = saved || 'en';

        // Fallback if no save
        if (!saved) {
            const nav = navigator.language || navigator.userLanguage || 'en';
            if (nav.startsWith('ru')) this.lang = 'ru';
            else if (nav.startsWith('tr')) this.lang = 'tr';
        }

        this.t = TEXTS[this.lang] || TEXTS['en'];

        // Apply translations immediately on init
        setTimeout(() => this.apply(), 100);
    }

    setLanguage(code, save = false) {
        let lang = 'en';
        if (code && code.startsWith('ru')) lang = 'ru';
        else if (code && code.startsWith('tr')) lang = 'tr';

        console.log("Language switched to:", lang, "Save:", save);
        this.lang = lang;
        this.t = TEXTS[lang] || TEXTS['en'];
        this.apply();

        if (save) localStorage.setItem('rs_lang', lang);
    }

    apply() {
        const set = (sel, txt) => { const el = document.querySelector(sel); if (el) el.innerText = txt; };
        const setSpan = (sel, txt) => {
            const el = document.querySelector(sel);
            if (el && el.lastElementChild) el.lastElementChild.innerText = txt;
        };

        setSpan('#btn-play', this.t.play);
        setSpan('#btn-levels', this.t.levels);
        setSpan('#btn-settings', this.t.settings);

        const stats = document.querySelectorAll('.stat-label');
        if (stats.length > 1) {
            stats[0].innerText = "⭐ " + this.t.stars_stat;
            stats[1].innerText = "✓ " + this.t.completed_stat;
        }

        const lvlHeader = document.querySelector('#level-select h2');
        if (lvlHeader) lvlHeader.innerText = this.t.select_level;

        // V12.0: Updated Selectors
        const lvlLbl = document.querySelector('.level-badge .lbl');
        if (lvlLbl) lvlLbl.innerText = this.t.level;

        const mvsLbl = document.querySelector('.moves-badge .lbl');
        if (mvsLbl) mvsLbl.innerText = this.t.moves;

        const setH2 = document.querySelector('#settings-modal h2');
        if (setH2) setH2.innerText = this.t.settings;

        // V14.1: Title Localization (Fixed Selectors)
        const titleH1 = document.getElementById('game-main-title');
        if (titleH1) titleH1.innerText = this.t.game_title_main;

        const subP = document.getElementById('game-subtitle');
        if (subP) subP.innerText = this.t.game_subtitle;

        // V14.0: Dynamic Hint Tooltip
        const hintBtn = document.getElementById('btn-hint');
        if (hintBtn) hintBtn.title = (this.lang === 'tr' ? 'İpucu' : (this.lang === 'ru' ? 'Подсказка' : 'Hint'));



        // Settings now only has Sound toggle in basic V12 rewrite
        const setLabel = document.querySelector('#lbl-sound');
        if (setLabel) setLabel.innerText = "🔊 " + this.t.sound;

        const cplH2 = document.querySelector('#complete-modal h2');
        if (cplH2) cplH2.innerText = this.t.congrats;

        setSpan('#btn-next-level', this.t.next_level);
        setSpan('#btn-replay-level', this.t.play_again);
        setSpan('#btn-undo', this.t.undo);

        const lblLang = document.querySelector('#lbl-language');
        if (lblLang) lblLang.innerText = "🌐 " + this.t.language;
    }

    get(key, ...args) {
        let str = this.t[key] || key;
        args.forEach((a, i) => str = str.replace(`{${i}}`, a));
        return str;
    }
}

// ===== Audio Manager =====
class AudioManager {
    constructor() {
        this.enabled = true;
        this.context = null;
        this.initialized = false;
    }
    async init() {
        if (this.initialized) return;
        try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) {
                this.context = new Ctx();
                this.initialized = true;
            }
        } catch (e) { }
    }
    async resume() {
        if (this.context?.state === 'suspended') await this.context.resume().catch(() => { });
    }
    setEnabled(enabled) { this.enabled = enabled; }
    playTone(freq, type, dur, vol = 0.1) {
        if (!this.enabled || !this.initialized) return;
        const asc = this.context.createOscillator();
        const gn = this.context.createGain();
        asc.connect(gn);
        gn.connect(this.context.destination);
        asc.type = type;
        asc.frequency.setValueAtTime(freq, this.context.currentTime);
        gn.gain.setValueAtTime(vol, this.context.currentTime);
        gn.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + dur);
        asc.start();
        asc.stop(this.context.currentTime + dur);
    }
    playSound(type) {
        if (!this.enabled || !this.initialized) return;
        try {
            switch (type) {
                case 'select': this.playTone(400, 'sine', 0.15, 0.1); break;
                case 'deselect': this.playTone(300, 'sine', 0.15, 0.08); break;
                case 'drop': this.playTone(600, 'sine', 0.1, 0.1); break;
                case 'wrong': this.playTone(150, 'triangle', 0.2, 0.15); break;
                case 'click': this.playTone(800, 'sine', 0.05, 0.05); break;
                case 'reveal': this.playTone(1000, 'sine', 0.2, 0.1); break;
                case 'unlock': this.playTone(1200, 'sine', 0.3, 0.2); break;
                case 'confetti':
                    for (let i = 0; i < 5; i++) setTimeout(() => this.playTone(800 + (i * 200), 'square', 0.1, 0.05), i * 80);
                    break;
                case 'complete':
                    this.playTone(523, 'sine', 0.3, 0.2);
                    setTimeout(() => this.playTone(659, 'sine', 0.3, 0.2), 150);
                    setTimeout(() => this.playTone(784, 'sine', 0.6, 0.2), 300);
                    break;
            }
        } catch (e) { console.warn('Audio Fail', e); }
    }
}

// ===== Game State =====
class GameState {
    constructor() {
        this.cylinders = [];
        this.selectedCylinder = -1;
        this.moves = 0;
        this.minMoves = 0;
        this.capacity = 4;
        this.isMystery = false;
        this.lockedPoles = [];
        this.moveHistory = [];
    }
    loadLevel(data) {
        if (!data || !data.cylinders) return;
        this.cylinders = data.cylinders.map(c => [...c]);
        this.minMoves = data.minMoves;
        if (!this.minMoves || this.minMoves < 1) this.minMoves = 20; // Safety fallback

        this.capacity = data.config.ringsPerColor || 4;
        this.isMystery = !!data.config.mystery;
        this.lockedPoles = (data.config.locked || []).slice();
        this.selectedCylinder = -1;
        this.moves = 0;
        this.moveHistory = [];
    }
    interact(index) {
        if (index < 0 || index >= this.cylinders.length) return null;

        if (this.lockedPoles.includes(index)) return { result: 'locked' };

        if (this.selectedCylinder === -1) {
            if (this.cylinders[index].length > 0) {
                this.selectedCylinder = index;
                return { result: 'select', from: index };
            }
            return null;
        }

        if (this.selectedCylinder === index) {
            this.selectedCylinder = -1;
            return { result: 'deselect' };
        }

        const from = this.selectedCylinder;
        const to = index;
        const fromCyl = this.cylinders[from];
        const toCyl = this.cylinders[to];
        const ring = fromCyl[fromCyl.length - 1];

        const validColor = toCyl.length === 0 || toCyl[toCyl.length - 1] === ring;
        const hasSpace = toCyl.length < this.capacity;

        if (!validColor || !hasSpace) return { result: 'wrong' };

        fromCyl.pop();
        toCyl.push(ring);
        this.moves++;
        this.moveHistory.push({ from, to, ring });
        this.selectedCylinder = -1;

        const isLevelComplete = this.cylinders.every(c => c.length === 0 || (c.length === this.capacity && c.every(r => r === c[0])));
        const isCylComplete = toCyl.length === this.capacity && toCyl.every(r => r === toCyl[0]);

        let unlocked = false;
        if (isCylComplete && this.lockedPoles.length > 0) {
            this.lockedPoles = [];
            unlocked = true;
        }

        return {
            result: isLevelComplete ? 'levelComplete' : (isCylComplete ? 'complete' : 'drop'),
            from, to, ring, unlocked
        };
    }
    undo() {
        if (!this.moveHistory.length) return null;
        const m = this.moveHistory.pop();
        this.cylinders[m.to].pop();
        this.cylinders[m.from].push(m.ring);
        this.moves--;
        this.selectedCylinder = -1;
        this.selectedCylinder = -1;
        return m;
    }
    isValidMove(from, to) {
        if (from === to) return false;
        if (from < 0 || from >= this.cylinders.length) return false;
        if (to < 0 || to >= this.cylinders.length) return false;
        if (this.lockedPoles.includes(from) || this.lockedPoles.includes(to)) return false;

        const fromCyl = this.cylinders[from];
        const toCyl = this.cylinders[to];

        if (fromCyl.length === 0) return false; // Nothing to move
        if (toCyl.length >= this.capacity) return false; // Full

        const ring = fromCyl[fromCyl.length - 1];
        if (toCyl.length === 0) return true; // Empty target always ok

        return toCyl[toCyl.length - 1] === ring; // Must match color
    }
}

// ===== 3D Engine =====
class Game3D {
    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.state = gameState;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.poles = [];
        this.particles = [];
        this.animating = false;

        this.initThree();
        window.addEventListener('resize', () => this.resize());
    }

    initThree() {
        try {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xe8f4f8);

            const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);

            this.updateCameraPosition(); // Initial position based on aspect

            const amb = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(amb);
            const dir = new THREE.DirectionalLight(0xffffff, 0.8);
            dir.position.set(10, 20, 10);
            this.scene.add(dir);

            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);

            this.animate();
        } catch (e) { }
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.updateCameraPosition();
    }

    updateCameraPosition() {
        if (!this.camera) return;
        const aspect = this.camera.aspect;
        const baseZ = 24;
        const baseY = 16;

        let factor = 1;
        if (aspect < 1.0) {
            // Increase distance for narrow screens to fit the scene
            // 0.8 / aspect gives good coverage for ~12-14 width units
            factor = 0.8 / Math.max(aspect, 0.4);
        }

        this.camera.position.set(0, baseY * factor, baseZ * factor);
        this.camera.lookAt(0, 2, 0);
    }

    hex(colorKey) {
        const colors = getGlobals().RingColors;
        const c = colors[colorKey];
        if (!c) return 0x999999;
        return parseInt(c.main.replace('#', '0x'), 16);
    }

    buildLevel(numCylinders, cylindersData, capacity = 4) {
        while (this.scene.children.length > 2) {
            this.scene.remove(this.scene.children[this.scene.children.length - 1]);
        }
        this.poles = [];
        this.particles = [];

        const cols = numCylinders > 7 ? Math.ceil(numCylinders / 2) : numCylinders;
        const rows = numCylinders > 7 ? 2 : 1;
        const spacing = 4.0; // Standard Spacing

        for (let i = 0; i < numCylinders; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;

            // STADIUM FIXED: Reasonable Height
            const isBack = (rows > 1 && r === 0);
            const rowY = isBack ? 3.0 : -1.0; // Back raised slightly, Front lowered slightly
            const rowZ = (rows === 1) ? 0 : (isBack ? -5.0 : 4.0);

            const itemsInRow = (rows > 1 && r === rows - 1) ? (numCylinders - (rows - 1) * cols) : cols;
            const rowW = (itemsInRow - 1) * spacing;
            const rowStartX = -rowW / 2;
            const px = rowStartX + c * spacing;

            this.createPole(i, px, rowY, rowZ, cylindersData[i], capacity);
        }
        // V13.8: Ensure initial reveals if top rings are hidden (Level Design safety)
        setTimeout(() => this.checkReveals(), 100);
    }

    createPole(index, x, y, z, ringsData, capacity) {
        const group = new THREE.Group();
        group.name = `pole_${index}`; // V11.8 Fix: Name the GROUP so all children are clickable
        group.position.set(x, y, z);
        this.scene.add(group);

        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(1.8, 2.0, 0.3, 32),
            new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.5 })
        );
        base.position.y = 0.15;
        group.add(base);

        const poleH = capacity * 1.2;
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, poleH, 16),
            new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 })
        );
        pole.position.y = poleH / 2 + 0.15;
        group.add(pole);

        // --- LOCK ICON (FIXED Y-POS) ---
        let lockMesh = null;
        if (this.state.lockedPoles.includes(index)) {
            lockMesh = this.createLockMesh();
            // V12.2 Fix: Raise Lock MUCH higher to be visible behind front row
            lockMesh.position.y = poleH + 2.5;
            lockMesh.userData = { isLock: true, baseY: poleH + 2.5 };
            group.add(lockMesh);
            pole.material = new THREE.MeshStandardMaterial({ color: 0x550000, roughness: 0.8 });
        }

        const hitMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 2, poleH + 3, 8),
            // V11.7 Fix: Opacity 0.001 to ensure not culled, depthWrite false for performance
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.001, side: THREE.DoubleSide, depthWrite: false })
        );
        hitMesh.position.y = poleH / 2;
        hitMesh.name = `pole_${index}`;
        group.add(hitMesh);

        const ringMeshes = [];
        ringsData.forEach((color, rIdx) => {
            const isHidden = this.state.isMystery && rIdx < 2;
            const mesh = this.createRingMesh(color, isHidden);
            // V12.2 Fix: Tighter Spacing (1.1 -> 0.95) to remove "Distracting Gaps"
            mesh.position.y = 0.6 + (rIdx * 0.95);
            group.add(mesh);
            ringMeshes.push(mesh);
        });

        this.poles[index] = { group, ringMeshes, pole, lockMesh, x, y, z };
    }

    createLockMesh() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.2), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI), new THREE.MeshStandardMaterial({ color: 0x888888 }));
        hoop.position.y = 0.3;
        hoop.rotation.y = Math.PI;
        g.add(body);
        g.add(hoop);
        // Scale it up slightly to be more visible
        g.scale.setScalar(1.5);
        return g;
    }

    createRingMesh(colorKey, isHidden) {
        const colorHex = isHidden ? 0x888888 : this.hex(colorKey);
        // Adjusted Geometry for tighter look
        const geo = new THREE.TorusGeometry(0.9, 0.42, 24, 50); // Slightly thinner tube (0.42)
        const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.2, metalness: 0.1 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.userData = { realColor: colorKey, isHidden: isHidden };
        return mesh;
    }

    revealRing(mesh) {
        if (!mesh || !mesh.userData.isHidden) return;
        const realColor = this.hex(mesh.userData.realColor);
        mesh.material.color.setHex(realColor);
        mesh.userData.isHidden = false;
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        this.createExplosion(worldPos.x, worldPos.y, worldPos.z, mesh.userData.realColor);
    }

    unlockAll() {
        this.poles.forEach((p, idx) => {
            if (p.lockMesh) {
                this.createExplosion(p.x, p.lockMesh.position.y + p.y, p.z, 'yellow');
                p.group.remove(p.lockMesh);
                p.lockMesh = null;
                p.pole.material.color.setHex(0x8B4513);
            }
        });
    }

    createExplosion(x, y, z, colorKey) {
        try {
            const color = this.hex(colorKey);
            const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const mat = new THREE.MeshBasicMaterial({ color: color });
            for (let i = 0; i < 20; i++) {
                const p = new THREE.Mesh(geo, mat);
                p.position.set(x, y, z);
                p.userData = { vel: new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random()) * 0.5, (Math.random() - 0.5) * 0.5) };
                this.scene.add(p);
                this.particles.push(p);
            }
        } catch (e) { }
    }

    async animateMove(fromIdx, toIdx, ringMesh, onComplete) {
        this.animating = true;
        try {
            if (ringMesh.userData.isHidden) this.revealRing(ringMesh);

            const toPole = this.poles[toIdx];
            this.scene.attach(ringMesh);
            const liftY = Math.max(this.poles[fromIdx].group.position.y + this.state.capacity * 1.2, toPole.group.position.y) + 8;
            await this.tween(ringMesh.position, { y: liftY }, 120);
            await this.tween(ringMesh.position, { x: toPole.x, z: toPole.z }, 180);
            // V12.2: Updated Landing Y for tighter spacing
            const landY = 0.6 + (toPole.ringMeshes.length * 0.95);
            await this.tween(ringMesh.position, { y: toPole.group.position.y + landY }, 120);
            toPole.group.attach(ringMesh);
            toPole.ringMeshes.push(ringMesh);

            onComplete();
        } catch (e) {
            console.error("Anim fail", e);
        } finally {
            this.animating = false; // SAFETY: Always reset
        }
    }

    checkReveals() {
        let revealedAny = false;
        try {
            this.poles.forEach(pole => {
                if (pole && pole.ringMeshes.length > 0) {
                    const topMesh = pole.ringMeshes[pole.ringMeshes.length - 1];
                    if (topMesh && topMesh.userData && topMesh.userData.isHidden) {
                        this.revealRing(topMesh);
                        revealedAny = true;
                    }
                }
            });
        } catch (e) { console.warn('checkReveals fail', e); }
        return revealedAny;
    }

    async animateSelect(poleIdx, isSelect) {
        if (poleIdx === -1) return;
        const p = this.poles[poleIdx];
        if (!p || !p.ringMeshes.length) return;

        const mesh = p.ringMeshes[p.ringMeshes.length - 1];
        // V12.2 Base Y calculation
        const yBase = 0.6 + ((p.ringMeshes.length - 1) * 0.95);
        const targetY = isSelect ? yBase + 1.2 : yBase;
        await this.tween(mesh.position, { y: targetY }, 100);
    }

    async animateShake(poleIdx) {
        if (poleIdx === -1) return;
        const p = this.poles[poleIdx];
        if (!p || !p.group) return;
        const startX = p.group.position.x;
        await this.tween(p.group.position, { x: startX + 0.2 }, 50);
        await this.tween(p.group.position, { x: startX - 0.2 }, 50);
        await this.tween(p.group.position, { x: startX }, 50);
    }

    tween(obj, target, dur) {
        return new Promise(resolve => {
            const start = { ...obj };
            const keys = Object.keys(target);
            const t0 = performance.now();
            const animate = (now) => {
                const p = Math.min((now - t0) / dur, 1);
                const e = 1 - Math.pow(1 - p, 3);
                keys.forEach(k => obj[k] = start[k] + (target[k] - start[k]) * e);
                if (p < 1) requestAnimationFrame(animate);
                else resolve();
            };
            requestAnimationFrame(animate);
        });
    }

    getHit(x, y) {
        // V11.5: Gold Standard Input Detection
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (let hit of intersects) {
            let obj = hit.object;
            while (obj) {
                if (obj.name && obj.name.startsWith('pole_')) {
                    return parseInt(obj.name.split('_')[1]);
                }
                obj = obj.parent;
            }
        }
        return -1;
    }

    handleHover(index) {
        // V11.9: Visual Interaction Probe
        this.poles.forEach((p, i) => {
            if (!p || !p.group) return;
            // Highlighting logic: Scale up slightly if hovered
            if (i === index) {
                p.group.scale.setScalar(1.05); // Subtle pop
                document.body.style.cursor = 'pointer';
            } else {
                p.group.scale.setScalar(1.0);
                document.body.style.cursor = 'default';
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // V12.2: Float Animation for Locks
        const time = Date.now() * 0.002;
        this.poles.forEach(p => {
            if (p && p.lockMesh) {
                p.lockMesh.position.y = p.lockMesh.userData.baseY + Math.sin(time) * 0.2;
                p.lockMesh.rotation.y = time * 0.5;
            }
        });

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.position.add(p.userData.vel);
            p.userData.vel.y -= 0.02;
            p.userData.vel.x *= 0.98;
            p.userData.vel.z *= 0.98;
            p.scale.multiplyScalar(0.95);
            if (p.scale.x < 0.01) {
                this.scene.remove(p);
                this.particles.splice(i, 1);
            }
        }
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

// ===== Main App =====
class App {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.state = new GameState();
        this.audio = new AudioManager();
        this.lang = new LanguageManager();

        if (typeof THREE === 'undefined') {
            console.error("Three.js not loaded.");
            const txt = document.querySelector('.loading-text');
            if (txt) txt.innerText = "Error: Three.js Missing!";
            return;
        }

        this.game3D = new Game3D(this.canvas, this.state);

        const check = setInterval(() => {
            if (window.LevelManager) {
                clearInterval(check);
                this.lvlMgr = new window.LevelManager();
                this.init();
            }
        }, 100);
    }

    init() {
        this.load();
        this.lang.apply();
        setTimeout(() => this.screen('main-menu'), 100);
        this.bind();
        const unlock = () => {
            if (this.audio) this.audio.init().then(() => this.audio.resume());
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);

        // V13.7: Disable Context Menu (Yandex Requirement)
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    screen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
        if (id === 'game-screen') requestAnimationFrame(() => this.game3D.resize());

        // V12.3: Menu Stats Update
        if (id === 'main-menu') {
            const totalStars = Object.values(this.stars).reduce((a, b) => a + b, 0);
            const completed = this.unlocked - 1;

            const elStars = document.getElementById('total-stars');
            if (elStars) elStars.innerText = totalStars;

            const elComp = document.getElementById('completed-levels');
            if (elComp) elComp.innerText = completed;
        }
    }

    showLevels() {
        const g = document.getElementById('levels-grid');
        g.innerHTML = '';
        const total = getGlobals().Levels || 60;
        for (let i = 1; i <= total; i++) {
            const b = document.createElement('button');
            b.className = `level-btn ${i <= this.unlocked ? '' : 'locked'} ${i === this.unlocked ? 'current' : ''}`;
            const stars = this.stars[i] || 0;
            const starStr = stars > 0 ? `<div style="font-size:12px; margin-top:2px;">${'⭐'.repeat(stars)}</div>` : '';
            b.innerHTML = `<div style="font-size:18px">${i}</div>${starStr}`;

            if (i <= this.unlocked) b.onclick = () => { this.start(i); };
            g.appendChild(b);
        }
        this.screen('level-select');
        this.lang.apply();
    }

    bind() {
        const click = (id, fn) => document.getElementById(id)?.addEventListener('click', () => {
            // Basic click sound for all
            this.audio.playSound('click'); fn();
        });

        // Main Menu
        click('btn-play', () => this.start(this.unlocked || 1));
        click('btn-levels', () => this.showLevels());
        click('btn-settings', () => document.getElementById('settings-modal').classList.add('active'));

        // Navigation
        click('btn-back-menu', () => this.screen('main-menu'));
        click('btn-back-levels', () => this.showLevels());
        click('btn-restart', () => this.start(this.curLvl));

        // Game Actions (Monetized)
        click('btn-next-level', () => {
            document.getElementById('complete-modal').classList.remove('active');
            this.showAd(() => this.start(this.unlocked));
        });
        click('btn-replay-level', () => {
            document.getElementById('complete-modal').classList.remove('active');
            this.showAd(() => this.start(this.curLvl));
        });

        // Undo
        const btnUndo = document.getElementById('btn-undo');
        if (btnUndo) {
            const newBtn = btnUndo.cloneNode(true);
            btnUndo.parentNode.replaceChild(newBtn, btnUndo);
            newBtn.onclick = () => {
                const m = this.state.undo();
                if (m) {
                    this.audio.playSound('click');
                    this.game3D.buildLevel(this.state.cylinders.length, this.state.cylinders, this.state.capacity);
                    this.updUI();
                } else this.audio.playSound('deselect');
            };
        }

        // Hint (Rewarded Auto Move)
        click('btn-hint', () => {
            this.showReward(() => {
                const s = this.state;
                let bestMove = null;

                // Find a valid move
                for (let f = 0; f < s.cylinders.length; f++) {
                    if (!s.cylinders[f].length || s.lockedPoles.includes(f)) continue;
                    for (let t = 0; t < s.cylinders.length; t++) {
                        if (s.isValidMove(f, t)) {
                            bestMove = { from: f, to: t };
                            break;
                        }
                    }
                    if (bestMove) break;
                }

                if (bestMove) {
                    // Execute move
                    const ring = s.cylinders[bestMove.from][s.cylinders[bestMove.from].length - 1];
                    s.interact(bestMove.from);
                    s.interact(bestMove.to);

                    // Animate
                    const p = this.game3D.poles[bestMove.from];
                    const ringMesh = p.ringMeshes.pop();
                    this.game3D.animateMove(bestMove.from, bestMove.to, ringMesh, () => {
                        this.game3D.handleHover(-1);
                        this.game3D.checkReveals();
                        this.updUI();
                        const result = s.cylinders.every(c => c.length === 0 || (c.length === s.capacity && c.every(r => r === c[0])));
                        if (result) {
                            this.audio.playSound('complete');
                            this.audio.playSound('confetti');
                            setTimeout(() => this.completeLevel(), 1000);
                        } else {
                            this.audio.playSound('drop');
                        }
                    });
                }
            });
        });

        // Settings & Sound
        click('btn-settings', () => {
            document.getElementById('settings-modal').classList.add('active');
            const toggle = document.getElementById('toggle-sound');
            if (toggle) toggle.checked = this.audio.enabled;
        });
        click('btn-close-settings', () => document.getElementById('settings-modal').classList.remove('active'));
        document.getElementById('toggle-sound')?.addEventListener('change', (e) => this.audio.setEnabled(e.target.checked));

        // Language Buttons
        click('btn-lang-en', () => this.lang.setLanguage('en', true));
        click('btn-lang-tr', () => this.lang.setLanguage('tr', true));
        click('btn-lang-ru', () => this.lang.setLanguage('ru', true));

        // Global Input (V11.9 Fix)
        const handleInput = (e) => {
            if (this.game3D.animating) return;
            // Ignore UI
            if (e.target.closest('button') || e.target.closest('.modal-content')) return;

            let x, y;
            if (e.type === 'touchstart') {
                if (e.changedTouches.length === 0) return;
                e.preventDefault();
                x = e.changedTouches[0].clientX;
                y = e.changedTouches[0].clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }

            const idx = this.game3D.getHit(x, y);
            if (idx !== -1) {
                this.handleHit(idx);
            }
        };

        window.addEventListener('mousedown', handleInput);
        window.addEventListener('touchstart', handleInput, { passive: false });

        window.addEventListener('mousemove', (e) => {
            if (this.game3D.animating) return;
            const idx = this.game3D.getHit(e.clientX, e.clientY);
            this.game3D.handleHover(idx);
        });
    }

    async handleHit(index) {
        if (this.game3D.animating) return;

        try {
            const cyl = this.state.cylinders[index];
            if (cyl && cyl.length > 0) {
                const topMesh = this.game3D.poles[index].ringMeshes[this.game3D.poles[index].ringMeshes.length - 1];
                if (topMesh && topMesh.userData.isHidden) {
                    this.audio.playSound('reveal');
                    this.game3D.revealRing(topMesh);
                    return;
                }
            }

            const res = this.state.interact(index);

            if (res.result === 'locked') {
                this.audio.playSound('wrong');
                this.game3D.animateShake(index);
            }
            else if (res.result === 'select') {
                this.audio.playSound('select');
                this.game3D.animateSelect(res.from, true);
            }
            else if (res.result === 'deselect') {
                this.audio.playSound('deselect');
                this.game3D.animateSelect(index, false);
            }
            else if (res.result === 'drop' || res.result === 'levelComplete' || res.result === 'complete') {
                this.audio.playSound('drop');
                const fromP = this.game3D.poles[res.from];
                const mesh = fromP.ringMeshes.pop();

                await this.game3D.animateMove(res.from, res.to, mesh, () => {
                    // Try-Catch inside Callback to ensure Level Complete fires
                    try {
                        if (this.game3D.checkReveals()) {
                            this.audio.playSound('reveal');
                        }

                        if (res.unlocked) {
                            this.audio.playSound('unlock');
                            this.game3D.unlockAll();
                        }

                        if (res.result === 'complete' || res.result === 'levelComplete') {
                            this.audio.playSound('complete');
                            const p = this.game3D.poles[res.to];
                            this.game3D.createExplosion(p.x, p.y + 5, p.z, res.ring);
                        }

                        if (res.result === 'levelComplete') {
                            this.audio.playSound('confetti');
                            this.levelComplete();
                        }
                    } catch (e) {
                        // FALLBACK
                        console.error("Callback crash", e);
                        if (res.result === 'levelComplete') this.levelComplete();
                    }
                });
                this.updUI();
            }
            else if (res.result === 'wrong') {
                this.audio.playSound('wrong');
                this.game3D.animateShake(this.state.selectedCylinder);
            }
        } catch (e) { console.error("Hit error", e); }
    }

    levelComplete() {
        try {
            const maxFor3 = this.state.minMoves;
            const maxFor2 = this.state.minMoves + 3;

            console.log("Level Complete. Moves:", this.state.moves, "Min:", maxFor3);

            let stars = 1;
            if (this.state.moves <= maxFor3) stars = 3;
            else if (this.state.moves <= maxFor2) stars = 2;

            this.stars[this.curLvl] = Math.max(this.stars[this.curLvl] || 0, stars);
            this.unlocked = Math.max(this.unlocked, this.curLvl + 1);
            this.save();

            const m = document.getElementById('complete-modal');
            m.classList.remove('active'); // Reset first
            void m.offsetWidth; // Force reflow
            m.classList.add('active');

            // V12.0: Star Update Logic
            const starEls = m.querySelectorAll('.star');
            starEls.forEach((el, idx) => {
                if (idx < stars) el.classList.add('earned');
                else el.classList.remove('earned');
            });

            m.querySelector('.complete-msg').innerHTML = this.lang.get('level_completed', `<span style="color:var(--primary)">${this.curLvl}</span>`);
            // Note: We removed detailed stats in V12 CSS for simpler look, but referencing moves if needed is fine. Use console.
        } catch (e) { console.error("Modal crash", e); }
    }

    start(n) {
        this.curLvl = n;
        const data = this.lvlMgr.generateLevel(n);
        this.state.loadLevel(data);
        this.game3D.buildLevel(data.cylinders.length, this.state.cylinders, this.state.capacity);

        // V12.0: Updated Badge Selector
        const badge = document.querySelector('.level-badge');
        if (this.state.isMystery) {
            // Mystery styling handled via CSS generally, but we can tweak text color
            badge.querySelector('.lbl').innerText = this.lang.get('mystery_mode');
            badge.querySelector('.val').innerText = n;
        } else {
            badge.querySelector('.lbl').innerText = this.lang.get('level');
            badge.querySelector('.val').innerText = n;
        }

        this.screen('game-screen');
        this.updUI();
    }

    updUI() {
        document.querySelector('.moves-badge .val').textContent = this.state.moves;

        // Update Hint Button
        const hBadge = document.getElementById('hint-counter');
        const hAd = document.getElementById('hint-ad-icon');
        const count = this.state.hints;

        if (count > 0) {
            hBadge.classList.remove('hidden');
            hBadge.innerText = count;
            hAd.classList.add('hidden');
        } else {
            hBadge.classList.add('hidden');
            hAd.classList.remove('hidden');
        }
    }

    // V13.0: Monetization (Ads)
    showAd(cb) {
        if (window.YandexSDK) {
            window.YandexSDK.showInterstitialAd(cb);
        } else {
            console.log('Dev: Ad Simulated');
            cb && cb();
        }
    }

    performHint() {
        const s = this.state;
        let bestMove = null;

        // Find a valid move
        for (let f = 0; f < s.cylinders.length; f++) {
            if (!s.cylinders[f].length || s.lockedPoles.includes(f)) continue;
            for (let t = 0; t < s.cylinders.length; t++) {
                if (s.isValidMove(f, t)) {
                    bestMove = { from: f, to: t };
                    break;
                }
            }
            if (bestMove) break;
        }

        if (bestMove) {
            // Deduct
            s.hints = Math.max(0, s.hints - 1);
            this.save();
            this.updUI();

            // Execute move
            const ring = s.cylinders[bestMove.from][s.cylinders[bestMove.from].length - 1];
            s.interact(bestMove.from);
            s.interact(bestMove.to);

            // Animate
            const p = this.game3D.poles[bestMove.from];
            const ringMesh = p.ringMeshes.pop();
            this.game3D.animateMove(bestMove.from, bestMove.to, ringMesh, () => {
                this.game3D.handleHover(-1);
                this.game3D.checkReveals();
                this.updUI();
                const result = s.cylinders.every(c => c.length === 0 || (c.length === s.capacity && c.every(r => r === c[0])));
                if (result) {
                    this.audio.playSound('complete');
                    this.audio.playSound('confetti');
                    setTimeout(() => this.completeLevel(), 1000);
                } else {
                    this.audio.playSound('drop');
                }
            });
        }
    }

    showReward(cb) {
        if (window.YandexSDK) {
            window.YandexSDK.showRewardedAd(cb);
        } else {
            console.log('Dev: Reward Simulated');
            cb && cb();
        }
    }
    load() { const d = JSON.parse(localStorage.getItem('rs_save') || '{}'); this.unlocked = d.u || 1; this.stars = d.s || {}; }
    save() { localStorage.setItem('rs_save', JSON.stringify({ u: this.unlocked, s: this.stars })); }

}

document.addEventListener('DOMContentLoaded', () => {
    const game = new App();
    window.game = game; // Global reference for SDK

    // V14.0: Clean SDK Initialization (No Race Condition)
    const startApp = () => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    };

    if (window.YaGames) {
        YaGames.init().then(ysdk => {
            const yandexLang = ysdk.environment?.i18n?.lang;
            console.log('Yandex SDK Initialized, lang:', yandexLang || 'unknown');
            window.ysdk = ysdk;

            // Notify Yandex that game is ready
            ysdk.features.LoadingAPI?.ready();

            // Language Detection Logic
            if (game && game.lang) {
                const saved = localStorage.getItem('rs_lang');

                if (saved) {
                    // Priority 1: User saved preference
                    console.log('→ Using saved language:', saved);
                    game.lang.setLanguage(saved, false);
                } else {
                    // Priority 2: Browser language (already set in constructor)
                    const currentLang = game.lang.lang; // Already set to browser lang
                    const isYandexPlatform = window.location.hostname.includes('yandex');

                    // Only override with SDK language on Yandex platform
                    if (isYandexPlatform && yandexLang && yandexLang !== currentLang) {
                        console.log('→ Using Yandex SDK language:', yandexLang, '(was:', currentLang + ')');
                        game.lang.setLanguage(yandexLang, false);
                    } else {
                        console.log('→ Keeping browser language:', currentLang, '(local test)');
                    }
                }
            }

            startApp();
        }).catch(e => {
            console.warn('SDK Init Fail:', e);
            startApp(); // Fallback with browser language
        });
    } else {
        console.warn('YaGames not found (Offline Mode)');
        setTimeout(startApp, 1000);
    }
});

