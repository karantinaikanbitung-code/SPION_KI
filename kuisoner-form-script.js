// Cek autentikasi sebelum mengizinkan akses
document.addEventListener('DOMContentLoaded', function () {
    // Jika belum login, redirect ke halaman login
    if (sessionStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'kuisoner-login.html';
        return;
    }

    // Ambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const jenisUji = urlParams.get('jenis');
    const hewan = urlParams.get('hewan');

    // Only run this check if we are on the form page (penilaianForm exists)
    const penilaianForm = document.getElementById('penilaianForm');
    if (penilaianForm) {
        if (!jenisUji || !hewan) {
            alert('Parameter tidak valid!');
            window.location.href = 'kuisoner-home.html';
            return;
        }

        // Set tanggal hari ini sebagai default
        const tanggalUji = document.getElementById('tanggalUji');
        if (tanggalUji && !tanggalUji.value) {
            const today = new Date().toISOString().split('T')[0];
            tanggalUji.value = today;
        }
    }

    // Set judul form
    const jenisUjiNames = {
        'organoleptik': 'Uji Organoleptik',
        'virologi': 'Uji Virologi',
        'mikrobiologi': 'Uji Mikrobiologi'
    };

    const hewanNames = {
        'ikan-segar': 'Ikan Segar',
        'ikan-beku': 'Ikan Beku',
        'ikan-tuna-kaleng': 'Ikan Tuna Kaleng'
    };

    if (penilaianForm) {
        document.getElementById('formTitle').textContent = `${jenisUjiNames[jenisUji]} - ${hewanNames[hewan]}`;
        document.getElementById('penilaianTitle').textContent = `Penilaian ${jenisUjiNames[jenisUji]}`;

        // Generate form fields berdasarkan jenis uji
        generateFormFields(jenisUji, hewan);

        // Handle form submission
        const form = document.getElementById('penilaianForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                handleFormSubmit(jenisUji, hewan);
            });
        }

        // Event listener untuk nama panelis
        const namaPetugasSelect = document.getElementById('namaPetugas');
        if (namaPetugasSelect) {
            namaPetugasSelect.addEventListener('change', updatePanelistQRCode);
        }
    }
});

