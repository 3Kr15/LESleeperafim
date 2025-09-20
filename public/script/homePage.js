class DynamicSleepApp {
    constructor() {
        this.sleepModeToggle = document.getElementById('sleep-mode-toggle');
        this.mainContent = document.getElementById('mainContent');
        this.modeIcon = document.getElementById('modeIcon');
        this.welcomeTitle = document.getElementById('welcomeTitle');
        this.welcomeSubtitle = document.getElementById('welcomeSubtitle');
        this.controlTitle = document.getElementById('controlTitle');
        this.controlDescription = document.getElementById('controlDescription');
        this.quoteText = document.getElementById('quoteText');
        this.quoteCite = document.getElementById('quoteCite');
        this.sleepSettings = document.getElementById('sleepSettings');
        this.frequencySlider = document.getElementById('frequencySlider');
        this.frequencyValue = document.getElementById('frequencyValue');
        this.vibrationToggle = document.getElementById('vibration-toggle');
        this.whiteNoiseToggle = document.getElementById('white-noise-toggle');
        this.whiteNoiseVolume = document.getElementById('whiteNoiseVolume');
        this.whiteNoiseAudio = new Audio('../assets/whitenoise.mp3');
        this.whiteNoiseAudio.loop = true;
        this.starsContainer = document.getElementById('starsContainer');
        this.sunContainer = document.getElementById('sunContainer');
        this.cloudsContainer = document.getElementById('cloudsContainer');
        this.isSleepMode = false;
        this.vibrationInterval = null;
        this.init();
    }

    init() {
        this.setTimeBasedTheme();

        this.sleepModeToggle.addEventListener("change", () => {
            this.toggleSleepMode();
        });

        this.frequencySlider.addEventListener('input', () => {
            this.frequencyValue.textContent = this.frequencySlider.value;
            if (this.isSleepMode && this.vibrationToggle.checked) {
                this.startVibration(); // Only update vibration if enabled
            }
        });

        this.vibrationToggle.addEventListener('change', () => {
            if (this.isSleepMode) {
                if (this.vibrationToggle.checked) {
                    this.startVibration();
                } else {
                    this.stopVibration();
                }
            }
        });

        this.whiteNoiseToggle.addEventListener("change", () => {
            this.toggleWhiteNoise();
        });

        this.whiteNoiseVolume.addEventListener("input", () => {
            this.setWhiteNoiseVolume();
        });

        setInterval(() => {
            if (!this.isSleepMode) {
                this.setTimeBasedTheme();
            }
        }, 60000);
    }

    getCurrentTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            return 'morning';
        } else if (hour >= 12 && hour < 18) {
            return 'afternoon';
        } else {
            return 'night';
        }
    }

    setTimeBasedTheme() {
        const timeOfDay = this.getCurrentTimeOfDay();
        this.mainContent.classList.remove('morning', 'afternoon', 'night');
        this.mainContent.classList.add(timeOfDay);
        this.updateContentForTime(timeOfDay);
        this.updateBackgroundElements(timeOfDay);
    }

    updateContentForTime(timeOfDay) {
        const themes = {
            morning: {
                icon: '<circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g>',
                iconClass: 'sun',
                title: 'Good Morning',
                subtitle: 'Start your day with energy and focus',
                controlTitle: 'Enter Sleep Mode',
                controlDescription: 'Switch to peaceful night environment',
                quote: 'Every morning we are born again. What we do today is what matters most.',
                cite: '- Buddha'
            },
            afternoon: {
                icon: '<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.8"/><g stroke="currentColor" stroke-width="2" opacity="0.6"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></g>',
                iconClass: 'sunset',
                title: 'Evening Wind Down',
                subtitle: 'The day transitions into peaceful dusk',
                controlTitle: 'Enter Sleep Mode',
                controlDescription: 'Prepare for a restful night',
                quote: 'As the sun sets, let your worries fade away with the light.',
                cite: '- Anonymous'
            },
            night: {
                icon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>',
                iconClass: 'moon',
                title: 'Sleep Mode Active',
                subtitle: 'Your peaceful night begins now',
                controlTitle: 'Sleep Mode',
                controlDescription: 'Peaceful night environment active',
                quote: 'Sleep is the best meditation.',
                cite: '- Dalai Lama'
            }
        };
        const theme = themes[timeOfDay];
        this.modeIcon.innerHTML = theme.icon;
        this.modeIcon.setAttribute("class", `mode-icon ${theme.iconClass}`);
        this.welcomeTitle.textContent = theme.title;
        this.welcomeSubtitle.textContent = theme.subtitle;
        this.controlTitle.textContent = theme.controlTitle;
        this.controlDescription.textContent = theme.controlDescription;
        this.quoteText.innerHTML = `${theme.quote}<cite>${theme.cite}</cite>`;
    }

    updateBackgroundElements(timeOfDay) {
        this.starsContainer.classList.remove('active');
        this.sunContainer.classList.remove('active');
        this.cloudsContainer.classList.remove('active');
        switch(timeOfDay) {
            case 'morning':
                this.sunContainer.classList.add('active');
                this.cloudsContainer.classList.add('active');
                break;
            case 'afternoon':
                this.cloudsContainer.classList.add('active');
                break;
            case 'night':
                this.starsContainer.classList.add('active');
                break;
        }
    }

    toggleSleepMode() {
        this.isSleepMode = this.sleepModeToggle.checked;
        if (this.isSleepMode) {
            this.mainContent.classList.remove("morning", "afternoon");
            this.mainContent.classList.add("night");
            this.updateContentForTime("night");
            this.updateBackgroundElements("night");
            this.sleepSettings.classList.add("active");
            this.whiteNoiseToggle.checked = true;
            this.setWhiteNoiseVolume();
            this.whiteNoiseAudio.play();
            // Enable vibration toggle by default
            this.vibrationToggle.checked = true;
            if (this.vibrationToggle.checked) {
                this.startVibration();
            }
        } else {
            this.setTimeBasedTheme();
            this.sleepSettings.classList.remove("active");
            this.whiteNoiseAudio.pause();
            this.whiteNoiseAudio.currentTime = 0;
            this.stopVibration();
        }
    }

    startVibration() {
        this.stopVibration();
        if (!("vibrate" in navigator)) return;
        if (!this.vibrationToggle.checked) return;
        const frequency = parseFloat(this.frequencySlider.value);
        if (isNaN(frequency) || frequency <= 0) return;
        const periodMs = 1000 / frequency;
        const onMs = Math.round(periodMs / 2);
        const offMs = Math.round(periodMs - onMs);
        this.vibrationInterval = setInterval(() => {
            navigator.vibrate([onMs, offMs]);
        }, periodMs);
    }

    stopVibration() {
        if (this.vibrationInterval) {
            clearInterval(this.vibrationInterval);
            this.vibrationInterval = null;
        }
        if ("vibrate" in navigator) {
            navigator.vibrate(0);
        }
    }

    toggleWhiteNoise() {
        if (this.whiteNoiseToggle.checked) {
            this.whiteNoiseAudio.play();
        } else {
            this.whiteNoiseAudio.pause();
        }
    }

    setWhiteNoiseVolume() {
        this.whiteNoiseAudio.volume = this.whiteNoiseVolume.value;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new DynamicSleepApp();
});