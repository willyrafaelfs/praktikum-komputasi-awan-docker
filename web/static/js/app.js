/**
 * Kompos App - Frontend JavaScript
 * Toast notifications, edit/delete modals, input validation,
 * plus pencarian realtime dan sorting kolom tabel.
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
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) this.classList.remove('active');
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // === Pencarian Realtime ===
    const searchInput = document.getElementById('search-input');
    const tbody = document.getElementById('barang-tbody');
    const countBadge = document.getElementById('count-badge');
    const noResults = document.getElementById('no-results');

    function applySearch() {
        if (!tbody) return;
        const query = (searchInput.value || '').trim().toLowerCase();
        let visible = 0;

        tbody.querySelectorAll('tr').forEach(row => {
            const nama = row.dataset.nama || '';
            const id = row.dataset.id || '';
            const match = nama.includes(query) || ('#' + id).includes(query) || id.includes(query);
            row.style.display = match ? '' : 'none';
            if (match) visible++;
        });

        if (countBadge) countBadge.textContent = visible + ' item';
        if (noResults) noResults.classList.toggle('hidden', visible !== 0);
    }

    if (searchInput) searchInput.addEventListener('input', applySearch);

    // === Sorting Kolom ===
    let sortState = { key: null, dir: 1 };

    function applySort(key, type) {
        if (!tbody) return;
        sortState.dir = sortState.key === key ? -sortState.dir : 1;
        sortState.key = key;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            let va = a.dataset[key];
            let vb = b.dataset[key];
            if (type === 'num') {
                va = parseFloat(va) || 0;
                vb = parseFloat(vb) || 0;
                return (va - vb) * sortState.dir;
            }
            return va.localeCompare(vb) * sortState.dir;
        });

        rows.forEach(row => tbody.appendChild(row));

        // Update indikator panah pada header
        document.querySelectorAll('.sort-th').forEach(th => {
            const ind = th.querySelector('.sort-ind');
            if (!ind) return;
            if (th.dataset.key === key) {
                ind.textContent = sortState.dir === 1 ? '↑' : '↓';
                ind.classList.remove('opacity-30');
            } else {
                ind.textContent = '↕';
                ind.classList.add('opacity-30');
            }
        });
    }

    document.querySelectorAll('.sort-th').forEach(th => {
        th.addEventListener('click', () => applySort(th.dataset.key, th.dataset.type));
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
