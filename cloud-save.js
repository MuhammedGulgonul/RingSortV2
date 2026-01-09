// Yandex Cloud Save Integration
async function loadYandexProgress() {
    if (!window.player) {
        console.log('Yandex Player not available');
        return;
    }

    try {
        const cloudData = await window.player.getData();
        if (cloudData && cloudData.progress) {
            console.log('Loading progress from Yandex Cloud:', cloudData);

            // Merge cloud data with local data
            const localData = JSON.parse(localStorage.getItem('rs_state') || '{}');

            // Use cloud data if it has more progress
            if (cloudData.progress.levelsCompleted > (localData.levelsCompleted || 0)) {
                localStorage.setItem('rs_state', JSON.stringify(cloudData.progress));
                console.log('Cloud save is newer, using cloud data');
                return true;
            } else {
                console.log('Local save is newer or equal');
                return false;
            }
        }
    } catch (error) {
        console.warn('Failed to load Yandex progress:', error);
    }
    return false;
}

async function saveYandexProgress(gameState) {
    if (!window.player) {
        console.log('Yandex Player not available, saving locally only');
        return false;
    }

    try {
        const data = {
            progress: {
                levelsCompleted: gameState.levelsCompleted || 0,
                currentLevel: gameState.currentLevel || 1,
                stars: gameState.stars || 0,
                timestamp: Date.now()
            }
        };

        await window.player.setData(data, true);
        console.log('Progress saved to Yandex Cloud');
        return true;
    } catch (error) {
        console.error('Failed to save to Yandex Cloud:', error);
        return false;
    }
}

// Make functions globally available
window.loadYandexProgress = loadYandexProgress;
window.saveYandexProgress = saveYandexProgress;
