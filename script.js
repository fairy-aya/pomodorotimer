class PomodoroTimer {
    constructor() {
        this.modes = {
            work: { name: '作業中', duration: 1500 }, // 25分を秒に変換
            short: { name: '短い休憩中', duration: 300 }, // 5分を秒に変換
            long: { name: '長い休憩中', duration: 900 } // 15分を秒に変換
        };
        this.currentMode = 'work';
        this.cycleCount = 1;
        this.isRunning = false;
        this.timer = null;
        this.initializeElements();
        this.loadSettings();
        this.setupEventListeners();
    }

    initializeElements() {
        this.elements = {
            modeText: document.getElementById('mode-text'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            cycleCount: document.getElementById('cycle-count'),
            startBtn: document.getElementById('start-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            resetBtn: document.getElementById('reset-btn'),
            skipBtn: document.getElementById('skip-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            workTime: document.getElementById('work-time'),
            shortBreak: document.getElementById('short-break'),
            longBreak: document.getElementById('long-break'),
            saveSettings: document.getElementById('save-settings')
        };
    }

    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startTimer());
        this.elements.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
        this.elements.skipBtn.addEventListener('click', () => this.skipToNextMode());
        this.elements.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.elements.saveSettings.addEventListener('click', () => this.saveSettings());
        
        // Time input buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleTimeChange(btn));
        });
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.elements.startBtn.disabled = true;
            this.elements.pauseBtn.disabled = false;
            this.updateDisplay();
            this.timer = setInterval(() => this.tick(), 1000);
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.elements.startBtn.disabled = false;
            this.elements.pauseBtn.disabled = true;
            clearInterval(this.timer);
        }
    }

    resetTimer() {
        this.pauseTimer();
        this.modes[this.currentMode].duration = this.getInitialDuration(this.currentMode);
        this.updateDisplay();
    }

    skipToNextMode() {
        this.pauseTimer();
        this.currentMode = this.getNextMode();
        if (this.currentMode === 'work') {
            this.cycleCount++;
            if (this.cycleCount > 4) {
                this.cycleCount = 1;
            }
        }
        this.modes[this.currentMode].duration = this.getInitialDuration(this.currentMode);
        this.updateDisplay();
    }

    getNextMode() {
        if (this.currentMode === 'work') {
            if (this.cycleCount === 4) {
                return 'long';
            }
            return 'short';
        }
        return 'work';
    }

    getInitialDuration(mode) {
        const baseTime = {
            work: 1500,
            short: 300,
            long: 900
        };
        
        const input = document.getElementById(`${mode}-time`);
        const minutes = parseInt(input.value);
        return minutes * 60; // 分を秒に変換
    }

    tick() {
        this.modes[this.currentMode].duration--;
        this.updateDisplay();

        if (this.modes[this.currentMode].duration <= 0) {
            this.playNotificationSound();
            this.skipToNextMode();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.modes[this.currentMode].duration / 60);
        const seconds = this.modes[this.currentMode].duration % 60;

        this.elements.modeText.textContent = this.modes[this.currentMode].name;
        this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
        this.elements.cycleCount.textContent = this.cycleCount;
    }

    toggleSettings() {
        this.elements.settingsModal.style.display = this.elements.settingsModal.style.display === 'flex' ? 'none' : 'flex';
    }

    saveSettings() {
        const settings = {
            workTime: parseInt(this.elements.workTime.value),
            shortBreak: parseInt(this.elements.shortBreak.value),
            longBreak: parseInt(this.elements.longBreak.value)
        };
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        this.toggleSettings();
        this.resetTimer();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.elements.workTime.value = settings.workTime;
            this.elements.shortBreak.value = settings.shortBreak;
            this.elements.longBreak.value = settings.longBreak;
        }
    }

    handleTimeChange(button) {
        const mode = button.dataset.mode;
        const input = document.getElementById(`${mode}-time`);
        const currentValue = parseInt(input.value);
        
        if (button.classList.contains('minus') && currentValue > 1) {
            input.value = currentValue - 1;
        } else if (button.classList.contains('plus') && currentValue < 60) {
            input.value = currentValue + 1;
        }
    }

    playNotificationSound() {
        // より良い通知音を追加
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU8BAAC8AAAAAwAAABgAAAAAAAAAAAAAABAAADwAAAAA=';
        audio.volume = 0.5;
        audio.play();
    }
}

// アプリケーションの初期化
window.addEventListener('load', () => {
    new PomodoroTimer();
});
