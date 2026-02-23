# Website Sistem Penilaian Uji dengan Password Protection

Website sistem penilaian uji yang dapat diakses melalui handphone dengan fitur password protection dan export hasil ke Excel.

## Fitur

✅ **Password Protection** - Website hanya bisa dibuka dengan username dan password  
✅ **Responsive Design** - Tampilan optimal untuk handphone/mobile  
✅ **Multi-Level Navigation** - Login → Home → Jenis Uji → Form Penilaian  
✅ **3 Jenis Uji** - Organoleptik, Virologi, Mikrobiologi  
✅ **4 Jenis Hewan** - Ikan Segar, Kepiting, Gurita, Kerang  
✅ **Form Dinamis** - Form penilaian berbeda untuk setiap jenis uji  
✅ **Export ke Excel** - Hasil penilaian otomatis tersimpan dalam format Excel  
✅ **UI Modern** - Desain yang menarik dan user-friendly  

## Struktur Navigasi

```
Login (username + password)
    ↓
Halaman Utama (3 ikon jenis uji)
    ├── Uji Organoleptik
    ├── Uji Virologi
    └── Uji Mikrobiologi
        ↓
Halaman Pilih Hewan (4 ikon hewan)
    ├── Ikan Segar 🐟
    ├── Kepiting 🦀
    ├── Gurita 🐙
    └── Kerang 🦪
        ↓
Form Penilaian (berbeda untuk setiap jenis uji)
    ↓
Export ke Excel
```

## Cara Menggunakan

### 1. Login

Buka file `kuisoner-login.html` di browser.

**Kredensial:**
- Username: `admin123`
- Password: `12345678`

### 2. Pilih Jenis Uji

Setelah login, Anda akan melihat 3 ikon:
- **Uji Organoleptik** - Penilaian berdasarkan indera
- **Uji Virologi** - Pengujian untuk mendeteksi virus
- **Uji Mikrobiologi** - Pengujian untuk mendeteksi mikroorganisme

### 3. Pilih Jenis Hewan

Setelah memilih jenis uji, pilih salah satu dari 4 jenis hewan:
- Ikan Segar
- Kepiting
- Gurita
- Kerang

### 4. Isi Form Penilaian

Form akan berbeda tergantung jenis uji yang dipilih:

#### Uji Organoleptik
- Warna (Normal, Agak Pucat, Pucat, Tidak Normal)
- Bau (Segar, Agak Busuk, Busuk, Sangat Busuk)
- Tekstur (Elastis, Agak Lunak, Lunak, Sangat Lunak)
- Penampakan Umum (Baik, Cukup, Kurang, Buruk)
- Skor Keseluruhan (1-100)

#### Uji Virologi
- Hasil Uji (Positif/Negatif)
- Jenis Virus yang Terdeteksi
- Jumlah Virus (kopi/mL)
- Metode Uji
- Catatan Hasil

#### Uji Mikrobiologi
- Total Bakteri (CFU/g)
- E. Coli (MPN/g)
- Salmonella (CFU/g)
- Status Mikroba (Aman, Tidak Aman, Perlu Perhatian)
- Metode Uji

### 5. Simpan Hasil

Klik "Simpan Hasil Uji" untuk menyimpan data ke Excel. File akan otomatis terdownload dengan format:
`[Jenis_Uji]_[Jenis_Hewan]_[Timestamp].xlsx`

## Struktur File

- `kuisoner-login.html` - Halaman login
- `kuisoner-login.js` - Logika autentikasi
- `kuisoner-home.html` - Halaman utama dengan 3 ikon jenis uji
- `kuisoner-jenis-uji.html` - Halaman pilih hewan (4 ikon)
- `kuisoner-form.html` - Form penilaian dinamis
- `kuisoner-form-script.js` - Logika form dan export Excel
- `kuisoner-style.css` - Styling untuk semua halaman

## Mengubah Kredensial Login

Edit file `kuisoner-login.js`:

```javascript
const CORRECT_USERNAME = "admin123";  // Ganti username di sini
const CORRECT_PASSWORD = "12345678";  // Ganti password di sini
```

## Format Excel Output

File Excel yang dihasilkan berisi kolom:
- Jenis Uji
- Jenis Hewan
- Waktu Pengisian
- Tanggal Uji
- Nama Petugas
- No. Sampel
- Field-field penilaian sesuai jenis uji
- Catatan Tambahan

## Catatan Penting

⚠️ **Keamanan Password**: Kredensial disimpan di client-side (JavaScript). Untuk keamanan yang lebih tinggi, disarankan menggunakan backend server.

⚠️ **Session Storage**: Autentikasi menggunakan `sessionStorage`, artinya akan hilang saat browser ditutup.

## Teknologi yang Digunakan

- HTML5
- CSS3 (dengan gradient dan animasi)
- JavaScript (Vanilla JS)
- SheetJS (xlsx.js) untuk export Excel

## Browser Support

Website ini kompatibel dengan browser modern:
- Chrome/Edge (disarankan)
- Firefox
- Safari
- Opera

## Cara Menjalankan

### Opsi 1: Langsung Buka File
Buka `kuisoner-login.html` langsung di browser (file://)

### Opsi 2: Menggunakan Web Server (Disarankan)
Untuk pengalaman terbaik, gunakan web server lokal:

**Python:**
```bash
python -m http.server 8000
```
Lalu buka: `http://localhost:8000/kuisoner-login.html`

**Node.js (http-server):**
```bash
npx http-server
```

**PHP:**
```bash
php -S localhost:8000
```

## Alur Penggunaan

1. **Login** → Masukkan username dan password
2. **Pilih Jenis Uji** → Klik salah satu dari 3 ikon
3. **Pilih Hewan** → Klik salah satu dari 4 ikon hewan
4. **Isi Form** → Lengkapi semua field yang wajib
5. **Simpan** → Klik "Simpan Hasil Uji" untuk export ke Excel
6. **Selesai** → File Excel akan terdownload otomatis

## Fitur Tambahan

- **Tombol Kembali** - Kembali ke halaman sebelumnya
- **Tombol Keluar** - Logout dari sistem
- **Reset Form** - Reset semua field yang telah diisi
- **Validasi Form** - Form tidak bisa disubmit jika ada field wajib yang kosong
- **Auto-fill Tanggal** - Tanggal uji otomatis terisi dengan tanggal hari ini