function updatePanelistQRCode() {
    const namaPanelis = document.getElementById('namaPetugas').value;
    const qrContainer = document.getElementById('qrcode-container');

    if (qrContainer) {
        qrContainer.innerHTML = ''; // Hapus QR code sebelumnya
        if (namaPanelis && namaPanelis.trim() !== "") {
            try {
                // Pastikan QRCode library tersedia
                if (typeof QRCode !== 'undefined') {
                    new QRCode(qrContainer, {
                        text: namaPanelis,
                        width: 100,
                        height: 100,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                } else {
                    console.error("QRCode library belum dimuat");
                }
            } catch (e) {
                console.error("Gagal membuat QR Code:", e);
                qrContainer.textContent = "Error loading QR Code";
            }
        }
    }
}

function generateFormFields(jenisUji, hewan) {
    const container = document.getElementById('penilaianFields');
    container.innerHTML = '';
    // Ensure catatan shown by default; some hewan (e.g., ikan-segar, ikan-beku) will hide it
    const catatanSectionEl = document.getElementById('catatanSection');
    if (catatanSectionEl) catatanSectionEl.style.display = 'block';

    if (hewan === 'ikan-segar' || hewan === 'ikan-beku' || hewan === 'ikan-tuna-kaleng') {
        if (catatanSectionEl) catatanSectionEl.style.display = 'none';
    }

    // Form fields berdasarkan jenis uji
    if (jenisUji === 'organoleptik') {
        generateOrganoleptikFields(container, hewan);
    } else if (jenisUji === 'virologi') {
        generateVirologiFields(container, hewan);
    } else if (jenisUji === 'mikrobiologi') {
        generateMikrobiologiFields(container, hewan);
    }
}

function generateOrganoleptikFields(container, hewan) {
    // Jika ikan segar, buat tabel khusus
    if (hewan === 'ikan-segar') {
        generateIkanSegarTable(container);
        return;
    }

    // Jika ikan beku, buat tabel khusus
    if (hewan === 'ikan-beku') {
        generateIkanBekuTable(container);
        return;
    }

    // Jika ikan tuna kaleng, buat tabel khusus
    if (hewan === 'ikan-tuna-kaleng') {
        generateIkanTunaKalengTable(container);
        return;
    }

    const fields = [
        {
            type: 'radio',
            name: 'warna',
            label: 'Warna',
            options: ['Normal', 'Agak Pucat', 'Pucat', 'Tidak Normal'],
            required: true
        },
        {
            type: 'radio',
            name: 'bau',
            label: 'Bau',
            options: ['Segar', 'Agak Busuk', 'Busuk', 'Sangat Busuk'],
            required: true
        },
        {
            type: 'radio',
            name: 'tekstur',
            label: 'Tekstur',
            options: ['Elastis', 'Agak Lunak', 'Lunak', 'Sangat Lunak'],
            required: true
        },
        {
            type: 'radio',
            name: 'penampakan',
            label: 'Penampakan Umum',
            options: ['Baik', 'Cukup', 'Kurang', 'Buruk'],
            required: true
        },
        {
            type: 'number',
            name: 'skor',
            label: 'Skor Keseluruhan (1-100)',
            min: 1,
            max: 100,
            required: true
        }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.innerHTML = `${field.label} ${field.required ? '<span class="required">*</span>' : ''}`;
        div.appendChild(label);

        if (field.type === 'radio') {
            const radioGroup = document.createElement('div');
            radioGroup.className = 'radio-group';
            field.options.forEach(option => {
                const radioLabel = document.createElement('label');
                radioLabel.className = 'radio-label';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = field.name;
                radio.value = option;
                if (field.required) radio.required = true;
                const span = document.createElement('span');
                span.textContent = option;
                radioLabel.appendChild(radio);
                radioLabel.appendChild(span);
                radioGroup.appendChild(radioLabel);
            });
            div.appendChild(radioGroup);
        } else if (field.type === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.name = field.name;
            input.id = field.name;
            input.min = field.min;
            input.max = field.max;
            if (field.required) input.required = true;
            div.appendChild(input);
        }

        container.appendChild(div);
    });
}

function generateIkanSegarTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-segar-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR IKAN SEGAR</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Kode Contoh Uji /No. Aju PTK :</label>
            <input type="text" id="kodeContohUji" name="kodeContohUji" style="width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">2. Tgl. Diterima Contoh Uji :</label>
            <input type="date" id="tglDiterima" name="tglDiterima" style="width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">NO</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">JENIS CONTOH UJI</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">JUMLAH</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">UKURAN</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Ket.</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1.</td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Ikan Segar" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda √ pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);
    // Hide catatan section for Ikan Segar and setup QR/barcode syncing with nama panelis
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';



    // Data untuk tabel penilaian
    const penilaianData = [
        {
            kategori: '1. Penampakan',
            subKategori: 'a. Mata',
            items: [
                { desc: 'Cerah, bola mata menonjol, kornea jernih, kornea dan pupil jernih, mengkilap spesifik jenis ikan.', nilai: 9 },
                { desc: 'Bola mata rata, kornea agak keruh dan pupil agak keabu-abuan, agak mengkilap specifik jenis ikan', nilai: 7 },
                { desc: 'Bola mata cekung, kornea keruh dan pupil keabu-abuan tidak mengkilap specefik jenis ikan.', nilai: 5 }
            ]
        },
        {
            kategori: '1. Penampakan',
            subKategori: 'b. Insang',
            items: [
                { desc: 'Warna insang merah darah atau merah kecoklatan dengan sedikit lender agak keruh', nilai: 9 },
                { desc: 'Warna insang merah tua atau coklat kemerahan, cemerlang dengan sedikit sekali lender transparan.', nilai: 7 },
                { desc: 'Warna Insang abu-abu atau coklat abu-abu dengan lendir keruh.', nilai: 5 }
            ]
        },
        {
            kategori: '1. Penampakan',
            subKategori: 'c. Lendir permukaan badan',
            items: [
                { desc: 'Lapisan lendir jernih, transparan, mengkilap cerah.', nilai: 9 },
                { desc: 'Lapisan lendir mulai agak keruh', nilai: 7 },
                { desc: 'Lapisan lendir tebal, untuk ikan air laut dan berubah warna', nilai: 5 }
            ]
        },
        {
            kategori: '2. Daging',
            subKategori: '',
            items: [
                { desc: 'Sayatan daging sangat cemerlang spesifik jenis, jaringan daging sangat kuat.', nilai: 9 },
                { desc: 'Sayatan daging kurang cemerlang, jaringan daging sangat kuat', nilai: 7 },
                { desc: 'Sayatan daging mulai pudar, jaringan daging kurang kuat', nilai: 5 }
            ]
        },
        {
            kategori: '3. Bau',
            subKategori: '',
            items: [
                { desc: 'Bau Segar, spesifik jenis kuat', nilai: 9 },
                { desc: 'Bau Segar, spesifik jenis kurang', nilai: 7 },
                { desc: 'Netral, bau asam', nilai: 5 }
            ]
        },
        {
            kategori: '4. Tekstur',
            subKategori: '',
            items: [
                { desc: 'Padat kompak', nilai: 9 },
                { desc: 'Padat, kurang kompak', nilai: 7 },
                { desc: 'Kurang padat, tidak kompak', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'ikan-segar-table';
    table.id = 'ikanSegarTable';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 200px;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 80px;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5;">Kode Contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    // Body tabel
    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    penilaianData.forEach((section, sectionIndex) => {
        section.items.forEach((item, itemIndex) => {
            const row = document.createElement('tr');
            row.dataset.nilai = item.nilai;
            row.dataset.rowIndex = rowIndex;

            // Kolom Spesifikasi
            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '10px';
            specCell.style.verticalAlign = 'top';

            let specText = '';
            if (itemIndex === 0) {
                specText = '<strong>' + section.kategori + '</strong>';
                if (section.subKategori) {
                    specText += '<br><strong>' + section.subKategori + '</strong>';
                }
                specText += '<br>';
            }
            specText += item.desc;
            specCell.innerHTML = specText;
            row.appendChild(specCell);

            // Kolom Nilai
            const nilaiCell = document.createElement('td');
            nilaiCell.style.border = '1px solid #ddd';
            nilaiCell.style.padding = '10px';
            nilaiCell.style.textAlign = 'center';
            nilaiCell.style.fontWeight = '600';
            nilaiCell.textContent = item.nilai;
            row.appendChild(nilaiCell);

            // Kolom Kode Contoh (1-6)
            for (let kode = 1; kode <= 6; kode++) {
                const kodeCell = document.createElement('td');
                kodeCell.className = 'kode-contoh-cell';
                kodeCell.dataset.kode = kode;
                kodeCell.dataset.rowIndex = rowIndex;
                kodeCell.dataset.nilai = item.nilai;
                kodeCell.style.border = '1px solid #ddd';
                kodeCell.style.padding = '10px';
                kodeCell.style.textAlign = 'center';
                kodeCell.style.cursor = 'pointer';
                kodeCell.style.minHeight = '40px';
                kodeCell.style.position = 'relative';

                // Checkbox tersembunyi
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.dataset.sectionIndex = sectionIndex;
                checkbox.style.display = 'none';

                kodeCell.appendChild(checkbox);

                // Event listener untuk klik pada cell
                kodeCell.addEventListener('click', function (e) {
                    // Jangan trigger jika klik langsung pada checkbox
                    if (e.target === checkbox || e.target.type === 'checkbox') {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle checkbox logic with exclusivity (1 per section)
                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        // Uncheck others in the same section and column
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;

                    // Update tampilan
                    updateCheckmark(kodeCell, newCheckedState);

                    // Hitung ulang total dan rata-rata setelah sedikit delay untuk memastikan DOM ter-update
                    setTimeout(() => {
                        calculateTotals();
                    }, 10);
                });

                // Event listener untuk perubahan checkbox (backup)
                checkbox.addEventListener('change', function (e) {
                    e.stopPropagation();
                    updateCheckmark(kodeCell, checkbox.checked);
                    setTimeout(() => {
                        calculateTotals();
                    }, 10);
                });

                row.appendChild(kodeCell);
            }

            tbody.appendChild(row);
            rowIndex++;
        });
    });

    // Baris Total
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>
    `;
    for (let kode = 1; kode <= 6; kode++) {
        const totalCell = document.createElement('td');
        totalCell.className = 'total-cell';
        totalCell.dataset.kode = kode;
        totalCell.style.border = '1px solid #ddd';
        totalCell.style.padding = '10px';
        totalCell.style.textAlign = 'center';
        totalCell.style.fontWeight = '600';
        totalCell.style.background = '#f9f9f9';
        totalCell.textContent = '0';
        totalRow.appendChild(totalCell);
    }
    tbody.appendChild(totalRow);

    // Baris Rata-rata
    const avgRow = document.createElement('tr');
    avgRow.className = 'avg-row';
    avgRow.innerHTML = `
        <td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>
    `;
    for (let kode = 1; kode <= 6; kode++) {
        const avgCell = document.createElement('td');
        avgCell.className = 'avg-cell';
        avgCell.dataset.kode = kode;
        avgCell.style.border = '1px solid #ddd';
        avgCell.style.padding = '10px';
        avgCell.style.textAlign = 'center';
        avgCell.style.fontWeight = '600';
        avgCell.style.background = '#f0f0f0';
        avgCell.textContent = '0.00';
        avgRow.appendChild(avgCell);
    }
    tbody.appendChild(avgRow);

    table.appendChild(tbody);

    // Wrap table in scrollable container for mobile
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tglDiterima = document.getElementById('tglDiterima');
    if (tglDiterima && !tglDiterima.value) {
        const today = new Date().toISOString().split('T')[0];
        tglDiterima.value = today;
    }

    // Inisialisasi perhitungan setelah tabel selesai di-render
    // Gunakan requestAnimationFrame untuk memastikan DOM sudah ter-render
    requestAnimationFrame(() => {
        setTimeout(() => {
            calculateTotals();
        }, 50);
    });

    // Tambahkan tombol LHU ke .form-actions
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
        // Hapus tombol preview lama jika ada
        const oldBtn = formActions.querySelector('.btn-lhu');
        if (oldBtn) oldBtn.remove();

        const lhuButton = document.createElement('button');
        lhuButton.type = 'button';
        lhuButton.className = 'btn-lhu';
        lhuButton.textContent = 'Lihat LHU (Laporan Hasil Uji)';
        lhuButton.style.padding = '12px 24px';
        lhuButton.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        lhuButton.style.color = 'white';
        lhuButton.style.border = 'none';
        lhuButton.style.borderRadius = '10px';
        lhuButton.style.fontSize = '16px';
        lhuButton.style.fontWeight = '600';
        lhuButton.style.cursor = 'pointer';
        lhuButton.style.transition = 'all 0.3s';
        lhuButton.style.marginRight = '10px'; // Spacing logic

        lhuButton.onmouseover = function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 20px rgba(67, 233, 123, 0.3)';
        };
        lhuButton.onmouseout = function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };

        lhuButton.addEventListener('click', async function (e) {
            try {
                this.disabled = true;
                await showLHUPreview();
            } catch (err) {
                console.error('showLHUPreview error', err);
                alert('Gagal membuka preview: ' + (err && err.message ? err.message : err));
            } finally {
                this.disabled = false;
            }
        });

        // Insert as first child (replacing Save button position)
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    // Container untuk QR Code (Pojok kanan bawah, di bawah tombol LHU)
    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end'; // Pojok kanan
    qrWrapper.style.paddingRight = '10px';

    const qrContainer = document.createElement('div');
    qrContainer.id = 'qrcode-container';
    qrContainer.style.padding = '10px';
    qrContainer.style.backgroundColor = '#fff';
    qrContainer.style.borderRadius = '8px';
    // qrContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

    qrWrapper.appendChild(qrContainer);
    container.appendChild(qrWrapper);

    // Update QR Code jika nama sudah dipilih
    setTimeout(updatePanelistQRCode, 300);



}


function generateIkanBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR IKAN BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Kode Contoh Uji /No. Aju PTK :</label>
            <input type="text" id="kodeContohUji" name="kodeContohUji" style="width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">2. Tgl. Diterima Contoh Uji :</label>
            <input type="date" id="tglDiterima" name="tglDiterima" style="width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">NO</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">JENIS CONTOH UJI</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">JUMLAH</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">UKURAN</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Ket.</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1.</td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Ikan Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
            <p style="margin: 5px 0;">• Cantumkan kode contoh pada kolom yang tersedia sebelum melakukan pengujian.</p>
            <p style="margin: 5px 0;">• Berilah tanda ✓ pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
        </div>
    `;
    container.appendChild(headerDiv);

    // Data untuk tabel penilaian
    const penilaianData = [
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '1. Kenampakan (khusus untuk frozen block)',
            items: [
                { desc: 'Rata, bening, pada seluruh permukaan dilapisi es', nilai: 9 },
                { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%', nilai: 7 },
                { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang lebih 50%', nilai: 5 }
            ]
        },
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 },
                { desc: 'Pengeringan pada permukaan produk kurang lebih 30%', nilai: 7 },
                { desc: 'Pengeringan pada permukaan produk kurang lebih 50%', nilai: 5 }
            ]
        },
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 },
                { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%', nilai: 7 },
                { desc: 'Perubahan warna pada permukaan produk kurang lebih 50%', nilai: 5 }
            ]
        },
        {
            kategori: 'B. Sesudah pelelehan (thawing)',
            subKategori: '1. Kenampakan',
            items: [
                { desc: 'Sangat cemerlang spesifik jenis', nilai: 9 },
                { desc: 'Cemerlang', nilai: 7 },
                { desc: 'Mulai kusam', nilai: 5 }
            ]
        },
        {
            kategori: 'B. Sesudah pelelehan (thawing)',
            subKategori: '2. Bau',
            items: [
                { desc: 'Segar, spesifik jenis', nilai: 9 },
                { desc: 'Segar mengarah ke netral', nilai: 7 },
                { desc: 'Mulai tercium bau amonia', nilai: 5 }
            ]
        },
        {
            kategori: 'B. Sesudah pelelehan (thawing)',
            subKategori: '3. Daging',
            items: [
                { desc: 'Sayatan daging sangat cemerlang', nilai: 9 },
                { desc: 'Sayatan daging cemerlang', nilai: 7 },
                { desc: 'Sayatan daging mulai kusam', nilai: 5 }
            ]
        },
        {
            kategori: 'B. Sesudah pelelehan (thawing)',
            subKategori: '4. Tekstur',
            items: [
                { desc: 'Kompak, sangat elastis', nilai: 9 },
                { desc: 'Kompak, elastis', nilai: 7 },
                { desc: 'Mulai lunak', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'ikan-beku-table';
    table.id = 'ikanBekuTable';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 200px;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 80px;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5;">Kode contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    // Body tabel
    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    penilaianData.forEach((section, sectionIndex) => {
        section.items.forEach((item, itemIndex) => {
            const currentRowIndex = rowIndex;
            const row = document.createElement('tr');
            row.dataset.nilai = item.nilai;
            row.dataset.rowIndex = rowIndex;

            // Kolom Spesifikasi
            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '10px';
            specCell.style.verticalAlign = 'top';

            let specText = '';
            if (itemIndex === 0) {
                specText = '<strong>' + section.kategori + '</strong>';
                if (section.subKategori) {
                    specText += '<br><strong>' + section.subKategori + '</strong>';
                }
                specText += '<br>';
            }
            specText += item.desc;
            specCell.innerHTML = specText;
            row.appendChild(specCell);

            // Kolom Nilai
            const nilaiCell = document.createElement('td');
            nilaiCell.style.border = '1px solid #ddd';
            nilaiCell.style.padding = '10px';
            nilaiCell.style.textAlign = 'center';
            nilaiCell.style.fontWeight = '600';
            nilaiCell.textContent = item.nilai;
            row.appendChild(nilaiCell);

            // Kolom Kode Contoh (1-6)
            for (let kode = 1; kode <= 6; kode++) {
                const kodeCell = document.createElement('td');
                kodeCell.className = 'kode-contoh-cell';
                kodeCell.dataset.kode = kode;
                kodeCell.dataset.rowIndex = rowIndex;
                kodeCell.dataset.nilai = item.nilai;
                kodeCell.style.border = '1px solid #ddd';
                kodeCell.style.padding = '10px';
                kodeCell.style.textAlign = 'center';
                kodeCell.style.cursor = 'pointer';
                kodeCell.style.minHeight = '40px';
                kodeCell.style.position = 'relative';

                // Checkbox tersembunyi
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';

                kodeCell.appendChild(checkbox);

                // Event listener untuk klik pada cell
                kodeCell.addEventListener('click', function (e) {
                    // Jangan trigger jika klik langsung pada checkbox
                    if (e.target === checkbox || e.target.type === 'checkbox') {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle checkbox logic with exclusivity (1 per section)
                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        // Uncheck others in the same "group of 3" (based on rowIndex)
                        const groupStart = Math.floor(currentRowIndex / 3) * 3;
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]`);
                        siblings.forEach(sib => {
                            const sibRowIndex = parseInt(sib.dataset.rowIndex);
                            if (sibRowIndex >= groupStart && sibRowIndex < groupStart + 3 && sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;

                    // Update tampilan
                    updateCheckmark(kodeCell, newCheckedState);

                    // Hitung ulang total dan rata-rata setelah sedikit delay untuk memastikan DOM ter-update
                    setTimeout(() => {
                        calculateTotalsBeku();
                    }, 10);
                });

                // Event listener untuk perubahan checkbox (backup)
                checkbox.addEventListener('change', function (e) {
                    e.stopPropagation();
                    if (this.checked) {
                        const groupStart = Math.floor(currentRowIndex / 3) * 3;
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]`);
                        siblings.forEach(sib => {
                            const sibRowIndex = parseInt(sib.dataset.rowIndex);
                            if (sibRowIndex >= groupStart && sibRowIndex < groupStart + 3 && sib !== this && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    updateCheckmark(kodeCell, this.checked);
                    setTimeout(() => {
                        calculateTotalsBeku();
                    }, 10);
                });

                row.appendChild(kodeCell);
            }

            tbody.appendChild(row);
            rowIndex++;
        });
    });

    // Baris Total
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>
    `;
    for (let kode = 1; kode <= 5; kode++) {
        const totalCell = document.createElement('td');
        totalCell.className = 'total-cell';
        totalCell.dataset.kode = kode;
        totalCell.style.border = '1px solid #ddd';
        totalCell.style.padding = '10px';
        totalCell.style.textAlign = 'center';
        totalCell.style.fontWeight = '600';
        totalCell.style.background = '#f9f9f9';
        totalCell.textContent = '0';
        totalRow.appendChild(totalCell);
    }
    tbody.appendChild(totalRow);

    // Baris Rata-rata
    const avgRow = document.createElement('tr');
    avgRow.className = 'avg-row';
    avgRow.innerHTML = `
        <td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>
    `;
    for (let kode = 1; kode <= 5; kode++) {
        const avgCell = document.createElement('td');
        avgCell.className = 'avg-cell';
        avgCell.dataset.kode = kode;
        avgCell.style.border = '1px solid #ddd';
        avgCell.style.padding = '10px';
        avgCell.style.textAlign = 'center';
        avgCell.style.fontWeight = '600';
        avgCell.style.background = '#f0f0f0';
        avgCell.textContent = '0.00';
        avgRow.appendChild(avgCell);
    }
    tbody.appendChild(avgRow);

    table.appendChild(tbody);

    // Wrap table in scrollable container for mobile
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tanggalPanelis = document.getElementById('tanggalPanelis');
    if (tanggalPanelis && !tanggalPanelis.value) {
        const today = new Date().toISOString().split('T')[0];
        tanggalPanelis.value = today;
    }

    // Ensure total/avg rows include a cell for kode #6 (in case header has 6 kode columns)
    (function ensureBekuColumn6() {
        try {
            const tableBeku = document.getElementById('ikanBekuTable');
            if (!tableBeku) return;
            const kodeThs = tableBeku.querySelectorAll('thead tr:last-child th');
            const kodeCount = kodeThs ? kodeThs.length : 0;
            if (kodeCount < 6) return;
            const totalRowEl = tableBeku.querySelector('tr.total-row');
            const avgRowEl = tableBeku.querySelector('tr.avg-row');
            if (totalRowEl && !totalRowEl.querySelector('td.total-cell[data-kode="6"]')) {
                const totalCell = document.createElement('td');
                totalCell.className = 'total-cell';
                totalCell.dataset.kode = 6;
                totalCell.style.border = '1px solid #ddd';
                totalCell.style.padding = '10px';
                totalCell.style.textAlign = 'center';
                totalCell.style.fontWeight = '600';
                totalCell.style.background = '#f9f9f9';
                totalCell.textContent = '0';
                totalRowEl.appendChild(totalCell);
            }
            if (avgRowEl && !avgRowEl.querySelector('td.avg-cell[data-kode="6"]')) {
                const avgCell = document.createElement('td');
                avgCell.className = 'avg-cell';
                avgCell.dataset.kode = 6;
                avgCell.style.border = '1px solid #ddd';
                avgCell.style.padding = '10px';
                avgCell.style.textAlign = 'center';
                avgCell.style.fontWeight = '600';
                avgCell.style.background = '#f0f0f0';
                avgCell.textContent = '0.00';
                avgRowEl.appendChild(avgCell);
            }
        } catch (e) { console.warn('ensureBekuColumn6 failed', e); }
    })();

    // Inisialisasi perhitungan setelah tabel selesai di-render
    requestAnimationFrame(() => {
        setTimeout(() => {
            calculateTotalsBeku();
        }, 50);
    });

    // Tambahkan tombol LHU ke .form-actions
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
        // Hapus tombol preview lama jika ada
        const oldBtn = formActions.querySelector('.btn-lhu');
        if (oldBtn) oldBtn.remove();

        const lhuButton = document.createElement('button');
        lhuButton.type = 'button';
        lhuButton.className = 'btn-lhu';
        lhuButton.textContent = 'Lihat LHU (Laporan Hasil Uji)';
        lhuButton.style.padding = '12px 24px';
        lhuButton.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        lhuButton.style.color = 'white';
        lhuButton.style.border = 'none';
        lhuButton.style.borderRadius = '10px';
        lhuButton.style.fontSize = '16px';
        lhuButton.style.fontWeight = '600';
        lhuButton.style.cursor = 'pointer';
        lhuButton.style.transition = 'all 0.3s';
        lhuButton.style.marginRight = '10px';

        lhuButton.onmouseover = function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 20px rgba(67, 233, 123, 0.3)';
        };
        lhuButton.onmouseout = function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };

        lhuButton.addEventListener('click', async function (e) {
            try {
                this.disabled = true;
                await showLHUPreview();
            } catch (err) {
                console.error('showLHUPreview error', err);
                alert('Gagal membuka preview: ' + (err && err.message ? err.message : err));
            } finally {
                this.disabled = false;
            }
        });

        // Insert as first child (replacing Save button position)
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    // Container untuk QR Code (Pojok kanan bawah, di bawah tombol LHU)
    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end'; // Pojok kanan
    qrWrapper.style.paddingRight = '10px';

    const qrContainer = document.createElement('div');
    qrContainer.id = 'qrcode-container';
    qrContainer.style.padding = '10px';
    qrContainer.style.backgroundColor = '#fff';
    qrContainer.style.borderRadius = '8px';

    qrWrapper.appendChild(qrContainer);
    container.appendChild(qrWrapper);

    // Update QR Code jika nama sudah dipilih
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsBeku() {
    const table = document.getElementById('ikanBekuTable');
    if (!table) {
        return;
    }

    // Hitung total dan rata-rata untuk setiap kode contoh (1-6)
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        let count = 0;

        // Cari semua checkbox untuk kode contoh ini (baik yang checked maupun tidak)
        const allCheckboxes = table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]`);

        // Hitung total dan jumlah dari checkbox yang dicentang
        allCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const nilaiStr = checkbox.getAttribute('data-nilai');
                const nilai = parseInt(nilaiStr);
                if (!isNaN(nilai) && nilai > 0) {
                    total += nilai;
                    count++;
                }
            }
        });

        // Update total - cari dengan berbagai cara untuk memastikan ditemukan
        let totalCell = table.querySelector(`td.total-cell[data-kode="${kode}"]`);
        if (!totalCell) {
            totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        }
        if (totalCell) {
            totalCell.textContent = total.toString();
            totalCell.style.color = '#667eea';
            totalCell.style.fontWeight = '600';
        }

        // Update rata-rata
        let avgCell = table.querySelector(`td.avg-cell[data-kode="${kode}"]`);
        if (!avgCell) {
            avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        }
        if (avgCell) {
            const avg = count > 0 ? (total / count).toFixed(2) : '0.00';
            avgCell.textContent = avg;
            avgCell.style.color = '#667eea';
            avgCell.style.fontWeight = '600';
        }
    }
}

function generateIkanTunaKalengTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-tuna-kaleng-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR IKAN TUNA KALENG</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Kode Contoh Uji /No. Aju PTK :</label>
            <input type="text" id="kodeContohUji" name="kodeContohUji" style="width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">2. Tgl. Diterima Contoh Uji :</label>
            <input type="date" id="tglDiterima" name="tglDiterima" style="width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">NO</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">JENIS CONTOH UJI</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">JUMLAH</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">UKURAN</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Ket.</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1.</td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Ikan Tuna Kaleng" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda √ pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Data untuk tabel penilaian
    const penilaianData = [
        {
            kategori: '1. Aroma',
            subKategori: '',
            items: [
                { desc: 'Aroma sangat kuat sesuai spesifikasi produk', nilai: 9 },
                { desc: 'Aroma kuat sesuai spesifikasi produk', nilai: 7 },
                { desc: 'Mulai tercium aroma yang menyimpang (tengik/sulfida/amoniak)', nilai: 5 }
            ]
        },
        {
            kategori: '2. Rasa',
            subKategori: '',
            items: [
                { desc: 'Sangat sesuai spesifikasi produk', nilai: 9 },
                { desc: 'Sesuai spesifikasi produk', nilai: 7 },
                { desc: 'Terdapat rasa yang tidak sesuai spesifikasi produk (pahit/masam)', nilai: 5 }
            ]
        },
        {
            kategori: '3. Tekstur',
            subKategori: '',
            items: [
                { desc: 'Sangat kompak sesuai spesifikasi produk', nilai: 9 },
                { desc: 'Kompak sesuai spesifikasi produk', nilai: 7 },
                { desc: 'Kurang kompak', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'ikan-tuna-kaleng-table';
    table.id = 'ikanTunaKalengTable';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 200px;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 80px;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5;">Kode contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 60px;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    // Body tabel
    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    penilaianData.forEach((section, sectionIndex) => {
        section.items.forEach((item, itemIndex) => {
            const currentRowIndex = rowIndex;
            const row = document.createElement('tr');
            row.dataset.nilai = item.nilai;
            row.dataset.rowIndex = currentRowIndex;

            // Kolom Spesifikasi
            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '10px';
            specCell.style.verticalAlign = 'top';

            let specText = '';
            if (itemIndex === 0) {
                specText = '<strong>' + section.kategori + '</strong>';
                if (section.subKategori) {
                    specText += '<br><strong>' + section.subKategori + '</strong>';
                }
                specText += '<br>';
            }
            specText += item.desc;
            specCell.innerHTML = specText;
            row.appendChild(specCell);

            // Kolom Nilai
            const nilaiCell = document.createElement('td');
            nilaiCell.style.border = '1px solid #ddd';
            nilaiCell.style.padding = '10px';
            nilaiCell.style.textAlign = 'center';
            nilaiCell.style.fontWeight = '600';
            nilaiCell.textContent = item.nilai;
            row.appendChild(nilaiCell);

            // Kolom Kode Contoh (1-6)
            for (let kode = 1; kode <= 6; kode++) {
                const kodeCell = document.createElement('td');
                kodeCell.className = 'kode-contoh-cell';
                kodeCell.dataset.kode = kode;
                kodeCell.dataset.rowIndex = currentRowIndex;
                kodeCell.dataset.nilai = item.nilai;
                kodeCell.style.border = '1px solid #ddd';
                kodeCell.style.padding = '10px';
                kodeCell.style.textAlign = 'center';
                kodeCell.style.cursor = 'pointer';
                kodeCell.style.minHeight = '40px';
                kodeCell.style.position = 'relative';

                // Checkbox tersembunyi
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = currentRowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';

                kodeCell.appendChild(checkbox);

                // Event listener untuk klik pada cell
                kodeCell.addEventListener('click', function (e) {
                    // Jangan trigger jika klik langsung pada checkbox
                    if (e.target === checkbox || e.target.type === 'checkbox') {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle checkbox
                    const newCheckedState = !checkbox.checked;

                    if (newCheckedState) {
                        // Hanya satu ceklis per 3 baris
                        const groupStart = Math.floor(currentRowIndex / 3) * 3;
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]`);
                        siblings.forEach(sibling => {
                            const sibIndex = parseInt(sibling.dataset.rowIndex);
                            if (sibIndex >= groupStart && sibIndex < groupStart + 3 && sibling !== checkbox) {
                                if (sibling.checked) {
                                    sibling.checked = false;
                                    const sibCell = sibling.parentElement;
                                    updateCheckmark(sibCell, false);
                                }
                            }
                        });
                    }

                    checkbox.checked = newCheckedState;

                    // Update tampilan
                    updateCheckmark(kodeCell, newCheckedState);

                    // Hitung ulang total dan rata-rata setelah sedikit delay untuk memastikan DOM ter-update
                    setTimeout(() => {
                        calculateTotalsTunaKaleng();
                    }, 10);
                });

                // Event listener untuk perubahan checkbox (backup)
                checkbox.addEventListener('change', function (e) {
                    e.stopPropagation();
                    if (checkbox.checked) {
                        // Hanya satu ceklis per 3 baris
                        const groupStart = Math.floor(currentRowIndex / 3) * 3;
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]`);
                        siblings.forEach(sibling => {
                            const sibIndex = parseInt(sibling.dataset.rowIndex);
                            if (sibIndex >= groupStart && sibIndex < groupStart + 3 && sibling !== checkbox) {
                                if (sibling.checked) {
                                    sibling.checked = false;
                                    const sibCell = sibling.parentElement;
                                    updateCheckmark(sibCell, false);
                                }
                            }
                        });
                    }
                    updateCheckmark(kodeCell, checkbox.checked);
                    setTimeout(() => {
                        calculateTotalsTunaKaleng();
                    }, 10);
                });

                row.appendChild(kodeCell);
            }

            tbody.appendChild(row);
            rowIndex++;
        });
    });

    // Baris Total
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>
    `;
    for (let kode = 1; kode <= 6; kode++) {
        const totalCell = document.createElement('td');
        totalCell.className = 'total-cell';
        totalCell.dataset.kode = kode;
        totalCell.style.border = '1px solid #ddd';
        totalCell.style.padding = '10px';
        totalCell.style.textAlign = 'center';
        totalCell.style.fontWeight = '600';
        totalCell.style.background = '#f9f9f9';
        totalCell.textContent = '0';
        totalRow.appendChild(totalCell);
    }
    tbody.appendChild(totalRow);

    // Baris Rata-rata
    const avgRow = document.createElement('tr');
    avgRow.className = 'avg-row';
    avgRow.innerHTML = `
        <td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>
    `;
    for (let kode = 1; kode <= 6; kode++) {
        const avgCell = document.createElement('td');
        avgCell.className = 'avg-cell';
        avgCell.dataset.kode = kode;
        avgCell.style.border = '1px solid #ddd';
        avgCell.style.padding = '10px';
        avgCell.style.textAlign = 'center';
        avgCell.style.fontWeight = '600';
        avgCell.style.background = '#f0f0f0';
        avgCell.textContent = '0.00';
        avgRow.appendChild(avgCell);
    }
    tbody.appendChild(avgRow);

    table.appendChild(tbody);

    // Wrap table in scrollable container for mobile
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tanggalPanelisTuna = document.getElementById('tanggalPanelisTuna');
    if (tanggalPanelisTuna && !tanggalPanelisTuna.value) {
        const today = new Date().toISOString().split('T')[0];
        tanggalPanelisTuna.value = today;
    }

    // Tambahkan tombol LHU ke .form-actions
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
        // Hapus tombol preview lama jika ada
        const oldBtn = formActions.querySelector('.btn-lhu');
        if (oldBtn) oldBtn.remove();

        const lhuButton = document.createElement('button');
        lhuButton.type = 'button';
        lhuButton.className = 'btn-lhu';
        lhuButton.textContent = 'Lihat LHU (Laporan Hasil Uji)';
        lhuButton.style.padding = '12px 24px';
        lhuButton.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        lhuButton.style.color = 'white';
        lhuButton.style.border = 'none';
        lhuButton.style.borderRadius = '10px';
        lhuButton.style.fontSize = '16px';
        lhuButton.style.fontWeight = '600';
        lhuButton.style.cursor = 'pointer';
        lhuButton.style.transition = 'all 0.3s';
        lhuButton.style.marginRight = '10px';

        lhuButton.onmouseover = function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 20px rgba(67, 233, 123, 0.3)';
        };
        lhuButton.onmouseout = function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };

        lhuButton.addEventListener('click', async function (e) {
            try {
                this.disabled = true;
                await showLHUPreview();
            } catch (err) {
                console.error('showLHUPreview error', err);
                alert('Gagal membuka preview: ' + (err && err.message ? err.message : err));
            } finally {
                this.disabled = false;
            }
        });

        // Insert as first child (replacing Save button position)
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    // Container untuk QR Code
    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.style.paddingRight = '10px';

    const qrContainer = document.createElement('div');
    qrContainer.id = 'qrcode-container';
    qrContainer.style.padding = '10px';
    qrContainer.style.backgroundColor = '#fff';
    qrContainer.style.borderRadius = '8px';

    qrWrapper.appendChild(qrContainer);
    container.appendChild(qrWrapper);

    // Update QR Code jika nama sudah dipilih
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsTunaKaleng() {
    const table = document.getElementById('ikanTunaKalengTable');
    if (!table) {
        return;
    }

    // Hitung total dan rata-rata untuk setiap kode contoh (1-6)
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        let count = 0;

        // Cari semua checkbox untuk kode contoh ini (baik yang checked maupun tidak)
        const allCheckboxes = table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]`);

        // Hitung total dan jumlah dari checkbox yang dicentang
        allCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const nilaiStr = checkbox.getAttribute('data-nilai');
                const nilai = parseInt(nilaiStr);
                if (!isNaN(nilai) && nilai > 0) {
                    total += nilai;
                    count++;
                }
            }
        });

        // Update total - cari dengan berbagai cara untuk memastikan ditemukan
        let totalCell = table.querySelector(`td.total-cell[data-kode="${kode}"]`);
        if (!totalCell) {
            totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        }
        if (totalCell) {
            totalCell.textContent = total.toString();
            totalCell.style.color = '#667eea';
            totalCell.style.fontWeight = '600';
        }

        // Update rata-rata
        let avgCell = table.querySelector(`td.avg-cell[data-kode="${kode}"]`);
        if (!avgCell) {
            avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        }
        if (avgCell) {
            const avg = count > 0 ? (total / count).toFixed(2) : '0.00';
            avgCell.textContent = avg;
            avgCell.style.color = '#667eea';
            avgCell.style.fontWeight = '600';
        }
    }
}

