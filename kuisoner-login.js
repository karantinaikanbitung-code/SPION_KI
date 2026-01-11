// Kredensial untuk akses kuisoner (contoh: ganti dengan mekanisme autentikasi yang lebih aman)
const CORRECT_USERNAME = "admin123";
const CORRECT_PASSWORD = "12345678";

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    let errorMessage = document.getElementById('errorMessage');

    // Jika form tidak ditemukan, hentikan dan beri tahu di console
    if (!loginForm) {
        console.warn('Form login tidak ditemukan (id=loginForm).');
        return;
    }

    // Buat elemen pesan error jika tidak ada di HTML
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'error-message-modern';
        errorMessage.setAttribute('aria-live', 'polite');
        // Tempelkan setelah input password jika tersedia, atau di akhir form
        if (passwordInput && passwordInput.parentNode) {
            passwordInput.parentNode.appendChild(errorMessage);
        } else {
            loginForm.appendChild(errorMessage);
        }
    }

    // Cek apakah user sudah login
    if (sessionStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'kuisoner-jenis-uji.html?jenis=organoleptik';
        return;
    }

    function showError(msg, timeout = 3000) {
        errorMessage.textContent = msg;
        errorMessage.classList.add('visible');
        if (timeout > 0) {
            setTimeout(() => {
                errorMessage.textContent = '';
                errorMessage.classList.remove('visible');
            }, timeout);
        }
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!usernameInput || !passwordInput) {
            showError('Elemen input tidak ditemukan. Segarkan halaman.');
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validasi sederhana (contoh; ganti dengan pengecekan server untuk produksi)
        if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('username', username);
            window.location.href = 'kuisoner-jenis-uji.html?jenis=organoleptik';
        } else {
            showError('Username atau password salah! Silakan coba lagi.');
            usernameInput.value = '';
            passwordInput.value = '';
            usernameInput.focus();
        }
    });

    // Bersihkan pesan error ketika pengguna mulai mengetik ulang
    if (usernameInput) usernameInput.addEventListener('input', () => { errorMessage.textContent = ''; });
    if (passwordInput) passwordInput.addEventListener('input', () => { errorMessage.textContent = ''; });

    // Fokus pada input username saat halaman dimuat
    if (usernameInput) usernameInput.focus();
});

