document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Rantai Makanan
    const currentLevel = {
    // ...
    correctOrder: [
        "rumput", 
        "belalang",  
        "katak",     
        "ular",      
        "elang",
        "dekomposer" // Ditambahkan
    ]
};

    // Daftar semua gambar yang akan dimainkan (harus ada di assets/images/)
    const allOrganisms = currentLevel.correctOrder.slice().sort(() => Math.random() - 0.5); // Diacak

    const draggableArea = document.getElementById('draggable-area');
    const slots = document.querySelectorAll('.slot');
    const checkButton = document.getElementById('check-button');
    const feedbackMessage = document.getElementById('feedback-message');

    // 2. Fungsi untuk MEMUAT GAMBAR ke area draggable
    function loadOrganisms() {
        draggableArea.innerHTML = '<h3>Pilih Organisme (Seret ke Bawah)</h3>'; // Reset title
        allOrganisms.forEach(organism => {
            const img = document.createElement('img');
            img.src = `assets/images/${organism}.png`; // PASTIKAN NAMA FILE SAMA DENGAN ARRAY DI ATAS!
            img.alt = organism.charAt(0).toUpperCase() + organism.slice(1); // Kapitalisasi nama
            img.classList.add('organism-image');
            img.setAttribute('draggable', true);
            img.id = organism; // ID untuk identifikasi saat drag
            draggableArea.appendChild(img);
        });
        setupDragListeners(); // Panggil fungsi untuk mengaktifkan drag
    }

    // 3. Implementasi Drag and Drop (HTML5 Drag API)
    let draggedItem = null;

    function setupDragListeners() {
        const items = document.querySelectorAll('.organism-image');
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.style.opacity = '0.5';
                }, 0);
            });

            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                draggedItem = null;
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault(); // Diperlukan agar drop bekerja
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                if (e.target.classList.contains('slot')) {
                    // Hanya izinkan satu gambar per slot
                    if (e.target.children.length === 0) {
                        e.target.innerHTML = ''; // Hapus teks placeholder
                        e.target.appendChild(draggedItem);
                    }
                }
            });
        });
    }

    // 4. Fungsi Validasi Jawaban
    checkButton.addEventListener('click', () => {
        let isCorrect = true;
        let playerChain = [];

        slots.forEach((slot, index) => {
            if (slot.querySelector('.organism-image')) {
                const placedOrganismId = slot.querySelector('.organism-image').id;
                playerChain.push(placedOrganismId);

                // Cek apakah organisme yang diletakkan sesuai urutan yang benar
                if (placedOrganismId !== currentLevel.correctOrder[index]) {
                    isCorrect = false;
                }
            } else {
                // Jika ada slot yang kosong
                isCorrect = false;
            }
        });

        if (isCorrect && playerChain.length === currentLevel.correctOrder.length) {
            feedbackMessage.textContent = "🥳 BENAR! Rantai Makanan Sempurna!";
            feedbackMessage.style.color = 'green';
            // Di sini Anda bisa menambahkan logika untuk naik level
        } else {
            feedbackMessage.textContent = "😞 Salah. Cek kembali urutan Produsen, Konsumen Primer, dst.";
            feedbackMessage.style.color = 'red';
        }
    });

    // Mulai game
    loadOrganisms();
});