/**
 * Menghasilkan nama file sesuai format: [Jenis]_[No. Uji]_[Panelis]-[Tanggal]
 */
function getFormattedFilename(data, hewan) {
    const hewanNames = {
        'ikan-segar': 'Ikan Segar',
        'ikan-beku': 'Ikan Beku',
        'ikan-tuna-kaleng': 'Ikan Tuna Kaleng'
    };

    const jenis = hewanNames[hewan] || 'Uji';
    const noUji = data.noSampel || data.kodeContohUji || 'TanpaNo';
    const panelis = data.namaPetugas || data.namaPanelis || data.namaPanelisTuna || 'Panelis';
    // Tanggal diuji format angka semua
    const tanggal = (data.tanggalUji || '').replace(/-/g, '');

    return `${jenis}_${noUji}_${panelis}-${tanggal}`;
}

/**
 * Menyimpan hasil uji ke localStorage
 */
function saveResultLocally(data, filename, rawHtml, hewan) {
    try {
        const history = JSON.parse(localStorage.getItem('spion_history') || '[]');
        const newItem = {
            id: Date.now(),
            filename: filename,
            hewan: hewan,
            data: data,
            html: rawHtml,
            timestamp: new Date().toISOString()
        };
        history.unshift(newItem); // Tambah di awal (terbaru)
        localStorage.setItem('spion_history', JSON.stringify(history));
        console.log('Data saved locally:', filename);
        return true;
    } catch (e) {
        console.error('Error saving locally:', e);
        return false;
    }
}

