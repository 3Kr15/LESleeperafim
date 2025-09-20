chrome.storage.local.get("siteUsage", ({ siteUsage }) => {
    const table = document.getElementById("usageTable");
    if (!siteUsage) return;
    for (let domain in siteUsage) {
        const row = document.createElement("tr");
        const time = Math.round(siteUsage[domain] / 1000); // sec
        row.innerHTML = `<td>${domain}</td><td>${time}s</td>`;
        table.appendChild(row);
    }
});
