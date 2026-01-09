/**
 * Ring Sort Puzzle - Yandex Games SDK Integration
 * Handles SDK initialization, ads, and player data
 */

// SDK State
let ysdk = null;
let player = null;
let isSDKReady = false;

/**
 * Initialize Yandex Games SDK
 */
async function initYandexSDK() {
    try {
        // Check if SDK is available
        if (typeof YaGames === 'undefined') {
            console.log('Yandex SDK not found, running in standalone mode');
            onSDKReady(false);
            return;
        }

        // Initialize SDK
        ysdk = await YaGames.init();
        window.ysdk = ysdk;
        console.log('Yandex SDK initialized');

        // Initialize player
        try {
            player = await ysdk.getPlayer({ scopes: false });
            window.player = player;
            console.log('Player initialized');

            // Load cloud progress
            if (window.game) {
                await window.game.loadYandexProgress();
            }
        } catch (e) {
            console.warn('Player initialization failed:', e);
        }

        // Notify SDK that game is ready
        ysdk.features.LoadingAPI?.ready();

        onSDKReady(true);

    } catch (error) {
        console.error('Yandex SDK initialization error:', error);
        onSDKReady(false);
    }
}

/**
 * Called when SDK initialization is complete
 */
function onSDKReady(success) {
    isSDKReady = true;

    // Hide loading screen once game is ready
    if (window.game) {
        // Game will handle the screen transition
    }
}

/**
 * Show interstitial ad (between levels)
 * @param {Function} onComplete - Called when ad is closed
 */
function showInterstitialAd(onComplete) {
    if (!ysdk) {
        if (onComplete) onComplete();
        return;
    }

    // Pause game audio
    if (window.game) {
        window.game.audio.setEnabled(false);
    }

    ysdk.adv.showFullscreenAdv({
        callbacks: {
            onOpen: () => {
                console.log('Interstitial ad opened');
            },
            onClose: (wasShown) => {
                console.log('Interstitial ad closed, wasShown:', wasShown);
                // Resume game audio
                if (window.game) {
                    const soundEnabled = document.getElementById('toggle-sound')?.checked;
                    window.game.audio.setEnabled(soundEnabled !== false);
                }
                if (onComplete) onComplete();
            },
            onError: (error) => {
                console.warn('Interstitial ad error:', error);
                if (onComplete) onComplete();
            }
        }
    });
}

/**
 * Show rewarded video ad (for hints)
 * @param {Function} onRewarded - Called when reward is earned
 * @param {Function} onClose - Called when ad is closed
 */
function showRewardedAd(onRewarded, onClose) {
    if (!ysdk) {
        // If no SDK, give reward anyway (for testing)
        if (onRewarded) onRewarded();
        if (onClose) onClose();
        return;
    }

    // Pause game audio
    if (window.game) {
        window.game.audio.setEnabled(false);
    }

    ysdk.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => {
                console.log('Rewarded ad opened');
            },
            onRewarded: () => {
                console.log('Reward earned!');
                if (onRewarded) onRewarded();
            },
            onClose: () => {
                console.log('Rewarded ad closed');
                // Resume game audio
                if (window.game) {
                    const soundEnabled = document.getElementById('toggle-sound')?.checked;
                    window.game.audio.setEnabled(soundEnabled !== false);
                }
                if (onClose) onClose();
            },
            onError: (error) => {
                console.warn('Rewarded ad error:', error);
                // Resume audio even on error
                if (window.game) {
                    const soundEnabled = document.getElementById('toggle-sound')?.checked;
                    window.game.audio.setEnabled(soundEnabled !== false);
                }
            }
        }
    });
}

/**
 * Save player data to Yandex cloud
 * @param {Object} data - Data to save (max 200KB)
 */
async function savePlayerData(data) {
    if (!player) {
        console.log('Player not available, saving to localStorage only');
        return false;
    }

    try {
        await player.setData(data, true);
        console.log('Player data saved to cloud');
        return true;
    } catch (error) {
        console.error('Failed to save player data:', error);
        return false;
    }
}

/**
 * Load player data from Yandex cloud
 * @returns {Object} Player data or null
 */
async function loadPlayerData() {
    if (!player) {
        console.log('Player not available');
        return null;
    }

    try {
        const data = await player.getData();
        console.log('Player data loaded from cloud:', data);
        return data;
    } catch (error) {
        console.error('Failed to load player data:', error);
        return null;
    }
}

/**
 * Set game stats (numeric values only, max 10KB)
 * @param {Object} stats - Stats object with numeric values
 */
async function setPlayerStats(stats) {
    if (!player) return false;

    try {
        await player.setStats(stats);
        console.log('Player stats saved');
        return true;
    } catch (error) {
        console.error('Failed to save player stats:', error);
        return false;
    }
}

/**
 * Get player stats
 * @returns {Object} Player stats or null
 */
async function getPlayerStats() {
    if (!player) return null;

    try {
        const stats = await player.getStats();
        console.log('Player stats loaded:', stats);
        return stats;
    } catch (error) {
        console.error('Failed to load player stats:', error);
        return null;
    }
}

/**
 * Get environment info
 */
function getEnvironmentInfo() {
    if (!ysdk) return null;

    return {
        lang: ysdk.environment.i18n.lang,
        tld: ysdk.environment.i18n.tld,
        deviceType: ysdk.deviceInfo.type,
        isMobile: ysdk.deviceInfo.isMobile(),
        isDesktop: ysdk.deviceInfo.isDesktop(),
        isTablet: ysdk.deviceInfo.isTablet(),
        isTV: ysdk.deviceInfo.isTV()
    };
}

/**
 * Handle game focus/blur for ads
 */
function setupFocusHandlers() {
    if (!ysdk) return;

    // Game should pause when losing focus (e.g., during ads)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Game is hidden (ad shown, tab switched, etc.)
            console.log('Game hidden');
        } else {
            // Game is visible again
            console.log('Game visible');
        }
    });
}

/**
 * Request review (can be shown to user after certain achievements)
 */
function canReview() {
    if (!ysdk || !ysdk.feedback) return false;
    return ysdk.feedback.canReview();
}

async function requestReview() {
    if (!ysdk || !ysdk.feedback) return false;

    try {
        const result = await ysdk.feedback.canReview();
        if (result.value) {
            const { feedbackSent } = await ysdk.feedback.requestReview();
            return feedbackSent;
        }
    } catch (error) {
        console.error('Review request error:', error);
    }
    return false;
}

// Export functions
window.YandexSDK = {
    init: initYandexSDK,
    showInterstitialAd,
    showRewardedAd,
    savePlayerData,
    loadPlayerData,
    setPlayerStats,
    getPlayerStats,
    getEnvironmentInfo,
    canReview,
    requestReview,
    get isReady() { return isSDKReady; },
    get sdk() { return ysdk; },
    get player() { return player; }
};

// AUTO-INIT DISABLED: SDK is now initialized in game.js
// This prevents race condition and ensures proper language detection
// initYandexSDK();