/**
 * Placeholder untuk backup ke GDrive (karantinaikanbitung@gmail.com)
 */
async function backupToGDrive(data, filename, rawHtml) {
    console.log('Attempting GDrive backup for:', filename);
    // Di sini bisa ditambahkan logika fetch ke backend/script yang menangani GDrive API
}

/**
 * Mengumpulkan data dari form untuk digunakan dalam preview atau simpan
 */
function collectFormDataForPreview(hewan) {
    const form = document.getElementById('penilaianForm');
    if (!form) return {};

    const data = {};

    // Capture all standard form elements
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.name && el.type !== 'submit' && el.type !== 'button') {
            if (el.type === 'radio') {
                if (el.checked) data[el.name] = el.value;
            } else if (el.type === 'checkbox') {
                // Skip nilai-checkbox as they are handled separately below
                if (!el.classList.contains('nilai-checkbox')) {
                    if (!data[el.name]) data[el.name] = [];
                    if (el.checked) data[el.name].push(el.value);
                }
            } else {
                data[el.name] = el.value;
            }
        }
    }

    // Capture explicit IDs that might not have names or are outside the main form structure but needed
    const extraIds = ['tanggalUji', 'namaPetugas', 'noSampel', 'kodeContohUji', 'tglDiterima', 'jenisContoh', 'jumlah', 'ukuran', 'keterangan', 'catatan', 'namaPenyelia'];
    extraIds.forEach(id => {
        const el = document.getElementById(id) || document.querySelector(`input[name="${id}"]`);
        if (el && !data[id]) {
            data[id] = el.value;
        }
    });

    // Capture QR Code Source
    let qrSrc = '';
    const qrImg = document.querySelector('#qrcode-container img');
    const qrCanvas = document.querySelector('#qrcode-container canvas');
    if (qrImg) {
        qrSrc = qrImg.src;
    } else if (qrCanvas) {
        try { qrSrc = qrCanvas.toDataURL(); } catch (e) { }
    }
    data.qrSrc = qrSrc;

    // Capture assessment data per animal type
    if (hewan === 'ikan-segar') {
        const table = document.getElementById('ikanSegarTable');
        if (table) {
            data.penilaianIkanSegar = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianIkanSegar[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'ikan-beku') {
        const table = document.getElementById('ikanBekuTable');
        if (table) {
            data.penilaianIkanBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianIkanBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'ikan-tuna-kaleng') {
        const table = document.getElementById('ikanTunaKalengTable');
        if (table) {
            data.penilaianIkanTunaKaleng = {};
            for (let kode = 1; kode <= 5; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianIkanTunaKaleng[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    }
    return data;
}

/**
 * Menghasilkan string HTML untuk dokumen LHU berdasarkan data dan jenis hewan
 */
function generateLHUHtml(data, hewan) {
    function formatIndoDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    const kodeContohUji = data.kodeContohUji || '';
    const tglDiterima = data.tglDiterima || '';
    const tanggalUji = data.tanggalUji || '';

    let jenisContoh = 'Ikan Segar';
    if (hewan === 'ikan-beku') jenisContoh = 'Ikan Beku';
    if (hewan === 'ikan-tuna-kaleng') jenisContoh = 'Ikan Tuna Kaleng';

    const isIkanBeku = (hewan === 'ikan-beku');
    const isIkanTuna = (hewan === 'ikan-tuna-kaleng');

    const kodeContohData = [];
    const penilaian = isIkanBeku ? data.penilaianIkanBeku : (isIkanTuna ? data.penilaianIkanTunaKaleng : data.penilaianIkanSegar);

    if (penilaian) {
        for (let i = 1; i <= 6; i++) {
            const item = penilaian[`kodeContoh${i}`];
            if (item && item.nilai && item.nilai.length > 0) {
                kodeContohData.push({ kode: i, nilai: item.nilai });
            }
        }
    }

    // Header logic
    const headerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
        <div style="flex: 0 0 100px; margin-right: 6px; display:flex; align-items:center; justify-content:center;"><img src="https://id.wikipedia.org/wiki/Special:FilePath/Logo_Barantin.svg" alt="Logo Barantin" style="width: 100px; height: 100px; object-fit: contain; display: block; border: none; border-radius: 0;"/></div>
        <div style="flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;"><div style="font-weight: bold; font-size: 16px; margin-bottom: 6px;">BADAN KARANTINA INDONESIA</div><div style="font-size: 14px; margin-bottom: 4px;">BALAI KARANTINA HEWAN, IKAN DAN TUMBUHAN</div><div style="font-size: 14px; margin-bottom: 4px; font-weight: bold;">SULAWESI UTARA</div><div style="font-size: 13px; margin-bottom: 3px;">JL. AA MARAMIS NO. 283, KEC. MAPANGET, KOTA MANADO, SULAWESI UTARA 95258</div><div style="font-size: 13px; margin-bottom: 3px;">Telp. 082190899090, Email: karantinasulut@karantinaindonesia.go.id</div><div style="font-size: 13px;">www.karantinaindonesia.go.id</div></div>
    </div>
    <h2 style="text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0;">LAMPIRAN LAPORAN HASIL UJI SEMENTARA<br>SENSORI/ORGANOLEPTIK - ${isIkanBeku ? 'IKAN BEKU' : (isIkanTuna ? 'IKAN TUNA KALENG' : 'IKAN SEGAR')}</h2>
    <table style="width:100%; margin-bottom: 8px; font-size:9pt; border-collapse: collapse; table-layout: fixed;">
        <tr><td style="width: 220px; text-align: left; vertical-align: middle; padding: 4px 8px;"><strong>Kode Contoh Uji</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 4px 8px; vertical-align: middle;">${kodeContohUji || '-'}</td></tr>
        <tr><td style="width: 220px; text-align: left; vertical-align: middle; padding: 4px 8px;"><strong>Jenis Contoh Uji</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 4px 8px; vertical-align: middle;">${jenisContoh || '-'}</td></tr>
        <tr><td style="width: 220px; text-align: left; vertical-align: middle; padding: 4px 8px;"><strong>Tanggal Masuk</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 4px 8px; vertical-align: middle;">${tglDiterima ? formatIndoDate(tglDiterima) : '-'}</td></tr>
        <tr><td style="width: 220px; text-align: left; vertical-align: middle; padding: 4px 8px;"><strong>Tanggal Pengujian</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 4px 8px; vertical-align: middle;">${tanggalUji ? formatIndoDate(tanggalUji) : '-'}</td></tr>
        <tr><td style="width: 220px; text-align: left; vertical-align: middle; padding: 4px 8px;"><strong>Metode Pengujian</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 4px 8px; vertical-align: middle;"><strong>${isIkanBeku ? 'SNI 4110-2020' : (isIkanTuna ? 'SNI 8223-2022' : 'SNI 2729-2021')}</strong></td></tr>
    </table>`;

    // Parameter mapping logic for summary table
    let parameterList = [];
    let renderGroups = [];

    if (isIkanBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Pengeringan', rowIndices: [3, 4, 5] },
            { name: '3. Perubahan warna', rowIndices: [6, 7, 8] },
            { name: 'B. Sesudah pelelehan\n   1. Kenampakan', rowIndices: [9, 10, 11] },
            { name: '2. Bau', rowIndices: [12, 13, 14] },
            { name: '3. Daging', rowIndices: [15, 16, 17] },
            { name: '4. Tekstur', rowIndices: [18, 19, 20] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Kenampakan\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan\n   1. Kenampakan\n   2. Bau\n   3. Daging\n   4. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices, parameterList[6].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5], parameterList[6]]
            }
        ];
    } else if (isIkanTuna) {
        parameterList = [
            { name: '1. Aroma', rowIndices: [0, 1, 2] },
            { name: '2. Rasa', rowIndices: [3, 4, 5] },
            { name: '3. Tekstur', rowIndices: [6, 7, 8] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2]];
    } else {
        parameterList = [
            { name: '1. Penampakan\n   a. Mata', rowIndices: [0, 1, 2] },
            { name: 'b. Insang', rowIndices: [3, 4, 5] },
            { name: 'c. Lendir permukaan badan', rowIndices: [6, 7, 8] },
            { name: '2. Daging', rowIndices: [9, 10, 11] },
            { name: '3. Bau', rowIndices: [12, 13, 14] },
            { name: '4. Tekstur', rowIndices: [15, 16, 17] }
        ];
        renderGroups = [
            {
                name: `1. Penampakan\n   a. Mata\n   b. Insang\n   c. Lendir permukaan badan`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            parameterList[3], parameterList[4], parameterList[5]
        ];
    }

    const rowsPerKode = renderGroups.length;
    let no = 1;
    let rowsHtml = '';
    kodeContohData.forEach(kd => {
        const bg = no % 2 === 0 ? '#E3F2FD' : '#BBDEFB';
        renderGroups.forEach((grp, idx) => {
            let nilaiBefore, nilaiAfter;
            if (grp.subGroups) {
                nilaiBefore = '\n' + grp.subGroups.map(sg => {
                    const vals = kd.nilai.filter(n => sg.rowIndices.includes(n.rowIndex)).map(n => n.nilai);
                    return vals.length > 0 ? vals.join(', ') : '-';
                }).join('\n');
                nilaiAfter = '\n' + grp.subGroups.map(sg => {
                    const vals = kd.nilai.filter(n => sg.rowIndices.includes(n.rowIndex)).map(n => Math.round(n.nilai));
                    return vals.length > 0 ? vals.join(', ') : '-';
                }).join('\n');
            } else {
                const vals = kd.nilai.filter(n => grp.rowIndices.includes(n.rowIndex)).map(n => n.nilai);
                nilaiBefore = vals.length > 0 ? vals.join(', ') : '-';
                nilaiAfter = vals.length > 0 ? vals.map(v => Math.round(v)).join(', ') : '-';
            }
            if (idx === 0) {
                rowsHtml += `
                <tr style="background-color: ${bg};">
                    <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top;" rowspan="${rowsPerKode}">${no}.</td>
                    <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top;" rowspan="${rowsPerKode}">${kd.kode}</td>
                    <td style="border: 1px solid #333; padding: 4px; white-space: pre-line; vertical-align: top; font-size: 10px;">${grp.name}</td>
                    <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: middle; font-size: 10px;" rowspan="${rowsPerKode}">Min. 7 (Skor 1-9)</td>
                    <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiBefore}</td>
                    <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiAfter}</td>
                </tr>`;
            } else {
                rowsHtml += `
                <tr style="background-color: ${bg};">
                    <td style="border: 1px solid #333; padding: 4px; white-space: pre-line; vertical-align: top; font-size: 10px;">${grp.name}</td>
                    <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiBefore}</td>
                    <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiAfter}</td>
                </tr>`;
            }
        });
        no++;
    });

    const tableHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 7pt;">
        <thead>
            <tr style="background-color: #4CAF50; color: white;">
                <th style="border: 1px solid #333; padding: 4px; text-align: center;" rowspan="2">NO</th>
                <th style="border: 1px solid #333; padding: 4px; text-align: center;" rowspan="2">Kode Pengujian</th>
                <th style="border: 1px solid #333; padding: 4px; text-align: center;" rowspan="2">Parameter Uji</th>
                <th style="border: 1px solid #333; padding: 4px; text-align: center;" rowspan="2">Batas Standar Mutu<br><span style="font-size: 10px;">${isIkanBeku ? '<strong>SNI 4110-2020</strong>' : (isIkanTuna ? '<strong>SNI 8223-2022</strong>' : 'SNI 2729-2021')}</span></th>
                <th style="border: 1px solid #333; padding: 4px; text-align: center;" colspan="2">Hasil Analisa</th>
            </tr>
            <tr style="background-color: #4CAF50; color: white;">
                <th style="border: 1px solid #333; padding: 4px; text-align: center;">Nilai sebelum dibulatkan</th>
                <th style="border: 1px solid #333; padding: 4px; text-align: center;">Nilai setelah dibulatkan</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>`;

    const namaPenyelia = data.namaPenyelia || 'Grace Lanny Tantu, S.Pi';

    const conclusionHTML = `
    <div style="margin-top: 10px; margin-bottom: 10px;">
        <table style="width:100%; font-size:9pt; border-collapse: collapse; table-layout: fixed;">
            <tr><td style="width:220px; text-align: left; vertical-align: middle; padding:4px 8px;"><strong>Tujuan Pemeriksaan</strong></td><td style="width:12px; text-align:center; vertical-align: middle;">:</td><td style="text-align: left; padding:4px 8px; vertical-align: middle;">Sensori/Organoleptik</td></tr>
            <tr><td style="width:220px; text-align: left; vertical-align: middle; padding:4px 8px;"><strong>Metode pemeriksaan laboratoris</strong></td><td style="width:12px; text-align:center; vertical-align: middle;">:</td><td style="text-align: left; padding:4px 8px; vertical-align: middle;"><strong>${isIkanBeku ? 'SNI 4110-2020' : (isIkanTuna ? 'SNI 8223-2022' : 'SNI 2729-2021')}</strong></td></tr>
            <tr><td style="width:220px; text-align: left; vertical-align: middle; padding:4px 8px;"><strong>Kesimpulan</strong></td><td style="width:12px; text-align:center; vertical-align: middle;">:</td><td style="text-align: left; padding:4px 8px; vertical-align: middle;">Memenuhi Standar Interval Mutu Kesegaran</td></tr>
        </table>
    </div>
    <div style="width:100%; display:flex; justify-content:flex-end; margin-top: 10px; font-size:10pt;">
        <div style="text-align: right; max-width:300px; line-height:1.4;">
            <div style="margin-bottom: 18px;">Bitung, ${tglDiterima ? formatIndoDate(tglDiterima) : ''}</div>
            <div style="margin-bottom: 6px;"><strong>Penyelia,</strong></div>
            <div style="margin-top: 48px;">${namaPenyelia}</div>
        </div>
    </div>`;

    const jumlah = data.jumlah || '';
    const ukuran = data.ukuran || '';
    const keterangan = data.keterangan || '';

    let scoreSheetItems = [];
    if (isIkanBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Kenampakan (khusus untuk frozen block)', items: [{ desc: 'Rata, bening, pada seluruh permukaan dilapisi es', nilai: 9 }, { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%', nilai: 7 }, { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang lebih 50%', nilai: 5 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 }, { desc: 'Pengeringan pada permukaan produk kurang lebih 30%', nilai: 7 }, { desc: 'Pengeringan pada permukaan produk kurang lebih 50%', nilai: 5 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 }, { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%', nilai: 7 }, { desc: 'Perubahan warna pada permukaan produk kurang lebih 50%', nilai: 5 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Sangat cemerlang spesifik jenis', nilai: 9 }, { desc: 'Cemerlang', nilai: 7 }, { desc: 'Mulai kusam', nilai: 5 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Segar, spesifik jenis', nilai: 9 }, { desc: 'Segar mengarah ke netral', nilai: 7 }, { desc: 'Mulai tercium bau amonia', nilai: 5 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Daging', items: [{ desc: 'Sayatan daging sangat cemerlang', nilai: 9 }, { desc: 'Sayatan daging cemerlang', nilai: 7 }, { desc: 'Sayatan daging mulai kusam', nilai: 5 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '4. Tekstur', items: [{ desc: 'Kompak, sangat elastis', nilai: 9 }, { desc: 'Kompak, elastis', nilai: 7 }, { desc: 'Mulai lunak', nilai: 5 }] }
        ];
    } else if (isIkanTuna) {
        scoreSheetItems = [
            { kategori: '1. Aroma', subKategori: '', items: [{ desc: 'Aroma sangat kuat sesuai spesifikasi produk', nilai: 9 }, { desc: 'Aroma kuat sesuai spesifikasi produk', nilai: 7 }, { desc: 'Mulai tercium aroma yang menyimpang (tengik/sulfida/amoniak)', nilai: 5 }] },
            { kategori: '2. Rasa', subKategori: '', items: [{ desc: 'Sangat sesuai spesifikasi produk', nilai: 9 }, { desc: 'Sesuai spesifikasi produk', nilai: 7 }, { desc: 'Terdapat rasa yang tidak sesuai spesifikasi produk (pahit/masam)', nilai: 5 }] },
            { kategori: '3. Tekstur', subKategori: '', items: [{ desc: 'Sangat kompak sesuai spesifikasi produk', nilai: 9 }, { desc: 'Kompak sesuai spesifikasi produk', nilai: 7 }, { desc: 'Kurang kompak', nilai: 5 }] }
        ];
    } else {
        scoreSheetItems = [
            { kategori: '1. Penampakan', subKategori: 'a. Mata', items: [{ desc: 'Cerah, bola mata menonjol, kornea jernih, kornea dan pupil jernih, mengkilap spesifik jenis ikan.', nilai: 9 }, { desc: 'Bola mata rata, kornea agak keruh and pupil agak keabu-abuan, agak mengkilap specifik jenis ikan', nilai: 7 }, { desc: 'Bola mata cekung, kornea keruh and pupil keabu-abuan tidak mengkilap specefik jenis ikan.', nilai: 5 }] },
            { kategori: '1. Penampakan', subKategori: 'b. Insang', items: [{ desc: 'Warna insang merah darah atau merah kecoklatan dengan sedikit lender agak keruh', nilai: 9 }, { desc: 'Warna insang merah tua atau coklat kemerahan, cemerlang dengan sedikit sekali lender transparan.', nilai: 7 }, { desc: 'Warna Insang abu-abu atau coklat abu-abu dengan lendir keruh.', nilai: 5 }] },
            { kategori: '1. Penampakan', subKategori: 'c. Lendir permukaan badan', items: [{ desc: 'Lapisan lendir jernih, transparan, mengkilap cerah.', nilai: 9 }, { desc: 'Lapisan lendir mulai agak keruh', nilai: 7 }, { desc: 'Lapisan lendir tebal, untuk ikan air laut dan berubah warna', nilai: 5 }] },
            { kategori: '2. Daging', subKategori: '', items: [{ desc: 'Sayatan daging sangat cemerlang spesifik jenis, jaringan daging sangat kuat.', nilai: 9 }, { desc: 'Sayatan daging kurang cemerlang, jaringan daging sangat kuat', nilai: 7 }, { desc: 'Sayatan daging mulai pudar, jaringan daging kurang kuat', nilai: 5 }] },
            { kategori: '3. Bau', subKategori: '', items: [{ desc: 'Bau Segar, spesifik jenis kuat', nilai: 9 }, { desc: 'Bau Segar, spesifik jenis kurang', nilai: 7 }, { desc: 'Netral, bau asam', nilai: 5 }] },
            { kategori: '4. Tekstur', subKategori: '', items: [{ desc: 'Padat kompak', nilai: 9 }, { desc: 'Padat, kurang kompak', nilai: 7 }, { desc: 'Kurang padat, tidak kompak', nilai: 5 }] }
        ];
    }

    let scoreRowsHtml = '';
    let globalRowIndex = 0;
    const selectionMap = {};
    if (kodeContohData) {
        kodeContohData.forEach(d => {
            if (d.nilai) {
                d.nilai.forEach(n => {
                    if (!selectionMap[n.rowIndex]) selectionMap[n.rowIndex] = {};
                    selectionMap[n.rowIndex][d.kode] = true;
                });
            }
        });
    }

    scoreSheetItems.forEach((section, sIdx) => {
        section.items.forEach((item, iIdx) => {
            let specText = '';
            let firstColContent = '';
            if (iIdx === 0) {
                if (section.kategori && (sIdx === 0 || scoreSheetItems[sIdx - 1].kategori !== section.kategori)) {
                    firstColContent += `<strong>${section.kategori}</strong><br>`;
                }
                if (section.subKategori) {
                    firstColContent += `<strong>${section.subKategori}</strong><br>`;
                }
            }
            specText = firstColContent + `<div style="padding-left:${firstColContent ? '10px' : '0'}">` + (item.desc.startsWith('•') ? item.desc : '• ' + item.desc) + `</div>`;
            let checkboxesHtml = '';
            for (let k = 1; k <= 6; k++) {
                const isChecked = selectionMap[globalRowIndex] && selectionMap[globalRowIndex][k];
                checkboxesHtml += `<td style="border: 1px solid #000; text-align: center; vertical-align: middle;">${isChecked ? '√' : ''}</td>`;
            }
            scoreRowsHtml += `<tr><td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 9pt;">${specText}</td><td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: middle; font-weight: bold;">${item.nilai}</td>${checkboxesHtml}</tr>`;
            globalRowIndex++;
        });
    });

    let totalRowHtml = `<tr><td colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold; background-color: #f9f9f9;">Total</td>`;
    let avgRowHtml = `<tr><td colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold; background-color: #f0f0f0;">Rata-rata</td>`;
    for (let k = 1; k <= 6; k++) {
        const item = penilaian ? penilaian[`kodeContoh${k}`] : null;
        totalRowHtml += `<td style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; background-color: #f9f9f9; font-size: 9pt;">${item ? item.total : '0'}</td>`;
        avgRowHtml += `<td style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; background-color: #f0f0f0; font-size: 9pt;">${item ? (typeof item.rataRata === 'number' ? item.rataRata.toFixed(2) : item.rataRata) : '0.00'}</td>`;
    }
    totalRowHtml += `</tr>`; avgRowHtml += `</tr>`;

    const namaPanelis = data.namaPetugas || data.namaPanelis || data.namaPanelisTuna || '-';
    const qrSrc = data.qrSrc || '';

    const scoreSheetPageHTML = `
    <div class="sheet" style="position: relative;">
        <div style="position: absolute; top: 10mm; right: 20mm; font-size: 10pt;">F.7.2.03-07/LP- BBKHIT-SULSEL</div>
        <div style="text-align: center; margin-top: 5mm; margin-bottom: 20px;"><h3 style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline;">LEMBAR PENILAIAN UJI SKOR ${isIkanBeku ? 'IKAN BEKU' : (isIkanTuna ? 'IKAN TUNA KALENG' : 'IKAN SEGAR')}</h3></div>
        <div style="margin-bottom: 10px; font-size: 9pt;"><table style="width: 100%; border: none;"><tr><td style="width: 250px;">1. Kode Contoh Uji /No. Aju PTK</td><td style="width: 10px;">:</td><td>${kodeContohUji}</td></tr><tr><td>2. Tgl. Diterima Contoh Uji</td><td>:</td><td>${tglDiterima ? formatIndoDate(tglDiterima) : ''}</td></tr></table></div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt;">
            <thead><tr><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 50px;">NO</th><th style="border: 1px solid #000; padding: 5px; text-align: center;">JENIS CONTOH UJI</th><th style="border: 1px solid #000; padding: 5px; text-align: center;">JUMLAH</th><th style="border: 1px solid #000; padding: 5px; text-align: center;">UKURAN</th><th style="border: 1px solid #000; padding: 5px; text-align: center;">Ket.</th></tr></thead>
            <tbody><tr><td style="border: 1px solid #000; padding: 5px; text-align: center;">1.</td><td style="border: 1px solid #000; padding: 5px;">${jenisContoh}</td><td style="border: 1px solid #000; padding: 5px; text-align: center;">${jumlah}</td><td style="border: 1px solid #000; padding: 5px; text-align: center;">${ukuran}</td><td style="border: 1px solid #000; padding: 5px; text-align: center;">${keterangan}</td></tr></tbody>
        </table>
        <div style="margin-bottom: 5px; font-size: 9pt;">• Berilah tanda √ pada nilai yang dipilih sesuai kode contoh yang diuji.</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
            <thead>
                <tr><th style="border: 1px solid #000; padding: 5px; text-align: left; vertical-align: middle;" rowspan="2">Spesifikasi</th><th style="border: 1px solid #000; padding: 5px; text-align: center; vertical-align: middle;" rowspan="2">Nilai</th><th style="border: 1px solid #000; padding: 5px; text-align: center;" colspan="6">Kode Contoh</th></tr>
                <tr><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 30px;">1</th><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 30px;">2</th><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 30px;">3</th><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 30px;">4</th><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 30px;">5</th><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 30px;">6</th></tr>
            </thead>
            <tbody>${scoreRowsHtml}${totalRowHtml}${avgRowHtml}</tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 9pt;">
            <thead><tr><th style="border: 1px solid #000; padding: 5px; text-align: center; width: 50px;">No</th><th style="border: 1px solid #000; padding: 5px; text-align: center;">Panelis</th><th style="border: 1px solid #000; padding: 5px; text-align: center;">Tanda Tangan</th></tr></thead>
            <tbody><tr><td style="border: 1px solid #000; padding: 5px; text-align: center; vertical-align: middle; height: 60px;">1.</td><td style="border: 1px solid #000; padding: 5px; text-align: center; vertical-align: middle;">${namaPanelis}</td><td style="border: 1px solid #000; padding: 5px; text-align: center; vertical-align: middle;">${qrSrc ? `<img src="${qrSrc}" style="width: 60px; height: 60px; object-fit: contain;">` : ''}</td></tr></tbody>
        </table>
    </div>`;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LHU Final</title>
    <style>
        @media print { 
            @page { size: A4 portrait; margin: 0; } 
            body { margin: 0; padding: 0; background: none; } 
            .sheet { margin: 0; box-shadow: none; width: 100%; height: auto; page-break-after: always; padding: 20mm; overflow: visible; } 
            .sheet:last-child { page-break-after: auto; } 
        }
        body { background: #525659; margin: 0; padding: 25px 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; -webkit-print-color-adjust: exact; }
        .sheet { width: 100%; max-width: 210mm; height: auto; min-height: 297mm; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5); padding: 20mm; box-sizing: border-box; margin-bottom: 25px; overflow: hidden; position: relative; }
        @media (max-width: 600px) { 
            body { padding: 10px 0; } 
            .sheet { padding: 10mm; margin-bottom: 10px; } 
            .table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; } 
        }
        table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; }
        .table-responsive { width: 100%; }
    </style>
