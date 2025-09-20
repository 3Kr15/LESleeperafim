document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('sleepChart').getContext('2d');
    const sleepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Estimated Time Slept (hours)',
                data: [7.5, 6, 8, 7, 7.8, 9, 8.2],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day of the week'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Estimated Time Slept for the Week',
                    font: {
                        size: 12
                    }
                }
            }
        }
    });
});