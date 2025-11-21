document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA INTI PERMAINAN
    const currentLevel = {
        correctOrder: [
            "rumput", 
            "belalang",  
            "katak",     
            "ular",      
            "elang",
            "dekomposer"
        ]
    };

    // Acak urutan organisme untuk area drag
    const allOrganisms = currentLevel.correctOrder.slice().sort(() => Math.random() - 0.5);

    // Ambil Elemen DOM
    const draggableArea = document.getElementById('draggable-area');
    const slots = document.querySelectorAll('.slot');
    const checkButton = document.getElementById('check-button');
    const feedbackMessage = document.getElementById('feedback-message');

    // 2. FUNGSI MEMUAT ORGANISME KE AREA DRAG
    function loadOrganisms() {
        draggableArea.innerHTML = '<h3>Pilih Organisme (Seret ke Bawah)</h3>';
        allOrganisms.forEach(organism => {
            const img = document.createElement('img');
            img.src = `assets/images/${organism}.png`;
            img.alt = organism.charAt(0).toUpperCase() + organism.slice(1);
            img.classList.add('organism-image');
            img.setAttribute('draggable', true);
            img.id = organism;
            draggableArea.appendChild(img);
        });
        setupDragListeners();
    }

    // 3. LOGIKA DRAG AND DROP (MOUSE & TOUCH)
    let draggedItem = null;
    let originalParent;         
    let touchStartX, touchStartY; 

    function setupDragListeners() {
        const items = document.querySelectorAll('.organism-image');
        
        // --- TOUCH EVENTS HELPER ---
        function onTouchMove(e) {
            if (!draggedItem) return;
            const touch = e.touches[0];
            draggedItem.style.left = touch.clientX - touchStartX + 'px';
            draggedItem.style.top = touch.clientY - touchStartY + 'px';
        }

        function onTouchEnd(e) {
            if (!draggedItem) return;

            draggedItem.style.opacity = '1';
            draggedItem.style.display = 'none'; 
            
            // Dapatkan elemen di bawah sentuhan
            const targetElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            draggedItem.style.display = 'block'; 

            // **SOLUSI UNTUK PANA & TOUCH:** Cari slot terdekat. Jika disentuh panah, ini akan null.
            const targetSlot = targetElement ? targetElement.closest('.slot') : null;

            if (targetSlot && targetSlot.children.length === 0) {
                // Drop berhasil pada slot yang valid dan kosong
                targetSlot.innerHTML = '';
                targetSlot.appendChild(draggedItem);
                draggedItem.style.position = 'static'; 
                draggedItem.style.zIndex = 'auto';
            } else {
                // Drop gagal, kembalikan ke tempat asal
                originalParent.appendChild(draggedItem);
                draggedItem.style.position = 'static'; 
                draggedItem.style.zIndex = 'auto';
            }

            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            draggedItem = null;
        }

        items.forEach(item => {
            // A. MOUSE (DRAGSTART & DRAGEND)
            item.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                originalParent = draggedItem.parentNode;
                setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
            });

            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                draggedItem = null;
            });

            // B. TOUCH START
            item.addEventListener('touchstart', (e) => {
                e.preventDefault(); 
                draggedItem = e.target;
                originalParent = draggedItem.parentNode;

                const touch = e.touches[0];
                touchStartX = touch.clientX - draggedItem.getBoundingClientRect().left;
                touchStartY = touch.clientY - draggedItem.getBoundingClientRect().top;
                
                draggedItem.style.position = 'absolute';
                draggedItem.style.zIndex = 1000;
                draggedItem.style.opacity = '0.7';

                document.body.appendChild(draggedItem);
                
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            });
        });

        slots.forEach(slot => {
            // MOUSE (DRAG OVER & DROP)
            slot.addEventListener('dragover', (e) => { e.preventDefault(); });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                // Verifikasi bahwa target drop adalah slot dan kosong
                if (e.target.classList.contains('slot') && e.target.children.length === 0) {
                    e.target.innerHTML = '';
                    e.target.appendChild(draggedItem);
                }
            });
        });
    }

    // 4. FUNGSI VALIDASI JAWABAN
    checkButton.addEventListener('click', () => {
        let isCorrect = true;
        let playerChain = [];

        slots.forEach((slot, index) => {
            if (slot.querySelector('.organism-image')) {
                const placedOrganismId = slot.querySelector('.organism-image').id;
                playerChain.push(placedOrganismId);

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
        } else {
            feedbackMessage.textContent = "😞 Salah. Cek kembali urutan Produsen, Konsumen Primer, dst.";
            feedbackMessage.style.color = 'red';
        }
    });

    // Mulai game
    loadOrganisms();
});