</head>
<body>
    <div class="sheet">
        ${headerHTML}
        <div class="table-responsive">
            ${tableHTML}
        </div>
        ${conclusionHTML}
    </div>
    
    <!-- Halaman 2: Lembar Penilaian -->
    ${scoreSheetPageHTML}
</body>
</html>`;
}

/**
 * Cadangkan file LHU ke Google Drive melalui Apps Script
 */
async function backupToGDrive(data, filename, htmlContent) {
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        console.warn('Google Apps Script URL belum dikonfigurasi untuk GDrive backup.');
        return;
    }

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'saveFileToDrive',
                filename: filename + '.html',
                htmlContent: htmlContent
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('GDrive Backup Result:', result.message);
        } else {
            console.error('GDrive Backup Error: HTTP ' + response.status);
        }
    } catch (error) {
        console.error('GDrive Backup Exception:', error);
    }
}

/**
 * Menghasilkan Blob PDF dari HTML yang tersimpan di window.htmlDownload
 */
async function generatePdfBlob() {
    if (!window.htmlDownload) {
        throw new Error('HTML content for PDF not found');
    }

    // Gunakan html2pdf.js (pastikan library ini sudah di-load di HTML)
    const element = document.createElement('div');
    element.innerHTML = window.htmlDownload;

    // Tunggu gambar di-load
    const images = Array.from(element.getElementsByTagName('img'));
    await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    }));

    const opt = {
        margin: 0,
        filename: 'LHU_Lampiran.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Output sebagai blob
    const worker = html2pdf().from(element).set(opt);
    const pdfBlob = await worker.outputPdf('blob');
    return { blob: pdfBlob, filename: opt.filename };
}

// LHU preview (implements requested mappings and preview layout)
async function showLHUPreview(savedData = null, savedHewan = null) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const hewan = savedHewan || urlParams.get('hewan') || 'ikan-segar';
        const data = savedData || collectFormDataForPreview(hewan);

        // Quick diagnostic feedback
        try {
            const existingTemp = document.getElementById('attachmentModalTemp');
            if (existingTemp) existingTemp.remove();
            const temp = document.createElement('div');
            temp.id = 'attachmentModalTemp';
            temp.style.position = 'fixed';
            temp.style.top = '0';
            temp.style.left = '0';
            temp.style.width = '100%';
            temp.style.height = '100%';
            temp.style.backgroundColor = 'rgba(0,0,0,0.5)';
            temp.style.zIndex = '9999';
            temp.style.display = 'flex';
            temp.style.alignItems = 'center';
            temp.style.justifyContent = 'center';
            temp.innerHTML = `<div style="background:white;padding:20px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.12);font-weight:600;">Membuat preview...</div>`;
            document.body.appendChild(temp);
        } catch (e) { }

        const fullDoc = generateLHUHtml(data, hewan);
        window.htmlDownload = fullDoc;

        let blobUrl;
        let initialFilename = '';
        try {
            const generated = await generatePdfBlob();
            blobUrl = URL.createObjectURL(generated.blob);
            initialFilename = generated.filename || '';
        } catch (e) {
            // fallback to HTML view if PDF generation/population failed
            const blob = new Blob([fullDoc], { type: 'text/html' });
            blobUrl = URL.createObjectURL(blob);
        }

        // Hapus modal yang mungkin sudah ada (termasuk temporary indicator)
        const existing = document.getElementById('attachmentModal');
        if (existing) existing.remove();
        const existingTemp = document.getElementById('attachmentModalTemp');
        if (existingTemp) existingTemp.remove();

        // Detect mobile
        const isMobile = window.innerWidth <= 768;

        // Buat modal dengan iframe yang menampilkan dokumen yang digenerate
        const modal = document.createElement('div');
        modal.id = 'attachmentModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.zIndex = '10000';
        modal.style.overflow = 'hidden'; // Keep scroll in modalContent
        modal.style.padding = isMobile ? '5px' : '20px';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.style.maxWidth = '1000px';
        modalContent.style.width = isMobile ? '100%' : '100%';
        modalContent.style.height = isMobile ? '100%' : '90vh';
        modalContent.style.margin = '0 auto';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = isMobile ? '10px' : '20px';
        modalContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        modalContent.style.display = 'flex';
        modalContent.style.flexDirection = 'column';
        modalContent.style.borderRadius = isMobile ? '0' : '12px'; // No rounded on mobile fullscreen

        // Header controls (Title + Close X)
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.marginBottom = isMobile ? '10px' : '15px';

        const title = document.createElement('div');
        title.style.fontWeight = '700';
        title.style.fontSize = isMobile ? '16px' : '18px';
        title.style.color = '#333';
        title.textContent = 'Preview Laporan Hasil Uji';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;'; // X symbol
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#555';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.lineHeight = '1';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '5px 10px';
        closeBtn.style.transition = 'color 0.2s';
        closeBtn.onclick = function () {
            window.closeLHUModal();
        };
        closeBtn.onmouseover = function () { this.style.color = '#f44336'; };
        closeBtn.onmouseout = function () { this.style.color = '#555'; };

        headerDiv.appendChild(title);
        headerDiv.appendChild(closeBtn);

        const iframe = document.createElement('iframe');
        iframe.src = blobUrl;
        iframe.style.width = '100%';
        iframe.style.flex = '1'; // Take remaining height
        iframe.style.border = '1px solid #eee';
        iframe.style.borderRadius = isMobile ? '4px' : '8px';

        // Footer controls (Print + Download HTML)
        const footerDiv = document.createElement('div');
        footerDiv.style.display = 'flex';
        footerDiv.style.justifyContent = 'center';
        footerDiv.style.gap = isMobile ? '10px' : '15px';
        footerDiv.style.marginTop = isMobile ? '10px' : '15px';

        const printBtn = document.createElement('button');
        printBtn.textContent = '🖨️ Print';
        printBtn.style.padding = isMobile ? '8px 15px' : '10px 20px';
        printBtn.style.border = 'none';
        printBtn.style.background = '#1976D2';
        printBtn.style.color = 'white';
        printBtn.style.borderRadius = '8px';
        printBtn.style.cursor = 'pointer';
        printBtn.style.fontSize = isMobile ? '12px' : '14px';
        printBtn.style.fontWeight = '500';
        printBtn.style.display = 'flex';
        printBtn.style.alignItems = 'center';
        printBtn.style.gap = '8px';
        printBtn.onclick = function () {
            const newWin = window.open(blobUrl, '_blank');
            if (!newWin) {
                alert('Pop-up diblokir. Silakan izinkan pop-up untuk mencetak.');
                return;
            }
            newWin.addEventListener && newWin.addEventListener('load', function () { try { newWin.focus(); newWin.print(); } catch (e) { } });
            setTimeout(function () { try { newWin.print(); } catch (e) { } }, 1500);
        };

        const htmlBtn = document.createElement('button');
        htmlBtn.textContent = '⬇️ HTML';
        htmlBtn.style.padding = isMobile ? '8px 15px' : '10px 20px';
        htmlBtn.style.border = 'none';
        htmlBtn.style.background = '#009688'; // Teal
        htmlBtn.style.color = 'white';
        htmlBtn.style.borderRadius = '8px';
        htmlBtn.style.cursor = 'pointer';
        htmlBtn.style.fontSize = isMobile ? '12px' : '14px';
        htmlBtn.style.fontWeight = '500';
        htmlBtn.style.display = 'flex';
        htmlBtn.style.alignItems = 'center';
        htmlBtn.style.gap = '8px';
        htmlBtn.onclick = function () {
            if (!window.htmlDownload) {
                alert('HTML preview belum tersedia. Silakan buka preview ulang.');
                return;
            }
            const blob = new Blob([window.htmlDownload], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'LHU_Preview_' + (kodeContohUji ? kodeContohUji.replace(/[^a-z0-9]/gi, '_') : 'Output') + '.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        footerDiv.appendChild(printBtn);
        footerDiv.appendChild(htmlBtn);

        modalContent.appendChild(headerDiv);
        modalContent.appendChild(iframe);
        modalContent.appendChild(footerDiv);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Fungsi untuk menutup modal dan revoke blob
        window.closeLHUModal = function () {
            const modal = document.getElementById('attachmentModal');
            if (modal) modal.remove();
            try { URL.revokeObjectURL(blobUrl); } catch (e) { }
        };
    } catch (err) {
        console.error('showLHUPreview fatal error', err);
        const existingTemp = document.getElementById('attachmentModalTemp');
        if (existingTemp) existingTemp.remove();
        alert('Gagal membuat preview: ' + (err && err.message ? err.message : err));
    }
}

function updateCheckmark(cell, checked) {
    // Pastikan checkbox tetap ada di DOM
    let checkbox = cell.querySelector('.nilai-checkbox');

    if (!checkbox) {
        // Jika checkbox tidak ada, buat ulang dari data attributes cell
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'nilai-checkbox';
        checkbox.dataset.kode = cell.dataset.kode;
        checkbox.dataset.rowIndex = cell.dataset.rowIndex;
        checkbox.dataset.nilai = cell.dataset.nilai;
        checkbox.style.display = 'none';
        // Tambahkan event listener untuk checkbox
        checkbox.addEventListener('change', function (e) {
            e.stopPropagation();
            updateCheckmark(cell, checkbox.checked);
            // Deteksi tabel mana yang digunakan
            const tableId = cell.closest('table')?.id;
            setTimeout(() => {
                if (tableId === 'ikanBekuTable') {
                    calculateTotalsBeku();
                } else if (tableId === 'ikanTunaKalengTable') {
                    calculateTotalsTunaKaleng();
                } else {
                    calculateTotals();
                }
            }, 10);
        });
        // Pastikan checkbox ada di cell
        cell.appendChild(checkbox);
    }

    // Set status checkbox hanya jika berbeda
    if (checkbox.checked !== checked) {
        checkbox.checked = checked;
    }

    // Update tampilan visual
    const existingMark = cell.querySelector('.checkmark-visual');

    if (checked) {
        // Tambahkan checkmark visual jika belum ada
        if (!existingMark) {
            const mark = document.createElement('span');
            mark.className = 'checkmark-visual';
            mark.style.fontSize = '20px';
            mark.style.color = '#667eea';
            mark.style.display = 'block';
            mark.style.pointerEvents = 'none';
            mark.textContent = '✓';
            cell.appendChild(mark);
        }
        cell.style.backgroundColor = '#e8f0fe';
    } else {
        // Hapus checkmark visual jika ada
        if (existingMark) {
            existingMark.remove();
        }
        cell.style.backgroundColor = '';
    }
}

function calculateTotals() {
    const table = document.getElementById('ikanSegarTable');
    if (!table) {
        return;
    }

    // Hitung total dan rata-rata untuk setiap kode contoh (1-6)
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        let count = 0;

        // Cari semua checkbox untuk kode contoh ini (baik yang checked maupun tidak)
        const allCheckboxes = table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]`);

        // Hitung total dan jumlah dari checkbox yang dicentang
        allCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const nilaiStr = checkbox.getAttribute('data-nilai');
                const nilai = parseInt(nilaiStr);
                if (!isNaN(nilai) && nilai > 0) {
                    total += nilai;
                    count++;
                }
            }
        });

        // Update total - cari dengan berbagai cara untuk memastikan ditemukan
        let totalCell = table.querySelector(`td.total-cell[data-kode="${kode}"]`);
        if (!totalCell) {
            totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        }
        if (totalCell) {
            totalCell.textContent = total.toString();
            totalCell.style.color = '#667eea';
            totalCell.style.fontWeight = '600';
        }

        // Update rata-rata
        let avgCell = table.querySelector(`td.avg-cell[data-kode="${kode}"]`);
        if (!avgCell) {
            avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        }
        if (avgCell) {
            const avg = count > 0 ? (total / count).toFixed(2) : '0.00';
            avgCell.textContent = avg;
            avgCell.style.color = '#667eea';
            avgCell.style.fontWeight = '600';
        }
    }
}

