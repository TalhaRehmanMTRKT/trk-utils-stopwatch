// Stopwatch Application JavaScript
class StopwatchApp {
    constructor() {
        this.time = 0;
        this.interval = null;
        this.running = false;
        this.currentActivity = null;
        this.activities = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateCurrentTime();
        this.updateCurrentTimeInterval();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.activityNameInput = document.getElementById('activityName');
        this.startActivityBtn = document.getElementById('startActivity');
        this.currentActivityDiv = document.getElementById('currentActivity');
        this.currentActivityName = document.getElementById('currentActivityName');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.finishBtn = document.getElementById('finishBtn');
        this.activitiesList = document.getElementById('activitiesList');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.infoBtn = document.getElementById('infoBtn');
        this.infoModal = document.getElementById('infoModal');
        this.closeModal = document.querySelector('.close');
    }
    
    attachEventListeners() {
        this.startActivityBtn.addEventListener('click', () => this.startActivity());
        this.startBtn.addEventListener('click', () => this.startStopwatch());
        this.pauseBtn.addEventListener('click', () => this.pauseStopwatch());
        this.resetBtn.addEventListener('click', () => this.resetStopwatch());
        this.finishBtn.addEventListener('click', () => this.finishActivity());
        this.clearAllBtn.addEventListener('click', () => this.clearAllActivities());
        this.infoBtn.addEventListener('click', () => this.showInfo());
        this.closeModal.addEventListener('click', () => this.hideInfo());
        
        // Allow starting activity with Enter key
        this.activityNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startActivity();
            }
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.infoModal) {
                this.hideInfo();
            }
        });
    }
    
    updateCurrentTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        this.currentTimeDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    
    updateCurrentTimeInterval() {
        setInterval(() => this.updateCurrentTime(), 1000);
    }
    
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    startActivity() {
        const activityName = this.activityNameInput.value.trim();
        
        if (!activityName) {
            alert('Please enter an activity name');
            return;
        }
        
        if (this.running) {
            alert('Please stop the current stopwatch before starting a new activity');
            return;
        }
        
        this.currentActivity = activityName;
        this.currentActivityName.textContent = activityName;
        this.currentActivityDiv.style.display = 'block';
        this.activityNameInput.value = '';
        
        // Enable finish button and update UI
        this.finishBtn.disabled = false;
        this.startActivityBtn.textContent = 'Change Activity';
        
        // Reset stopwatch for new activity
        this.resetStopwatch();
    }
    
    startStopwatch() {
        if (!this.currentActivity) {
            alert('Please start an activity first');
            return;
        }
        
        this.running = true;
        this.interval = setInterval(() => {
            this.time++;
            this.timeDisplay.textContent = this.formatTime(this.time);
        }, 1000);
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
    }
    
    pauseStopwatch() {
        this.running = false;
        clearInterval(this.interval);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }
    
    resetStopwatch() {
        this.running = false;
        clearInterval(this.interval);
        this.time = 0;
        this.timeDisplay.textContent = this.formatTime(0);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }
    
    finishActivity() {
        if (!this.currentActivity) {
            return;
        }
        
        // Stop the stopwatch if running
        if (this.running) {
            this.pauseStopwatch();
        }
        
        // Only add to activities if there's time recorded
        if (this.time > 0) {
            const activity = {
                name: this.currentActivity,
                time: this.time,
                formattedTime: this.formatTime(this.time),
                date: new Date().toLocaleDateString()
            };
            
            this.activities.push(activity);
            this.updateActivitiesList();
        }
        
        // Reset everything
        this.currentActivity = null;
        this.currentActivityDiv.style.display = 'none';
        this.finishBtn.disabled = true;
        this.startActivityBtn.textContent = 'Start Activity';
        this.resetStopwatch();
    }
    
    updateActivitiesList() {
        if (this.activities.length === 0) {
            this.activitiesList.innerHTML = '<p class="no-activities">No activities recorded yet</p>';
            return;
        }
        
        let html = '';
        this.activities.forEach((activity, index) => {
            html += `
                <div class="activity-item">
                    <div class="activity-name">${activity.name}</div>
                    <div class="activity-time">Time: ${activity.formattedTime} | Date: ${activity.date}</div>
                </div>
            `;
        });
        
        this.activitiesList.innerHTML = html;
    }
    
    clearAllActivities() {
        if (this.activities.length === 0) {
            return;
        }
        
        if (confirm('Are you sure you want to clear all activities? This action cannot be undone.')) {
            this.activities = [];
            this.updateActivitiesList();
            
            // Also reset current activity if any
            this.currentActivity = null;
            this.currentActivityDiv.style.display = 'none';
            this.finishBtn.disabled = true;
            this.startActivityBtn.textContent = 'Start Activity';
            this.resetStopwatch();
        }
    }
    
    showInfo() {
        this.infoModal.style.display = 'block';
    }
    
    hideInfo() {
        this.infoModal.style.display = 'none';
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StopwatchApp();
});