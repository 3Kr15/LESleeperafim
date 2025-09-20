let usageData = [];
let sortByTime = true;

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
}

const getDomainInitial = (domain) => {
    return domain.charAt(0).toUpperCase();
}

const calculateMaxTime = (data) => {
    return data.length > 0 ? Math.max(...data.map(item => item.timeSpent)) : 0;
}

const renderTable = (data) => {
    const tableBody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    const usageTable = document.getElementById('usageTable');

    if (data.length === 0) {
        usageTable.style.display = 'none';
        emptyState.style.display = 'block';
        document.getElementById('totalTime').textContent = '0m';
        return;
    }

    usageTable.style.display = 'table';
    emptyState.style.display = 'none';

    const maxTime = calculateMaxTime(data);

    tableBody.innerHTML = data.map(item => {
        const barWidth = maxTime > 0 ? (item.timeSpent / maxTime) * 100 : 0;
        return `
      <tr>
        <td class="domain-cell">
          <div class="domain-favicon">${getDomainInitial(item.domain)}</div>
          <span>${item.domain}</span>
        </td>
        <td class="time-cell">
          ${formatTime(item.timeSpent)}
          <div class="time-bar" style="width: ${barWidth}%"></div>
        </td>
      </tr>
    `;
    }).join('');

    const totalSeconds = data.reduce((sum, item) => sum + item.timeSpent, 0);
    document.getElementById('totalTime').textContent = formatTime(totalSeconds);
}

// Fetch data from storage
chrome.storage.local.get("siteUsage", ({ siteUsage }) => {
    if (!siteUsage) {
        renderTable([]);
        return;
    }

    usageData = Object.entries(siteUsage).map(([domain, timeMs]) => ({
        domain,
        timeSpent: Math.round(timeMs / 1000) // convert ms to sec
    }));

    usageData.sort((a, b) => b.timeSpent - a.timeSpent);
    renderTable(usageData);
});
