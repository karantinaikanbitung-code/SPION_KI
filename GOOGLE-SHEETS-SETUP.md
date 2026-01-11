# Setup Google Sheets Integration

Panduan untuk mengintegrasikan sistem dengan Google Sheets agar data hasil uji otomatis tersimpan ke Google Drive.

## Prerequisites

1. Akun Google (karantinaikanbitung@gmail.com)
2. Akses ke Google Drive dan Google Sheets
3. Akses ke Google Apps Script

## Langkah-langkah Setup

### 1. Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama: **"Hasil Uji Karantina Ikan Bitung"**
3. Copy **Spreadsheet ID** dari URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy bagian `SPREADSHEET_ID`

### 2. Setup Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Klik **"New Project"**
3. Hapus kode default dan copy-paste seluruh isi dari file **`google-apps-script-code.gs`**
4. Ganti `SPREADSHEET_ID` dengan ID spreadsheet yang Anda copy di langkah 1:
   ```javascript
   const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_DISINI';
   ```
5. Klik **"Save"** (Ctrl+S atau Cmd+S)
6. Beri nama project: **"Karantina Ikan Bitung - Data Logger"**

### 3. Deploy sebagai Web App

1. Di Google Apps Script, klik **"Deploy"** > **"New deployment"**
2. Klik ikon **settings** (⚙️) di sebelah "Select type"
3. Pilih **"Web app"**
4. Isi konfigurasi:
   - **Description**: "Web app untuk menyimpan data hasil uji"
   - **Execute as**: "Me" (karantinaikanbitung@gmail.com)
   - **Who has access**: "Anyone" (atau "Anyone with Google account" untuk lebih aman)
5. Klik **"Deploy"**
6. **PENTING**: Authorize akses saat diminta:
   - Klik **"Authorize access"**
   - Pilih akun Google Anda
   - Klik **"Advanced"** > **"Go to [project name] (unsafe)"**
   - Klik **"Allow"**
7. Copy **Web App URL** yang muncul (format: `https://script.google.com/macros/s/.../exec`)

### 4. Konfigurasi di Website

1. Buka file **`google-sheets-config.js`**
2. Ganti `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` dengan Web App URL yang Anda copy:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Save file

### 5. Test Setup

1. Buka website dan isi form uji
2. Submit form
3. Cek Google Spreadsheet - data seharusnya muncul di sheet yang sesuai:
   - **Ikan Segar** → Sheet "Ikan_Segar"
   - **Kepiting** → Sheet "Kepiting"
   - **Gurita** → Sheet "Gurita"
   - **Kerang** → Sheet "Kerang"

## Struktur Data di Google Sheets

### Sheet "Ikan_Segar"
Kolom:
- Waktu Pengisian
- Jenis Uji
- Jenis Hewan
- Tanggal Uji
- Nama Petugas
- No. Sampel
- Kode Contoh Uji
- Tanggal Diterima
- Kode Contoh 1-6 (Total, Rata-rata, Detail Nilai untuk masing-masing)
- Catatan

### Sheet "Kepiting", "Gurita", "Kerang"
Kolom:
- Waktu Pengisian
- Jenis Uji
- Jenis Hewan
- Tanggal Uji
- Nama Petugas
- No. Sampel
- [Field lainnya sesuai form]
- Catatan

## Troubleshooting

### Data tidak muncul di Google Sheets

1. **Cek Console Browser**:
   - Buka Developer Tools (F12)
   - Lihat tab Console untuk error messages
   - Pastikan tidak ada error CORS atau network

2. **Cek Google Apps Script**:
   - Buka Google Apps Script
   - Klik **"Executions"** di menu kiri
   - Lihat apakah ada error saat eksekusi

3. **Cek Spreadsheet ID**:
   - Pastikan Spreadsheet ID di Google Apps Script benar
   - Pastikan spreadsheet bisa diakses dengan akun yang sama

4. **Cek Web App URL**:
   - Pastikan URL di `google-sheets-config.js` benar
   - Pastikan Web App sudah di-deploy dan authorized

5. **Cek Permission**:
   - Pastikan Web App di-deploy dengan akses "Anyone" atau "Anyone with Google account"
   - Pastikan spreadsheet bisa diakses oleh akun yang menjalankan script

### Error "Script function not found"

- Pastikan fungsi `doPost` dan `doGet` ada di Google Apps Script
- Pastikan kode sudah di-save sebelum deploy

### Error "Access denied"

- Pastikan sudah authorize akses saat deploy Web App
- Coba deploy ulang dan authorize lagi

## Catatan Penting

1. **Keamanan**: 
   - Untuk produksi, gunakan "Anyone with Google account" untuk akses Web App
   - Jangan share Web App URL secara publik

2. **Quota**:
   - Google Apps Script memiliki quota harian
   - Free tier: 20,000 requests/hari
   - Jika melebihi, upgrade ke Google Workspace

3. **Backup**:
   - Data juga tetap di-download sebagai file Excel lokal
   - Google Sheets berfungsi sebagai backup dan aggregasi data

4. **Update Script**:
   - Jika mengubah Google Apps Script, perlu **redeploy** dengan versi baru
   - Pilih "New version" saat redeploy

## Support

Jika mengalami masalah, cek:
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)