function generateVirologiFields(container, hewan) {
    const fields = [
        {
            type: 'radio',
            name: 'hasilUji',
            label: 'Hasil Uji',
            options: ['Positif', 'Negatif'],
            required: true
        },
        {
            type: 'text',
            name: 'jenisVirus',
            label: 'Jenis Virus yang Terdeteksi',
            placeholder: 'Masukkan jenis virus jika positif'
        },
        {
            type: 'number',
            name: 'jumlahVirus',
            label: 'Jumlah Virus (kopi/mL)',
            placeholder: 'Masukkan jumlah virus'
        },
        {
            type: 'text',
            name: 'metodeUji',
            label: 'Metode Uji',
            placeholder: 'Contoh: PCR, RT-PCR, dll',
            required: true
        },
        {
            type: 'text',
            name: 'catatanHasil',
            label: 'Catatan Hasil',
            placeholder: 'Masukkan catatan hasil uji'
        }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.innerHTML = `${field.label} ${field.required ? '<span class="required">*</span>' : ''}`;
        div.appendChild(label);

        if (field.type === 'radio') {
            const radioGroup = document.createElement('div');
            radioGroup.className = 'radio-group';
            field.options.forEach(option => {
                const radioLabel = document.createElement('label');
                radioLabel.className = 'radio-label';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = field.name;
                radio.value = option;
                if (field.required) radio.required = true;
                const span = document.createElement('span');
                span.textContent = option;
                radioLabel.appendChild(radio);
                radioLabel.appendChild(span);
                radioGroup.appendChild(radioLabel);
            });
            div.appendChild(radioGroup);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = field.name;
            if (field.placeholder) input.placeholder = field.placeholder;
            if (field.required) input.required = true;
            div.appendChild(input);
        }

        container.appendChild(div);
    });
}

