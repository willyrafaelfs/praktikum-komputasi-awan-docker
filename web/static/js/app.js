/**
 * Kompos App - Frontend JavaScript
 * Handles toast notifications, edit/delete modals, and input validation.
 */

document.addEventListener('DOMContentLoaded', function () {

    // === Toast Notification ===
    const urlParams = new URLSearchParams(window.location.search);
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message, type) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.remove('toast-danger');
        if (type === 'danger') toast.classList.add('toast-danger');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    if (urlParams.get('success') === '1') {
        showToast('Barang berhasil ditambahkan!');
    } else if (urlParams.get('edited') === '1') {
        showToast('Barang berhasil diperbarui!');
    } else if (urlParams.get('deleted') === '1') {
        showToast('Barang berhasil dihapus!', 'danger');
    }

    // Clean URL after showing toast
    if (urlParams.has('success') || urlParams.has('edited') || urlParams.has('deleted')) {
        window.history.replaceState({}, '', window.location.pathname);
    }

    // === Input Validation ===
    const hargaInput = document.getElementById('harga');
    if (hargaInput) {
        hargaInput.addEventListener('input', function () {
            if (this.value < 0) this.value = 0;
        });
    }

    // === Modal Helpers ===
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

});

// === Edit Modal ===
function openEditModal(id, nama, harga) {
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('edit-form');
    const namaInput = document.getElementById('edit-nama');
    const hargaInput = document.getElementById('edit-harga');

    form.action = '/edit/' + id;
    namaInput.value = nama;
    hargaInput.value = harga;

    modal.classList.add('active');
    // Focus the nama input after animation
    setTimeout(() => namaInput.focus(), 300);
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

// === Delete Modal ===
function openDeleteModal(id, nama) {
    const modal = document.getElementById('delete-modal');
    const form = document.getElementById('delete-form');
    const itemName = document.getElementById('delete-item-name');

    form.action = '/delete/' + id;
    itemName.textContent = nama;

    modal.classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
}
