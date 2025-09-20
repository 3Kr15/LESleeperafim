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
        
        // Sleep timer properties
        this.sleepStartTime = null;
        this.sleepTimerInterval = null;
        this.sleepTimerElement = null;
        
        this.isSleepMode = false;
        this.vibrationInterval = null;
        this.init();
    }

    init() {
        this.createSleepTimer();
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

    createSleepTimer() {
        // Create sleep timer element and insert it after the mode indicator
        const sleepTimerHTML = `
            <div class="sleep-timer-container" id="sleepTimerContainer" style="display: none;">
                <div class="timer-card">
                    <div class="timer-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="timer-content">
                        <h3>Sleep Duration</h3>
                        <div class="timer-display" id="sleepTimerDisplay">00:00:00</div>
                        <p class="timer-status">Sleeping peacefully...</p>
                    </div>
                </div>
            </div>
        `;

        // Find the mode indicator and insert timer after it
        const modeIndicator = document.querySelector('.mode-indicator');
        modeIndicator.insertAdjacentHTML('afterend', sleepTimerHTML);
        this.sleepTimerElement = document.getElementById('sleepTimerContainer');
        
        // Add CSS styles for the timer
        this.addTimerStyles();
    }

    addTimerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sleep-timer-container {
                margin-bottom: 40px;
                width: 100%;
                max-width: 400px;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .sleep-timer-container.active {
                opacity: 1;
                transform: translateY(0);
                display: block !important;
            }

            .timer-card {
                background: rgba(15, 23, 42, 0.9);
                border: 2px solid rgba(96, 165, 250, 0.3);
                border-radius: 25px;
                padding: 30px 25px;
                text-align: center;
                backdrop-filter: blur(15px);
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }

            .timer-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(96, 165, 250, 0.1),
                    transparent
                );
                animation: shimmer 3s ease-in-out infinite;
            }

            @keyframes shimmer {
                0% { left: -100%; }
                50% { left: 100%; }
                100% { left: 100%; }
            }

            .timer-icon {
                background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(168, 85, 247, 0.2));
                border-radius: 18px;
                padding: 15px;
                color: #60a5fa;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                animation: pulse-glow 2s ease-in-out infinite;
            }

            @keyframes pulse-glow {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(96, 165, 250, 0.5);
                    transform: scale(1.02);
                }
            }

            .timer-content h3 {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 15px;
                color: #f1f5f9;
                opacity: 0.9;
            }

            .timer-display {
                font-size: 3rem;
                font-weight: 700;
                font-family: 'Courier New', monospace;
                color: #60a5fa;
                text-shadow: 0 0 20px rgba(96, 165, 250, 0.4);
                margin-bottom: 10px;
                letter-spacing: 2px;
                background: linear-gradient(135deg, #60a5fa, #a78bfa);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .timer-status {
                font-size: 1rem;
                color: #cbd5e1;
                opacity: 0.8;
                font-style: italic;
            }

            /* Hide sleep stats when in sleep mode */
            .main-content.night .sleep-stats {
                opacity: 0;
                transform: translateY(-20px);
                pointer-events: none;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                max-height: 0;
                overflow: hidden;
                margin-bottom: 0;
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .timer-display {
                    font-size: 2.5rem;
                    letter-spacing: 1px;
                }
                
                .timer-card {
                    padding: 25px 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    formatSleepDuration(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startSleepTimer() {
        this.sleepStartTime = new Date();
        this.sleepTimerElement.style.display = 'block';
        
        // Add active class after a brief delay for animation
        setTimeout(() => {
            this.sleepTimerElement.classList.add('active');
        }, 100);
        
        // Update timer every second
        this.sleepTimerInterval = setInterval(() => {
            const currentTime = new Date();
            const sleepDuration = currentTime - this.sleepStartTime;
            const timerDisplay = document.getElementById('sleepTimerDisplay');
            if (timerDisplay) {
                timerDisplay.textContent = this.formatSleepDuration(sleepDuration);
            }
        }, 1000);
    }

    stopSleepTimer() {
        if (this.sleepTimerInterval) {
            clearInterval(this.sleepTimerInterval);
            this.sleepTimerInterval = null;
        }
        
        // Calculate total sleep time before hiding
        if (this.sleepStartTime) {
            const endTime = new Date();
            const totalSleepTime = endTime - this.sleepStartTime;
            console.log(`Total sleep time: ${this.formatSleepDuration(totalSleepTime)}`);
            
            // You could store this in localStorage or send to a server
            // localStorage.setItem('lastSleepDuration', totalSleepTime);
        }
        
        this.sleepTimerElement.classList.remove('active');
        
        // Hide element after animation completes
        setTimeout(() => {
            this.sleepTimerElement.style.display = 'none';
        }, 500);
        
        this.sleepStartTime = null;
    }

    getCurrentTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            return 'morning';
        } else {
            return 'afternoon';
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
            
            // Start sleep timer
            this.startSleepTimer();
        } else {
            this.setTimeBasedTheme();
            this.sleepSettings.classList.remove("active");
            this.whiteNoiseAudio.pause();
            this.whiteNoiseAudio.currentTime = 0;
            this.stopVibration();
            
            // Stop sleep timer
            this.stopSleepTimer();
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