function generateMikrobiologiFields(container, hewan) {
    const fields = [
        {
            type: 'number',
            name: 'totalBakteri',
            label: 'Total Bakteri (CFU/g)',
            placeholder: 'Masukkan total bakteri',
            required: true
        },
        {
            type: 'number',
            name: 'eColi',
            label: 'E. Coli (MPN/g)',
            placeholder: 'Masukkan jumlah E. Coli'
        },
        {
            type: 'number',
            name: 'salmonella',
            label: 'Salmonella (CFU/g)',
            placeholder: 'Masukkan jumlah Salmonella'
        },
        {
            type: 'radio',
            name: 'statusMikroba',
            label: 'Status Mikroba',
            options: ['Aman', 'Tidak Aman', 'Perlu Perhatian'],
            required: true
        },
        {
            type: 'text',
            name: 'metodeUji',
            label: 'Metode Uji',
            placeholder: 'Contoh: Plate Count, MPN, dll',
            required: true
        }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.innerHTML = `${field.label} ${field.required ? '<span class="required">*</span>' : ''}`;
        div.appendChild(label);

        if (field.type === 'radio') {
            const radioGroup = document.createElement('div');
            radioGroup.className = 'radio-group';
            field.options.forEach(option => {
                const radioLabel = document.createElement('label');
                radioLabel.className = 'radio-label';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = field.name;
                radio.value = option;
                if (field.required) radio.required = true;
                const span = document.createElement('span');
                span.textContent = option;
                radioLabel.appendChild(radio);
                radioLabel.appendChild(span);
                radioGroup.appendChild(radioLabel);
            });
            div.appendChild(radioGroup);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = field.name;
            if (field.placeholder) input.placeholder = field.placeholder;
            if (field.required) input.required = true;
            div.appendChild(input);
        }

        container.appendChild(div);
    });
}

