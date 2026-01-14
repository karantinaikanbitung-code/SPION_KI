// Konfigurasi Google Sheets
// Ganti URL ini dengan URL Google Apps Script Web App Anda
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwMquEGFezdJZqG9ci814UsF01BVc4oYn5DS1mCWHTL6YBX1kVjA2hCNCJBr2UYyrC4yg/exec';

// Mapping jenis hewan ke nama sheet
const SHEET_NAMES = {
    'Ikan Segar': 'Ikan_Segar',
    'Ikan Beku': 'Ikan_Beku',
    'Ikan Tuna Kaleng': 'Ikan_Tuna_Kaleng',
    'Kepiting': 'Kepiting',
    'Gurita': 'Gurita',
    'Kerang': 'Kerang'
};

// Daftar panelis terpusat (bisa diperluas atau dimuat dari sheet)
// Gunakan window.PANELIS_LIST untuk akses global di script lain
window.PANELIS_LIST = window.PANELIS_LIST || [
    "ARIE BRAMONO",
    "MUHAMMAD",
    "MIFTAHUDDIN",
    "NOCH MUSA JEFTA TELEW",
    "GRACE LANNY TANTU",
    "YANCE"
];

/**
 * Mengirim data ke Google Sheets
 * @param {Object} data - Data yang akan disimpan
 * @param {string} jenisUji - Jenis uji (Organoleptik, Virologi, Mikrobiologi)
 * @param {string} jenisHewan - Jenis hewan (Ikan Segar, Kepiting, Gurita, Kerang)
 */
async function saveToGoogleSheets(data, jenisUji, jenisHewan) {
    // Jika URL belum dikonfigurasi, skip
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        console.warn('Google Sheets URL belum dikonfigurasi. Silakan konfigurasi di google-sheets-config.js');
        return { success: false, message: 'Google Sheets URL belum dikonfigurasi' };
    }

    try {
        // Siapkan data untuk dikirim
        const sheetName = SHEET_NAMES[jenisHewan] || jenisHewan.replace(/\s+/g, '_');

        // Format data menjadi array untuk Google Sheets
        const rowData = formatDataForSheets(data, jenisUji, jenisHewan);

        // Kirim data ke Google Apps Script sebagai JSON
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'appendRow',
                sheetName: sheetName,
                data: rowData
            })
        });

        if (response.ok) {
            const result = await response.json();
            return { success: result.success, message: result.message || 'Data berhasil dikirim ke Google Sheets' };
        } else {
            throw new Error('HTTP Error: ' + response.status);
        }
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        // Coba metode alternatif menggunakan image tag (fire and forget)
        tryAlternativeMethod(data, jenisUji, jenisHewan);
        return { success: false, message: 'Gagal menyimpan ke Google Sheets: ' + error.message };
    }
}

/**
 * Metode alternatif menggunakan image tag (fire and forget)
 */
function tryAlternativeMethod(data, jenisUji, jenisHewan) {
    try {
        const sheetName = SHEET_NAMES[jenisHewan] || jenisHewan.replace(/\s+/g, '_');
        const rowData = formatDataForSheets(data, jenisUji, jenisHewan);

        // Buat URL dengan parameter
        const params = new URLSearchParams({
            action: 'appendRow',
            sheetName: sheetName,
            data: JSON.stringify(rowData)
        });

        // Gunakan image tag untuk mengirim request (fire and forget)
        const img = document.createElement('img');
        img.src = GOOGLE_APPS_SCRIPT_URL + '?' + params.toString();
        img.style.display = 'none';
        document.body.appendChild(img);

        // Hapus setelah beberapa detik
        setTimeout(() => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        }, 5000);
    } catch (error) {
        console.error('Alternative method also failed:', error);
    }
}

/**
 * Format data menjadi array untuk Google Sheets
 */
