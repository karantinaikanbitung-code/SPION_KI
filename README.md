<<<<<<< HEAD
# SPION_KI
=======
# Penilaian Uji - Local Website

Instruksi singkat untuk menjalankan versi lokal dari project ini.

1. Pastikan seluruh file ada di satu folder (sudah ada):
   - `index.html`, `kuisoner-login.html`, `kuisoner.html`, `kuisoner-home.html`, `kuisoner-style.css`, `kuisoner-script.js`, `kuisoner-login.js`, dll.

2. Jalankan server lokal dari folder proyek (direkomendasikan agar fitur download bekerja dan path relatif valid):

Windows / macOS / Linux (Python 3):

```bash
python -m http.server 8000
```

Lalu buka: http://localhost:8000/

3. Kredensial demo untuk login:
- Username: `admin123`
- Password: `12345678`

4. Catatan penting:
- Ekspor ke Excel menggunakan library SheetJS sudah disertakan di `kuisoner.html` via CDN.
- Untuk produksi, jangan menyimpan kredensial di client-side; gunakan server dan autentikasi aman.

Butuh saya: tambahkan fitur "show password", validasi tambahan, atau deploy ke GitHub Pages?

---

**Note:** LHU generation and upload features have been removed from this repository.
>>>>>>> 8463a96 (first deploy)