function handleFormSubmit(jenisUji, hewan) {
    const form = document.getElementById('penilaianForm');

    // Validasi form HTML5
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Kumpulkan semua data dari form secara dinamis
    const formData = new FormData(form);

    const jenisUjiNames = {
        'organoleptik': 'Uji Organoleptik',
        'virologi': 'Uji Virologi',
        'mikrobiologi': 'Uji Mikrobiologi'
    };

    const hewanNames = {
        'ikan-segar': 'Ikan Segar',
        'ikan-beku': 'Ikan Beku',
        'ikan-tuna-kaleng': 'Ikan Tuna Kaleng',
        'kepiting': 'Kepiting',
        'gurita': 'Gurita',
        'kerang': 'Kerang'
    };

    // Buat objek data
    const data = {
        jenisUji: jenisUjiNames[jenisUji],
        jenisHewan: hewanNames[hewan],
        timestamp: new Date().toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    };

    // Kumpulkan semua field dari form
    const formElements = form.elements;

    for (let element of formElements) {
        if (element.name && element.type !== 'submit' && element.type !== 'button') {
            if (element.type === 'radio') {
                if (element.checked) {
                    data[element.name] = element.value;
                }
            } else {
                data[element.name] = element.value || '';
            }
        }
    }

    // Khusus untuk ikan segar, kumpulkan data dari tabel
    if (hewan === 'ikan-segar') {
        // Ambil kode contoh uji dan tanggal diterima
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');

        if (kodeContohUjiInput) {
            data.kodeContohUji = kodeContohUjiInput.value || '';
        }
        if (tglDiterimaInput) {
            data.tglDiterima = tglDiterimaInput.value || '';
        }

        const table = document.getElementById('ikanSegarTable');
        if (table) {
            data.penilaianIkanSegar = {};

            // Kumpulkan data untuk setiap kode contoh (1-6)
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = {
                    nilai: [],
                    total: 0,
                    rataRata: 0
                };

                // Ambil semua checkbox yang dicentang untuk kode contoh ini
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    const rowIndex = checkbox.dataset.rowIndex;
                    const nilai = parseInt(checkbox.dataset.nilai);
                    kodeData.nilai.push({
                        rowIndex: rowIndex,
                        nilai: nilai
                    });
                });

                // Ambil total dan rata-rata
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

                if (totalCell) {
                    kodeData.total = parseInt(totalCell.textContent) || 0;
                }
                if (avgCell) {
                    kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                }

                data.penilaianIkanSegar[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk ikan beku, kumpulkan data dari tabel
    if (hewan === 'ikan-beku') {
        // Ambil kode contoh uji dan tanggal diterima (sama format dengan ikan segar)
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        // Also keep namaPanelis/tanggalPanelis if present
        const namaPanelisInput = document.getElementById('namaPanelis');
        const tanggalPanelisInput = document.getElementById('tanggalPanelis');
        if (namaPanelisInput) data.namaPanelis = namaPanelisInput.value || '';
        if (tanggalPanelisInput) data.tanggalPanelis = tanggalPanelisInput.value || '';

        const table = document.getElementById('ikanBekuTable');
        if (table) {
            data.penilaianIkanBeku = {};

            // Kumpulkan data untuk setiap kode contoh (1-6)
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = {
                    nilai: [],
                    total: 0,
                    rataRata: 0
                };

                // Ambil semua checkbox yang dicentang untuk kode contoh ini
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    const rowIndex = checkbox.dataset.rowIndex;
                    const nilai = parseInt(checkbox.dataset.nilai);
                    kodeData.nilai.push({
                        rowIndex: rowIndex,
                        nilai: nilai
                    });
                });

                // Ambil total dan rata-rata
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

                if (totalCell) {
                    kodeData.total = parseInt(totalCell.textContent) || 0;
                }
                if (avgCell) {
                    kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                }

                data.penilaianIkanBeku[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk ikan tuna kaleng, kumpulkan data dari tabel
    if (hewan === 'ikan-tuna-kaleng') {
        // Ambil nama panelis dan tanggal
        const namaPanelisTunaInput = document.getElementById('namaPanelisTuna');
        const tanggalPanelisTunaInput = document.getElementById('tanggalPanelisTuna');

        if (namaPanelisTunaInput) {
            data.namaPanelisTuna = namaPanelisTunaInput.value || '';
        }
        if (tanggalPanelisTunaInput) {
            data.tanggalPanelisTuna = tanggalPanelisTunaInput.value || '';
        }

        const table = document.getElementById('ikanTunaKalengTable');
        if (table) {
            data.penilaianIkanTunaKaleng = {};

            // Kumpulkan data untuk setiap kode contoh (1-5)
            for (let kode = 1; kode <= 5; kode++) {
                const kodeData = {
                    nilai: [],
                    total: 0,
                    rataRata: 0
                };

                // Ambil semua checkbox yang dicentang untuk kode contoh ini
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    const rowIndex = checkbox.dataset.rowIndex;
                    const nilai = parseInt(checkbox.dataset.nilai);
                    kodeData.nilai.push({
                        rowIndex: rowIndex,
                        nilai: nilai
                    });
                });

                // Ambil total dan rata-rata
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

                if (totalCell) {
                    kodeData.total = parseInt(totalCell.textContent) || 0;
                }
                if (avgCell) {
                    kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                }

                data.penilaianIkanTunaKaleng[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Capture QR Code Source explicitly for saving
    let qrSrc = '';
    const qrImg = document.querySelector('#qrcode-container img');
    const qrCanvas = document.querySelector('#qrcode-container canvas');
    if (qrImg) {
        qrSrc = qrImg.src;
    } else if (qrCanvas) {
        try { qrSrc = qrCanvas.toDataURL(); } catch (e) { }
    }
    data.qrSrc = qrSrc;

    // Construct filename
    const filename = getFormattedFilename(data, hewan);

    // Generate LHU HTML always (for storage and backup)
    const lhuHtml = generateLHUHtml(data, hewan);
    window.htmlDownload = lhuHtml;

    // Simpan ke Local Storage
    saveResultLocally(data, filename, lhuHtml, hewan);

    // Backup ke GDrive
    backupToGDrive(data, filename, lhuHtml);

    // Simpan ke Google Sheets (async, tidak blocking)
    saveToGoogleSheets(data, jenisUjiNames[jenisUji], hewanNames[hewan])
        .then(result => {
            if (result.success) {
                console.log('Data berhasil disimpan ke Google Sheets');
            } else {
                console.warn('Peringatan: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error saving to Google Sheets:', error);
        });

    // Tampilkan pesan sukses
    alert('Terima kasih! Data penilaian uji telah berhasil disimpan di history dan cadangan cloud.');
}

function exportToExcel(data, jenisUji, hewan) {
    // Buat workbook baru
    const wb = XLSX.utils.book_new();

    // Buat header dan data rows
    const headers = ['Jenis Uji', 'Jenis Hewan', 'Waktu Pengisian'];
    const values = [data.jenisUji, data.jenisHewan, data.timestamp];

    // Tambahkan semua field lainnya
    for (let key in data) {
        if (key !== 'jenisUji' && key !== 'jenisHewan' && key !== 'timestamp') {
            // Format nama field menjadi lebih readable
            const headerName = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
            headers.push(headerName);
            values.push(data[key] || '-');
        }
    }

    const wsData = [headers, values];

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set lebar kolom secara dinamis
    const colWidths = headers.map(() => ({ wch: 25 }));
    colWidths[0] = { wch: 20 }; // Jenis Uji
    colWidths[1] = { wch: 15 }; // Jenis Hewan
    colWidths[2] = { wch: 20 }; // Waktu
    ws['!cols'] = colWidths;

    // Tambahkan worksheet ke workbook
    const sheetName = jenisUji.replace(/\s+/g, '_').substring(0, 31); // Excel sheet name max 31 chars
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate nama file dengan timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `${jenisUji.replace(/\s+/g, '_')}_${hewan.replace(/\s+/g, '_')}_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
}

function goBack() {
    const urlParams = new URLSearchParams(window.location.search);
    const jenisUji = urlParams.get('jenis');
    window.location.href = `kuisoner-jenis-uji.html?jenis=${jenisUji}`;
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('username');
        window.location.href = 'kuisoner-login.html';
    }
}

function resetForm() {
    if (confirm('Apakah Anda yakin ingin mereset semua data yang telah diisi?')) {
        document.getElementById('penilaianForm').reset();
        const tanggalUji = document.getElementById('tanggalUji');
        if (tanggalUji) {
            const today = new Date().toISOString().split('T')[0];
            tanggalUji.value = today;
        }
    }
}


