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
let draggedItem = null;
    let originalParent;         // <-- BARIS BARU 1: Menyimpan tempat asal item
    let touchStartX, touchStartY; // <-- BARIS BARU 2: Menyimpan koordinat sentuhan awal
    
    function setupDragListeners() {
        // ...
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
        // B. TOUCH MOVE (Menggantikan drag pada mouse)
    function onTouchMove(e) {
        if (!draggedItem) return;
        const touch = e.touches[0];
        
        // Pindahkan item ke posisi sentuhan
        draggedItem.style.left = touch.clientX - touchStartX + 'px';
        draggedItem.style.top = touch.clientY - touchStartY + 'px';
    }

    // C. END TOUCH (Menggantikan drop/dragend pada mouse)
    function onTouchEnd(e) {
        if (!draggedItem) return;

        // Cari slot di bawah jari
        draggedItem.style.opacity = '1';
        draggedItem.style.display = 'none'; // Sembunyikan sebentar untuk menemukan elemen di bawah
        const targetSlot = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        draggedItem.style.display = 'block'; // Tampilkan lagi

        if (targetSlot && targetSlot.classList.contains('slot') && targetSlot.children.length === 0) {
            // Drop berhasil di slot yang kosong
            targetSlot.innerHTML = '';
            targetSlot.appendChild(draggedItem);
            draggedItem.style.position = 'static'; // Kembalikan posisi normal
            draggedItem.style.zIndex = 'auto';
        } else {
            // Drop gagal, kembalikan ke tempat asal (draggableArea)
            originalParent.appendChild(draggedItem);
            draggedItem.style.position = 'static'; // Kembalikan posisi normal
            draggedItem.style.zIndex = 'auto';
        }

        // Hapus listener agar tidak bergerak terus
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        draggedItem = null;
    }
Langkah 3: Tambahkan Listener touchstart
Sekarang kita akan menambahkan event listener yang mendeteksi saat item disentuh, lalu memanggil fungsi onTouchMove dan onTouchEnd yang baru saja Anda buat.

Apa yang harus dilakukan: Tambahkan blok kode item.addEventListener('touchstart', ...) ini.

Tempatnya: Di dalam perulangan items.forEach di samping listener dragstart dan dragend yang sudah ada.

JavaScript

    function setupDragListeners() {
        const items = document.querySelectorAll('.organism-image');
        items.forEach(item => {
            // Listener MOUSE yang sudah ada (dragstart)
            item.addEventListener('dragstart', (e) => { 
                // ...
            });

            // Listener MOUSE yang sudah ada (dragend)
            item.addEventListener('dragend', (e) => { 
                // ...
            });

            // --- KODE BARU: START TOUCH (A. Menggantikan dragstart) ---
            item.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Mencegah scrolling default HP
                draggedItem = e.target;
                originalParent = draggedItem.parentNode;

                // Dapatkan koordinat sentuhan awal
                const touch = e.touches[0];
                touchStartX = touch.clientX - draggedItem.getBoundingClientRect().left;
                touchStartY = touch.clientY - draggedItem.getBoundingClientRect().top;
                
                // Posisikan item secara absolut untuk digerakkan
                draggedItem.style.position = 'absolute';
                draggedItem.style.zIndex = 1000;
                draggedItem.style.opacity = '0.7';

                // Pindahkan item ke body agar bisa bergerak bebas di atas elemen lain
                document.body.appendChild(draggedItem);
                
                // Panggil onTouchMove dan onTouchEnd saat sentuhan bergerak
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            });
            // -----------------------------------------------------------------
        });
        // ... sisa kode slot.forEach dan fungsi onTouchMove/onTouchEnd});
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