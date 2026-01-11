// Cek autentikasi sebelum mengizinkan akses
document.addEventListener('DOMContentLoaded', function() {
    // Jika belum login, redirect ke halaman login
    if (sessionStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'kuisoner-login.html';
        return;
    }

    // Setup rating slider
    const ratingSlider = document.getElementById('rating');
    const ratingValue = document.getElementById('ratingValue');

    if (ratingSlider && ratingValue) {
        ratingSlider.addEventListener('input', function() {
            ratingValue.textContent = this.value;
        });
    }

    // Handle form submission
    const form = document.getElementById('questionnaireForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }
});

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.removeItem('isAuthenticated');
        window.location.href = 'kuisoner-login.html';
    }
}

function resetForm() {
    if (confirm('Apakah Anda yakin ingin mereset semua data yang telah diisi?')) {
        document.getElementById('questionnaireForm').reset();
        document.getElementById('ratingValue').textContent = '5';
        document.getElementById('rating').value = 5;
    }
}

function handleFormSubmit() {
    // Validasi checkbox untuk aspek
    const aspekCheckboxes = document.querySelectorAll('input[name="aspek"]:checked');
    if (aspekCheckboxes.length === 0) {
        alert('Silakan pilih minimal satu aspek yang penting bagi Anda.');
        return;
    }

    // Kumpulkan data dari form
    const formData = new FormData(document.getElementById('questionnaireForm'));
    
    // Buat objek data
    const data = {
        timestamp: new Date().toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        nama: formData.get('nama'),
        email: formData.get('email'),
        usia: formData.get('usia'),
        jenisKelamin: formData.get('jenisKelamin'),
        pekerjaan: formData.get('pekerjaan') || '-',
        kepuasan: formData.get('kepuasan'),
        frekuensi: formData.get('frekuensi'),
        aspek: Array.from(aspekCheckboxes).map(cb => cb.value).join(', '),
        saran: formData.get('saran'),
        rekomendasi: formData.get('rekomendasi'),
        rating: formData.get('rating')
    };

    // Export ke Excel
    exportToExcel(data);

    // Tampilkan pesan sukses
    alert('Terima kasih! Data kuisoner Anda telah berhasil disimpan ke file Excel.');
    
    // Reset form setelah submit
    document.getElementById('questionnaireForm').reset();
    document.getElementById('ratingValue').textContent = '5';
    document.getElementById('rating').value = 5;
}

function exportToExcel(data) {
    // Buat workbook baru
    const wb = XLSX.utils.book_new();

    // Buat worksheet dengan data
    const wsData = [
        ['Waktu Pengisian', 'Nama Lengkap', 'Email', 'Usia', 'Jenis Kelamin', 'Pekerjaan', 
         'Tingkat Kepuasan', 'Frekuensi Penggunaan', 'Aspek Penting', 'Saran/Masukan', 
         'Rekomendasi', 'Rating (1-10)'],
        [
            data.timestamp,
            data.nama,
            data.email,
            data.usia,
            data.jenisKelamin,
            data.pekerjaan,
            data.kepuasan,
            data.frekuensi,
            data.aspek,
            data.saran,
            data.rekomendasi,
            data.rating
        ]
    ];

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set lebar kolom
    ws['!cols'] = [
        { wch: 20 }, // Waktu
        { wch: 25 }, // Nama
        { wch: 30 }, // Email
        { wch: 8 },  // Usia
        { wch: 15 }, // Jenis Kelamin
        { wch: 20 }, // Pekerjaan
        { wch: 18 }, // Kepuasan
        { wch: 22 }, // Frekuensi
        { wch: 30 }, // Aspek
        { wch: 40 }, // Saran
        { wch: 15 }, // Rekomendasi
        { wch: 12 }  // Rating
    ];

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Hasil Kuisoner');

    // Generate nama file dengan timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `Hasil_Kuisoner_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
}







