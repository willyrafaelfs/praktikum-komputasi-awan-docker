/**
 * Kompos App - Frontend JavaScript
 * Handles toast notifications, hover effects, and input validation.
 */

document.addEventListener('DOMContentLoaded', function () {

    // === Toast Notification ===
    // Show toast if redirected after a successful POST
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === '1') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
        // Clean URL so refresh doesn't re-trigger toast
        window.history.replaceState({}, '', window.location.pathname);
    }

    // === Table Row Hover Effect ===
    document.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transition = 'background 0.2s ease';
        });
    });

    // === Input Validation ===
    // Prevent negative price values
    const hargaInput = document.getElementById('harga');
    if (hargaInput) {
        hargaInput.addEventListener('input', function () {
            if (this.value < 0) this.value = 0;
        });
    }

});
