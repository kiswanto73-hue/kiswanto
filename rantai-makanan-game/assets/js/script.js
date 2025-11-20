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
            "dekomposer"
        ]
    };

    const allOrganisms = currentLevel.correctOrder.slice().sort(() => Math.random() - 0.5);

    const draggableArea = document.getElementById('draggable-area');
    const slots = document.querySelectorAll('.slot');
    const checkButton = document.getElementById('check-button');
    const feedbackMessage = document.getElementById('feedback-message');

    // 2. Fungsi untuk MEMUAT GAMBAR ke area draggable
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

    // 3. Implementasi Drag and Drop (HTML5 Drag & Touch API)
    let draggedItem = null;
    let originalParent;         
    let touchStartX, touchStartY; 

    function setupDragListeners() {
        const items = document.querySelectorAll('.organism-image');
        
        // --- 3A. PENANGANAN MOUSE (HTML5 Drag API) ---
        items.forEach(item => {
            // DRAG START
            item.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.style.opacity = '0.5';
                }, 0);
            });

            // DRAG END
            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                draggedItem = null;
            });

            // --- 3B. PENANGANAN TOUCH (START TOUCH) ---
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

        // --- 3C. PENANGANAN SLOT (DROP TARGETS) ---
        slots.forEach(slot => {
            // DRAG OVER (Mouse)
            slot.addEventListener('dragover', (e) => {
                e.preventDefault(); 
            });

            // DROP (Mouse)
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                if (e.target.classList.contains('slot')) {
                    if (e.target.children.length === 0) {
                        e.target.innerHTML = '';
                        e.target.appendChild(draggedItem);
                    }
                }
            });
        });

        // --- 3D. FUNGSI HELPER TOUCH EVENTS ---
        
        // TOUCH MOVE (Menggantikan drag pada mouse)
        function onTouchMove(e) {
            if (!draggedItem) return;
            const touch = e.touches[0];
            
            draggedItem.style.left = touch.clientX - touchStartX + 'px';
            draggedItem.style.top = touch.clientY - touchStartY + 'px';
        }

        // END TOUCH (Menggantikan drop/dragend pada mouse)
        function onTouchEnd(e) {
            if (!draggedItem) return;

            draggedItem.style.opacity = '1';
            draggedItem.style.display = 'none'; 
            const targetSlot = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            draggedItem.style.display = 'block'; 

            if (targetSlot && targetSlot.classList.contains('slot') && targetSlot.children.length === 0) {
                // Drop berhasil
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
    } // Akhir setupDragListeners

    // 4. Fungsi Validasi Jawaban
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