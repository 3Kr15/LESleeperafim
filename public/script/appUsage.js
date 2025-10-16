// Helper to convert time
const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

// Fetch usage data from Node.js API and populate the card
const loadUsageData = async () => {
    const list = document.getElementById('appUsageList');
    if (!list) {
        console.error("Element with id='appUsageList' not found in HTML");
        return;
    }

    // Show loading state before fetch
    list.innerHTML = '<li><span>Loading...</span></li>';

    try {
        const response = await fetch('http://localhost:44223/api/usage');
        if (!response.ok) throw new Error('Failed to fetch usage data');

        const data = await response.json();
        console.log("Fetched usage data:", data); // debug log

        list.innerHTML = ''; // clear loading message

        if (Object.keys(data).length === 0) {
            list.innerHTML = '<li><span>No data yet, Please wait while we fetch...</span></li>';
            return;
        }

        // Loop through usage object
        for (const [app, seconds] of Object.entries(data)) {
            const li = document.createElement('li');
            li.innerHTML = `<span>${app}</span> <span>${formatTime(seconds)}</span>`;
            list.appendChild(li);
        }
    } catch (err) {
        console.error('Error loading usage data:', err);
        list.innerHTML = '<li><span>Error loading data</span></li>';

    }
};

// Load immediately and refresh every 10s
document.addEventListener('DOMContentLoaded', () => {
    loadUsageData();
    setInterval(loadUsageData, 10000);
});