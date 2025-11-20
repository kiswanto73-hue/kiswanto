// 1. Sidebar Toggle Functionality
var sidebarToggle = document.getElementById('sidebarToggle');
var wrapper = document.getElementById('wrapper');

if (sidebarToggle && wrapper) {
    sidebarToggle.addEventListener('click', function (e) {
        e.preventDefault();
        wrapper.classList.toggle('toggled');
    });
}

// 2. Inisialisasi Chart.js (Membuat Data Seru)

// Data Tren Pertumbuhan
const ctxGrowth = document.getElementById('growthChart');
if (ctxGrowth) {
    new Chart(ctxGrowth, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
            datasets: [{
                label: 'Pertumbuhan (%)',
                data: [12, 19, 3, 5, 2, 3, 25], // Data Seru!
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 3,
                tension: 0.4, // Membuat garis lebih melengkung (smooth)
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Data Sumber Lalu Lintas (Traffic)
const ctxTraffic = document.getElementById('trafficChart');
if (ctxTraffic) {
    new Chart(ctxTraffic, {
        type: 'doughnut',
        data: {
            labels: ['Google Search', 'Direct', 'Social Media', 'Iklan'],
            datasets: [{
                label: 'Sumber Lalu Lintas',
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#007bff', // Biru
                    '#28a745', // Hijau
                    '#ffc107', // Kuning (Seru!)
                    '#17a2b8' // Biru Muda
                ],
                hoverOffset: 10 // Efek hover yang seru
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribusi Lalu Lintas'
                }
            }
        }
    });
}