function formatDataForSheets(data, jenisUji, jenisHewan) {
    const row = [];

    // Header dasar
    row.push(data.timestamp || '');
    row.push(jenisUji || '');
    row.push(jenisHewan || '');
    row.push(data.tanggalUji || '');
    row.push(data.namaPetugas || '');
    row.push(data.noSampel || '');

    // Data khusus ikan segar
    if (jenisHewan === 'Ikan Segar') {
        // Kode contoh uji dan tanggal diterima sudah ada di data object
        row.push(data.kodeContohUji || '');
        row.push(data.tglDiterima || '');

        // Data untuk setiap kode contoh (1-6)
        if (data.penilaianIkanSegar) {
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = data.penilaianIkanSegar[`kodeContoh${kode}`];
                if (kodeData) {
                    row.push(kodeData.total || 0);
                    row.push(kodeData.rataRata || 0);
                    // Tambahkan detail nilai jika ada
                    const nilaiStr = kodeData.nilai && kodeData.nilai.length > 0
                        ? kodeData.nilai.map(n => `Row${n.rowIndex}:${n.nilai}`).join('; ')
                        : '';
                    row.push(nilaiStr);
                } else {
                    row.push(0, 0, '');
                }
            }
        } else {
            // Jika tidak ada data penilaian, isi dengan 0
            for (let kode = 1; kode <= 6; kode++) {
                row.push(0, 0, '');
            }
        }
    } else if (jenisHewan === 'Ikan Beku') {
        // Nama panelis dan tanggal panelis
        row.push(data.namaPanelis || '');
        row.push(data.tanggalPanelis || '');

        // Data untuk setiap kode contoh (1-5)
        if (data.penilaianIkanBeku) {
            for (let kode = 1; kode <= 5; kode++) {
                const kodeData = data.penilaianIkanBeku[`kodeContoh${kode}`];
                if (kodeData) {
                    row.push(kodeData.total || 0);
                    row.push(kodeData.rataRata || 0);
                    // Tambahkan detail nilai jika ada
                    const nilaiStr = kodeData.nilai && kodeData.nilai.length > 0
                        ? kodeData.nilai.map(n => `Row${n.rowIndex}:${n.nilai}`).join('; ')
                        : '';
                    row.push(nilaiStr);
                } else {
                    row.push(0, 0, '');
                }
            }
        } else {
            // Jika tidak ada data penilaian, isi dengan 0
            for (let kode = 1; kode <= 5; kode++) {
                row.push(0, 0, '');
            }
        }
    } else if (jenisHewan === 'Ikan Tuna Kaleng') {
        // Nama panelis dan tanggal panelis
        row.push(data.namaPanelisTuna || '');
        row.push(data.tanggalPanelisTuna || '');

        // Data untuk setiap kode contoh (1-5)
        if (data.penilaianIkanTunaKaleng) {
            for (let kode = 1; kode <= 5; kode++) {
                const kodeData = data.penilaianIkanTunaKaleng[`kodeContoh${kode}`];
                if (kodeData) {
                    row.push(kodeData.total || 0);
                    row.push(kodeData.rataRata || 0);
                    // Tambahkan detail nilai jika ada
                    const nilaiStr = kodeData.nilai && kodeData.nilai.length > 0
                        ? kodeData.nilai.map(n => `Row${n.rowIndex}:${n.nilai}`).join('; ')
                        : '';
                    row.push(nilaiStr);
                } else {
                    row.push(0, 0, '');
                }
            }
        } else {
            // Jika tidak ada data penilaian, isi dengan 0
            for (let kode = 1; kode <= 5; kode++) {
                row.push(0, 0, '');
            }
        }
    } else {
        // Data untuk jenis hewan lain (kepiting, gurita, kerang)
        // Tambahkan field sesuai dengan form
        const excludedKeys = ['jenisUji', 'jenisHewan', 'timestamp', 'tanggalUji',
            'namaPetugas', 'noSampel', 'penilaianIkanSegar',
            'kodeContohUji', 'tglDiterima', 'penilaianIkanBeku',
            'namaPanelis', 'tanggalPanelis', 'penilaianIkanTunaKaleng',
            'namaPanelisTuna', 'tanggalPanelisTuna', 'catatan'];

        for (let key in data) {
            if (!excludedKeys.includes(key)) {
                // Jika object, stringify
                if (typeof data[key] === 'object' && data[key] !== null) {
                    row.push(JSON.stringify(data[key]));
                } else {
                    row.push(data[key] || '');
                }
            }
        }
    }

    // Catatan
    row.push(data.catatan || '');

    return row;
}

/**
 * Mendapatkan header untuk Google Sheets berdasarkan jenis hewan
 */
function getSheetHeaders(jenisHewan) {
    const baseHeaders = [
        'Waktu Pengisian',
        'Jenis Uji',
        'Jenis Hewan',
        'Tanggal Uji',
        'Nama Panelis',
        'Lokasi Pelayanan'
    ];

    if (jenisHewan === 'Ikan Segar') {
        const ikanSegarHeaders = [
            ...baseHeaders,
            'Kode Contoh Uji',
            'Tanggal Diterima',
            // Headers untuk Kode Contoh 1
            'Kode Contoh 1 - Total',
            'Kode Contoh 1 - Rata-rata',
            'Kode Contoh 1 - Detail Nilai',
            // Headers untuk Kode Contoh 2
            'Kode Contoh 2 - Total',
            'Kode Contoh 2 - Rata-rata',
            'Kode Contoh 2 - Detail Nilai',
            // Headers untuk Kode Contoh 3
            'Kode Contoh 3 - Total',
            'Kode Contoh 3 - Rata-rata',
            'Kode Contoh 3 - Detail Nilai',
            // Headers untuk Kode Contoh 4
            'Kode Contoh 4 - Total',
            'Kode Contoh 4 - Rata-rata',
            'Kode Contoh 4 - Detail Nilai',
            // Headers untuk Kode Contoh 5
            'Kode Contoh 5 - Total',
            'Kode Contoh 5 - Rata-rata',
            'Kode Contoh 5 - Detail Nilai',
            // Headers untuk Kode Contoh 6
            'Kode Contoh 6 - Total',
            'Kode Contoh 6 - Rata-rata',
            'Kode Contoh 6 - Detail Nilai',
            'Catatan'
        ];
        return ikanSegarHeaders;
    } else {
        // Headers untuk jenis hewan lain akan ditambahkan secara dinamis
        return [...baseHeaders, 'Catatan'];
    }
}

/**
 * Menyimpan item history ke Google Sheets
 */
async function saveHistoryToSheets(item) {
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        return { success: false, message: 'Apps Script URL belum dikonfigurasi' };
    }

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'saveHistory',
                historyItem: item
            })
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('HTTP Error: ' + response.status);
    } catch (error) {
        console.error('Error saving history to Sheets:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Mengambil history dari Google Sheets
 */
async function getHistoryFromSheets() {
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        return { success: false, message: 'Apps Script URL belum dikonfigurasi' };
    }

    try {
        // Gunakan GET untuk mengambil data agar lebih simpel
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getHistory`, {
            method: 'GET',
            mode: 'cors'
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('HTTP Error: ' + response.status);
    } catch (error) {
        console.error('Error fetching history from Sheets:', error);
        return { success: false, message: error.message };
    }
}
