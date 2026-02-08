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

        // Auto-select lokasi pelayanan berdasarkan user
        const userLocation = sessionStorage.getItem('userLocation');
        const noSampelSelect = document.getElementById('noSampel');
        if (noSampelSelect && userLocation) {
            // Temukan option yang teksnya cocok dengan userLocation
            for (let i = 0; i < noSampelSelect.options.length; i++) {
                if (noSampelSelect.options[i].text === userLocation || noSampelSelect.options[i].value === userLocation) {
                    noSampelSelect.selectedIndex = i;
                    break;
                }
            }
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
        'ikan-tuna-kaleng': 'Ikan Tuna Kaleng',
        'sarden-makarel-kaleng': 'Sarden/Makarel Kaleng',
        'ikan-asap': 'Dried Smoking Fish (Ikan Kayu)',
        'ikan-asin-kering': 'Ikan Asin Kering',
        'rumput-laut-kering': 'Rumput Laut Kering',
        'lobster-udang-kipas': 'LOBSTER, UDANG KIPAS HIDUP',
        'udang-beku': 'Udang Beku',
        'udang-masak-beku': 'Udang Masak Beku',
        'cumi-cumi-beku': 'Cumi-cumi Beku',
        'gurita-mentah-beku': 'Gurita Mentah Beku',
        'lobster-beku': 'Lobster Beku',
        'cakalang-beku': 'Cakalang Beku',
        'hiu-utuh-beku': 'Hiu Utuh Beku',
        'fillet-kakap-beku': 'Fillet Kakap Beku',
        'fillet-nila-beku': 'Fillet Nila (Tilapia sp.) Beku',
        'fillet-nila-beku': 'Fillet Nila (Tilapia sp.) Beku',
        'fillet-ikan-beku': 'Fillet Ikan Beku',
        'bakso-ikan': 'Bakso Ikan',
        'sosis-ikan': 'Sosis Ikan',
        'daging-kepiting-rebus-beku': 'Daging Kepiting Rebus Beku',
        'ikan-pindang': 'Ikan Pindang',
        'tuna-segar-sashimi': 'Tuna Segar Untuk Sashimi',
        'tuna-loin-segar': 'Tuna Loin Segar'
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

    if (hewan === 'ikan-segar' || hewan === 'ikan-beku' || hewan === 'ikan-tuna-kaleng' || hewan === 'sarden-makarel-kaleng' || hewan === 'ikan-asap' || hewan === 'ikan-asin-kering' || hewan === 'rumput-laut-kering' || hewan === 'lobster-udang-kipas' || hewan === 'kepiting-bakau' || hewan === 'ikan-asap-murni' || hewan === 'sirip-hiu-kering' || hewan === 'udang-kering-utuh' || hewan === 'abon-ikan' || hewan === 'sambal-ikan' || hewan === 'tuna-loin-beku' || hewan === 'tuna-steak-beku' || hewan === 'udang-segar' || hewan === 'udang-beku' || hewan === 'udang-masak-beku' || hewan === 'cumi-cumi-beku' || hewan === 'gurita-mentah-beku' || hewan === 'lobster-beku' || hewan === 'cakalang-beku' || hewan === 'hiu-utuh-beku' || hewan === 'fillet-kakap-beku' || hewan === 'fillet-nila-beku' || hewan === 'fillet-ikan-beku' || hewan === 'bakso-ikan' || hewan === 'sosis-ikan' || hewan === 'daging-kepiting-rebus-beku' || hewan === 'ikan-pindang' || hewan === 'tuna-segar-sashimi' || hewan === 'tuna-loin-segar') {
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

    // Jika sarden/makarel kaleng, buat tabel khusus
    if (hewan === 'sarden-makarel-kaleng') {
        generateSardenMakarelKalengTable(container);
        return;
    }

    // Jika ikan asap, buat tabel khusus
    if (hewan === 'ikan-asap') {
        generateDriedSmokingFishTable(container);
        return;
    }

    // Jika ikan asin kering, buat tabel khusus
    if (hewan === 'ikan-asin-kering') {
        generateIkanAsinKeringTable(container);
        return;
    }

    // Jika rumput laut kering, buat tabel khusus
    if (hewan === 'rumput-laut-kering') {
        generateRumputLautKeringTable(container);
        return;
    }

    // Jika lobster/udang kipas, buat tabel khusus
    if (hewan === 'lobster-udang-kipas') {
        generateLobsterUdangKipasTable(container);
        return;
    }

    // Jika kepiting bakau, buat tabel khusus
    if (hewan === 'kepiting-bakau') {
        generateKepitingBakauTable(container);
        return;
    }

    // Jika ikan asap (baru), buat tabel khusus
    if (hewan === 'ikan-asap-murni') {
        generateIkanAsapMurniTable(container);
        return;
    }

    // Jika sirip hiu kering, buat tabel khusus
    if (hewan === 'sirip-hiu-kering') {
        generateSiripHiuKeringTable(container);
        return;
    }

    // Jika udang kering utuh, buat tabel khusus
    if (hewan === 'udang-kering-utuh') {
        generateUdangKeringUtuhTable(container);
        return;
    }

    // Jika abon ikan, buat tabel khusus
    if (hewan === 'abon-ikan') {
        generateAbonIkanTable(container);
        return;
    }

    // Jika sambal ikan, buat tabel khusus
    if (hewan === 'sambal-ikan') {
        generateSambalIkanTable(container);
        return;
    }

    // Jika tuna loin beku, buat tabel khusus
    if (hewan === 'tuna-loin-beku') {
        generateTunaLoinBekuTable(container);
        return;
    }

    // Jika tuna steak beku, buat tabel khusus
    if (hewan === 'tuna-steak-beku') {
        generateTunaSteakBekuTable(container);
        return;
    }

    // Jika udang segar/beku, buat tabel khusus
    if (hewan === 'udang-segar') {
        generateUdangSegarTable(container);
        return;
    }
    if (hewan === 'udang-beku') {
        generateUdangBekuTable(container);
        return;
    }
    if (hewan === 'udang-masak-beku') {
        generateUdangMasakBekuTable(container);
        return;
    }
    if (hewan === 'lobster-beku') {
        generateLobsterBekuTable(container);
        return;
    }
    if (hewan === 'cumi-cumi-beku') {
        generateCumiCumiBekuTable(container);
        return;
    }
    if (hewan === 'gurita-mentah-beku') {
        generateGuritaMentahBekuTable(container);
        return;
    }
    if (hewan === 'cakalang-beku') {
        generateCakalangBekuTable(container);
        return;
    }
    if (hewan === 'hiu-utuh-beku') {
        generateHiuUtuhBekuTable(container);
        return;
    }
    if (hewan === 'fillet-kakap-beku') {
        generateFilletKakapBekuTable(container);
        return;
    }
    if (hewan === 'fillet-nila-beku') {
        generateFilletNilaBekuTable(container);
        return;
    } else if (hewan === 'fillet-ikan-beku') {
        generateFilletIkanBekuTable(container);
        return;
    } else if (hewan === 'bakso-ikan') {
        generateBaksoIkanTable(container);
        return;
    } else if (hewan === 'sosis-ikan') {
        generateSosisIkanTable(container);
        return;
    } else if (hewan === 'daging-kepiting-rebus-beku') {
        generateDagingKepitingRebusBekuTable(container);
        return;
    } else if (hewan === 'ikan-pindang') {
        generateIkanPindangTable(container);
        return;
    } else if (hewan === 'tuna-segar-sashimi') {
        generateTunaSegarSashimiTable(container);
        return;
    } else if (hewan === 'tuna-loin-segar') {
        generateTunaLoinSegarTable(container);
        return;
    } else {
        container.innerHTML = '<p>Formulir belum tersedia untuk jenis ini.</p>';
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


function generateFilletIkanBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'fillet-ikan-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR FILLET IKAN BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Fillet Ikan Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);
    // Hide catatan section and setup QR/barcode syncing
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    // Data untuk tabel penilaian (Based on Image)
    const penilaianData = [
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '1. Lapisan es',
            items: [
                { desc: 'Rata, bening, dan cukup tebal.', nilai: 9 },
                { desc: 'Tidak rata, ada bagian yang terbuka', nilai: 7 },
                { desc: 'Tidak rata, bagian yang terbuka cukup banyak', nilai: 5 },
                { desc: 'Banyak bagian-bagian yang terbuka', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk', nilai: 1 }
            ]
        },
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak mengalami pengeringan', nilai: 9 },
                { desc: 'Sedikit sekali pengeringan', nilai: 7 },
                { desc: 'Pengeringan mulai jelas', nilai: 5 },
                { desc: 'Banyak bagian yang mengering', nilai: 3 },
                { desc: 'Kering dan terjadi freeze-burning', nilai: 1 }
            ]
        },
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '3. Perubahan warna (perubahan warna)',
            items: [
                { desc: 'Belum mengalami perubahan warna', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna', nilai: 7 },
                { desc: 'Banyak mengalami perubahan warna', nilai: 5 },
                { desc: 'Perubahan warna hampir menyeluruh', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh', nilai: 1 }
            ]
        },
        {
            kategori: 'B. Setelah pelelehan (thawing)',
            subKategori: '1. Kenampakan',
            items: [
                { desc: 'Warna spesifik jenis, cemerlang.', nilai: 9 },
                { desc: 'Warna spesifik jenis, kurang cemerlang', nilai: 7 },
                { desc: 'Mulai berubah warna, kusam.', nilai: 5 },
                { desc: 'Bagian pinggir agak kehijauan, kusam.', nilai: 3 },
                { desc: 'Warna kehijauan merata', nilai: 1 }
            ]
        },
        {
            kategori: 'B. Setelah pelelehan (thawing)',
            subKategori: '2. Bau',
            items: [
                { desc: 'Segar, spesifik jenis.', nilai: 9 },
                { desc: 'Netral.', nilai: 7 },
                { desc: 'Apek, sedikit tengik.', nilai: 5 },
                { desc: 'Asam, sedikit bau amoniak, tengik.', nilai: 3 },
                { desc: 'Amoniak dan busuk jelas sekali', nilai: 1 }
            ]
        },
        {
            kategori: 'B. Setelah pelelehan (thawing)',
            subKategori: '3. Tekstur',
            items: [
                { desc: 'Padat, kompak dan elastis.', nilai: 9 },
                { desc: 'Padat, kurang kompak, kurang elastis.', nilai: 7 },
                { desc: 'Agak lembek, kurang elastis, sedikit berair', nilai: 5 },
                { desc: 'Lembek, tidak elastis, berair', nilai: 3 },
                { desc: 'Sangat lembek, berair', nilai: 1 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'fillet-ikan-beku-table';
    table.id = 'filletIkanBekuTable';

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
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => { calculateTotals(); }, 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
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
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
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

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tglDiterima = document.getElementById('tglDiterima');
    if (tglDiterima && !tglDiterima.value) {
        tglDiterima.value = new Date().toISOString().split('T')[0];
    }

    requestAnimationFrame(() => {
        setTimeout(() => { calculateTotals(); }, 50);
    });

    // Tambahkan tombol LHU
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

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

    setTimeout(updatePanelistQRCode, 300);
}




function generateDagingKepitingRebusBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'daging-kepiting-rebus-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR DAGING KEPITING REBUS BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Daging Kepiting Rebus Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Hide catatan section
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    // Data based on user image for Daging Kepiting Rebus Beku
    const penilaianData = [
        {
            kategori: 'Sesudah pelelehan (thawing)',
            subKategori: '1. Kenampakan',
            items: [
                { desc: 'Putih sesuai spesifikasi, cemerlang asli menurut jenis', nilai: 9 },
                { desc: 'Putih sesuai spesifikasi, cemerlang asli menurut jenis sedikit berkurang', nilai: 8 },
                { desc: 'Putih sesuai spesifikasi, cemerlang, menurut jenis mulai hilang', nilai: 7 },
                { desc: 'Warna asli menurut jenis hilang', nilai: 6 },
                { desc: 'Warna asli menurut jenis hilang, agak kusam, mulai berlendir', nilai: 5 },
                { desc: 'Warna asli menurut jenis hilang, kusam, berlendir', nilai: 3 },
                { desc: 'Warna asli menurut jenis hilang, sangat kusam, berlendir', nilai: 1 }
            ]
        },
        {
            kategori: 'Sesudah pelelehan (thawing)',
            subKategori: '2. Bau',
            items: [
                { desc: 'Sangat segar spesifik', nilai: 9 },
                { desc: 'Segar spesifik jenis', nilai: 8 },
                { desc: 'Spesifik jenis netral', nilai: 7 },
                { desc: 'Berubah dari netral', nilai: 6 },
                { desc: 'Mulai timbul bau amonia', nilai: 5 },
                { desc: 'Busuk lanjut dan bau asam sulfida (H₂S)', nilai: 3 },
                { desc: 'Amonia dan bau busuk menyengat', nilai: 1 }
            ]
        },
        {
            kategori: 'Sesudah pelelehan (thawing)',
            subKategori: '3. Tekstur',
            items: [
                { desc: 'Sangat kompak', nilai: 9 },
                { desc: 'Kompak', nilai: 8 },
                { desc: 'Sedikit kompak', nilai: 7 },
                { desc: 'Kurang kompak', nilai: 5 },
                { desc: 'Tidak kompak', nilai: 3 },
                { desc: 'Tidak kompak, agak lembek', nilai: 1 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'daging-kepiting-rebus-beku-table';
    table.id = 'dagingKepitingRebusBekuTable';

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
            // Show category only on first item of FIRST section if we want main category
            // But here structure is Category -> SubCategory -> Items
            // Logic:
            if (itemIndex === 0) {
                // Check if it's the very first item of the section
                // In this data structure, sections allow 'kategori' and 'subKategori'
                if (section.kategori && sectionIndex === 0 && itemIndex === 0) {
                    specText += '<strong>' + section.kategori + '</strong><br>';
                }
                if (section.subKategori) {
                    specText += '<strong>' + section.subKategori + '</strong><br>';
                }
            } else {
                // Nothing specific for non-first items unless complex
            }

            specText += ' - ' + item.desc;

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
                checkbox.dataset.sectionIndex = sectionIndex; // Important for mutual exclusivity
                checkbox.style.display = 'none';

                kodeCell.appendChild(checkbox);

                // Event listener untuk klik pada cell
                kodeCell.addEventListener('click', function (e) {
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        // Uncheck other checkboxes in the same section for this column
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => { calculateTotals(); }, 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
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
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
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

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tglDiterima = document.getElementById('tglDiterima');
    if (tglDiterima && !tglDiterima.value) {
        tglDiterima.value = new Date().toISOString().split('T')[0];
    }

    requestAnimationFrame(() => {
        setTimeout(() => { calculateTotals(); }, 50);
    });

    // Tambahkan tombol LHU
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

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

    setTimeout(updatePanelistQRCode, 300);
}

function generateSosisIkanTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'sosis-ikan-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR SOSIS IKAN</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Sosis Ikan" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Hide catatan section
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    // Data based on user image for Sosis Ikan
    const penilaianData = [
        {
            kategori: '1 Kenampakan',
            items: [
                { desc: 'Cemerlang spesifik produk', nilai: 9 },
                { desc: 'Kurang cemerlang', nilai: 7 },
                { desc: 'Agak kusam, sedikit lendir', nilai: 5 },
                { desc: 'Kusam, berlendir', nilai: 3 }
            ]
        },
        {
            kategori: '2 Bau',
            items: [
                { desc: 'Kuat spesifik jenis', nilai: 9 },
                { desc: 'Kurang kuat spesifik jenis', nilai: 7 },
                { desc: 'Dominan bumbu spesifik jenis kurang', nilai: 5 },
                { desc: 'Amis, apak', nilai: 3 }
            ]
        },
        {
            kategori: '3 Rasa',
            items: [
                { desc: 'Kuat spesifik produk', nilai: 9 },
                { desc: 'Kurang kuat spesifik produk', nilai: 7 },
                { desc: 'Agak masam', nilai: 5 },
                { desc: 'Masam', nilai: 3 }
            ]
        },
        {
            kategori: '4 Tekstur',
            items: [
                { desc: 'Padat, kompak, cukup elastis', nilai: 9 },
                { desc: 'Cukup padat dan kompak', nilai: 7 },
                { desc: 'Agak lembek', nilai: 5 },
                { desc: 'Lembek', nilai: 3 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'sosis-ikan-table';
    table.id = 'sosisIkanTable';

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
            // Handle ordered lists in descriptions if needed, but for now simple text
            if (item.desc.includes(' - ')) {
                specText += ' - ' + item.desc;
            } else {
                specText += ' - ' + item.desc;
            }

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
                checkbox.dataset.sectionIndex = sectionIndex; // Important for mutual exclusivity
                checkbox.style.display = 'none';

                kodeCell.appendChild(checkbox);

                // Event listener untuk klik pada cell
                kodeCell.addEventListener('click', function (e) {
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        // Uncheck other checkboxes in the same section for this column
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => { calculateTotals(); }, 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
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
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
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

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tglDiterima = document.getElementById('tglDiterima');
    if (tglDiterima && !tglDiterima.value) {
        tglDiterima.value = new Date().toISOString().split('T')[0];
    }

    requestAnimationFrame(() => {
        setTimeout(() => { calculateTotals(); }, 50);
    });

    // Tambahkan tombol LHU
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

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

    setTimeout(updatePanelistQRCode, 300);
}

function generateBaksoIkanTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'bakso-ikan-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR BAKSO IKAN</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Bakso Ikan" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Hide catatan section
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    // Data based on user image
    const penilaianData = [
        {
            kategori: '1 Kenampakan',
            items: [
                { desc: 'Permukaan halus, tidak berongga, cerah', nilai: 9 },
                { desc: 'Permukaan agak halus, sedikit berongga, agak cerah', nilai: 7 },
                { desc: 'Permukaan kasar, berongga, kusam', nilai: 5 }
            ]
        },
        {
            kategori: '2 Bau',
            items: [
                { desc: 'Spesifik produk', nilai: 9 },
                { desc: 'Agak spesifik produk', nilai: 7 },
                { desc: 'Netral', nilai: 5 }
            ]
        },
        {
            kategori: '3 Rasa',
            items: [
                { desc: 'Spesifik produk', nilai: 9 },
                { desc: 'Agak spesifik produk', nilai: 7 },
                { desc: 'Hambar', nilai: 5 }
            ]
        },
        {
            kategori: '4 Tekstur',
            items: [
                { desc: 'Padat, kompak, kenyal', nilai: 9 },
                { desc: 'Padat, kompak, agak kenyal', nilai: 7 },
                { desc: 'Tidak padat, tidak kompak, tidak kenyal', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'bakso-ikan-table';
    table.id = 'baksoIkanTable';

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
            // Handle ordered lists in descriptions if needed, but for now simple text
            if (item.desc.includes(' - ')) {
                // Format as list if there are dashes (like in image)
                // Actually image shows: "- Permukaan halus..."
                // I put full text in desc. I'll prepend ' - ' if it's not the header.
                specText += ' - ' + item.desc;
            } else {
                specText += ' - ' + item.desc;
            }

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
                checkbox.dataset.sectionIndex = sectionIndex; // Important for mutual exclusivity
                checkbox.style.display = 'none';

                kodeCell.appendChild(checkbox);

                // Event listener untuk klik pada cell
                kodeCell.addEventListener('click', function (e) {
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        // Uncheck other checkboxes in the same section for this column
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => { calculateTotals(); }, 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
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
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
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

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tglDiterima = document.getElementById('tglDiterima');
    if (tglDiterima && !tglDiterima.value) {
        tglDiterima.value = new Date().toISOString().split('T')[0];
    }

    requestAnimationFrame(() => {
        setTimeout(() => { calculateTotals(); }, 50);
    });

    // Tambahkan tombol LHU
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

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

    setTimeout(updatePanelistQRCode, 300);
}

function generateIkanSegarTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-segar-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR IKAN SEGAR</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
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
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
            <p style="margin: 5px 0;">&#8226; Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
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
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
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


function generateSardenMakarelKalengTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'sarden-makarel-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR SARDEN/MAKAREL KALENG</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Sarden/Makarel Kaleng" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Data untuk tabel penilaian sesuai gambar
    const penilaianData = [
        {
            kategori: '1. Kenampakan',
            items: [
                { desc: 'Utuh, cerah', nilai: 9 },
                { desc: 'Utuh, kurang cerah', nilai: 7 },
                { desc: 'Tidak utuh, kusam', nilai: 5 }
            ]
        },
        {
            kategori: '2. Bau',
            items: [
                { desc: 'Aroma sangat kuat sesuai spesifikasi', nilai: 9 },
                { desc: 'Aroma kuat sesuai spesifikasi', nilai: 7 },
                { desc: 'Mulai tercium bau asam', nilai: 5 }
            ]
        },
        {
            kategori: '3. Rasa',
            items: [
                { desc: 'Sangat sesuai spesifikasi.', nilai: 9 },
                { desc: 'Sesuai spesifikasi', nilai: 7 },
                { desc: 'Tidak sesuai spesifikasi, hambar', nilai: 5 }
            ]
        },
        {
            kategori: '4. Tekstur',
            items: [
                { desc: 'Sangat kompak sesuai spesifikasi', nilai: 9 },
                { desc: 'Kompak sesuai spesifikasi', nilai: 7 },
                { desc: 'Kurang kompak', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'sarden-makarel-table';
    table.id = 'sardenMakarelTable';

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
                specText = '<strong>' + section.kategori + '</strong><br>';
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
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => calculateTotalsSardenMakarel(), 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        totalRow.innerHTML += `<td class="total-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f9f9f9;">0</td>`;
    }
    tbody.appendChild(totalRow);

    // Baris Rata-rata
    const avgRow = document.createElement('tr');
    avgRow.className = 'avg-row';
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        avgRow.innerHTML += `<td class="avg-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f0f0f0;">0.00</td>`;
    }
    tbody.appendChild(avgRow);

    table.appendChild(tbody);
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // LHU Button
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        lhuButton.addEventListener('click', async () => {
            try {
                lhuButton.disabled = true;
                await showLHUPreview();
            } finally {
                lhuButton.disabled = false;
            }
        });
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}


function generateDriedSmokingFishTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-asap-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR DRIED SMOKING FISH (IKAN KAYU)</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Dried Smoking Fish" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Data untuk tabel penilaian sesuai gambar (5 level: 1, 3, 5, 7, 9)
    const penilaianData = [
        {
            kategori: '1. Kenampakan',
            items: [
                { desc: 'Bersih, Warna seragam dan merata tanpa retakan.', nilai: 9 },
                { desc: 'Cukup bersih, warna seragam dan merata tanpa retakan.', nilai: 7 },
                { desc: 'Kurang bersih, warna seragam dan merata sedikit retakan.', nilai: 5 },
                { desc: 'Kotor, warna kurang seragam dan kurang merata, retak-retak.', nilai: 3 },
                { desc: 'Kotor sekali, warna tidak seragam dan tidak rata, retak-retak.', nilai: 1 }
            ]
        },
        {
            kategori: '2. Bau',
            items: [
                { desc: 'Spesifik Ikan Kayu, tanpa bahan tambahan.', nilai: 9 },
                { desc: 'Spesifik bau ikan kayu berkurang, tanpa bau tambahan.', nilai: 7 },
                { desc: 'Spesifik bau ikan kayu tidak ada dengan dengan sedikit bau tambahan.', nilai: 5 },
                { desc: 'Spesifik bau ikan kayu tidak ada dengan tambahan agak kuat.', nilai: 3 },
                { desc: 'Tengik, apek dengan bau tambahan kuat', nilai: 1 }
            ]
        },
        {
            kategori: '3. Rasa',
            items: [
                { desc: 'Sangat suka.', nilai: 9 },
                { desc: 'Suka.', nilai: 7 },
                { desc: 'Biasa.', nilai: 5 },
                { desc: 'Tidak suka.', nilai: 3 },
                { desc: 'Sangat tidak suka.', nilai: 1 }
            ]
        },
        {
            kategori: '4. Tekstur',
            items: [
                { desc: 'Keras, tidak mudah patah.', nilai: 9 },
                { desc: 'Kurang keras, agak mudah patah.', nilai: 7 },
                { desc: 'Agak rapuh.', nilai: 5 },
                { desc: 'Rapuh.', nilai: 3 },
                { desc: 'Hancur.', nilai: 1 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'ikan-asap-table';
    table.id = 'ikanAsapTable';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 250px;">Spesifikasi</th>
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
                specText = '<strong>' + section.kategori + '</strong><br>';
            }
            specText += '- ' + item.desc;
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
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => calculateTotalsIkanAsap(), 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        totalRow.innerHTML += `<td class="total-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f9f9f9;">0</td>`;
    }
    tbody.appendChild(totalRow);

    // Baris Rata-rata
    const avgRow = document.createElement('tr');
    avgRow.className = 'avg-row';
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        avgRow.innerHTML += `<td class="avg-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f0f0f0;">0.00</td>`;
    }
    tbody.appendChild(avgRow);

    table.appendChild(tbody);
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // LHU Button
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        lhuButton.addEventListener('click', async () => {
            try {
                lhuButton.disabled = true;
                await showLHUPreview();
            } finally {
                lhuButton.disabled = false;
            }
        });
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsIkanAsap() {
    const table = document.getElementById('ikanAsapTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

function generateIkanAsinKeringTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-asin-kering-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR IKAN ASIN KERING</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Ikan Asin Kering" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Data untuk tabel penilaian sesuai gambar
    const penilaianData = [
        {
            kategori: '1. Kenampakan',
            items: [
                { desc: 'Spesifik produk, tidak ada jamur, tidak ada bintik merah muda.', nilai: 9 },
                { desc: 'Kurang spesifik produk, tidak ada jamur, tidak ada bintik merah muda.', nilai: 7 },
                { desc: 'Tidak spesifik produk, terdapat benda asing, terdapat garam di permukaan, terdapat jamur atau terdapat bintik merah muda.', nilai: 5 }
            ]
        },
        {
            kategori: '2. Bau',
            items: [
                { desc: 'Spesifik produk kuat', nilai: 9 },
                { desc: 'Spesifik produk kurang kuat', nilai: 7 },
                { desc: 'Tengik, apak', nilai: 5 }
            ]
        },
        {
            kategori: '3. Tekstur',
            items: [
                { desc: 'Padat, kering', nilai: 9 },
                { desc: 'Padat, kurang kering', nilai: 7 },
                { desc: 'Kurang padat, mulai rapuh', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'ikan-asin-kering-table';
    table.id = 'ikanAsinKeringTable';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 250px;">Spesifikasi</th>
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
                specText = '<strong>' + section.kategori + '</strong><br>';
            }
            specText += '- ' + item.desc;
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
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => calculateTotalsIkanAsinKering(), 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        totalRow.innerHTML += `<td class="total-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f9f9f9;">0</td>`;
    }
    tbody.appendChild(totalRow);

    // Baris Rata-rata
    const avgRow = document.createElement('tr');
    avgRow.className = 'avg-row';
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        avgRow.innerHTML += `<td class="avg-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f0f0f0;">0.00</td>`;
    }
    tbody.appendChild(avgRow);

    table.appendChild(tbody);
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // LHU Button
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        lhuButton.addEventListener('click', async () => {
            try {
                lhuButton.disabled = true;
                await showLHUPreview();
            } finally {
                lhuButton.disabled = false;
            }
        });
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsIkanAsinKering() {
    const table = document.getElementById('ikanAsinKeringTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

function generateRumputLautKeringTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'rumput-laut-kering-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR RUMPUT LAUT KERING</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Rumput Laut Kering" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Data untuk tabel penilaian sesuai gambar
    const penilaianData = [
        {
            kategori: '1. Kenampakan talus',
            items: [
                { desc: 'Bersih, ada kristal garam warna putih dipermukaan talus, warna talus cerah spesifik jenis', nilai: 9 },
                { desc: 'Sedikit kurang bersih, ada kristal garam warna kusam dipermukaan talus, warna talus kurang cerah atau agak kusam', nilai: 7 },
                { desc: 'Kurang bersih, tidak ada kristal garam dipermukaan talus, warna talus kusam spesifik jenis, talus tidak padat', nilai: 5 }
            ]
        },
        {
            kategori: '2. Tekstur',
            items: [
                { desc: 'Kering merata, talus padat dan liat tidak mudah dipatahkan', nilai: 9 },
                { desc: 'Kering kurang merata, talus padat dan liat tidak mudah dipatahkan', nilai: 7 },
                { desc: 'Lembab, liat agak mudah dipatahkan, talus mengkerut.', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'rumput-laut-kering-table';
    table.id = 'rumputLautKeringTable';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f5f5f5; min-width: 250px;">Spesifikasi</th>
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
                specText = '<strong>' + section.kategori + '</strong><br>';
            }
            specText += '- ' + item.desc;
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
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => calculateTotalsRumputLautKering(), 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        totalRow.innerHTML += `<td class="total-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f9f9f9;">0</td>`;
    }
    tbody.appendChild(totalRow);

    // Baris Rata-rata
    const avgRow = document.createElement('tr');
    avgRow.className = 'avg-row';
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
    for (let kode = 1; kode <= 6; kode++) {
        avgRow.innerHTML += `<td class="avg-cell" data-kode="${kode}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 600; background: #f0f0f0;">0.00</td>`;
    }
    tbody.appendChild(avgRow);

    table.appendChild(tbody);
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // LHU Button
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        lhuButton.addEventListener('click', async () => {
            try {
                lhuButton.disabled = true;
                await showLHUPreview();
            } finally {
                lhuButton.disabled = false;
            }
        });
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsRumputLautKering() {
    const table = document.getElementById('rumputLautKeringTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

/**
 * Menghasilkan nama file sesuai format: [Jenis]_[No. Uji]_[Panelis]-[Tanggal]
 */
function getFormattedFilename(data, hewan) {
    const hewanNames = {
        'ikan-segar': 'Ikan Segar',
        'ikan-beku': 'Ikan Beku',
        'ikan-tuna-kaleng': 'Ikan Tuna Kaleng',
        'sarden-makarel-kaleng': 'Sarden/Makarel Kaleng',
        'ikan-asap': 'Dried Smoking Fish (Ikan Kayu)',
        'ikan-asin-kering': 'Ikan Asin Kering',
        'rumput-laut-kering': 'Rumput Laut Kering',
        'lobster-udang-kipas': 'LOBSTER, UDANG KIPAS HIDUP',
        'fillet-ikan-beku': 'Fillet Ikan Beku'
    };

    const jenis = hewanNames[hewan] || 'Uji';
    const noPTK = data.kodeContohUji || 'TanpaPTK';
    const panelis = data.namaPetugas || data.namaPanelis || data.namaPanelisTuna || 'Panelis';
    // Tanggal diuji format angka semua
    const tanggal = (data.tanggalUji || '').replace(/-/g, '');

    return `${jenis}_PTK-${noPTK}_${panelis}-${tanggal}`;
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

// function backupToGDrive moved to avoid duplication

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
    } else if (hewan === 'sarden-makarel-kaleng') {
        const table = document.getElementById('sardenMakarelTable');
        if (table) {
            data.penilaianSardenMakarel = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianSardenMakarel[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'ikan-asap') {
        const table = document.getElementById('ikanAsapTable');
        if (table) {
            data.penilaianIkanAsap = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianIkanAsap[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'ikan-asin-kering') {
        const table = document.getElementById('ikanAsinKeringTable');
        if (table) {
            data.penilaianIkanAsinKering = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianIkanAsinKering[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'rumput-laut-kering') {
        const table = document.getElementById('rumputLautKeringTable');
        if (table) {
            data.penilaianRumputLautKering = {};
            for (let kode = 1; kode <= 8; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianRumputLautKering[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'lobster-udang-kipas') {
        const table = document.getElementById('lobsterUdangKipasTable');
        if (table) {
            data.penilaianLobsterUdangKipas = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianLobsterUdangKipas[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'kepiting-bakau') {
        const table = document.getElementById('kepitingBakauTable');
        if (table) {
            data.penilaianKepitingBakau = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianKepitingBakau[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'ikan-asap-murni') {
        const table = document.getElementById('ikanAsapMurniTable');
        if (table) {
            data.penilaianIkanAsapMurni = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianIkanAsapMurni[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'sirip-hiu-kering') {
        const table = document.getElementById('siripHiuKeringTable');
        if (table) {
            data.penilaianSiripHiuKering = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianSiripHiuKering[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'udang-kering-utuh') {
        const table = document.getElementById('udangKeringUtuhTable');
        if (table) {
            data.penilaianUdangKeringUtuh = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianUdangKeringUtuh[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'abon-ikan') {
        const table = document.getElementById('abonIkanTable');
        if (table) {
            data.penilaianAbonIkan = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianAbonIkan[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'sambal-ikan') {
        const table = document.getElementById('sambalIkanTable');
        if (table) {
            data.penilaianSambalIkan = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianSambalIkan[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'tuna-loin-beku') {
        const table = document.getElementById('tunaLoinBekuTable');
        if (table) {
            data.penilaianTunaLoinBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianTunaLoinBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'tuna-steak-beku') {
        const table = document.getElementById('tunaSteakBekuTable');
        if (table) {
            data.penilaianTunaSteakBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianTunaSteakBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'udang-segar') {
        const table = document.getElementById('udangSegarTable');
        if (table) {
            data.penilaianUdangSegar = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianUdangSegar[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'udang-beku') {
        const table = document.getElementById('udangBekuTable');
        if (table) {
            data.penilaianUdangBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianUdangBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'udang-masak-beku') {
        const table = document.getElementById('udangMasakBekuTable');
        if (table) {
            data.penilaianUdangMasakBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianUdangMasakBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'cumi-cumi-beku') {
        const table = document.getElementById('cumiCumiBekuTable');
        if (table) {
            data.penilaianCumiCumiBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianCumiCumiBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'gurita-mentah-beku') {
        const table = document.getElementById('guritaMentahBekuTable');
        if (table) {
            data.penilaianGuritaMentahBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianGuritaMentahBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'lobster-beku') {
        const table = document.getElementById('lobsterBekuTable');
        if (table) {
            data.penilaianLobsterBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianLobsterBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'cakalang-beku') {
        const table = document.getElementById('cakalangBekuTable');
        if (table) {
            data.penilaianCakalangBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianCakalangBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'hiu-utuh-beku') {
        const table = document.getElementById('hiuUtuhBekuTable');
        if (table) {
            data.penilaianHiuUtuhBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianHiuUtuhBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'fillet-kakap-beku') {
        const table = document.getElementById('filletKakapBekuTable');
        if (table) {
            data.penilaianFilletKakapBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianFilletKakapBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'fillet-nila-beku') {
        const table = document.getElementById('filletNilaBekuTable');
        if (table) {
            data.penilaianFilletNilaBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianFilletNilaBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'fillet-ikan-beku') {
        const table = document.getElementById('filletIkanBekuTable');
        if (table) {
            data.penilaianFilletIkanBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianFilletIkanBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'sosis-ikan') {
        const table = document.getElementById('sosisIkanTable');
        if (table) {
            data.penilaianSosisIkan = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianSosisIkan[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'daging-kepiting-rebus-beku') {
        const table = document.getElementById('dagingKepitingRebusBekuTable');
        if (table) {
            data.penilaianDagingKepitingRebusBeku = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianDagingKepitingRebusBeku[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'bakso-ikan') {
        const table = document.getElementById('baksoIkanTable');
        if (table) {
            data.penilaianBaksoIkan = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianBaksoIkan[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'ikan-pindang') {
        const table = document.getElementById('ikanPindangTable');
        if (table) {
            data.penilaianIkanPindang = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianIkanPindang[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'tuna-segar-sashimi') {
        const table = document.getElementById('tunaSegarSashimiTable');
        if (table) {
            data.penilaianTunaSegarSashimi = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianTunaSegarSashimi[`kodeContoh${kode}`] = {
                    total: totalCell?.textContent || '0',
                    rataRata: avgCell?.textContent || '0.00',
                    nilai: Array.from(table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`)).map(cb => ({
                        rowIndex: parseInt(cb.dataset.rowIndex),
                        nilai: parseInt(cb.dataset.nilai)
                    }))
                };
            }
        }
    } else if (hewan === 'tuna-loin-segar') {
        const table = document.getElementById('tunaLoinSegarTable');
        if (table) {
            data.penilaianTunaLoinSegar = {};
            for (let kode = 1; kode <= 6; kode++) {
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                data.penilaianTunaLoinSegar[`kodeContoh${kode}`] = {
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
    if (hewan === 'sarden-makarel-kaleng') jenisContoh = 'Sarden/Makarel Kaleng';
    if (hewan === 'ikan-asap') jenisContoh = 'Dried Smoking Fish (Ikan Kayu)';
    if (hewan === 'ikan-asin-kering') jenisContoh = 'Ikan Asin Kering';
    if (hewan === 'rumput-laut-kering') jenisContoh = 'Rumput Laut Kering';
    if (hewan === 'lobster-udang-kipas') jenisContoh = 'LOBSTER, UDANG KIPAS HIDUP';
    if (hewan === 'kepiting-bakau') jenisContoh = 'KEPITING BAKAU HIDUP';
    if (hewan === 'ikan-asap-murni') jenisContoh = 'IKAN ASAP';
    if (hewan === 'sirip-hiu-kering') jenisContoh = 'Sirip Hiu Kering dengan Kulit';
    if (hewan === 'udang-kering-utuh') jenisContoh = 'Udang Kering Utuh';
    if (hewan === 'abon-ikan') jenisContoh = 'Abon Ikan, Krustasea, dan Moluska';
    if (hewan === 'sambal-ikan') jenisContoh = 'Sambal Ikan';
    if (hewan === 'tuna-loin-beku') jenisContoh = 'Tuna Loin Beku';
    if (hewan === 'tuna-steak-beku') jenisContoh = 'Tuna Steak Beku';
    if (hewan === 'udang-segar') jenisContoh = 'Udang Segar';
    if (hewan === 'udang-beku') jenisContoh = 'Udang Beku';
    if (hewan === 'udang-masak-beku') jenisContoh = 'Udang Masak Beku';
    if (hewan === 'cumi-cumi-beku') jenisContoh = 'Cumi-cumi Beku';
    if (hewan === 'gurita-mentah-beku') jenisContoh = 'Gurita Mentah Beku';
    if (hewan === 'lobster-beku') jenisContoh = 'Lobster Beku';
    if (hewan === 'cakalang-beku') jenisContoh = 'Cakalang Beku';
    if (hewan === 'hiu-utuh-beku') jenisContoh = 'Hiu Utuh Beku';
    if (hewan === 'fillet-kakap-beku') jenisContoh = 'Fillet Kakap Beku';
    if (hewan === 'fillet-nila-beku') jenisContoh = 'Fillet Nila (Tilapia sp.) Beku';
    if (hewan === 'fillet-ikan-beku') jenisContoh = 'Fillet Ikan Beku';
    if (hewan === 'bakso-ikan') jenisContoh = 'Bakso Ikan';
    if (hewan === 'sosis-ikan') jenisContoh = 'Sosis Ikan';
    if (hewan === 'daging-kepiting-rebus-beku') jenisContoh = 'Daging Kepiting Rebus Beku';
    if (hewan === 'ikan-pindang') jenisContoh = 'Ikan Pindang';
    if (hewan === 'tuna-segar-sashimi') jenisContoh = 'Tuna Segar Untuk Sashimi';
    if (hewan === 'tuna-loin-segar') jenisContoh = 'Tuna Loin Segar';

    const isIkanBeku = (hewan === 'ikan-beku');
    const isIkanTuna = (hewan === 'ikan-tuna-kaleng');
    const isSardenMakarel = (hewan === 'sarden-makarel-kaleng');
    const isIkanAsap = (hewan === 'ikan-asap');
    const isIkanAsinKering = (hewan === 'ikan-asin-kering');
    const isRumputLautKering = (hewan === 'rumput-laut-kering');
    const isLobsterUdangKipas = (hewan === 'lobster-udang-kipas');
    const isKepitingBakau = (hewan === 'kepiting-bakau');
    const isIkanAsapMurni = (hewan === 'ikan-asap-murni');
    const isSiripHiuKering = (hewan === 'sirip-hiu-kering');
    const isUdangKeringUtuh = (hewan === 'udang-kering-utuh');
    const isAbonIkan = (hewan === 'abon-ikan');
    const isSambalIkan = (hewan === 'sambal-ikan');
    const isTunaLoinBeku = (hewan === 'tuna-loin-beku');
    const isTunaSteakBeku = (hewan === 'tuna-steak-beku');
    const isUdangSegar = (hewan === 'udang-segar');
    const isUdangBeku = (hewan === 'udang-beku');
    const isUdangMasakBeku = (hewan === 'udang-masak-beku');
    const isCumiCumiBeku = (hewan === 'cumi-cumi-beku');
    const isGuritaMentahBeku = (hewan === 'gurita-mentah-beku');
    const isIkanPindang = (hewan === 'ikan-pindang');
    const isTunaSegarSashimi = (hewan === 'tuna-segar-sashimi');
    const isTunaLoinSegar = (hewan === 'tuna-loin-segar');
    const isLobsterBeku = (hewan === 'lobster-beku');
    const isCakalangBeku = (hewan === 'cakalang-beku');
    const isHiuUtuhBeku = (hewan === 'hiu-utuh-beku');
    const isFilletKakapBeku = (hewan === 'fillet-kakap-beku');
    const isFilletNilaBeku = (hewan === 'fillet-nila-beku');
    const isFilletIkanBeku = (hewan === 'fillet-ikan-beku');
    const isBaksoIkan = (hewan === 'bakso-ikan');
    const isSosisIkan = (hewan === 'sosis-ikan');
    const isDagingKepitingRebusBeku = (hewan === 'daging-kepiting-rebus-beku');

    const titles = {
        'ikan-beku': 'IKAN BEKU',
        'ikan-tuna-kaleng': 'IKAN TUNA KALENG',
        'sarden-makarel-kaleng': 'SARDEN/MAKAREL KALENG',
        'ikan-asap': 'DRIED SMOKING FISH',
        'ikan-asap-murni': 'IKAN ASAP',
        'ikan-asin-kering': 'IKAN ASIN KERING',
        'rumput-laut-kering': 'RUMPUT LAUT KERING',
        'lobster-udang-kipas': 'LOBSTER, UDANG KIPAS HIDUP',
        'kepiting-bakau': 'KEPITING BAKAU HIDUP',
        'sirip-hiu-kering': 'SIRIP HIU KERING DENGAN KULIT',
        'udang-kering-utuh': 'UDANG KERING UTUH',
        'abon-ikan': 'ABON IKAN, KRUSTASEA, DAN MOLUSKA',
        'sambal-ikan': 'SAMBAL IKAN',
        'tuna-loin-beku': 'TUNA LOIN BEKU',
        'tuna-steak-beku': 'TUNA STEAK BEKU',
        'udang-segar': 'UDANG SEGAR',
        'udang-beku': 'UDANG BEKU',
        'udang-masak-beku': 'UDANG MASAK BEKU',
        'cumi-cumi-beku': 'CUMI-CUMI BEKU',
        'gurita-mentah-beku': 'GURITA MENTAH BEKU',
        'lobster-beku': 'LOBSTER BEKU',
        'cakalang-beku': 'CAKALANG BEKU',
        'hiu-utuh-beku': 'HIU UTUH BEKU',
        'fillet-kakap-beku': 'FILLET KAKAP BEKU',
        'fillet-nila-beku': 'FILLET NILA (TILAPIA SP.) BEKU',
        'fillet-ikan-beku': 'FILLET IKAN BEKU',
        'bakso-ikan': 'BAKSO IKAN',
        'sosis-ikan': 'SOSIS IKAN',
        'daging-kepiting-rebus-beku': 'DAGING KEPITING REBUS BEKU',
        'ikan-pindang': 'IKAN PINDANG',
        'tuna-segar-sashimi': 'TUNA SEGAR UNTUK SASHIMI',
        'tuna-loin-segar': 'TUNA LOIN SEGAR'
    };
    const titleText = titles[hewan] || 'IKAN SEGAR';

    const snis = {
        'ikan-beku': 'SNI 4110-2020',
        'ikan-tuna-kaleng': 'SNI 8223-2022',
        'sarden-makarel-kaleng': 'SNI 8222-2016',
        'ikan-asap': 'SNI 2725.1-2009',
        'ikan-asin-kering': 'SNI 8273-2023',
        'rumput-laut-kering': 'SNI 2690-2018',
        'lobster-udang-kipas': 'SNI 4488-2016',
        'kepiting-bakau': 'SNI 9057-1:2022',
        'udang-kering-utuh': 'SNI 2709.1:2010',
        'sirip-hiu-kering': 'SNI 2695-2017',
        'abon-ikan': 'SNI 7690-2019',
        'sambal-ikan': 'SNI 8740:2019',
        'tuna-loin-beku': 'SNI 5006:2014',
        'tuna-steak-beku': 'SNI 4110-2020',
        'udang-segar': 'SNI 01-2728.1-2006',
        'udang-beku': 'SNI 2705-2020',
        'udang-masak-beku': 'SNI 2705:2014',
        'lobster-beku': 'SNI 2711.1-2009',
        'cumi-cumi-beku': 'SNI 2731.1-2010',
        'gurita-mentah-beku': 'SNI 6941-2017',
        'cakalang-beku': 'SNI 01-2710.1-2006',
        'hiu-utuh-beku': 'SNI 01-7145.1-2005',
        'fillet-kakap-beku': 'SNI 01-2696.1-2006',
        'fillet-nila-beku': 'SNI 01-4103.1-2006',
        'fillet-ikan-beku': 'SNI 2696-2913',
        'bakso-ikan': 'SNI 7266-2017',
        'sosis-ikan': 'SNI 7755-2013',
        'ikan-asap-murni': 'SNI 2725.1-2009',
        'daging-kepiting-rebus-beku': 'SNI 3231.1-2010',
        'ikan-pindang': 'SNI 2717-2017',
        'tuna-segar-sashimi': 'SNI 2693 - 2014',
        'tuna-loin-segar': 'SNI 7530-2018'
    };
    const sniStandard = snis[hewan] || 'SNI 2729-2021';

    const kodeContohData = [];
    let penilaian = data.penilaianIkanSegar;
    if (isIkanBeku) penilaian = data.penilaianIkanBeku;
    else if (isIkanTuna) penilaian = data.penilaianIkanTunaKaleng;
    else if (isSardenMakarel) penilaian = data.penilaianSardenMakarel;
    else if (isIkanAsap) penilaian = data.penilaianIkanAsap;
    else if (isIkanAsinKering) penilaian = data.penilaianIkanAsinKering;
    else if (isRumputLautKering) penilaian = data.penilaianRumputLautKering;
    else if (isLobsterUdangKipas) penilaian = data.penilaianLobsterUdangKipas;
    else if (isKepitingBakau) penilaian = data.penilaianKepitingBakau;
    else if (isIkanAsapMurni) penilaian = data.penilaianIkanAsapMurni;
    else if (isSiripHiuKering) penilaian = data.penilaianSiripHiuKering;
    else if (isUdangKeringUtuh) penilaian = data.penilaianUdangKeringUtuh;
    else if (isAbonIkan) penilaian = data.penilaianAbonIkan;
    else if (isSambalIkan) penilaian = data.penilaianSambalIkan;
    else if (isTunaLoinBeku) penilaian = data.penilaianTunaLoinBeku;
    else if (isTunaSteakBeku) penilaian = data.penilaianTunaSteakBeku;
    else if (isUdangSegar) penilaian = data.penilaianUdangSegar;
    else if (isUdangBeku) penilaian = data.penilaianUdangBeku;
    else if (isUdangMasakBeku) penilaian = data.penilaianUdangMasakBeku;
    else if (isLobsterBeku) penilaian = data.penilaianLobsterBeku;
    else if (isCumiCumiBeku) penilaian = data.penilaianCumiCumiBeku;
    else if (isGuritaMentahBeku) penilaian = data.penilaianGuritaMentahBeku;
    else if (isIkanPindang) penilaian = data.penilaianIkanPindang;
    else if (isTunaSegarSashimi) penilaian = data.penilaianTunaSegarSashimi;
    else if (isTunaLoinSegar) penilaian = data.penilaianTunaLoinSegar;
    else if (isCakalangBeku) penilaian = data.penilaianCakalangBeku;
    else if (isHiuUtuhBeku) penilaian = data.penilaianHiuUtuhBeku;
    else if (isFilletKakapBeku) penilaian = data.penilaianFilletKakapBeku;
    else if (isFilletNilaBeku) penilaian = data.penilaianFilletNilaBeku;
    else if (isFilletIkanBeku) penilaian = data.penilaianFilletIkanBeku;
    else if (isBaksoIkan) penilaian = data.penilaianBaksoIkan;
    else if (isSosisIkan) penilaian = data.penilaianSosisIkan;
    else if (isDagingKepitingRebusBeku) penilaian = data.penilaianDagingKepitingRebusBeku;

    if (penilaian) {
        let maxSamples = 6;
        if (isRumputLautKering) maxSamples = 6;
        if (isSambalIkan) maxSamples = 6; // Keep 6 as requested previously for Sambal Ikan (user mentioned match Ikan Segar)

        for (let i = 1; i <= maxSamples; i++) {
            const item = penilaian[`kodeContoh${i}`];
            if (item && item.nilai && item.nilai.length > 0) {
                kodeContohData.push({ kode: i, nilai: item.nilai });
            }
        }
    }

    // Header logic
    const headerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 5px; border-bottom: 2px solid #333; padding-bottom: 5px;">
        <div style="flex: 0 0 80px; margin-right: 6px; display:flex; align-items:center; justify-content:center;"><img src="https://id.wikipedia.org/wiki/Special:FilePath/Logo_Barantin.svg" alt="Logo Barantin" style="width: 80px; height: 80px; object-fit: contain; display: block; border: none; border-radius: 0;"/></div>
        <div style="flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;"><div style="font-weight: bold; font-size: 14px; margin-bottom: 2px;">BADAN KARANTINA INDONESIA</div><div style="font-size: 12px; margin-bottom: 2px;">BALAI KARANTINA HEWAN, IKAN DAN TUMBUHAN</div><div style="font-size: 12px; margin-bottom: 2px; font-weight: bold;">SULAWESI UTARA</div><div style="font-size: 11px; margin-bottom: 2px;">JL. AA MARAMIS NO. 283, KEC. MAPANGET, KOTA MANADO, SULAWESI UTARA 95258</div><div style="font-size: 11px; margin-bottom: 2px;">Telp. 082190899090, Email: karantinasulut@karantinaindonesia.go.id</div><div style="font-size: 11px;">www.karantinaindonesia.go.id</div></div>
    </div>
    <h2 style="text-align: center; font-size: 13px; font-weight: bold; margin: 5px 0;">LAMPIRAN LAPORAN HASIL UJI SEMENTARA<br/>SENSORI/ORGANOLEPTIK - ${titleText}</h2>
    <table class="header-info-table" style="width:100%; margin-bottom: 5px; font-size:8pt; border-collapse: collapse; table-layout: fixed;">
        <tr><td style="width: 180px; text-align: left; vertical-align: middle; padding: 2px 8px;"><strong>Kode Contoh Uji</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 2px 8px; vertical-align: middle;">${kodeContohUji || '-'}</td></tr>
        <tr><td style="width: 180px; text-align: left; vertical-align: middle; padding: 2px 8px;"><strong>Jenis Contoh Uji</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 2px 8px; vertical-align: middle;">${jenisContoh || '-'}</td></tr>
        <tr><td style="width: 180px; text-align: left; vertical-align: middle; padding: 2px 8px;"><strong>Tanggal Masuk</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 2px 8px; vertical-align: middle;">${tglDiterima ? formatIndoDate(tglDiterima) : '-'}</td></tr>
        <tr><td style="width: 180px; text-align: left; vertical-align: middle; padding: 2px 8px;"><strong>Tanggal Pengujian</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 2px 8px; vertical-align: middle;">${tanggalUji ? formatIndoDate(tanggalUji) : '-'}</td></tr>
        <tr><td style="width: 180px; text-align: left; vertical-align: middle; padding: 2px 8px;"><strong>Metode Pengujian</strong></td><td style="width: 12px; text-align: center; vertical-align: middle;">:</td><td style="text-align: left; padding: 2px 8px; vertical-align: middle;"><strong>${sniStandard}</strong></td></tr>
    </table>`;

    // Parameter mapping logic for summary table
    let parameterList = [];
    let renderGroups = [];

    if (isSosisIkan) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2, 3] },
            { name: '2. Bau', rowIndices: [4, 5, 6, 7] },
            { name: '3. Rasa', rowIndices: [8, 9, 10, 11] },
            { name: '4. Tekstur', rowIndices: [12, 13, 14, 15] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3]];
    } else if (isDagingKepitingRebusBeku) {
        parameterList = [
            { name: 'Sesudah pelelehan (thawing)\n   1. Kenampakan', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: '2. Bau', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: '3. Tekstur', rowIndices: [14, 15, 16, 17, 18, 19] }
        ];
        renderGroups = [
            {
                name: `Sesudah pelelehan (thawing)\n   1. Kenampakan\n   2. Bau\n   3. Tekstur`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            }
        ];
    } else if (isIkanBeku) {
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
    } else if (isSardenMakarel) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Bau', rowIndices: [3, 4, 5] },
            { name: '3. Rasa', rowIndices: [6, 7, 8] },
            { name: '4. Tekstur', rowIndices: [9, 10, 11] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3]];
    } else if (isIkanAsap) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2, 3, 4] },
            { name: '2. Bau', rowIndices: [5, 6, 7, 8, 9] },
            { name: '3. Rasa', rowIndices: [10, 11, 12, 13, 14] },
            { name: '4. Tekstur', rowIndices: [15, 16, 17, 18, 19] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3]];
    } else if (isIkanAsinKering) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Bau', rowIndices: [3, 4, 5] },
            { name: '3. Tekstur', rowIndices: [6, 7, 8] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2]];
    } else if (isRumputLautKering) {
        parameterList = [
            { name: '1. Kenampakan talus', rowIndices: [0, 1, 2] },
            { name: '2. Tekstur', rowIndices: [3, 4, 5] }
        ];
        renderGroups = [parameterList[0], parameterList[1]];
    } else if (isLobsterUdangKipas) {
        parameterList = [
            { name: '1. Mutu Sensori', rowIndices: [0, 1, 2] }
        ];
        renderGroups = [parameterList[0]];
    } else if (isKepitingBakau) {
        parameterList = [
            { name: '1. Mutu Sensori', rowIndices: [0, 1, 2, 3, 4] }
        ];
        renderGroups = [parameterList[0]];
    } else if (isIkanAsapMurni) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2, 3, 4] },
            { name: '2. Bau', rowIndices: [5, 6, 7, 8, 9] },
            { name: '3. Rasa', rowIndices: [10, 11, 12, 13, 14] },
            { name: '4. Tekstur', rowIndices: [15, 16, 17, 18, 19] },
            { name: '5. Jamur', rowIndices: [20, 21] },
            { name: '6. Lendir', rowIndices: [22, 23] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3], parameterList[4], parameterList[5]];
    } else if (isSiripHiuKering) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Bau', rowIndices: [3, 4, 5] },
            { name: '3. Tekstur', rowIndices: [6, 7, 8] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2]];
    } else if (isUdangKeringUtuh) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2, 3, 4] },
            { name: '2. Bau', rowIndices: [5, 6, 7, 8, 9] },
            { name: '3. Rasa', rowIndices: [10, 11, 12, 13, 14] },
            { name: '4. Tekstur', rowIndices: [15, 16, 17, 18, 19] },
            { name: '5. Jamur', rowIndices: [20, 21] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3], parameterList[4]];
    } else if (isAbonIkan) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Bau', rowIndices: [3, 4, 5] },
            { name: '3. Rasa', rowIndices: [6, 7, 8] },
            { name: '4. Tekstur', rowIndices: [9, 10, 11] },
            { name: '5. Kapang', rowIndices: [12, 13] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3], parameterList[4]];
    } else if (isSambalIkan) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Aroma', rowIndices: [3, 4, 5] },
            { name: '3. Tekstur', rowIndices: [6, 7] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2]];
    } else if (isTunaLoinBeku) {
        parameterList = [
            { name: '1. Lapisan es', rowIndices: [0, 1, 2, 3, 4] },
            { name: '2. Pengeringan', rowIndices: [5, 6, 7, 8, 9] },
            { name: '3. Perubahan warna', rowIndices: [10, 11, 12, 13, 14] },
            { name: '4. Kenampakan', rowIndices: [15, 16, 17, 18, 19] },
            { name: '5. Bau', rowIndices: [20, 21, 22, 23, 24] },
            { name: '6. Tekstur', rowIndices: [25, 26, 27, 28, 29] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3], parameterList[4], parameterList[5]];
    } else if (isTunaSteakBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan es', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: '2. Pengeringan', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: '3. Perubahan warna', rowIndices: [14, 15, 16, 17, 18, 19, 20] },
            { name: 'B. Sesudah pelelehan\n   1. Kenampakan', rowIndices: [21, 22, 23, 24, 25, 26, 27] },
            { name: '3. Bau', rowIndices: [28, 29, 30, 31, 32, 33, 34] },
            { name: '4. Tekstur', rowIndices: [35, 36, 37, 38, 39, 40, 41] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan\n   1. Kenampakan\n   3. Bau\n   4. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isUdangBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan es', rowIndices: [0, 1, 2] },
            { name: '2. Pengeringan (dehidrasi)', rowIndices: [3, 4, 5] },
            { name: '3. Perubahan warna (diskolorasi)', rowIndices: [6, 7, 8] },
            { name: 'B. Sesudah pelelehan (thawing)\n   1. Kenampakan', rowIndices: [9, 10, 11] },
            { name: '2. Bau', rowIndices: [12, 13, 14] },
            { name: '3. Tekstur', rowIndices: [15, 16, 17] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan es\n   2. Pengeringan (dehidrasi)\n   3. Perubahan warna (diskolorasi)`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan (thawing)\n   1. Kenampakan\n   2. Bau\n   3. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isUdangMasakBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan es', rowIndices: [0, 1, 2] },
            { name: '2. Pengeringan', rowIndices: [3, 4, 5] },
            { name: '3. Perubahan warna', rowIndices: [6, 7, 8] },
            { name: 'B. Sesudah dilelehkan\n   1. Kenampakan', rowIndices: [9, 10, 11] },
            { name: '2. Bau', rowIndices: [12, 13, 14] },
            { name: '3. Rasa', rowIndices: [15, 16, 17] },
            { name: '4. Tekstur', rowIndices: [18, 19, 20] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            parameterList[3],
            parameterList[4],
            parameterList[5],
            parameterList[6]
        ];
    } else if (isCumiCumiBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan es', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: '2. Pengeringan', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: '3. Perubahan warna', rowIndices: [14, 15, 16, 17, 18, 19, 20] },
            { name: 'B. Sesudah pelelehan\n   1. Kenampakan', rowIndices: [21, 22, 23, 24, 25, 26, 27] },
            { name: '2. Bau', rowIndices: [28, 29, 30, 31, 32, 33] },
            { name: '3. Tekstur', rowIndices: [34, 35, 36, 37, 38, 39] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan\n   1. Kenampakan\n   2. Bau\n   3. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isGuritaMentahBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan es', rowIndices: [0, 1, 2] },
            { name: '2. Pengeringan', rowIndices: [3, 4, 5] },
            { name: '3. Perubahan warna', rowIndices: [6, 7, 8] },
            { name: 'B. Sesudah pelelehan\n   1. Kenampakan', rowIndices: [9, 10, 11] },
            { name: '2. Bau', rowIndices: [12, 13, 14] },
            { name: '3. Tekstur', rowIndices: [15, 16, 17] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan\n   1. Kenampakan\n   2. Bau\n   3. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isLobsterBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan Es', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: '2. Pengeringan', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: '3. Perubahan warna', rowIndices: [14, 15, 16, 17, 18, 19, 20] },
            { name: 'B. Sesudah pelelehan\n   1. Kenampakan', rowIndices: [21, 22, 23, 24, 25, 26, 27] },
            { name: '2. Bau', rowIndices: [28, 29, 30, 31, 32, 33] },
            { name: '3. Konsistensi', rowIndices: [34, 35, 36, 37, 38, 39] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan Es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            parameterList[3],
            parameterList[4],
            parameterList[5]
        ];
    } else if (isCakalangBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan es', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: '2. Pengeringan', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: '3. Perubahan warna', rowIndices: [14, 15, 16, 17, 18, 19, 20] },
            { name: 'B. Sesudah pelelehan\n   1. Kenampakan', rowIndices: [21, 22, 23, 24, 25, 26, 27] },
            { name: '2. Bau', rowIndices: [28, 29, 30, 31, 32, 33, 34] },
            { name: '3. Daging/tekstur', rowIndices: [35, 36, 37, 38, 39, 40, 41] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan\n   1. Kenampakan\n   2. Bau\n   3. Daging/tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isHiuUtuhBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Pengeringan', rowIndices: [0, 1, 2, 3, 4] },
            { name: '2. Perubahan warna', rowIndices: [5, 6, 7, 8, 9] },
            { name: 'B. Sesudah pelelehan\n   1. Kenampakan', rowIndices: [10, 11, 12, 13, 14] },
            { name: '2. Bau', rowIndices: [15, 16, 17, 18, 19] },
            { name: '3. Daging', rowIndices: [20, 21, 22, 23, 24] },
            { name: '4. Tekstur', rowIndices: [25, 26, 27, 28, 29] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Pengeringan\n   2. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices),
                subGroups: [parameterList[0], parameterList[1]]
            },
            {
                name: `B. Sesudah pelelehan\n   1. Kenampakan\n   2. Bau\n   3. Daging\n   4. Tekstur`,
                rowIndices: [].concat(parameterList[2].rowIndices, parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[2], parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isFilletKakapBeku) {
        parameterList = [
            { name: 'A. Dalam Keadaan Beku\n   1. Lapisan es', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: '2. Pengeringan', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: '3. Perubahan warna', rowIndices: [14, 15, 16, 17, 18, 19, 20] },
            { name: 'B. Sesudah pelelehan (thawing)\n   1. Kenampakan', rowIndices: [21, 22, 23, 24, 25, 26] },
            { name: '2. Bau', rowIndices: [27, 28, 29, 30, 31, 32] },
            { name: '3. Tekstur', rowIndices: [33, 34, 35, 36, 37, 38] }
        ];
        renderGroups = [
            {
                name: `A. Dalam Keadaan Beku\n   1. Lapisan es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan (thawing)\n   1. Kenampakan\n   2. Bau\n   3. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isFilletIkanBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan es', rowIndices: [0, 1, 2, 3, 4] },
            { name: '2. Pengeringan (dehidrasi)', rowIndices: [5, 6, 7, 8, 9] },
            { name: '3. Perubahan warna', rowIndices: [10, 11, 12, 13, 14] },
            { name: 'B. Setelah pelelehan (thawing)\n   1. Kenampakan', rowIndices: [15, 16, 17, 18, 19] },
            { name: '2. Bau', rowIndices: [20, 21, 22, 23, 24] },
            { name: '3. Tekstur', rowIndices: [25, 26, 27, 28, 29] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan es\n   2. Pengeringan\n   3. Perubahan warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Setelah pelelehan (thawing)\n   1. Kenampakan\n   2. Bau\n   3. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isBaksoIkan) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Bau', rowIndices: [3, 4, 5] },
            { name: '3. Rasa', rowIndices: [6, 7, 8] },
            { name: '4. Tekstur', rowIndices: [9, 10, 11] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3]];
    } else if (isFilletNilaBeku) {
        parameterList = [
            { name: 'A. Dalam keadaan beku\n   1. Lapisan Es', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: '2. Pengeringan', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: '3. Perubahan Warna', rowIndices: [14, 15, 16, 17, 18, 19, 20] },
            { name: 'B. Sesudah pelelehan (thawing)\n   1. Kenampakan', rowIndices: [21, 22, 23, 24, 25, 26] },
            { name: '2. Bau', rowIndices: [27, 28, 29, 30, 31, 32] },
            { name: '3. Tekstur', rowIndices: [33, 34, 35, 36, 37, 38] }
        ];
        renderGroups = [
            {
                name: `A. Dalam keadaan beku\n   1. Lapisan Es\n   2. Pengeringan\n   3. Perubahan Warna`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            {
                name: `B. Sesudah pelelehan (thawing)\n   1. Kenampakan\n   2. Bau\n   3. Tekstur`,
                rowIndices: [].concat(parameterList[3].rowIndices, parameterList[4].rowIndices, parameterList[5].rowIndices),
                subGroups: [parameterList[3], parameterList[4], parameterList[5]]
            }
        ];
    } else if (isIkanPindang) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Bau', rowIndices: [3, 4, 5] },
            { name: '3. Rasa', rowIndices: [6, 7, 8] },
            { name: '4. Tekstur', rowIndices: [9, 10, 11] },
            { name: '5. Lendir', rowIndices: [12, 13] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2], parameterList[3], parameterList[4]];
    } else if (isTunaSegarSashimi) {
        parameterList = [
            { name: '1. Kenampakan\n   a. Mata', rowIndices: [0, 1, 2, 3, 4, 5, 6] },
            { name: 'b. Insang', rowIndices: [7, 8, 9, 10, 11, 12, 13] },
            { name: 'c. Daging pangkal ekor', rowIndices: [14, 15] },
            { name: '2. Daging', rowIndices: [16, 17, 18, 19, 20, 21, 22] },
            { name: '3. Bau', rowIndices: [23, 24, 25, 26, 27, 28, 29] },
            { name: '4. Tekstur', rowIndices: [30, 31, 32, 33, 34, 35, 36] }
        ];
        renderGroups = [
            {
                name: `1. Kenampakan\n   a. Mata\n   b. Insang\n   c. Daging pangkal ekor`,
                rowIndices: [].concat(parameterList[0].rowIndices, parameterList[1].rowIndices, parameterList[2].rowIndices),
                subGroups: [parameterList[0], parameterList[1], parameterList[2]]
            },
            parameterList[3],
            parameterList[4],
            parameterList[5]
        ];
    } else if (isTunaLoinSegar) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2] },
            { name: '2. Bau', rowIndices: [3, 4, 5] },
            { name: '3. Tekstur', rowIndices: [6, 7, 8] }
        ];
        renderGroups = [parameterList[0], parameterList[1], parameterList[2]];
    } else if (isUdangSegar) {
        parameterList = [
            { name: '1. Kenampakan', rowIndices: [0, 1, 2, 3, 4, 5] },
            { name: '2. Bau', rowIndices: [6, 7, 8, 9, 10, 11] },
            { name: '3. Tekstur', rowIndices: [12, 13, 14, 15, 16, 17] }
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

    const sampleCodesText = kodeContohData.map(kd => kd.kode).join(', ');
    const totalRowsCount = renderGroups.length;
    let rowsHtml = '';

    renderGroups.forEach((grp, idx) => {
        let nilaiBefore, nilaiAfter;

        if (grp.subGroups) {
            nilaiBefore = '\n' + grp.subGroups.map(sg => {
                const allScores = [];
                kodeContohData.forEach(kd => {
                    const vals = kd.nilai.filter(n => sg.rowIndices.includes(n.rowIndex)).map(n => n.nilai);
                    if (vals.length > 0) allScores.push(...vals);
                });

                if (allScores.length > 0) {
                    const sum = allScores.reduce((a, b) => a + b, 0);
                    return (sum / allScores.length).toFixed(2);
                }
                return '-';
            }).join('\n');

            nilaiAfter = '\n' + grp.subGroups.map(sg => {
                const allScores = [];
                kodeContohData.forEach(kd => {
                    const vals = kd.nilai.filter(n => sg.rowIndices.includes(n.rowIndex)).map(n => n.nilai);
                    if (vals.length > 0) allScores.push(...vals);
                });

                if (allScores.length > 0) {
                    const sum = allScores.reduce((a, b) => a + b, 0);
                    return Math.round(sum / allScores.length);
                }
                return '-';
            }).join('\n');
        } else {
            const allScores = [];
            kodeContohData.forEach(kd => {
                const vals = kd.nilai.filter(n => grp.rowIndices.includes(n.rowIndex)).map(n => n.nilai);
                if (vals.length > 0) allScores.push(...vals);
            });

            if (allScores.length > 0) {
                const sum = allScores.reduce((a, b) => a + b, 0);
                const avg = sum / allScores.length;
                nilaiBefore = avg.toFixed(2);
                nilaiAfter = Math.round(avg);
            } else {
                nilaiBefore = '-';
                nilaiAfter = '-';
            }
        }

        if (idx === 0) {
            rowsHtml += `
            <tr style="background-color: #E3F2FD;">
                <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top;" rowspan="${totalRowsCount}">1.</td>
                <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top;" rowspan="${totalRowsCount}">&nbsp;</td>
                <td style="border: 1px solid #333; padding: 4px; white-space: pre-line; vertical-align: top; font-size: 10px;">${grp.name}</td>
                <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: middle; font-size: 10px;" rowspan="${totalRowsCount}">Min. 7 (Skor 1-9)</td>
                <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiBefore}</td>
                <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiAfter}</td>
            </tr>`;
        } else {
            rowsHtml += `
            <tr style="background-color: #E3F2FD;">
                <td style="border: 1px solid #333; padding: 4px; white-space: pre-line; vertical-align: top; font-size: 10px;">${grp.name}</td>
                <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiBefore}</td>
                <td style="border: 1px solid #333; padding: 4px; text-align: center; vertical-align: top; white-space: pre-line">${nilaiAfter}</td>
            </tr>`;
        }
    });

    const tableHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; font-size: 7.5pt;">
        <thead>
            <tr style="background-color: #4CAF50; color: white;">
                <th style="border: 1px solid #333; padding: 2px; text-align: center;" rowspan="2">NO</th>
                <th style="border: 1px solid #333; padding: 2px; text-align: center;" rowspan="2">Kode Pengujian</th>
                <th style="border: 1px solid #333; padding: 2px; text-align: center;" rowspan="2">Parameter Uji</th>
                <th style="border: 1px solid #333; padding: 2px; text-align: center;" rowspan="2">Batas Standar Mutu<br/><span style="font-size: 8px;"><strong>${sniStandard}</strong></span></th>
                <th style="border: 1px solid #333; padding: 2px; text-align: center;" colspan="2">Hasil Analisa</th>
            </tr>
            <tr style="background-color: #4CAF50; color: white;">
                <th style="border: 1px solid #333; padding: 2px; text-align: center;">Nilai sebelum dibulatkan</th>
                <th style="border: 1px solid #333; padding: 2px; text-align: center;">Nilai setelah dibulatkan</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>`;

    const namaPenyelia = data.namaPenyelia || 'Grace Lanny Tantu, S.Pi';

    const conclusionHTML = `
    <div style="margin-top: 5px; margin-bottom: 5px;">
        <table style="width:100%; font-size:8pt; border-collapse: collapse; table-layout: fixed;">
            <tr><td style="width:180px; text-align: left; vertical-align: middle; padding:2px 8px;"><strong>Tujuan Pemeriksaan</strong></td><td style="width:12px; text-align:center; vertical-align: middle;">:</td><td style="text-align: left; padding:2px 8px; vertical-align: middle;">Sensori/Organoleptik</td></tr>
            <tr><td style="width:180px; text-align: left; vertical-align: middle; padding:2px 8px;"><strong>Metode pemeriksaan laboratoris</strong></td><td style="width:12px; text-align:center; vertical-align: middle;">:</td><td style="text-align: left; padding:2px 8px; vertical-align: middle;"><strong>${sniStandard}</strong></td></tr>
            <tr><td style="width:180px; text-align: left; vertical-align: middle; padding:2px 8px;"><strong>Kesimpulan</strong></td><td style="width:12px; text-align:center; vertical-align: middle;">:</td><td style="text-align: left; padding:2px 8px; vertical-align: middle;">Memenuhi Standar Interval Mutu Kesegaran</td></tr>
        </table>
    </div>
    <div style="width:100%; display:flex; justify-content:flex-end; margin-top: 5px; font-size:9pt;">
        <div style="text-align: right; max-width:250px; line-height:1.2;">
            <div style="margin-bottom: 10px;">Bitung, ${tglDiterima ? formatIndoDate(tglDiterima) : ''}</div>
            <div style="margin-bottom: 4px;"><strong>Penyelia,</strong></div>
            <div style="margin-top: 30px;">${namaPenyelia}</div>
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
    } else if (isSardenMakarel) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', subKategori: '', items: [{ desc: 'Utuh, cerah', nilai: 9 }, { desc: 'Utuh, kurang cerah', nilai: 7 }, { desc: 'Tidak utuh, kusam', nilai: 5 }] },
            { kategori: '2. Bau', subKategori: '', items: [{ desc: 'Aroma sangat kuat sesuai spesifikasi', nilai: 9 }, { desc: 'Aroma kuat sesuai spesifikasi', nilai: 7 }, { desc: 'Mulai tercium bau asam', nilai: 5 }] },
            { kategori: '3. Rasa', subKategori: '', items: [{ desc: 'Sangat sesuai spesifikasi.', nilai: 9 }, { desc: 'Sesuai spesifikasi', nilai: 7 }, { desc: 'Tidak sesuai spesifikasi, hambar', nilai: 5 }] },
            { kategori: '4. Tekstur', subKategori: '', items: [{ desc: 'Sangat kompak sesuai spesifikasi', nilai: 9 }, { desc: 'Kompak sesuai spesifikasi', nilai: 7 }, { desc: 'Kurang kompak', nilai: 5 }] }
        ];
    } else if (isIkanAsap) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', subKategori: '', items: [{ desc: 'Bersih, Warna seragam dan merata tanpa retakan.', nilai: 9 }, { desc: 'Cukup bersih, warna seragam dan merata tanpa retakan.', nilai: 7 }, { desc: 'Kurang bersih, warna seragam dan merata sedikit retakan.', nilai: 5 }, { desc: 'Kotor, warna kurang seragam dan kurang merata, retak-retak.', nilai: 3 }, { desc: 'Kotor sekali, warna tidak seragam dan tidak rata, retak-retak.', nilai: 1 }] },
            { kategori: '2. Bau', subKategori: '', items: [{ desc: 'Spesifik Ikan Kayu, tanpa bahan tambahan.', nilai: 9 }, { desc: 'Spesifik bau ikan kayu berkurang, tanpa bau tambahan.', nilai: 7 }, { desc: 'Spesifik bau ikan kayu tidak ada dengan dengan sedikit bau tambahan.', nilai: 5 }, { desc: 'Spesifik bau ikan kayu tidak ada dengan tambahan agak kuat.', nilai: 3 }, { desc: 'Tengik, apek dengan bau tambahan kuat', nilai: 1 }] },
            { kategori: '3. Rasa', subKategori: '', items: [{ desc: 'Sangat suka.', nilai: 9 }, { desc: 'Suka.', nilai: 7 }, { desc: 'Biasa.', nilai: 5 }, { desc: 'Tidak suka.', nilai: 3 }, { desc: 'Sangat tidak suka.', nilai: 1 }] },
            { kategori: '4. Tekstur', subKategori: '', items: [{ desc: 'Keras, tidak mudah patah.', nilai: 9 }, { desc: 'Kurang keras, agak mudah patah.', nilai: 7 }, { desc: 'Agak rapuh.', nilai: 5 }, { desc: 'Rapuh.', nilai: 3 }, { desc: 'Hancur.', nilai: 1 }] }
        ];
    } else if (isIkanAsinKering) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', subKategori: '', items: [{ desc: 'Bersih, sangat cerah spesifik jenis.', nilai: 9 }, { desc: 'Bersih, cerah spesifik jenis.', nilai: 7 }, { desc: 'Kusam', nilai: 5 }] },
            { kategori: '2. Bau', subKategori: '', items: [{ desc: 'Spesifik jenis kuat', nilai: 9 }, { desc: 'Spesifik jenis kurang kuat.', nilai: 7 }, { desc: 'Tengik, apak.', nilai: 5 }] },
            { kategori: '3. Rasa', subKategori: '', items: [{ desc: 'Asin, spesifik jenis', nilai: 9 }, { desc: 'Asin, spesifik jenis kurang', nilai: 7 }, { desc: 'Asin, ada rasa tambahan.', nilai: 5 }] },
            { kategori: '4. Tekstur', subKategori: '', items: [{ desc: 'Padat, kering', nilai: 9 }, { desc: 'Padat, kurang kering', nilai: 7 }, { desc: 'Padat, ada rasa tambahan.', nilai: 5 }] },
            { kategori: '5. Jamur', subKategori: '', items: [{ desc: 'Tidak ada.', nilai: 9 }, { desc: 'Ada.', nilai: 1 }] }
        ];
    } else if (isRumputLautKering) {
        scoreSheetItems = [
            {
                kategori: '1. Kenampakan', items: [
                    { desc: 'Bersih, warna cerah spesifik jenis', nilai: 9 },
                    { desc: 'Sedikit kurang bersih, warna kurang cerah spesifik jenis.', nilai: 7 },
                    { desc: 'Kurang bersih, warna agak kusam spesifik jenis', nilai: 5 },
                    { desc: 'Kotor, warna spesifik jenis, kusam', nilai: 3 },
                    { desc: 'Kotor, warna spesifik jenis, sangat kusam', nilai: 1 }
                ]
            },
            {
                kategori: '2. Tekstur', items: [
                    { desc: 'Kering merata, liat tidak mudah dipatahkan.', nilai: 9 },
                    { desc: 'Kering kurang merata, liat tidak mudah dipatahkan.', nilai: 7 },
                    { desc: 'Lembab, liat agak mudah dipatahkan.', nilai: 5 },
                    { desc: 'Mudah dipatahkan.', nilai: 3 },
                    { desc: 'Mudah sekali dipatahkan.', nilai: 1 }
                ]
            }
        ];
    } else if (isLobsterUdangKipas) {
        scoreSheetItems = [
            {
                kategori: '1. Spesifikasi', items: [
                    { desc: 'Hidup dan reaktif terhadap sentuhan, Mata utuh, antenna utuh, kaki utuh tanpa cacat sedikit pun, bagian perut cemerlang', nilai: 9 },
                    { desc: 'Hidup dan reaktif terhadap sentuhanm mata utuh, antena tidak utuh, kaki utuh tanpa cacat sedikitpun bagian perut cemerlang.', nilai: 7 },
                    { desc: 'Hidup dan reaktif terhadap sentuhan, mata tidak utuh, antena tidak utuh, kaki utuh bagian perut cemerlang.', nilai: 5 }
                ]
            }
        ];
    } else if (isKepitingBakau) {
        scoreSheetItems = [
            {
                kategori: '1. Spesifikasi', items: [
                    { desc: 'Hidup dan reaktif terhadap sentuhan, Mata utuh, capit dan kaki utuh tanpa cacat', nilai: 9 },
                    { desc: 'Hidup dan reaktif terhadap sentuhan, mata utuh, capit utuh, kaki patah satu sampai tidak sebaris', nilai: 7 },
                    { desc: 'Hidup dan reaktif terhadap sentuhan, mata utuh, capit patah tidak sampai pangkal, kaki patah satu sampai tiga tidak sebaris', nilai: 5 },
                    { desc: 'Hidup dan tidak reaktif terhadap sentuhan, mata tidak utuh, capit patah dari pangkal dan posisi horizon, kaki patah lebih dari tiga mulut sedikit berbusa', nilai: 3 },
                    { desc: 'Mati', nilai: 1 }
                ]
            }
        ];
    } else if (isIkanAsapMurni) {
        scoreSheetItems = [
            {
                kategori: '1. Kenampakan', items: [
                    { desc: 'Menarik, bersih, coklat emas, bercahaya menurut jenis.', nilai: 9 },
                    { desc: 'Menarik, bersih, coklat emas, kurang bercahaya, menurut jenis.', nilai: 7 },
                    { desc: 'Cukup menarik, bersih, coklat, kusam.', nilai: 5 },
                    { desc: 'Kurang menarik, coklat tua, kusam.', nilai: 3 },
                    { desc: 'Tidak menarik, coklat tua, kusam sekali.', nilai: 1 }
                ]
            },
            {
                kategori: '2. Bau', items: [
                    { desc: 'Harum asap cukup, tanpa bau tambahan mengganggu.', nilai: 9 },
                    { desc: 'Kurang harum, asap cukup, tanpa bau tambahan mengganggu.', nilai: 7 },
                    { desc: 'Keharuman hampir netral, sedikit bau tambahan.', nilai: 5 },
                    { desc: 'Bau tambahan kuat, tercium bau amoniak dan tengik.', nilai: 3 },
                    { desc: 'Busuk, bau amoniak kuat dan tengik.', nilai: 1 }
                ]
            },
            {
                kategori: '3. Rasa', items: [
                    { desc: 'Enak, gurih, tanpa rasa tambahan mengganggu.', nilai: 9 },
                    { desc: 'Enak, kurang gurih.', nilai: 7 },
                    { desc: 'Tidak enak, tidak gurih.', nilai: 5 },
                    { desc: 'Tidak enak dengan rasa tambahan mengganggu.', nilai: 3 },
                    { desc: 'Basi / busuk.', nilai: 1 }
                ]
            },
            {
                kategori: '4. Tekstur', items: [
                    { desc: 'Padat, kompak, cukup kering, antar jaringan erat.', nilai: 9 },
                    { desc: 'Padat, kompak, kering, antar jaringan erat.', nilai: 7 },
                    { desc: 'Kurang kering, antar jaringan longgar.', nilai: 5 },
                    { desc: 'Lembab, antar jaringan mudah lepas.', nilai: 3 },
                    { desc: 'Sangat lembab, mudah terurai.', nilai: 1 }
                ]
            },
            {
                kategori: '5. Jamur', items: [
                    { desc: 'Tidak ada.', nilai: 9 },
                    { desc: 'Ada.', nilai: 1 }
                ]
            },
            {
                kategori: '6. Lendir', items: [
                    { desc: 'Tidak ada.', nilai: 9 },
                    { desc: 'Ada.', nilai: 1 }
                ]
            }
        ];
    } else if (isSiripHiuKering) {
        scoreSheetItems = [
            {
                kategori: '1. Kenampakan', items: [
                    { desc: 'Cerah dan bersih, warna spesifik jenis, daging menempel sedikit.', nilai: 9 },
                    { desc: 'Cerah dan bersih, warna spesifik jenis, daging menempel agak banyak.', nilai: 7 },
                    { desc: 'Warna spesifik jenis, daging menempel banyak, warna coklat tua atau hitam.', nilai: 5 }
                ]
            },
            {
                kategori: '2. Bau', items: [
                    { desc: 'Segar spesifik jenis tanpa bau tambahan.', nilai: 9 },
                    { desc: 'Segar berkurang tanpa bau tambahan.', nilai: 7 },
                    { desc: 'Bau amonia.', nilai: 5 }
                ]
            },
            {
                kategori: '3. Tekstur', items: [
                    { desc: 'Liat, tidak mudah patah, kering.', nilai: 9 },
                    { desc: 'Liat, tidak mudah patah, kurang kering.', nilai: 7 },
                    { desc: 'Liat, tidak mudah patah, lembab.', nilai: 5 }
                ]
            }
        ];
    } else if (isUdangKeringUtuh) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', items: [{ desc: 'Utuh, bersih, sangat cerah spesifik jenis.', nilai: 9 }, { desc: 'Cerah, spesifik jenis.', nilai: 7 }, { desc: 'Kurang cerah, spesifik jenis.', nilai: 5 }, { desc: 'Kusam.', nilai: 3 }, { desc: 'Sangat kusam.', nilai: 1 }] },
            { kategori: '2. Bau', items: [{ desc: 'Sangat segar, spesifik jenis kuat.', nilai: 9 }, { desc: 'Segar, spesifik jenis.', nilai: 7 }, { desc: 'Kurang segar, spesifik jenis.', nilai: 5 }, { desc: 'Bau tambahan (apek/tengik) sangat lemah.', nilai: 3 }, { desc: 'Apek, tengik atau bau asing lainnya.', nilai: 1 }] },
            { kategori: '3. Rasa', items: [{ desc: 'Sangat enak, gurih, spesifik jenis.', nilai: 9 }, { desc: 'Enak, gurih, spesifik jenis.', nilai: 7 }, { desc: 'Kurang enak, kurang gurih.', nilai: 5 }, { desc: 'Kurang enak, hambar.', nilai: 3 }, { desc: 'Tidak enak, rasa asing.', nilai: 1 }] },
            { kategori: '4. Tekstur', items: [{ desc: 'Sangat padat, sangat kompak, sangat kering.', nilai: 9 }, { desc: 'Padat, kompak, kering.', nilai: 7 }, { desc: 'Kurang padat, kurang kompak, kurang kering.', nilai: 5 }, { desc: 'Agak lunak, lembab.', nilai: 3 }, { desc: 'Lunak, sangat lembab.', nilai: 1 }] },
            { kategori: '5. Jamur', items: [{ desc: 'Tidak ada.', nilai: 9 }, { desc: 'Ada.', nilai: 1 }] }
        ];
    } else if (isAbonIkan) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', items: [{ desc: 'Warna coklat spesifik produk, serbuk/serat homogen, cemerlang', nilai: 9 }, { desc: 'Warna coklat spesifik produk, serbuk/serat kurang homogen, agak kusam', nilai: 7 }, { desc: 'Warna coklat tidak spesifik produk, serbuk/serat tidak homogen, kusam', nilai: 5 }] },
            { kategori: '2. Bau', items: [{ desc: 'Spesifik produk sangat kuat', nilai: 9 }, { desc: 'Spesifik produk kuat', nilai: 7 }, { desc: 'Spesifik produk apek, tengik atau bau asing lainnya', nilai: 5 }] },
            { kategori: '3. Rasa', items: [{ desc: 'Spesifik produk', nilai: 9 }, { desc: 'Netral, spesifik produk kurang', nilai: 7 }, { desc: 'Mulai tengik atau rasa asing lainnya', nilai: 5 }] },
            { kategori: '4. Tekstur', items: [{ desc: 'Renyah, tidak menggumpal', nilai: 9 }, { desc: 'Renyah, menggumpal', nilai: 7 }, { desc: 'Tidak renyah, menggumpal', nilai: 5 }] },
            { kategori: '5. Kapang', items: [{ desc: 'Tidak ada', nilai: 9 }, { desc: 'Ada', nilai: 5 }] }
        ];
    } else if (isSambalIkan) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', items: [{ desc: 'Warna spesifik', nilai: 9 }, { desc: 'Warna kurang spesifik produk', nilai: 7 }, { desc: 'Warna tidak spesifik produk', nilai: 5 }] },
            { kategori: '2. Aroma', items: [{ desc: 'Spesifik sambal ikan kuat', nilai: 9 }, { desc: 'Spesifik sambal ikan kurang kuat menuju netral', nilai: 7 }, { desc: 'Tengik, mulai tercium penyimpangan yang kuat', nilai: 5 }] },
            { kategori: '3. Tekstur', items: [{ desc: 'Kental, spesifik produk', nilai: 9 }, { desc: 'Kurang kental, spesifik produk', nilai: 7 }] }
        ];
    } else if (isTunaLoinBeku) {
        scoreSheetItems = [
            { kategori: '1. Lapisan es', items: [{ desc: 'Rata, bening, seluruh permukaan dilapisi es', nilai: 9 }, { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%', nilai: 7 }, { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang dari 50%', nilai: 5 }, { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es lebih dari 50%.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk', nilai: 1 }] },
            { kategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 }, { desc: 'Pengeringan pada permukaan produk kurang lebih 30%', nilai: 7 }, { desc: 'Pengeringan pada permukaan produk kurang dari 50%', nilai: 5 }, { desc: 'Pengeringan banyak pada permukaan produk 40%-50%', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 }, { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%', nilai: 7 }, { desc: 'Perubahan warna pada permukaan produk kurang dari 50%', nilai: 5 }, { desc: 'Perubahan warna pada permukaan produk lebih dari 50%', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk', nilai: 1 }] },
            { kategori: '4. Kenampakan', items: [{ desc: 'Cemerlang spesifik produk', nilai: 9 }, { desc: 'Kurang cemerlang spesifik produk', nilai: 7 }, { desc: 'Agak kusam', nilai: 5 }, { desc: 'Mulai berubah warna', nilai: 3 }, { desc: 'Warna agak kemerahan', nilai: 1 }] },
            { kategori: '5. Bau', items: [{ desc: 'Spesifik produk', nilai: 9 }, { desc: 'Netral', nilai: 7 }, { desc: 'Sedikit tengik', nilai: 5 }, { desc: 'Asam, sedikit bau amonia, tengik', nilai: 3 }, { desc: 'Amonia dan busuk jelas sekali', nilai: 1 }] },
            { kategori: '6. Tekstur', items: [{ desc: 'Padat, kompak', nilai: 9 }, { desc: 'Padat, kurang kompak,', nilai: 7 }, { desc: 'Agak lembek', nilai: 5 }, { desc: 'Lembek.', nilai: 3 }, { desc: 'Sangat lembek', nilai: 1 }] }
        ];
    } else if (isTunaSteakBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan es', items: [{ desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10%.', nilai: 8 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20%-30%.', nilai: 7 }, { desc: 'Tidak rata, bagian yang terbuka sebanyak 40%-50%.', nilai: 6 }, { desc: 'Banyak bagian yang terbuka 60%-70%.', nilai: 5 }, { desc: 'Banyak bagian yang terbuka 80%-90%.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20%-30%.', nilai: 7 }, { desc: 'Pengeringan banyak pada permukaan produk 40%-50%.', nilai: 6 }, { desc: 'Banyak bagian produk yang tampak mengering 60%-70%.', nilai: 5 }, { desc: 'Banyak bagian produk yang tampak mengering 80%-90%.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%.', nilai: 8 }, { desc: 'Agak banyak mengalami perubahan warna pada permukaan produk 20%-30%.', nilai: 7 }, { desc: 'Banyak mengalami perubahan warna pada permukaan produk 40%-50%.', nilai: 6 }, { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 60%-70%.', nilai: 5 }, { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 80%-90%.', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Warna daging krem, sangat cerah dan sangat mengkilap', nilai: 9 }, { desc: 'Warna daging krem, cerah dan mengkilap', nilai: 8 }, { desc: 'Warna daging krem, cerah, kurang mengkilap', nilai: 7 }, { desc: 'Warna daging krem kecoklatan, agak kusam', nilai: 6 }, { desc: 'Warna daging kecoklatan, kusam', nilai: 5 }, { desc: 'Warna daging coklat, kusam', nilai: 3 }, { desc: 'Warna daging coklat tua, sangat kusam', nilai: 1 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '3. Bau', items: [{ desc: 'Bau sangat segar.', nilai: 9 }, { desc: 'Bau segar.', nilai: 8 }, { desc: 'Bau segar mengarah ke netral.', nilai: 7 }, { desc: 'Netral', nilai: 6 }, { desc: 'Netral dengan sedikit bau tambahan yang mengganggu', nilai: 5 }, { desc: 'Tercium bau busuk', nilai: 3 }, { desc: 'Bau busuk sangat jelas', nilai: 1 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '4. Tekstur', items: [{ desc: 'Kompak, padat dan sangat elastis', nilai: 9 }, { desc: 'Kompak, padat dan elastis', nilai: 8 }, { desc: 'Kurang padat, kurang elastis, jaringan daging masih melekat kuat', nilai: 7 }, { desc: 'Kurang elastis, jaringan daging agak longgar', nilai: 6 }, { desc: 'Tidak elastis, jaringan daging longgar and daging agak mudah sobek', nilai: 5 }, { desc: 'Lunak, daging mudah sobek', nilai: 3 }, { desc: 'Sangat lunak, daging sangat mudah sobek', nilai: 1 }] }
        ];
    } else if (isGuritaMentahBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan es', items: [{ desc: 'Rata, bening, seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%.', nilai: 7 }, { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang dari 50%.', nilai: 5 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 }, { desc: 'Pengeringan pada permukaan produk kurang lebih 30%.', nilai: 7 }, { desc: 'Pengeringan pada permukaan produk kurang dari 50%.', nilai: 5 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 }, { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%.', nilai: 7 }, { desc: 'Perubahan warna pada permukaan produk kurang dari 50%.', nilai: 5 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Mulut tentakel (mulut hisap) terbuka dan menonjol, warna spesifik jenis, cemerlang.', nilai: 9 }, { desc: 'Mulut tentakel terbuka dan rata, warna spesifik jenis, kurang cemerlang.', nilai: 7 }, { desc: 'Mulut tentakel rata warna spesifik berubah menjadi merah muda (pink).', nilai: 5 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Bau sangat segar spesifik produk.', nilai: 9 }, { desc: 'Bau segar spesifik produk.', nilai: 7 }, { desc: 'Mulai tercium bau busuk.', nilai: 5 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '3. Tekstur', items: [{ desc: 'Elastis dan padat.', nilai: 9 }, { desc: 'Kurang elastis dan kurang padat.', nilai: 7 }, { desc: 'Tidak elastis dan agak lunak.', nilai: 5 }] }
        ];
    } else if (isCumiCumiBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan es', items: [{ desc: 'Rata, Bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Rata, Bening, cukup tebal, ada bagian yang terbuka 10 %.', nilai: 8 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20 - 30 %.', nilai: 7 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 40 - 50 %.', nilai: 6 }, { desc: 'Banyak bagian yang terbuka 60 - 70 %.', nilai: 5 }, { desc: 'Banyak bagian yang terbuka 80 - 90 %.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10 %.', nilai: 8 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20 - 30 %.', nilai: 7 }, { desc: 'Pengeringan banyak pada permukaan produk 40 - 50 %.', nilai: 6 }, { desc: 'Banyak bagian produk yang tampak mengering 60 - 70 %.', nilai: 5 }, { desc: 'Banyak bagian produk yang tampak mengering 80 - 90 %.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 }, { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%', nilai: 8 }, { desc: 'Agak banyak perubahan warna permukaan produk 20 - 30 %', nilai: 7 }, { desc: 'Banyak perubahan warna pada permukaan produk 40 - 50 %', nilai: 6 }, { desc: 'Perubahan warna hampir menyeluruh permukaan produk 60 - 70 %', nilai: 5 }, { desc: 'Perubahan warna hampir menyeluruh permukaan produk 80 - 90 %', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Warna spesifik jenis, sangat cemerlang.', nilai: 9 }, { desc: 'Warna spesifik jenis, cemerlang.', nilai: 8 }, { desc: 'Warna spesifik jenis, putih kapur sedikit krem, kurang cemerlang.', nilai: 7 }, { desc: 'Warna spesifik jenis, putih kapur sedikit krem, agak pucat, kurang cemerlang.', nilai: 6 }, { desc: 'Warna spesifik jenis, krem, pucat, kurang cemerlang', nilai: 5 }, { desc: 'Krem, agak kecoklatan, pucat.', nilai: 3 }, { desc: 'Krem, kecoklatan, pucat.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Sangat segar, spesifik jenis.', nilai: 9 }, { desc: 'Bau segar.', nilai: 8 }, { desc: 'Netral.', nilai: 7 }, { desc: 'Mulai amis, sedikit busuk.', nilai: 5 }, { desc: 'Bau amis, sedikit busuk.', nilai: 3 }, { desc: 'Bau busuk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Tekstur', items: [{ desc: 'Padat, kompak dan elastis.', nilai: 9 }, { desc: 'Kompak, elastis.', nilai: 8 }, { desc: 'Kompak, kurang elastis.', nilai: 7 }, { desc: 'Tidak elastis, agak lunak.', nilai: 5 }, { desc: 'Lunak.', nilai: 3 }, { desc: 'Sangat lunak.', nilai: 1 }] }
        ];
    } else if (isUdangBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan es', items: [{ desc: 'Rata, Bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Rata, Bening, cukup tebal, ada bagian yang terbuka 10 %.', nilai: 8 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20 - 30 %.', nilai: 7 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 40 - 50 %.', nilai: 6 }, { desc: 'Banyak bagian yang terbuka 60 - 70 %.', nilai: 5 }, { desc: 'Banyak bagian yang terbuka 80 - 90 %.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10 %.', nilai: 8 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20 - 30 %.', nilai: 7 }, { desc: 'Pengeringan banyak pada permukaan produk 40 - 50 %.', nilai: 6 }, { desc: 'Banyak bagian produk yang tampak mengering 60 - 70 %.', nilai: 5 }, { desc: 'Banyak bagian produk yang tampak mengering 80 - 90 %.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 }, { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10 %', nilai: 8 }, { desc: 'Agak banyak perubahan warna permukaan produk 20 - 30 %', nilai: 7 }, { desc: 'Banyak perubahan warna pada permukaan produk 40 - 50 %', nilai: 6 }, { desc: 'Perubahan warna hampir menyeluruh permukaan produk 60 - 70 %', nilai: 5 }, { desc: 'Perubahan warna hampir menyeluruh permukaan produk 80 - 90 %', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Utuh, bercahaya, warna asli jenis, antar ruas kokoh', nilai: 9 }, { desc: 'Utuh, sedikit kurang bercahaya, warna asli jenis, antar ruas sedikit kokoh', nilai: 8 }, { desc: 'Utuh, kurang bercahaya, warna asli jenis, antar ruas sedikit kurang kokoh', nilai: 7 }, { desc: 'Utuh, kurang bercahaya, warna asli jenis, antar ruas kurang kokoh', nilai: 6 }, { desc: 'Utuh, tidak bercahaya, warna kulit sedikit kemerahan, antar ruas renggang', nilai: 5 }, { desc: 'Utuh, kusam, warna kulit kemerahan, antar ruas sudah longgar', nilai: 3 }, { desc: 'Utuh, warna merah jelas, pada ekor sudah hitam', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Sangat segar, spesifik jenis.', nilai: 9 }, { desc: 'Bau segar spesifik jenis', nilai: 8 }, { desc: 'Netral', nilai: 7 }, { desc: 'Bau berubah dari netral', nilai: 6 }, { desc: 'Bau sedikit indol', nilai: 5 }, { desc: 'Bau indol', nilai: 3 }, { desc: 'Bau busuk, indol tajam', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Daging / tekstur', items: [{ desc: 'Elastis, bercahaya, spesifik jenis.', nilai: 9 }, { desc: 'Elastis, kurang bercahaya.', nilai: 8 }, { desc: 'Elastis, sedikit kurang bercahaya.', nilai: 7 }, { desc: 'Kurang elastis, warna sudah pudar.', nilai: 5 }, { desc: 'Lembek, warna agak sedikit merah.', nilai: 3 }, { desc: 'Sudah lembek sekali, warna merah cukup jelas.', nilai: 1 }] }
        ];
    } else if (isUdangMasakBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan es', items: [{ desc: 'Rata, bening, seluruh permukaan dilapisi es', nilai: 9 }, { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%', nilai: 7 }, { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang lebih 50%', nilai: 5 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 }, { desc: 'Pengeringan pada permukaan produk kurang lebih 30%', nilai: 7 }, { desc: 'Pengeringan pada permukaan produk kurang lebih 50%', nilai: 5 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 }, { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%', nilai: 7 }, { desc: 'Perubahan warna pada permukaan produk kurang lebih 50%', nilai: 5 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Utuh, daging berwarna merah muda cerah dan bersih', nilai: 9 }, { desc: 'Utuh, daging berwarna merah muda, agak cerah dan bersih', nilai: 7 }, { desc: 'Utuh, sedikit cacat, daging berwarna merah muda pucat, kusam, sedikit kotor', nilai: 5 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Bau sangat segar', nilai: 9 }, { desc: 'Bau segar', nilai: 7 }, { desc: 'Sedikit busuk', nilai: 5 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '3. Rasa', items: [{ desc: 'Manis dan segar', nilai: 9 }, { desc: 'Agak manis', nilai: 7 }, { desc: 'Agak hambar', nilai: 5 }] },
            { kategori: 'B. Sesudah dilelehkan (thawing)', subKategori: '4. Tekstur', items: [{ desc: 'Elastis, kompak dan padat', nilai: 9 }, { desc: 'Elastis, kompak dan kurang padat', nilai: 7 }, { desc: 'Elastis dan agak hambar', nilai: 5 }] }
        ];
    } else if (isLobsterBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan Es', items: [{ desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10 %.', nilai: 8 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20 - 30 %.', nilai: 7 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 40 - 50 %.', nilai: 6 }, { desc: 'Banyak bagian yang terbuka 60 - 70 %.', nilai: 5 }, { desc: 'Banyak bagian yang terbuka 80 - 90 %.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10 %.', nilai: 8 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20 - 30 %.', nilai: 7 }, { desc: 'Pengeringan banyak pada permukaan produk 40 - 50 %.', nilai: 6 }, { desc: 'Banyak bagian produk yang tampak mengering 60 - 70 %.', nilai: 5 }, { desc: 'Banyak bagian produk yang tampak mengering 80 - 90 %.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami perubahan warna permukaan produk 10 %.', nilai: 8 }, { desc: 'Agak banyak perubahan warna permukaan produk 20 - 30 %.', nilai: 7 }, { desc: 'Banyak perubahan warna pada permukaan produk 40 - 50 %.', nilai: 6 }, { desc: 'Perubahan warna hampir menyeluruh permukaan produk 60 - 70 %.', nilai: 5 }, { desc: 'Perubahan warna hampir menyeluruh permukaan produk 80 - 90 %.', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Utuh, bening bercahaya asli menurut jenis, antar ruas kokoh.', nilai: 9 }, { desc: 'Utuh, kurang bening, cahaya mulai pudar, berwarna asli antar ruas kokoh.', nilai: 8 }, { desc: 'Utuh, tidak bening, warna pudar, antar ruas kokoh.', nilai: 7 }, { desc: 'Utuh, warna pudar, ada sedikit noda hitam, antar ruas agak renggang.', nilai: 6 }, { desc: 'Kurang utuh, noda hitam agak banyak, antar ruas mudah lepas.', nilai: 5 }, { desc: 'Tidak utuh, mulai merah, noda hitam banyak, antar ruas mudah lepas.', nilai: 3 }, { desc: 'Tidak utuh, warna merah jelas, penuh noda hitam.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Bau sangat segar spesifik jenis.', nilai: 9 }, { desc: 'Bau segar, spesifik jenis.', nilai: 7 }, { desc: 'Netral.', nilai: 6 }, { desc: 'Mulai timbul bau amoniak.', nilai: 5 }, { desc: 'Bau amoniak kuat.', nilai: 3 }, { desc: 'Bau amoniak dan busuk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Konsistensi', items: [{ desc: 'Kulit ari kenyal, daging padat lekat erat pada kulit.', nilai: 9 }, { desc: 'Kulit ari kurang kenyal, daging padat lekat pada kulit.', nilai: 7 }, { desc: 'Tidak kenyal, daging kurang padat, mulai lepas dari kulit.', nilai: 6 }, { desc: 'Kulit ari tidak kenyal, daging kurang padat, mulai lepas dari kulit.', nilai: 5 }, { desc: 'Daging lunak dan lepas dari kulit.', nilai: 3 }, { desc: 'Daging sangat lunak dan lepas dari kulit.', nilai: 1 }] }
        ];
    } else if (isCakalangBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan es', items: [{ desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10%.', nilai: 8 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20%-30%.', nilai: 7 }, { desc: 'Tidak rata, bagian yang terbuka sebanyak 40%-50%.', nilai: 6 }, { desc: 'Banyak bagian yang terbuka 60%-70%.', nilai: 5 }, { desc: 'Banyak bagian yang terbuka 80%-90%.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20%-30%.', nilai: 7 }, { desc: 'Pengeringan banyak pada permukaan produk 40%-50%.', nilai: 6 }, { desc: 'Banyak bagian produk yang tampak mengering 60%-70%.', nilai: 5 }, { desc: 'Banyak bagian produk yang tampak mengering 80%-90%.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%.', nilai: 8 }, { desc: 'Agak banyak mengalami perubahan warna pada permukaan produk 20%-30%.', nilai: 7 }, { desc: 'Banyak mengalami perubahan warna pada permukaan produk 40%-50%.', nilai: 6 }, { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 60%-70%.', nilai: 5 }, { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 80%-90%.', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit mengkilat, cemerlang.', nilai: 9 }, { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit mengkilat, cemerlang.', nilai: 8 }, { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit kurang mengkilat, agak cemerlang.', nilai: 7 }, { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit hilang, kurang cemerlang.', nilai: 6 }, { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit hilang.', nilai: 5 }, { desc: 'Utuh, tidak cacat, warna permukaan kulit kusam.', nilai: 3 }, { desc: 'Utuh, tidak cacat, warna permukaan kulit sangat kusam.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Sangat segar.', nilai: 9 }, { desc: 'Segar.', nilai: 8 }, { desc: 'Segar mendekati netral.', nilai: 7 }, { desc: 'Netral.', nilai: 6 }, { desc: 'Sedikit tengik.', nilai: 5 }, { desc: 'Tengik sedikit asam.', nilai: 3 }, { desc: 'Asam dan busuk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Daging/tekstur', items: [{ desc: 'Sayatan daging warna merah kecoklatan sangat cerah, antar jaringan sangat kuat, sangat elastis.', nilai: 9 }, { desc: 'Sayatan daging warna merah kecoklatan cerah, antar jaringan kuat, elastis.', nilai: 8 }, { desc: 'Sayatan daging warna merah kecoklatan kurang cerah, antar jaringan kuat, agak elastis.', nilai: 7 }, { desc: 'Sayatan daging warna kecoklatan kurang cerah, antar jaringan sedikit longgar, kurang elastis.', nilai: 6 }, { desc: 'Sayatan daging warna kecoklatan kusam, antar jaringan longgar, tidak elastis.', nilai: 5 }, { desc: 'Sayatan daging warna coklat kusam, antar jaringan longgar.', nilai: 3 }, { desc: 'Sayatan daging warna coklat kehitaman kusam, antar jaringan sangat longgar.', nilai: 1 }] }
        ];
    } else if (isHiuUtuhBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10 %.', nilai: 7 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20 - 30 %.', nilai: 5 }, { desc: 'Pengeringan banyak pada permukaan produk 40 - 50 %.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 }, { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10 %', nilai: 7 }, { desc: 'Agak banyak perubahan warna permukaan produk 20 - 30 %', nilai: 5 }, { desc: 'Banyak perubahan warna pada permukaan produk 40 - 50 %', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Utuh, bersih, tidak cacat, warna sesuai jenis, cemerlang', nilai: 9 }, { desc: 'Utuh, bersih, tidak cacat, warna sesuai jenis, kurang cemerlang', nilai: 7 }, { desc: 'Utuh, bersih, tidak cacat, warna sesuai jenis, agak kusam', nilai: 5 }, { desc: 'Sedikit rusak, warna kusam', nilai: 3 }, { desc: 'Rusak, sangat kusam', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Sangat segar., spesifik hiu segar', nilai: 9 }, { desc: 'Segar.', nilai: 7 }, { desc: 'Kurang segar., sedikit bau amoniak', nilai: 5 }, { desc: 'Sedikit busuk bau amoniak kuat', nilai: 3 }, { desc: 'Busuk', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Daging', items: [{ desc: 'Sayatan daging berwarna putih susu, sangat cemerlang', nilai: 9 }, { desc: 'Sayatan daging berwarna putih sedikit kusam, agak cemerlang', nilai: 7 }, { desc: 'Sayatan daging berwarna krem , kurang cemerlang', nilai: 5 }, { desc: 'Sayatan daging krem kecoklatan, kusam', nilai: 3 }, { desc: 'Sayatan coklat, sangat kusam', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '4. Tekstur', items: [{ desc: 'Padat, sangat kompak, sangat elastis', nilai: 9 }, { desc: 'Padat, kompak, elastis', nilai: 7 }, { desc: 'Kurang Padat, kurang kompak', nilai: 5 }, { desc: 'lembek, tidak kompak', nilai: 3 }, { desc: 'Sayatan coklat, sangat kusam', nilai: 1 }] }
        ];
    } else if (isFilletKakapBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam Keadaan Beku', subKategori: '1. Lapisan es', items: [{ desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10%.', nilai: 8 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20-30%.', nilai: 7 }, { desc: 'Tidak rata, bagian yang terbuka sebanyak 40-50%.', nilai: 6 }, { desc: 'Banyak bagian yang terbuka 60-70%.', nilai: 5 }, { desc: 'Banyak bagian yang terbuka 80-90%.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }] },
            { kategori: 'A. Dalam Keadaan Beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20-30%.', nilai: 7 }, { desc: 'Pengeringan banyak pada permukaan produk 40-50%.', nilai: 6 }, { desc: 'Banyak bagian produk yang tampak mengering 60-70%.', nilai: 5 }, { desc: 'Banyak bagian produk yang tampak mengering 80-90%.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'A. Dalam Keadaan Beku', subKategori: '3. Perubahan warna (diskolorasi)', items: [{ desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 }, { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%.', nilai: 8 }, { desc: 'Agak banyak mengalami perubahan warna pada permukaan produk 20-30%.', nilai: 7 }, { desc: 'Banyak mengalami perubahan warna pada permukaan produk 40-50%.', nilai: 6 }, { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 60-70%.', nilai: 5 }, { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 80-90%.', nilai: 3 }, { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: 'Rapi, bersih, warna daging putih krem kemerahan, sangat cemerlang, linea lateralis berwarna merah muda.', nilai: 9 }, { desc: 'Rapi, bersih, warna daging putih krem agak kemerahan, cemerlang, linea lateralis berwarna merah muda', nilai: 8 }, { desc: 'Rapi, bersih, warna daging krem agak kemerahan, kurang cemerlang, garis yang membentuk tulang belakang dan linea lateralis berwarna merah.', nilai: 7 }, { desc: 'Rapi, bersih, warna daging krem kecoklatan, kusam, linea lateralis berwarna merah agak kecoklatan', nilai: 5 }, { desc: 'Rapi, kurang bersih, warna daging agak kehijauan-hijauan, kusam, garis yang membentuk bagian tulang belakang berwarna coklat kusam.', nilai: 3 }, { desc: 'Rapi, kurang bersih, warna daging kehijauan, sangat kusam, garis yang membentuk bagian tulang belakang berwarna kehijauan.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: 'Sangat segar, spesifik jenis.', nilai: 9 }, { desc: 'Segar, spesifik jenis.', nilai: 8 }, { desc: 'Kurang segar, mengarah ke netral.', nilai: 7 }, { desc: 'Apek sedikit tengik.', nilai: 5 }, { desc: 'Asam, sedikit bau amoniak dan tengik amoniak jelas.', nilai: 3 }, { desc: 'Busuk, asam dan bau amoniak.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Tekstur', items: [{ desc: 'Padat, kompak dan elastis.', nilai: 9 }, { desc: 'Padat, kompak, agak elastis.', nilai: 8 }, { desc: 'Padat, kompak, kurang elastis.', nilai: 7 }, { desc: 'Kurang padat, kurang kompak.', nilai: 5 }, { desc: 'Lembek, tidak kompak.', nilai: 3 }, { desc: 'Lembek sekali.', nilai: 1 }] }
        ];
    } else if (isFilletIkanBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan es', items: [{ desc: "Rata, bening, dan cukup tebal.", nilai: 9 }, { desc: "Tidak rata, ada bagian yang terbuka", nilai: 7 }, { desc: "Tidak rata, bagian yang terbuka cukup banyak", nilai: 5 }, { desc: "Banyak bagian-bagian yang terbuka", nilai: 3 }, { desc: "Tidak terdapat lapisan es pada permukaan produk", nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: "Tidak mengalami pengeringan", nilai: 9 }, { desc: "Sedikit sekali pengeringan", nilai: 7 }, { desc: "Pengeringan mulai jelas", nilai: 5 }, { desc: "Banyak bagian yang mengering", nilai: 3 }, { desc: "Kering dan terjadi freeze-burning", nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '3. Perubahan warna (perubahan warna)', items: [{ desc: "Belum mengalami perubahan warna", nilai: 9 }, { desc: "Sedikit mengalami perubahan warna", nilai: 7 }, { desc: "Banyak mengalami perubahan warna", nilai: 5 }, { desc: "Perubahan warna hampir menyeluruh", nilai: 3 }, { desc: "Perubahan warna menyeluruh", nilai: 1 }] },
            { kategori: 'B. Setelah pelelehan (thawing)', subKategori: '1. Kenampakan', items: [{ desc: "Warna spesifik jenis, cemerlang.", nilai: 9 }, { desc: "Warna spesifik jenis, kurang cemerlang", nilai: 7 }, { desc: "Mulai berubah warna, kusam.", nilai: 5 }, { desc: "Bagian pinggir agak kehijauan, kusam.", nilai: 3 }, { desc: "Warna kehijauan merata", nilai: 1 }] },
            { kategori: 'B. Setelah pelelehan (thawing)', subKategori: '2. Bau', items: [{ desc: "Segar, spesifik jenis.", nilai: 9 }, { desc: "Netral.", nilai: 7 }, { desc: "Apek, sedikit tengik.", nilai: 5 }, { desc: "Asam, sedikit bau amoniak, tengik.", nilai: 3 }, { desc: "Amoniak dan busuk jelas sekali", nilai: 1 }] },
            { kategori: 'B. Setelah pelelehan (thawing)', subKategori: '3. Tekstur', items: [{ desc: "Padat, kompak dan elastis.", nilai: 9 }, { desc: "Padat, kurang kompak, kurang elastis.", nilai: 7 }, { desc: "Agak lembek, kurang elastis, sedikit berair", nilai: 5 }, { desc: "Lembek, tidak elastis, berair", nilai: 3 }, { desc: "Sangat lembek, berair", nilai: 1 }] }
        ];
    } else if (isFilletNilaBeku) {
        scoreSheetItems = [
            { kategori: 'A. Dalam keadaan beku', subKategori: '1. Lapisan Es', items: [{ desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 }, { desc: 'Rata, bening, cukup tebal ada bagian yang terbuka 10%', nilai: 8 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20%-30%.', nilai: 7 }, { desc: 'Tidak rata, bagian yang terbuka, sebanyak 40%-50%.', nilai: 6 }, { desc: 'Banyak bagian yang terbuka 60%-70%.', nilai: 5 }, { desc: 'Banyak bagian yang terbuka 80%-90%.', nilai: 3 }, { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }] },
            { kategori: 'A. Dalam keadaan beku', subKategori: '2. Pengeringan (dehidrasi)', items: [{ desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 }, { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 }, { desc: 'Pengeringan mulai jelas pada permukaan produk 20%-30%.', nilai: 7 }, { desc: 'Pengeringan banyak pada permukaan produk 40%-50%.', nilai: 6 }, { desc: 'Banyak bagian produk yang tampak mengering 60-70%.', nilai: 5 }, { desc: 'Banyak bagian produk yang tampak mengering 80-90%.', nilai: 3 }, { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }] },
            { kategori: 'B. Sesudah pelelehan (thawing)', subKategori: '3. Tekstur', items: [{ desc: 'Padat, kompak dan elastis.', nilai: 9 }, { desc: 'Padat, kompak dan agak elastis.', nilai: 7 }, { desc: 'Padat, agak kompak, kurang elastis.', nilai: 6 }, { desc: 'Padat, kurang kompak, kurang elastis.', nilai: 5 }, { desc: 'Mulai lembek, kurang kompak, kurang elastis.', nilai: 3 }, { desc: 'Lembek, tidak kompak.', nilai: 1 }] }
        ];
    } else if (isUdangSegar) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', items: [{ desc: 'Utuh, bening bercahaya asli menurut jenis, antar ruas kokoh', nilai: 9 }, { desc: 'Utuh, kurang bening, cahaya mulai pudar, berwarna asli, antar ruas kokoh', nilai: 8 }, { desc: 'Utuh, kebeningan agak hilang, sedikit kusam, antar ruas kurang kokoh', nilai: 7 }, { desc: 'Utuh, kebeningan hilang, kusam, warna agak merah muda, sedikit noda hitam, antar ruas kurang kokoh', nilai: 5 }, { desc: 'Warna merah, noda hitam banyak, kulit mudah lepas dari daging', nilai: 3 }, { desc: 'Warna merah sangat kusam, banyak sekali noda hitam', nilai: 1 }] },
            { kategori: '2. Bau', items: [{ desc: 'Bau sangat segar spesifik jenis', nilai: 9 }, { desc: 'Bau segar spesifik jenis', nilai: 8 }, { desc: 'Bau spesifik jenis netral', nilai: 7 }, { desc: 'Mulai timbul bau amoniak', nilai: 5 }, { desc: 'Bau asam sulfit (H2S)', nilai: 3 }, { desc: 'Bau amoniak kuat dan bau busuk', nilai: 1 }] },
            { kategori: '3. Tekstur', items: [{ desc: 'Sangat elastis, kompak and padat', nilai: 9 }, { desc: 'Elastis, kompak and padat', nilai: 8 }, { desc: 'Kurang elastis, kompak and padat', nilai: 7 }, { desc: 'Tidak elastis, tidak kompak and tidak padat', nilai: 5 }, { desc: 'Agak lunak', nilai: 3 }, { desc: 'Lunak', nilai: 1 }] }
        ];
    } else if (isIkanPindang) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', items: [{ desc: '- Utuh, bersih, warna cemerlang spesifik jenis.', nilai: 9 }, { desc: '- Utuh, bersih, warna kurang cemerlang', nilai: 7 }, { desc: '- Utuh, bersih/kurang bersih, kusam.', nilai: 5 }] },
            { kategori: '2. Bau', items: [{ desc: '- Sangat segar, harum spesifik jenis.', nilai: 9 }, { desc: '- Segar, kurang harum.', nilai: 7 }, { desc: '- Mulai timbul bau asam.', nilai: 5 }] },
            { kategori: '3. Rasa', items: [{ desc: '- Sangat enak, gurih, spesifik jenis.', nilai: 9 }, { desc: '- Enak, kurang gurih.', nilai: 7 }, { desc: '- Timbul rasa gatal pada ujung lidah', nilai: 5 }] },
            { kategori: '4. Tekstur', items: [{ desc: '- Sangat padat, kompak.', nilai: 9 }, { desc: '- Padat, kurang kompak.', nilai: 7 }, { desc: '- Kurang padat, lembek.', nilai: 5 }] },
            { kategori: '5. Lendir', items: [{ desc: '- Tidak berlendir.', nilai: 9 }, { desc: '- Berlendir.', nilai: 3 }] }
        ];
    } else if (isTunaSegarSashimi) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', subKategori: 'a. Mata', items: [{ desc: '- Bola mata cembung, kornea dan pupil jernih, mengkilap spesifik jenis ikan', nilai: 9 }, { desc: '- Bola mata rata, kornea dan pupil jernih, agak mengkilap spesifik jenis ikan', nilai: 8 }, { desc: '- Bola mata rata, kornea agak keruh, pupil agak keabu-abuan, agak mengkilap spesifik jenis ikan', nilai: 7 }, { desc: '- Bola mata agak cekung, kornea agak keruh, pupil agak keabu-abuan, agak mengkilap spesifik jenis ikan', nilai: 6 }, { desc: '- Bola mata agak cekung, kornea keruh, pupil agak keabu-abuan, tidak mengkilap', nilai: 5 }, { desc: '- Bola mata cekung, kornea keruh, pupil keabu-abuan, tidak mengkilap', nilai: 3 }, { desc: '- Bola mata sangat cekung, kornea sangat keruh, pupil abu-abu, tidak mengkilap', nilai: 1 }] },
            { kategori: '1. Kenampakan', subKategori: 'b. Insang', items: [{ desc: '- Warna insang merah tua or coklat kemerahan, cemerlang dengan sedikit sekali lendir transparan', nilai: 9 }, { desc: '- Warna insang merah tua or coklat kemerahan, kurang cemerlang with sedikit lendir transparan', nilai: 8 }, { desc: '- Warna insang merah muda or coklat muda with sedikit lendir agak keruh', nilai: 7 }, { desc: '- Warna insang merah muda or coklat muda with lendir agak keruh', nilai: 6 }, { desc: '- Warna insang merah muda or coklat muda pucat with lendir keruh', nilai: 5 }, { desc: '- Warna insang abu-abu or coklat keabu-abuan with lendir putih susu bergumpal', nilai: 3 }, { desc: '- Warna insang abu-abu, or coklat keabu-abuan with lendir coklat bergumpal', nilai: 1 }] },
            { kategori: '1. Kenampakan', subKategori: 'c. Daging pangkal ekor', items: [{ desc: '- warna pelangi belum terbentuk pada irisan melintang pangkal ekor', nilai: 9 }, { desc: '- warna pelangi sudah terbentuk pada irisan melintang pangkal ekor', nilai: 1 }] },
            { kategori: '2. Daging', items: [{ desc: '- Sayatan daging sangat cemerlang, merah spesifik jenis, jaringan daging sangat kuat', nilai: 9 }, { desc: '- Sayatan daging cemerlang, merah spesifik jenis, jaringan daging kuat', nilai: 8 }, { desc: '- Sayatan daging sedikit kurang cemerlang, merah spesifik jenis, jaringan daging kuat', nilai: 7 }, { desc: '- Sayatan daging kurang cemerlang, agak merah, jaringan daging sedikit kurang kuat', nilai: 6 }, { desc: '- Sayatan daging mulai pudar, mulai kusam, jaringan daging kurang kuat', nilai: 5 }, { desc: '- Sayatan daging kusam, jaringan daging kurang kuat', nilai: 3 }, { desc: '- Sayatan daging sangat kusam, jaringan daging rusak', nilai: 1 }] },
            { kategori: '3. Bau', items: [{ desc: '- Sangat segar, spesifik jenis kuat', nilai: 9 }, { desc: '- Segar, spesifik jenis', nilai: 8 }, { desc: '- Segar, spesifik jenis kurang', nilai: 7 }, { desc: '- Netral', nilai: 6 }, { desc: '- Sedikit bau asam', nilai: 5 }, { desc: '- Bau asam kuat', nilai: 3 }, { desc: '- Bau busuk kuat', nilai: 1 }] },
            { kategori: '4. Tekstur', items: [{ desc: '- Padat, kompak, sangat elastis', nilai: 9 }, { desc: '- Padat, kompak, elastis', nilai: 8 }, { desc: '- Agak lunak, agak elastis', nilai: 7 }, { desc: '- Agak lunak, sedikit kurang elastis', nilai: 6 }, { desc: '- Agak lunak, kurang elastis', nilai: 5 }, { desc: '- Lunak bekas jari terlihat and sangat lambat hilang', nilai: 3 }, { desc: '- Sangat lunak, bekas jari tidak hilang', nilai: 1 }] }
        ];
    } else if (isTunaLoinSegar) {
        scoreSheetItems = [
            { kategori: '1. Kenampakan', items: [{ desc: '- Daging berwarna merah cerah, serat daging merekat kuat sesamanya, mengkilap, tanpa pelangi. Bentuk potongan daging rapi, tidak terikut tulang, tidak ada daging merah', nilai: 9 }, { desc: '- Daging berwarna merah kurang cerah, serat daging merekat sesamanya, kurang mengkilap, sedikit tampak pelangi. Bentuk potongan daging rapi, tidak terikut tulang, tidak ada daging merah', nilai: 7 }, { desc: '- Daging berwarna merah kusam, serat daging mulai memisah, kering, tampak pelangi. Bentuk potongan daging tidak rapi, sedikit terikut tulang, ada daging merah', nilai: 5 }] },
            { kategori: '2. Bau', items: [{ desc: '- Sangat segar, spesifik jenis.', nilai: 9 }, { desc: '- Segar, spesifik jenis.', nilai: 7 }, { desc: '- Kurang segar, ada sedikit bau tambahan.', nilai: 5 }] },
            { kategori: '3. Tekstur', items: [{ desc: '- Padat dan kompak,', nilai: 9 }, { desc: '- Padat, kurang kompak,', nilai: 7 }, { desc: '- Agak lembek, tidak kompak', nilai: 5 }] }
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
            specText = firstColContent + `<div style="padding-left:${firstColContent ? '10px' : '0'}">` + (item.desc.startsWith('\u2022') ? item.desc : '\u2022 ' + item.desc) + `</div>`;
            let checkboxesHtml = '';
            const samplesCount = 6;
            for (let k = 1; k <= samplesCount; k++) {
                const isChecked = selectionMap[globalRowIndex] && selectionMap[globalRowIndex][k];
                checkboxesHtml += `<td style="border: 1px solid #000; text-align: center; vertical-align: middle;">${isChecked ? '&#10003;' : ''}</td>`;
            }
            scoreRowsHtml += `<tr><td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 9pt;">${specText}</td><td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: middle; font-weight: bold;">${item.nilai}</td>${checkboxesHtml}</tr>`;
            globalRowIndex++;
        });
    });

    let totalRowHtml = `<tr><td colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold; background-color: #f9f9f9;">Total</td>`;
    let avgRowHtml = `<tr><td colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold; background-color: #f0f0f0;">Rata-rata</td>`;
    const colLimit = 6;
    for (let k = 1; k <= colLimit; k++) {
        const item = penilaian ? penilaian[`kodeContoh${k}`] : null;
        totalRowHtml += `<td style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; background-color: #f9f9f9; font-size: 9pt;">${item ? item.total : '0'}</td>`;
        avgRowHtml += `<td style="border: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; background-color: #f0f0f0; font-size: 9pt;">${item ? (typeof item.rataRata === 'number' ? item.rataRata.toFixed(2) : item.rataRata) : '0.00'}</td>`;
    }
    totalRowHtml += `</tr>`; avgRowHtml += `</tr>`;

    const namaPanelis = data.namaPetugas || data.namaPanelis || data.namaPanelisTuna || '-';
    const qrSrc = data.qrSrc || '';

    const scoreSheetPageHTML = `
    <div class="sheet" style="position: relative;">
        <div style="text-align: center; margin-top: 2mm; margin-bottom: 10px;"><h3 style="margin: 0; font-size: 10pt; font-weight: bold; text-decoration: underline;">LEMBAR PENILAIAN UJI SKOR ${titleText}</h3></div>
        <div style="margin-bottom: 5px; font-size: 8pt;"><table style="width: 100%; border: none;"><tr><td style="width: 200px;">1. Nomor Sertifikat</td><td style="width: 10px;">:</td><td>${kodeContohUji}</td></tr><tr><td>2. Tgl. Diterima Contoh Uji</td><td>:</td><td>${tglDiterima ? formatIndoDate(tglDiterima) : ''}</td></tr></table></div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; font-size: 8pt;">
            <thead><tr><th style="border: 1px solid #000; padding: 3px; text-align: center; width: 40px;">NO</th><th style="border: 1px solid #000; padding: 3px; text-align: center;">JENIS CONTOH UJI</th><th style="border: 1px solid #000; padding: 3px; text-align: center;">JUMLAH</th><th style="border: 1px solid #000; padding: 3px; text-align: center;">UKURAN</th><th style="border: 1px solid #000; padding: 3px; text-align: center;">Ket.</th></tr></thead>
            <tbody><tr><td style="border: 1px solid #000; padding: 3px; text-align: center;">1.</td><td style="border: 1px solid #000; padding: 3px;">${jenisContoh}</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">${jumlah}</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">${ukuran}</td><td style="border: 1px solid #000; padding: 3px; text-align: center;">${keterangan}</td></tr></tbody>
        </table>
        <div style="margin-bottom: 2px; font-size: 8pt;">&#8226; Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 8pt;">
            <thead>
                <tr><th style="border: 1px solid #000; padding: 3px; text-align: left; vertical-align: middle;" rowspan="2">Spesifikasi</th><th style="border: 1px solid #000; padding: 3px; text-align: center; vertical-align: middle;" rowspan="2">Nilai</th><th style="border: 1px solid #000; padding: 3px; text-align: center;" colspan="6">Kode Contoh</th></tr>
                <tr>
                    <th style="border: 1px solid #000; padding: 3px; text-align: center; width: 25px;">1</th>
                    <th style="border: 1px solid #000; padding: 3px; text-align: center; width: 25px;">2</th>
                    <th style="border: 1px solid #000; padding: 3px; text-align: center; width: 25px;">3</th>
                    <th style="border: 1px solid #000; padding: 3px; text-align: center; width: 25px;">4</th>
                    <th style="border: 1px solid #000; padding: 3px; text-align: center; width: 25px;">5</th>
                    <th style="border: 1px solid #000; padding: 3px; text-align: center; width: 25px;">6</th>
                </tr>
            </thead>
            <tbody>${scoreRowsHtml}${totalRowHtml}${avgRowHtml}</tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8pt;">
            <thead><tr><th style="border: 1px solid #000; padding: 3px; text-align: center; width: 40px;">No</th><th style="border: 1px solid #000; padding: 3px; text-align: center;">Panelis</th><th style="border: 1px solid #000; padding: 3px; text-align: center;">Tanda Tangan</th></tr></thead>
            <tbody><tr><td style="border: 1px solid #000; padding: 3px; text-align: center; vertical-align: middle; height: 50px;">1.</td><td style="border: 1px solid #000; padding: 3px; text-align: center; vertical-align: middle;">${namaPanelis}</td><td style="border: 1px solid #000; padding: 3px; text-align: center; vertical-align: middle;">${qrSrc ? `<img src="${qrSrc}" style="width: 50px; height: 50px; object-fit: contain;">` : ''}</td></tr></tbody>
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
            html, body { 
                margin: 0 !important; 
                padding: 0 !important; 
                display: block !important; 
                width: 100% !important; 
                height: auto !important; 
                overflow: visible !important; 
                background: none !important;
            } 
            .sheet { 
                margin: 0 !important; 
                box-shadow: none !important; 
                width: 210mm !important; 
                height: 280mm !important; 
                page-break-after: always !important; 
                page-break-inside: avoid !important;
                padding: 10mm !important; 
                overflow: hidden !important;
                display: block !important;
                box-sizing: border-box !important;
                position: relative !important;
            } 
            .sheet:last-of-type { page-break-after: avoid !important; } 
            
            /* Tighten up for print */
            h2 { margin: 2px 0 !important; font-size: 13pt !important; }
            table { font-size: 8.5pt !important; border-collapse: collapse !important; width: 100% !important; margin-bottom: 5px !important; }
            th, td { padding: 2px 4px !important; border: 1px solid #000 !important; }
            .header-info-table, .header-info-table td { border: none !important; padding: 1px 2px !important; }
            .no-print { display: none !important; }
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
    <div class="sheet">${headerHTML.trim()}<div class="table-responsive">${tableHTML.trim()}</div>${conclusionHTML.trim()}</div>${scoreSheetPageHTML.trim()}
</body>
</html>`.trim();
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
    const response = await fetch("https://spion-api.karantinaikanbitung.workers.dev/lhu", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            no_ptk: data.kodeContohUji || "-",
            nama_panelis: data.namaPanelis || "-",
            lokasi_pelayanan: data.noSampel || "-",
            jenis_ikan: data.jenisHewan || "-",
            html: htmlContent
        })
    });

    const result = await response.json();
    console.log("HASIL API:", result);

    if (!result.success) {
        alert("Gagal menyimpan LHU ke server");
    }

} catch (error) {
    console.error("ERROR KIRIM LHU:", error);
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

    // Gunakan html2pdf.js
    const parser = new DOMParser();
    const doc = parser.parseFromString(window.htmlDownload, 'text/html');
    const element = document.createElement('div');

    // Ambil hanya element .sheet agar tidak ada wrapping yang merusak layout
    const sheets = doc.querySelectorAll('.sheet');
    sheets.forEach(sheet => {
        element.appendChild(sheet.cloneNode(true));
    });

    if (element.children.length === 0) {
        element.innerHTML = window.htmlDownload;
    }

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
async function showLHUPreview(savedData = null, savedHewan = null, savedFilename = null) {
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
        printBtn.innerHTML = '&#128424; Print';
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
        htmlBtn.innerHTML = '&#128196; HTML';
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

            // Menggunakan format nama file yang sama dengan Daftar Hasil Uji
            // Jika ada nama file tersimpan (dari history), gunakan itu. Jika tidak, generate baru.
            const filename = savedFilename || getFormattedFilename(data, hewan);
            a.download = filename + (filename.toLowerCase().endsWith('.html') ? '' : '.html');

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
            mark.textContent = '\u2713'; // Fixed checkmark symbol
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
    let table = document.getElementById('ikanSegarTable');
    if (!table) {
        table = document.getElementById('filletIkanBekuTable');
    }
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
        'sarden-makarel-kaleng': 'Sarden/Makarel Kaleng',
        'ikan-asap': 'Dried Smoking Fish (Ikan Kayu)',
        'ikan-asin-kering': 'Ikan Asin Kering',
        'rumput-laut-kering': 'Rumput Laut Kering',
        'lobster-udang-kipas': 'LOBSTER, UDANG KIPAS HIDUP',
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

    // Khusus untuk ikan asap, kumpulkan data dari tabel
    if (hewan === 'ikan-asap') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('ikanAsapTable');
        if (table) {
            data.penilaianIkanAsap = {};
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianIkanAsap[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk sarden/makarel kaleng, kumpulkan data dari tabel
    if (hewan === 'sarden-makarel-kaleng') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('sardenMakarelTable');
        if (table) {
            data.penilaianSardenMakarel = {};
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianSardenMakarel[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk ikan asin kering, kumpulkan data dari tabel
    if (hewan === 'ikan-asin-kering') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('ikanAsinKeringTable');
        if (table) {
            data.penilaianIkanAsinKering = {};
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianIkanAsinKering[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk rumput laut kering, kumpulkan data dari tabel
    if (hewan === 'rumput-laut-kering') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('rumputLautKeringTable');
        if (table) {
            data.penilaianRumputLautKering = {};
            for (let kode = 1; kode <= 8; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianRumputLautKering[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk lobster/udang kipas, kumpulkan data dari tabel
    if (hewan === 'lobster-udang-kipas') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('lobsterUdangKipasTable');
        if (table) {
            data.penilaianLobsterUdangKipas = {};
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianLobsterUdangKipas[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk kepiting bakau, kumpulkan data dari tabel
    if (hewan === 'kepiting-bakau') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('kepitingBakauTable');
        if (table) {
            data.penilaianKepitingBakau = {};
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianKepitingBakau[`kodeContoh${kode}`] = kodeData;
            }
        }
    }

    // Khusus untuk ikan asap MURNI (BARU), kumpulkan data dari tabel
    if (hewan === 'ikan-asap-murni') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('ikanAsapMurniTable');
        if (table) {
            data.penilaianIkanAsapMurni = {};
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianIkanAsapMurni[`kodeContoh${kode}`] = kodeData;
            }
        }
    }
    if (hewan === 'kepiting-bakau') {
        const kodeContohUjiInput = document.getElementById('kodeContohUji');
        const tglDiterimaInput = document.getElementById('tglDiterima');
        if (kodeContohUjiInput) data.kodeContohUji = kodeContohUjiInput.value || '';
        if (tglDiterimaInput) data.tglDiterima = tglDiterimaInput.value || '';

        const table = document.getElementById('kepitingBakauTable');
        if (table) {
            data.penilaianKepitingBakau = {};
            for (let kode = 1; kode <= 6; kode++) {
                const kodeData = { nilai: [], total: 0, rataRata: 0 };
                const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
                checkboxes.forEach(checkbox => {
                    kodeData.nilai.push({ rowIndex: checkbox.dataset.rowIndex, nilai: parseInt(checkbox.dataset.nilai) });
                });
                const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
                const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
                if (totalCell) kodeData.total = parseInt(totalCell.textContent) || 0;
                if (avgCell) kodeData.rataRata = parseFloat(avgCell.textContent) || 0;
                data.penilaianKepitingBakau[`kodeContoh${kode}`] = kodeData;
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

    // Persiapkan item history
    const historyItem = {
        id: Date.now(),
        filename: filename,
        lokasiPelayanan: data.noSampel || '-',
        hewan: hewan,
        data: data,
        // html: lhuHtml, // HTML tidak dikirim ke history sheet (terlalu besar), sudah dibackup ke Drive
        timestamp: new Date().toISOString()
    };

    // Simpan ke Local Storage
    saveResultLocally(data, filename, lhuHtml, hewan);

    // Kirim data ke Production API
    const productionAPIData = {
        nomor_sertifikat: data.kodeContohUji || '-',
        nama_perusahaan: data.namaPerusahaan || '-',
        jenis_produk: data.jenisHewan || '-',
        negara_tujuan: data.negaraTujuan || '-',
        tanggal_terbit: data.tanggalUji || '-'
    };

    console.log('Sending data to Production API:', productionAPIData);

    fetch("https://spion-api.karantinaikanbitung.workers.dev/lhu", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    no_ptk: data.kodeContohUji || "-",
    nama_panelis: data.namaPanelis || "-",
    lokasi_pelayanan: data.noSampel || "-",
    jenis_ikan: data.jenisHewan || "-",
    html: lhuHtml
  })
})
.then(res => res.json())
.then(result => {
  console.log("HASIL API:", result);
  if (!result.success) {
    alert("Gagal menyimpan ke server");
  }
})
.catch(err => {
  console.error("ERROR API:", err);
});

  body: JSON.stringify({
    no_ptk: data.kodeContohUji || "-",
    nama_panelis: data.namaPanelis || "-",
    lokasi_pelayanan: data.noSampel || "-",
    jenis_ikan: data.jenisHewan || "-",
    html: lhuHtml
  })
})
.then(res => res.json())
.then(result => {
  console.log("HASIL API:", result);
  if (!result.success) {
    alert("Gagal menyimpan ke server");
  }
})
.catch(err => {
  console.error("ERROR API:", err);
});

        .then(async response => {
            if (response.ok) {
                const result = await response.json();
                console.log('Successfully sent to Production API:', result);
            } else {
                console.error('Failed to send to Production API', response.status);
            }
        })
        .catch(error => {
            console.error('Error sending to Production API:', error);
        });

    // Tampilkan pesan sukses
    alert('Terima kasih! Data penilaian uji telah berhasil disimpan dan dikirim ke sistem produksi.');
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
    const urlParams = new URLSearchParams(location.search);
    const jenisUji = urlParams.get('jenis');
    location.href = `kuisoner-jenis-uji.html?jenis=${jenisUji}`;
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

/**
 * Menghasilkan tabel penilaian untuk Lobster/Udang Kipas Hidup
 */
function generateLobsterUdangKipasTable(container) {
    // Header info (Format as Ikan Segar)
    const headerDiv = document.createElement('div');
    headerDiv.className = 'lobster-udang-kipas-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR LOBSTER, UDANG KIPAS HIDUP</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Lobster/Udang Kipas" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);
    // Hide catatan section for Lobster/Udang Kipas
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    // Scoring descriptions from the image
    const criteria = [
        { desc: 'Hidup dan reaktif terhadap sentuhan, Mata utuh, antenna utuh, kaki utuh tanpa cacat sedikit pun, bagian perut cemerlang', nilai: 9 },
        { desc: 'Hidup dan reaktif terhadap sentuhanm mata utuh, antena tidak utuh, kaki utuh tanpa cacat sedikitpun bagian perut cemerlang.', nilai: 7 },
        { desc: 'Hidup dan reaktif terhadap sentuhan, mata tidak utuh, antena tidak utuh, kaki utuh bagian perut cemerlang.', nilai: 5 }
    ];

    const table = document.createElement('table');
    table.className = 'lobster-udang-kipas-table';
    table.id = 'lobsterUdangKipasTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 60px;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center;">Kode Contoh</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <th colspan="2"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    criteria.forEach((item, rowIndex) => {
        const tr = document.createElement('tr');
        tr.dataset.nilai = item.nilai;
        tr.dataset.rowIndex = rowIndex;

        // Spesifikasi cell
        const specCell = document.createElement('td');
        specCell.style.border = '1px solid #ddd';
        specCell.style.padding = '10px';
        specCell.textContent = '- ' + item.desc;
        tr.appendChild(specCell);

        // Nilai cell
        const valorCell = document.createElement('td');
        valorCell.style.border = '1px solid #ddd';
        valorCell.style.padding = '10px';
        valorCell.style.textAlign = 'center';
        valorCell.style.fontWeight = 'bold';
        valorCell.textContent = item.nilai;
        tr.appendChild(valorCell);

        // Kode contoh cells (1-6)
        for (let kode = 1; kode <= 6; kode++) {
            const td = document.createElement('td');
            td.className = 'kode-contoh-cell';
            td.dataset.kode = kode;
            td.dataset.rowIndex = rowIndex;
            td.dataset.nilai = item.nilai;
            td.style.border = '1px solid #ddd';
            td.style.padding = '10px';
            td.style.textAlign = 'center';
            td.style.cursor = 'pointer';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'nilai-checkbox';
            checkbox.dataset.kode = kode;
            checkbox.dataset.rowIndex = rowIndex;
            checkbox.dataset.nilai = item.nilai;
            checkbox.style.display = 'none';
            td.appendChild(checkbox);

            td.addEventListener('click', function (e) {
                if (e.target.type === 'checkbox') return;
                const newChecked = !checkbox.checked;

                // Uncheck others in the same column
                if (newChecked) {
                    tbody.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                        cb.checked = false;
                        updateCheckmark(cb.parentElement, false);
                    });
                }

                checkbox.checked = newChecked;
                updateCheckmark(td, newChecked);
                setTimeout(() => calculateTotalsLobsterUdangKipas(), 10);
            });

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });

    // Baris Total
    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    // Baris Rata-rata
    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // LHU Button (re-implement specific for this species)
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

        // Insert as first child
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    // QR Code and Panelist info
    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsLobsterUdangKipas() {
    const table = document.getElementById('lobsterUdangKipasTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

/**
 * Menghasilkan tabel penilaian untuk Kepiting Bakau Hidup
 */
function generateKepitingBakauTable(container) {
    // Header info (Format as Ikan Segar)
    const headerDiv = document.createElement('div');
    headerDiv.className = 'kepiting-bakau-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR KEPITING BAKAU HIDUP</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Kepiting Bakau Hidup" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);
    // Hide catatan section for Kepiting Bakau
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    // Scoring descriptions from the image
    const criteria = [
        { desc: 'Hidup dan reaktif terhadap sentuhan, Mata utuh, capit dan kaki utuh tanpa cacat', nilai: 9 },
        { desc: 'Hidup dan reaktif terhadap sentuhan, mata utuh, capit utuh, kaki patah satu sampai tidak sebaris', nilai: 7 },
        { desc: 'Hidup dan reaktif terhadap sentuhan, mata utuh, capit patah tidak sampai pangkal, kaki patah satu sampai tiga tidak sebaris', nilai: 5 },
        { desc: 'Hidup dan tidak reaktif terhadap sentuhan, mata tidak utuh, capit patah dari pangkal dan posisi horizon, kaki patah lebih dari tiga mulut sedikit berbusa', nilai: 3 },
        { desc: 'Mati', nilai: 1 }
    ];

    const table = document.createElement('table');
    table.className = 'kepiting-bakau-table';
    table.id = 'kepitingBakauTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 60px;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center;">Kode Contoh</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <th colspan="2"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    criteria.forEach((item, rowIndex) => {
        const tr = document.createElement('tr');
        tr.dataset.nilai = item.nilai;
        tr.dataset.rowIndex = rowIndex;

        // Spesifikasi cell
        const specCell = document.createElement('td');
        specCell.style.border = '1px solid #ddd';
        specCell.style.padding = '10px';
        specCell.textContent = '- ' + item.desc;
        tr.appendChild(specCell);

        // Nilai cell
        const valorCell = document.createElement('td');
        valorCell.style.border = '1px solid #ddd';
        valorCell.style.padding = '10px';
        valorCell.style.textAlign = 'center';
        valorCell.style.fontWeight = 'bold';
        valorCell.textContent = item.nilai;
        tr.appendChild(valorCell);

        // Kode contoh cells (1-6)
        for (let kode = 1; kode <= 6; kode++) {
            const td = document.createElement('td');
            td.className = 'kode-contoh-cell';
            td.dataset.kode = kode;
            td.dataset.rowIndex = rowIndex;
            td.dataset.nilai = item.nilai;
            td.style.border = '1px solid #ddd';
            td.style.padding = '10px';
            td.style.textAlign = 'center';
            td.style.cursor = 'pointer';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'nilai-checkbox';
            checkbox.dataset.kode = kode;
            checkbox.dataset.rowIndex = rowIndex;
            checkbox.dataset.nilai = item.nilai;
            checkbox.style.display = 'none';
            td.appendChild(checkbox);

            td.addEventListener('click', function (e) {
                if (e.target.type === 'checkbox') return;
                const newChecked = !checkbox.checked;

                // Uncheck others in the same column
                if (newChecked) {
                    tbody.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                        cb.checked = false;
                        updateCheckmark(cb.parentElement, false);
                    });
                }

                checkbox.checked = newChecked;
                updateCheckmark(td, newChecked);
                setTimeout(() => calculateTotalsKepitingBakau(), 10);
            });

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });

    // Baris Total
    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    // Baris Rata-rata
    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // LHU Button (re-implement specific for this species)
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

        // Insert as first child
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    // QR Code and Panelist info
    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsKepitingBakau() {
    const table = document.getElementById('kepitingBakauTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

function calculateTotalsIkanAsapMurni() {
    const table = document.getElementById('ikanAsapMurniTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

/**
 * Menghasilkan tabel penilaian untuk IKAN ASAP
 */
function generateIkanAsapMurniTable(container) {
    // Header info (Format as Ikan Segar)
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-asap-murni-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR IKAN ASAP</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="IKAN ASAP" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);
    // Hide catatan section
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const criteria = [
        {
            category: '1. Kenampakan',
            items: [
                { desc: 'Menarik, bersih, coklat emas, bercahaya menurut jenis.', nilai: 9 },
                { desc: 'Menarik, bersih, coklat emas, kurang bercahaya, menurut jenis.', nilai: 7 },
                { desc: 'Cukup menarik, bersih, coklat, kusam.', nilai: 5 },
                { desc: 'Kurang menarik, coklat tua, kusam.', nilai: 3 },
                { desc: 'Tidak menarik, coklat tua, kusam sekali.', nilai: 1 }
            ]
        },
        {
            category: '2. Bau',
            items: [
                { desc: 'Harum asap cukup, tanpa bau tambahan mengganggu.', nilai: 9 },
                { desc: 'Kurang harum, asap cukup, tanpa bau tambahan mengganggu.', nilai: 7 },
                { desc: 'Keharuman hampir netral, sedikit bau tambahan.', nilai: 5 },
                { desc: 'Bau tambahan kuat, tercium bau amoniak dan tengik.', nilai: 3 },
                { desc: 'Busuk, bau amoniak kuat dan tengik.', nilai: 1 }
            ]
        },
        {
            category: '3. Rasa',
            items: [
                { desc: 'Enak, gurih, tanpa rasa tambahan mengganggu.', nilai: 9 },
                { desc: 'Enak, kurang gurih.', nilai: 7 },
                { desc: 'Tidak enak, tidak gurih.', nilai: 5 },
                { desc: 'Tidak enak dengan rasa tambahan mengganggu.', nilai: 3 },
                { desc: 'Basi / busuk.', nilai: 1 }
            ]
        },
        {
            category: '4. Tekstur',
            items: [
                { desc: 'Padat, kompak, cukup kering, antar jaringan erat.', nilai: 9 },
                { desc: 'Padat, kompak, kering, antar jaringan erat.', nilai: 7 },
                { desc: 'Kurang kering, antar jaringan longgar.', nilai: 5 },
                { desc: 'Lembab, antar jaringan mudah lepas.', nilai: 3 },
                { desc: 'Sangat lembab, mudah terurai.', nilai: 1 }
            ]
        },
        {
            category: '5. Jamur',
            items: [
                { desc: 'Tidak ada.', nilai: 9 },
                { desc: 'Ada.', nilai: 1 }
            ]
        },
        {
            category: '6. Lendir',
            items: [
                { desc: 'Tidak ada.', nilai: 9 },
                { desc: 'Ada.', nilai: 1 }
            ]
        }
    ];

    const table = document.createElement('table');
    table.className = 'ikan-asap-murni-table';
    table.id = 'ikanAsapMurniTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    // Header tabel
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 60px;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center;">Kode Contoh</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <th colspan="2"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(cat => {
        // Category Header
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#eaeaea';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 5px; font-weight: bold;">${cat.category}</td>`;
        tbody.appendChild(catHeader);

        cat.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            // Spesifikasi cell
            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '10px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            // Nilai cell
            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '10px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            // Kode contoh cells (1-6)
            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;

                    // Uncheck others in the same column for THIS CATEGORY
                    // Need to find checks within this category's row range?
                    // Or simplified: uncheck others in same column THAT belong to the same category?
                    // The standard behavior in other functions seems to be unchecking others in the same BLOCK/Function.
                    // But here we have categories.
                    // Let's look at `generateIkanSegarTable`. It uses `tbody.querySelectorAll`.
                    // But `generateIkanSegarTable` has different items for different sub-categories.
                    // Actually, usually we only select ONE value per category (Kenampakan, Bau, etc.)?
                    // Checking the images... yes, typically one check per attribute.
                    // "Berilah tanda &#10003; pada nilai yang dipilih".
                    // So for "1. Kenampakan", choose ONE of 9, 7, 5, 3, 1.
                    // So we must group by category.

                    if (newChecked) {
                        // Find all checkboxes in this column for *this category*
                        // We can identify category by checking surrounding rows? Or just index range.
                        // Easier: Since we build it loop by loop, let's tag the rows with category ID.
                        const catId = cat.category;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }

                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsIkanAsapMurni(), 10);
                });

                tr.appendChild(td);
            }
            // Tag row
            tr.dataset.catId = cat.category;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    // Baris Total
    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    // Baris Rata-rata
    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // LHU Button
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

        // Insert as first child
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    // QR Code and Panelist info
    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}


function calculateTotalsSiripHiuKering() {
    const table = document.getElementById('siripHiuKeringTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}


// -- Append Sirip Hiu Function --
function calculateTotalsSiripHiuKering() {
    const table = document.getElementById('siripHiuKeringTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

function generateSiripHiuKeringTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'sirip-hiu-kering-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR SIRIP HIU KERING DENGAN KULIT</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Sirip Hiu Kering dengan Kulit" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const criteria = [
        {
            category: '1. Kenampakan',
            items: [
                { desc: 'Cerah dan bersih, warna spesifik jenis, daging menempel sedikit.', nilai: 9 },
                { desc: 'Cerah dan bersih, warna spesifik jenis, daging menempel agak banyak.', nilai: 7 },
                { desc: 'Warna spesifik jenis, daging menempel banyak, warna coklat tua atau hitam.', nilai: 5 }
            ]
        },
        {
            category: '2. Bau',
            items: [
                { desc: 'Segar spesifik jenis tanpa bau tambahan.', nilai: 9 },
                { desc: 'Segar berkurang tanpa bau tambahan.', nilai: 7 },
                { desc: 'Bau amonia.', nilai: 5 }
            ]
        },
        {
            category: '3. Tekstur',
            items: [
                { desc: 'Liat, tidak mudah patah, kering.', nilai: 9 },
                { desc: 'Liat, tidak mudah patah, kurang kering.', nilai: 7 },
                { desc: 'Liat, tidak mudah patah, lembab.', nilai: 5 }
            ]
        }
    ];

    const table = document.createElement('table');
    table.className = 'sirip-hiu-kering-table';
    table.id = 'siripHiuKeringTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 60px;">Nilai (?)</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center;">Nomor Sertifikat :</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <th colspan="2"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(cat => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#eaeaea';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 5px; font-weight: bold;">${cat.category}</td>`;
        tbody.appendChild(catHeader);

        cat.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '10px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '10px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = cat.category;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsSiripHiuKering(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = cat.category;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames at the end to ensure it exists
if (typeof hewanNames !== 'undefined') {
    hewanNames['sirip-hiu-kering'] = 'Sirip Hiu Kering dengan Kulit';
    hewanNames['kepiting-bakau'] = 'KEPITING BAKAU HIDUP';
}

// -- Udang Kering Utuh Functions --
function calculateTotalsUdangKeringUtuh() {
    const table = document.getElementById('udangKeringUtuhTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

function generateUdangKeringUtuhTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'udang-kering-utuh-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR UDANG KERING UTUH</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Udang Kering Utuh" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const criteria = [
        {
            category: '1. Kenampakan',
            items: [
                { desc: 'Utuh, bersih, rapi, bercahaya menurut jenis', nilai: 9 },
                { desc: 'Utuh, bersih, kurang rapi, kurang bercahaya menurut jenis', nilai: 7 },
                { desc: 'Kurang bersih, kurang rapi, tidak utuh, agak kusam', nilai: 5 },
                { desc: 'Kotor, tidak rapi, tidak utuh, agak kusam', nilai: 3 },
                { desc: 'Kotor Sekali.', nilai: 1 }
            ]
        },
        {
            category: '2. Bau',
            items: [
                { desc: 'Bau segar, spesifik udang kering.', nilai: 9 },
                { desc: 'Bau segar, spesifik udang kering berkurang.', nilai: 7 },
                { desc: 'Mulai tercium bau apek.', nilai: 5 },
                { desc: 'Bau amoniak dan agak tengik.', nilai: 3 },
                { desc: 'Bau amoniak kuat dan tengik.', nilai: 1 }
            ]
        },
        {
            category: '3. Rasa',
            items: [
                { desc: 'Gurih, spesifik udang kering.', nilai: 9 },
                { desc: 'Gurih, spesifik udang kering berkurang.', nilai: 7 },
                { desc: 'Hambar, sedikit rasa tambahan.', nilai: 5 },
                { desc: 'Tidak enak dan rasa tambahan mengganggu', nilai: 3 },
                { desc: 'Sangat tidak enak', nilai: 1 }
            ]
        },
        {
            category: '4. Tekstur',
            items: [
                { desc: 'Padat, liat, dan kering.', nilai: 9 },
                { desc: 'Padat, liat, dan sedikit kurang kering.', nilai: 7 },
                { desc: 'Kurang padat, agak rapuh dan lembab.', nilai: 5 },
                { desc: 'Kurang padat, rapuh dan lembab.', nilai: 3 },
                { desc: 'Sangat lembab, mudah terurai.', nilai: 1 }
            ]
        },
        {
            category: '5. Jamur',
            items: [
                { desc: 'Tidak ada.', nilai: 9 },
                { desc: 'Ada.', nilai: 1 }
            ]
        }
    ];

    const table = document.createElement('table');
    table.className = 'udang-kering-utuh-table';
    table.id = 'udangKeringUtuhTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 60px;">Nilai (?)</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center;">Nomor Sertifikat :</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <th colspan="2"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(cat => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#eaeaea';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 5px; font-weight: bold;">${cat.category}</td>`;
        tbody.appendChild(catHeader);

        cat.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '10px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '10px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = cat.category;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsUdangKeringUtuh(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = cat.category;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Udang Kering Utuh
if (typeof hewanNames !== 'undefined') {
    hewanNames['udang-kering-utuh'] = 'Udang Kering Utuh';
}

// -- Abon Ikan Functions --
function calculateTotalsAbonIkan() {
    const table = document.getElementById('abonIkanTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

function generateAbonIkanTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'abon-ikan-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR ABON IKAN, KRUSTASEA, DAN MOLUSKA</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Abon Ikan, Krustasea, dan Moluska" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const criteria = [
        {
            category: '1. Kenampakan',
            items: [
                { desc: 'Warna coklat spesifik produk, serbuk/serat homogen, cemerlang', nilai: 9 },
                { desc: 'Warna coklat spesifik produk, serbuk/serat kurang homogen, agak kusam', nilai: 7 },
                { desc: 'Warna coklat tidak spesifik produk, serbuk/serat tidak homogen, kusam', nilai: 5 }
            ]
        },
        {
            category: '2. Bau',
            items: [
                { desc: 'Spesifik produk sangat kuat', nilai: 9 },
                { desc: 'Spesifik produk kuat', nilai: 7 },
                { desc: 'Spesifik produk apek, tengik atau bau asing lainnya', nilai: 5 }
            ]
        },
        {
            category: '3. Rasa',
            items: [
                { desc: 'Spesifik produk', nilai: 9 },
                { desc: 'Netral, spesifik produk kurang', nilai: 7 },
                { desc: 'Mulai tengik atau rasa asing lainnya', nilai: 5 }
            ]
        },
        {
            category: '4. Tekstur',
            items: [
                { desc: 'Renyah, tidak menggumpal', nilai: 9 },
                { desc: 'Renyah, menggumpal', nilai: 7 },
                { desc: 'Tidak renyah, menggumpal', nilai: 5 }
            ]
        },
        {
            category: '5. Kapang',
            items: [
                { desc: 'Tidak ada', nilai: 9 },
                { desc: 'Ada', nilai: 5 }
            ]
        }
    ];

    const table = document.createElement('table');
    table.className = 'abon-ikan-table';
    table.id = 'abonIkanTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 60px;">Nilai (?)</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center;">Nomor Sertifikat :</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <th colspan="2"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(cat => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#eaeaea';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 5px; font-weight: bold;">${cat.category}</td>`;
        tbody.appendChild(catHeader);

        cat.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '10px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '10px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = cat.category;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsAbonIkan(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = cat.category;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Abon Ikan
if (typeof hewanNames !== 'undefined') {
    hewanNames['abon-ikan'] = 'Abon Ikan, Krustasea, dan Moluska';
}

// -- Sambal Ikan Functions --
function calculateTotalsSambalIkan() {
    const table = document.getElementById('sambalIkanTable');
    if (!table) return;
    for (let kode = 1; kode <= 6; kode++) {
        let total = 0, count = 0;
        table.querySelectorAll(`input.nilai-checkbox[data-kode="${kode}"]:checked`).forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });
        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) avgCell.textContent = count > 0 ? (total / count).toFixed(2) : '0.00';
    }
}

function generateSambalIkanTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'sambal-ikan-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR SAMBAL IKAN</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Sambal Ikan" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const criteria = [
        {
            category: '1. Kenampakan',
            items: [
                { desc: 'Warna spesifik', nilai: 9 },
                { desc: 'Warna kurang spesifik produk', nilai: 7 },
                { desc: 'Warna tidak spesifik produk', nilai: 5 }
            ]
        },
        {
            category: '2. Aroma',
            items: [
                { desc: 'Spesifik sambal ikan kuat', nilai: 9 },
                { desc: 'Spesifik sambal ikan kurang kuat menuju netral', nilai: 7 },
                { desc: 'Tengik, mulai tercium penyimpangan yang kuat', nilai: 5 }
            ]
        },
        {
            category: '3. Tekstur',
            items: [
                { desc: 'Kental, spesifik produk', nilai: 9 },
                { desc: 'Kurang kental, spesifik produk', nilai: 7 }
            ]
        }
    ];

    const table = document.createElement('table');
    table.className = 'sambal-ikan-table';
    table.id = 'sambalIkanTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    let theadHTML = `
        <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 40%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50px;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center;">Nomor Sertifikat :</th>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <th colspan="2"></th>`;
    for (let i = 1; i <= 6; i++) {
        theadHTML += `<th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i}</th>`;
    }
    theadHTML += `</tr>`;
    thead.innerHTML = theadHTML;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(cat => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#eaeaea';
        catHeader.innerHTML = `<td colspan="14" style="border: 1px solid #ddd; padding: 5px; font-weight: bold;">${cat.category}</td>`;
        tbody.appendChild(catHeader);

        cat.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = cat.category;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsSambalIkan(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = cat.category;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Sambal Ikan
if (typeof hewanNames !== 'undefined') {
    hewanNames['sambal-ikan'] = 'Sambal Ikan';
}

/**
 * Menghitung total dan rata-rata untuk Tuna Loin Beku
 */
function calculateTotalsTunaLoinBeku() {
    const table = document.getElementById('tunaLoinBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll('.nilai-checkbox[data-kode="' + kode + '"]:checked');
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector('.total-cell[data-kode="' + kode + '"]');
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector('.avg-cell[data-kode="' + kode + '"]');
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

/**
 * Membuat tabel penilaian untuk Tuna Loin Beku
 */
function generateTunaLoinBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'tuna-loin-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR TUNA LOIN BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Tuna Loin Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.className = 'tuna-loin-beku-table';
    table.id = 'tunaLoinBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Kode Contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan es',
            items: [
                { desc: 'Rata, bening, seluruh permukaan dilapisi es', nilai: 9 },
                { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%', nilai: 7 },
                { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang dari 50%', nilai: 5 },
                { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es lebih dari 50%', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 },
                { desc: 'Pengeringan pada permukaan produk kurang lebih 30%', nilai: 7 },
                { desc: 'Pengeringan pada permukaan produk kurang dari 50%', nilai: 5 },
                { desc: 'Pengeringan banyak pada permukaan produk 40%-50%', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 },
                { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%', nilai: 7 },
                { desc: 'Perubahan warna pada permukaan produk kurang dari 50%', nilai: 5 },
                { desc: 'Perubahan warna pada permukaan produk lebih dari 50%', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk', nilai: 1 }
            ]
        },
        {
            category: 'B. Setelah pelelehan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Cemerlang spesifik produk', nilai: 9 },
                { desc: 'Kurang cemerlang spesifik produk', nilai: 7 },
                { desc: 'Agak kusam', nilai: 5 },
                { desc: 'Mulai berubah warna', nilai: 3 },
                { desc: 'Warna agak kemerahan', nilai: 1 }
            ]
        },
        {
            category: 'B. Setelah pelelehan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Spesifik produk', nilai: 9 },
                { desc: 'Netral', nilai: 7 },
                { desc: 'Sedikit tengik', nilai: 5 },
                { desc: 'Asam, sedikit bau amonia, tengik', nilai: 3 },
                { desc: 'Amonia dan busuk jelas sekali', nilai: 1 }
            ]
        },
        {
            category: 'B. Setelah pelelehan (thawing)',
            subCategory: '3. Tekstur',
            items: [
                { desc: 'Padat, kompak', nilai: 9 },
                { desc: 'Padat, kurang kompak,', nilai: 7 },
                { desc: 'Agak lembek', nilai: 5 },
                { desc: 'Lembek.', nilai: 3 },
                { desc: 'Sangat lembek', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach((section, sIdx) => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f1f1f1';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsTunaLoinBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // Reuse form actions but ensure LHU button exists
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Tuna Loin Beku
if (typeof hewanNames !== 'undefined') {
    hewanNames['tuna-loin-beku'] = 'Tuna Loin Beku';
}

/**
 * Menghitung total dan rata-rata untuk Tuna Steak Beku
 */
function calculateTotalsTunaSteakBeku() {
    const table = document.getElementById('tunaSteakBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll('.nilai-checkbox[data-kode="' + kode + '"]:checked');
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector('.total-cell[data-kode="' + kode + '"]');
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector('.avg-cell[data-kode="' + kode + '"]');
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

/**
 * Membuat tabel penilaian untuk Tuna Steak Beku
 */
function generateTunaSteakBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'tuna-steak-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR TUNA STEAK BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Tuna Steak Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.className = 'tuna-steak-beku-table';
    table.id = 'tunaSteakBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Kode Contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan es',
            items: [
                { desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 },
                { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10%.', nilai: 8 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20%-30%.', nilai: 7 },
                { desc: 'Tidak rata, bagian yang terbuka sebanyak 40%-50%.', nilai: 6 },
                { desc: 'Banyak bagian yang terbuka 60%-70%.', nilai: 5 },
                { desc: 'Banyak bagian yang terbuka 80%-90%.', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 },
                { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Pengeringan mulai jelas pada permukaan produk 20%-30%.', nilai: 7 },
                { desc: 'Pengeringan banyak pada permukaan produk 40%-50%.', nilai: 6 },
                { desc: 'Banyak bagian produk yang tampak mengering 60%-70%.', nilai: 5 },
                { desc: 'Banyak bagian produk yang tampak mengering 80%-90%.', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Agak banyak mengalami perubahan warna pada permukaan produk 20%-30%.', nilai: 7 },
                { desc: 'Banyak mengalami perubahan warna pada permukaan produk 40%-50%.', nilai: 6 },
                { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 60%-70%.', nilai: 5 },
                { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 80%-90%.', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Warna daging krem, sangat cerah dan sangat mengkilap', nilai: 9 },
                { desc: 'Warna daging krem, cerah dan mengkilap', nilai: 8 },
                { desc: 'Warna daging krem, cerah, kurang mengkilap', nilai: 7 },
                { desc: 'Warna daging krem kecoklatan, agak kusam', nilai: 6 },
                { desc: 'Warna daging kecoklatan, kusam', nilai: 5 },
                { desc: 'Warna daging coklat, kusam', nilai: 3 },
                { desc: 'Warna daging coklat tua, sangat kusam', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '3. Bau',
            items: [
                { desc: 'Bau sangat segar.', nilai: 9 },
                { desc: 'Bau segar.', nilai: 8 },
                { desc: 'Bau segar mengarah ke netral.', nilai: 7 },
                { desc: 'Netral', nilai: 6 },
                { desc: 'Netral dengan sedikit bau tambahan yang mengganggu', nilai: 5 },
                { desc: 'Tercium bau busuk', nilai: 3 },
                { desc: 'Bau busuk sangat jelas', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '4. Tekstur',
            items: [
                { desc: 'Kompak, padat dan sangat elastis', nilai: 9 },
                { desc: 'Kompak, padat dan elastis', nilai: 8 },
                { desc: 'Kurang padat, kurang elastis, jaringan daging masih melekat kuat', nilai: 7 },
                { desc: 'Kurang elastis, jaringan daging agak longgar', nilai: 6 },
                { desc: 'Tidak elastis, jaringan daging longgar dan daging agak mudah sobek', nilai: 5 },
                { desc: 'Lunak, daging mudah sobek', nilai: 3 },
                { desc: 'Sangat lunak, daging sangat mudah sobek', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach((section, sIdx) => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f1f1f1';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsTunaSteakBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // Reuse form actions but ensure LHU button exists
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Tuna Steak Beku
if (typeof hewanNames !== 'undefined') {
    hewanNames['tuna-steak-beku'] = 'Tuna Steak Beku';
}

/**
 * Menghitung total dan rata-rata untuk Udang Segar
 */
function calculateTotalsUdangSegar() {
    const table = document.getElementById('udangSegarTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll('.nilai-checkbox[data-kode="' + kode + '"]:checked');
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector('.total-cell[data-kode="' + kode + '"]');
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector('.avg-cell[data-kode="' + kode + '"]');
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

/**
 * Membuat tabel penilaian untuk Udang Segar
 */
function generateUdangSegarTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'udang-segar-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR UDANG SEGAR</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Udang Segar" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.className = 'udang-segar-table';
    table.id = 'udangSegarTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">Kode Contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #4dc9e6; color: white;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const criteria = [
        {
            category: '1. Kenampakan',
            items: [
                { desc: 'Utuh, bening bercahaya asli menurut jenis, antar ruas kokoh', nilai: 9 },
                { desc: 'Utuh, kurang bening, cahaya mulai pudar, berwarna asli, antar ruas kokoh', nilai: 8 },
                { desc: 'Utuh, kebeningan agak hilang, sedikit kusam, antar ruas kurang kokoh', nilai: 7 },
                { desc: 'Utuh, kebeningan hilang, kusam, warna agak merah muda, sedikit noda hitam, antar ruas kurang kokoh', nilai: 5 },
                { desc: 'Warna merah, noda hitam banyak, kulit mudah lepas dari daging', nilai: 3 },
                { desc: 'Warna merah sangat kusam, banyak sekali noda hitam', nilai: 1 }
            ]
        },
        {
            category: '2. Bau',
            items: [
                { desc: 'Bau sangat segar spesifik jenis', nilai: 9 },
                { desc: 'Bau segar spesifik jenis', nilai: 8 },
                { desc: 'Bau spesifik jenis netral', nilai: 7 },
                { desc: 'Mulai timbul bau amoniak', nilai: 5 },
                { desc: 'Bau asam sulfit (H2S)', nilai: 3 },
                { desc: 'Bau amoniak kuat dan bau busuk', nilai: 1 }
            ]
        },
        {
            category: '3. Tekstur',
            items: [
                { desc: 'Sangat elastis, kompak dan padat', nilai: 9 },
                { desc: 'Elastis, kompak dan padat', nilai: 8 },
                { desc: 'Kurang elastis, kompak dan padat', nilai: 7 },
                { desc: 'Tidak elastis, tidak kompak dan tidak padat', nilai: 5 },
                { desc: 'Agak lunak', nilai: 3 },
                { desc: 'Lunak', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach((section, sIdx) => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f1f1f1';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsUdangSegar(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // Reuse form actions but ensure LHU button exists
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Udang Segar
if (typeof hewanNames !== 'undefined') {
    hewanNames['udang-segar'] = 'Udang Segar';
}

/**
 * Menghitung total dan rata-rata untuk Udang Beku
 */
function calculateTotalsUdangBeku() {
    const table = document.getElementById('udangBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll('.nilai-checkbox[data-kode="' + kode + '"]:checked');
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector('.total-cell[data-kode="' + kode + '"]');
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector('.avg-cell[data-kode="' + kode + '"]');
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

function generateUdangBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'udang-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR UDANG BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Udang Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Show catatan section for Udang Beku to match Ikan Segar
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'block';

    // Data based on SNI 2705-2020
    const penilaianData = [
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '1. Lapisan es',
            items: [
                { desc: '- Rata, bening, pada seluruh permukaan dilapisi es', nilai: 9 },
                { desc: '- Tidak rata, bening, bagian permukaan yang tidak dilapisi es kurang dari 30 %', nilai: 7 },
                { desc: '- Tidak rata, bagian permukaan yang tidak dilapisi es lebih dari 30 %', nilai: 5 }
            ]
        },
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: '- Tidak ada pengeringan pada permukaan produk', nilai: 9 },
                { desc: '- Pengeringan pada permukaan produk kurang dari 20 %', nilai: 7 },
                { desc: '- Pengeringan pada permukaan produk lebih dari 20 %', nilai: 5 }
            ]
        },
        {
            kategori: 'A. Dalam keadaan beku',
            subKategori: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: '- Belum mengalami perubahan warna pada permukaan produk', nilai: 9 },
                { desc: '- Perubahan warna pada permukaan produk kurang dari 20 %', nilai: 7 },
                { desc: '- Perubahan warna pada permukaan produk lebih dari 20 %', nilai: 5 }
            ]
        },
        {
            kategori: 'B. Sesudah pelelehan (thawing)',
            subKategori: '1. Kenampakan',
            items: [
                { desc: '- Sangat cemerlang, spesifik jenis, antar ruas rapat', nilai: 9 },
                { desc: '- Cemerlang, antar ruas sedikit kurang rapat', nilai: 7 },
                { desc: '- Agak kusam, antar ruas renggang', nilai: 5 }
            ]
        },
        {
            kategori: 'B. Sesudah pelelehan (thawing)',
            subKategori: '2. Bau',
            items: [
                { desc: '- Sangat segar, spesifik jenis', nilai: 9 },
                { desc: '- Segar, spesifik jenis', nilai: 7 },
                { desc: '- Mulai tercium bau busuk', nilai: 5 }
            ]
        },
        {
            kategori: 'B. Sesudah pelelehan (thawing)',
            subKategori: '3. Tekstur',
            items: [
                { desc: '- Padat, kompak', nilai: 9 },
                { desc: '- Padat, kurang kompak', nilai: 7 },
                { desc: '- Kurang padat, tidak kompak', nilai: 5 }
            ]
        }
    ];

    // Buat tabel utama
    const table = document.createElement('table');
    table.className = 'udang-beku-table';
    table.id = 'udangBekuTable';

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
                checkbox.dataset.sectionIndex = sectionIndex; // Important for mutual exclusivity
                checkbox.style.display = 'none';

                kodeCell.appendChild(checkbox);

                // Event listener untuk klik pada cell
                kodeCell.addEventListener('click', function (e) {
                    if (e.target === checkbox || e.target.type === 'checkbox') return;
                    e.preventDefault();
                    e.stopPropagation();

                    const newCheckedState = !checkbox.checked;
                    if (newCheckedState) {
                        // Uncheck other checkboxes in the same section and column
                        const siblings = tbody.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"][data-section-index="${sectionIndex}"]`);
                        siblings.forEach(sib => {
                            if (sib !== checkbox && sib.checked) {
                                sib.checked = false;
                                updateCheckmark(sib.parentElement, false);
                            }
                        });
                    }
                    checkbox.checked = newCheckedState;
                    updateCheckmark(kodeCell, newCheckedState);
                    setTimeout(() => { calculateTotalsUdangBeku(); }, 10);
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
    totalRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f9f9f9;">Total</td>`;
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
    avgRow.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 10px; font-weight: 600; text-align: center; background-color: #f0f0f0;">Rata-rata</td>`;
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

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.overflowX = 'auto';
    tableWrapper.style.marginBottom = '20px';
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    // Set tanggal default
    const tglDiterima = document.getElementById('tglDiterima');
    if (tglDiterima && !tglDiterima.value) {
        tglDiterima.value = new Date().toISOString().split('T')[0];
    }

    requestAnimationFrame(() => {
        setTimeout(() => { calculateTotalsUdangBeku(); }, 50);
    });

    // Tambahkan tombol LHU
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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
        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

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

    setTimeout(updatePanelistQRCode, 300);
}

/**
 * Menghitung total dan rata-rata untuk Udang Beku
 */
function calculateTotalsUdangBeku() {
    const table = document.getElementById('udangBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai) || 0;
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}


// Update hewanNames for Udang Beku
if (typeof hewanNames !== 'undefined') {
    hewanNames['udang-beku'] = 'Udang Beku';
}

// Menghitung total dan rata-rata untuk Udang Masak Beku
function calculateTotalsUdangMasakBeku() {
    for (let kode = 1; kode <= 6; kode++) {
        const checkboxes = document.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai) || 0;
        });

        const totalCell = document.querySelector(`.total-cell[data-kode="${kode}"]`);
        if (totalCell) totalCell.textContent = total;

        const avgCell = document.querySelector(`.avg-cell[data-kode="${kode}"]`);
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

// Membuat tabel penilaian untuk Udang Masak Beku
function generateUdangMasakBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'udang-masak-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR UDANG MASAK BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Udang Masak Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.className = 'udang-masak-beku-table';
    table.id = 'udangMasakBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">Kode Contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f093fb; color: white;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan es',
            items: [
                { desc: 'Rata, bening, seluruh permukaan dilapisi es', nilai: 9 },
                { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%', nilai: 7 },
                { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang lebih 50%', nilai: 5 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 },
                { desc: 'Pengeringan pada permukaan produk kurang lebih 30%', nilai: 7 },
                { desc: 'Pengeringan pada permukaan produk kurang lebih 50%', nilai: 5 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 },
                { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%', nilai: 7 },
                { desc: 'Perubahan warna pada permukaan produk kurang lebih 50%', nilai: 5 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Utuh, daging berwarna merah muda cerah dan bersih', nilai: 9 },
                { desc: 'Utuh, daging berwarna merah muda, agak cerah dan bersih', nilai: 7 },
                { desc: 'Utuh, sedikit cacat, daging berwarna merah muda pucat, kusam, sedikit kotor', nilai: 5 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Bau sangat segar', nilai: 9 },
                { desc: 'Bau segar', nilai: 7 },
                { desc: 'Sedikit busuk', nilai: 5 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '3. Rasa',
            items: [
                { desc: 'Manis dan segar', nilai: 9 },
                { desc: 'Agak manis', nilai: 7 },
                { desc: 'Agak hambar', nilai: 5 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '4. Tekstur',
            items: [
                { desc: 'Elastis, kompak dan padat', nilai: 9 },
                { desc: 'Elastis, kompak dan kurang padat', nilai: 7 },
                { desc: 'Elastis dan agak hambar', nilai: 5 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach((section, sIdx) => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f1f1f1';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsUdangMasakBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // Add LHU button
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Udang Masak Beku
if (typeof hewanNames !== 'undefined') {
    hewanNames['udang-masak-beku'] = 'Udang Masak Beku';
}

/**
 * Menghitung total dan rata-rata untuk Cumi-cumi Beku
 */
function calculateTotalsCumiCumiBeku() {
    const table = document.getElementById('cumiCumiBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll('.nilai-checkbox[data-kode="' + kode + '"]:checked');
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector('.total-cell[data-kode="' + kode + '"]');
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector('.avg-cell[data-kode="' + kode + '"]');
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

/**
 * Membuat tabel penilaian untuk Cumi-cumi Beku
 */
function generateCumiCumiBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'cumi-cumi-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR CUMI-CUMI BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Cumi-cumi Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.className = 'cumi-cumi-beku-table';
    table.id = 'cumiCumiBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">Kode Contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #6a11cb; color: white;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan Es',
            items: [
                { desc: 'Rata, Bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 },
                { desc: 'Rata, Bening, cukup tebal, ada bagian yang terbuka 10 %.', nilai: 8 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20 - 30 %.', nilai: 7 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 40 - 50 %.', nilai: 6 },
                { desc: 'Banyak bagian yang terbuka 60 - 70 %.', nilai: 5 },
                { desc: 'Banyak bagian yang terbuka 80 - 90 %.', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10 %.', nilai: 8 },
                { desc: 'Pengeringan mulai jelas pada permukaan produk 20 - 30 %.', nilai: 7 },
                { desc: 'Pengeringan banyak pada permukaan produk 40 - 50 %.', nilai: 6 },
                { desc: 'Banyak bagian produk yang tampak mengering 60 - 70 %.', nilai: 5 },
                { desc: 'Banyak bagian produk yang tampak mengering 80 - 90 %.', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%', nilai: 8 },
                { desc: 'Agak banyak perubahan warna permukaan produk 20 - 30 %', nilai: 7 },
                { desc: 'Banyak perubahan warna pada permukaan produk 40 - 50 %', nilai: 6 },
                { desc: 'Perubahan warna hampir menyeluruh permukaan produk 60 - 70 %', nilai: 5 },
                { desc: 'Perubahan warna hampir menyeluruh permukaan produk 80 - 90 %', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Warna spesifik jenis, sangat cemerlang.', nilai: 9 },
                { desc: 'Warna spesifik jenis, cemerlang.', nilai: 8 },
                { desc: 'Warna spesifik jenis, putih kapur sedikit krem, kurang cemerlang.', nilai: 7 },
                { desc: 'Warna spesifik jenis, putih kapur sedikit krem, agak pucat, kurang cemerlang.', nilai: 6 },
                { desc: 'Warna spesifik jenis, krem, pucat, kurang cemerlang', nilai: 5 },
                { desc: 'Krem, agak kecoklatan, pucat.', nilai: 3 },
                { desc: 'Krem, kecoklatan, pucat.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Sangat segar, spesifik jenis.', nilai: 9 },
                { desc: 'Bau segar.', nilai: 8 },
                { desc: 'Netral.', nilai: 7 },
                { desc: 'Mulai amis, sedikit busuk.', nilai: 5 },
                { desc: 'Bau amis, sedikit busuk.', nilai: 3 },
                { desc: 'Bau busuk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '3. Tekstur',
            items: [
                { desc: 'Padat, kompak dan elastis.', nilai: 9 },
                { desc: 'Kompak, elastis.', nilai: 8 },
                { desc: 'Kompak, kurang elastis.', nilai: 7 },
                { desc: 'Tidak elastis, agak lunak.', nilai: 5 },
                { desc: 'Lunak.', nilai: 3 },
                { desc: 'Sangat lunak.', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach((section, sIdx) => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f1f1f1';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsCumiCumiBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // Reuse form actions but ensure LHU button exists
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Cumi-cumi Beku
if (typeof hewanNames !== 'undefined') {
    hewanNames['cumi-cumi-beku'] = 'Cumi-cumi Beku';
}

/**
 * Menghitung total dan rata-rata untuk Gurita Mentah Beku
 */
function calculateTotalsGuritaMentahBeku() {
    const table = document.getElementById('guritaMentahBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll('.nilai-checkbox[data-kode="' + kode + '"]:checked');
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector('.total-cell[data-kode="' + kode + '"]');
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector('.avg-cell[data-kode="' + kode + '"]');
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / checkboxes.length).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

/**
 * Membuat tabel penilaian untuk Gurita Mentah Beku
 */
function generateGuritaMentahBekuTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'gurita-mentah-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR GURITA MENTAH BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Gurita Mentah Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.className = 'gurita-mentah-beku-table';
    table.id = 'guritaMentahBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">Spesifikasi</th>
            <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">Kode Contoh</th>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">1</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">2</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">3</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">4</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">5</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #11998e; color: white;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan Es',
            items: [
                { desc: 'Rata, bening, seluruh permukaan dilapisi es.', nilai: 9 },
                { desc: 'Tidak rata, bening, bagian permukaan produk yang tidak dilapisi es kurang lebih 30%.', nilai: 7 },
                { desc: 'Tidak rata, bagian permukaan yang tidak dilapisi es kurang dari 50%.', nilai: 5 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 },
                { desc: 'Pengeringan pada permukaan produk kurang lebih 30%.', nilai: 7 },
                { desc: 'Pengeringan pada permukaan produk kurang dari 50%.', nilai: 5 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 },
                { desc: 'Perubahan warna pada permukaan produk kurang lebih 30%.', nilai: 7 },
                { desc: 'Perubahan warna pada permukaan produk kurang dari 50%.', nilai: 5 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Mulut tentakel (mulut hisap) terbuka dan menonjol, warna spesifik jenis, cemerlang.', nilai: 9 },
                { desc: 'Mulut tentakel terbuka dan rata, warna spesifik jenis, kurang cemerlang.', nilai: 7 },
                { desc: 'Mulut tentakel rata warna spesifik berubah menjadi merah muda (pink).', nilai: 5 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Bau sangat segar spesifik produk.', nilai: 9 },
                { desc: 'Bau segar spesifik produk.', nilai: 7 },
                { desc: 'Mulai tercium bau busuk.', nilai: 5 }
            ]
        },
        {
            category: 'B. Sesudah dilelehkan (thawing)',
            subCategory: '3. Tekstur',
            items: [
                { desc: 'Elastis dan padat.', nilai: 9 },
                { desc: 'Kurang elastis dan kurang padat.', nilai: 7 },
                { desc: 'Tidak elastis dan agak lunak.', nilai: 5 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach((section, sIdx) => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f1f1f1';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsGuritaMentahBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    // Reuse form actions but ensure LHU button exists
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Update hewanNames for Gurita Mentah Beku
if (typeof hewanNames !== 'undefined') {
    hewanNames['gurita-mentah-beku'] = 'Gurita Mentah Beku';
}

/**
 * Menghitung total dan rata-rata untuk Lobster Beku
 */
function calculateTotalsLobsterBeku() {
    const table = document.getElementById('lobsterBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        let count = 0;
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
            count++;
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

        if (totalCell) totalCell.textContent = total;
        if (avgCell) {
            const avg = total / 6; // Dibagi 6 kategori utama
            avgCell.textContent = isNaN(avg) ? '0.00' : avg.toFixed(2);
        }
    }
}

/**
 * Membuat tabel penilaian untuk Lobster Beku
 */
function generateLobsterBekuTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'lobster-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR LOBSTER BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Lobster Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.id = 'lobsterBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const headerHTML = `
        <thead>
            <tr>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">Spesifikasi</th>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">Nilai</th>
                <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">Kode Contoh</th>
            </tr>
            <tr>
                ${[1, 2, 3, 4, 5, 6].map(i => `<th style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">${i}</th>`).join('')}
            </tr>
        </thead>
    `;
    table.innerHTML = headerHTML;

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan Es',
            items: [
                { desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 },
                { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10 %.', nilai: 8 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20 - 30 %.', nilai: 7 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 40 - 50 %.', nilai: 6 },
                { desc: 'Banyak bagian yang terbuka 60 - 70 %.', nilai: 5 },
                { desc: 'Banyak bagian yang terbuka 80 - 90 %.', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10 %.', nilai: 8 },
                { desc: 'Pengeringan mulai jelas pada permukaan produk 20 - 30 %.', nilai: 7 },
                { desc: 'Pengeringan banyak pada permukaan produk 40 - 50 %.', nilai: 6 },
                { desc: 'Banyak bagian produk yang tampak mengering 60 - 70 %.', nilai: 5 },
                { desc: 'Banyak bagian produk yang tampak mengering 80 - 90 %.', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna permukaan produk 10 %.', nilai: 8 },
                { desc: 'Agak banyak perubahan warna permukaan produk 20 - 30 %.', nilai: 7 },
                { desc: 'Banyak perubahan warna pada permukaan produk 40 - 50 %.', nilai: 6 },
                { desc: 'Perubahan warna hampir menyeluruh permukaan produk 60 - 70 %.', nilai: 5 },
                { desc: 'Perubahan warna hampir menyeluruh permukaan produk 80 - 90 %.', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Utuh, bening bercahaya asli menurut jenis, antar ruas kokoh.', nilai: 9 },
                { desc: 'Utuh, kurang bening, cahaya mulai pudar, berwarna asli antar ruas kokoh.', nilai: 8 },
                { desc: 'Utuh, tidak bening, warna pudar, antar ruas kokoh.', nilai: 7 },
                { desc: 'Utuh, warna pudar, ada sedikit noda hitam, antar ruas agak renggang.', nilai: 6 },
                { desc: 'Kurang utuh, noda hitam agak banyak, antar ruas mudah lepas.', nilai: 5 },
                { desc: 'Tidak utuh, mulai merah, noda hitam banyak, antar ruas mudah lepas.', nilai: 3 },
                { desc: 'Tidak utuh, warna merah jelas, penuh noda hitam.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Bau sangat segar spesifik jenis.', nilai: 9 },
                { desc: 'Bau segar, spesifik jenis.', nilai: 7 },
                { desc: 'Netral.', nilai: 6 },
                { desc: 'Mulai timbul bau amoniak.', nilai: 5 },
                { desc: 'Bau amoniak kuat.', nilai: 3 },
                { desc: 'Bau amoniak dan busuk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '3. Konsistensi',
            items: [
                { desc: 'Kulit ari kenyal, daging padat lekat erat pada kulit.', nilai: 9 },
                { desc: 'Kulit ari kurang kenyal, daging padat lekat pada kulit.', nilai: 7 },
                { desc: 'Tidak kenyal, daging kurang padat, mulai lepas dari kulit.', nilai: 6 },
                { desc: 'Kulit ari tidak kenyal, daging kurang padat, mulai lepas dari kulit.', nilai: 5 },
                { desc: 'Daging lunak dan lepas dari kulit.', nilai: 3 },
                { desc: 'Daging sangat lunak dan lepas dari kulit.', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(section => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f0f0f0';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsLobsterBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Register for hewanNames
if (typeof hewanNames !== 'undefined') {
    hewanNames['lobster-beku'] = 'Lobster Beku';
}

/**
 * Menghitung total dan rata-rata untuk Cakalang Beku
 */
function calculateTotalsCakalangBeku() {
    const table = document.getElementById('cakalangBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

        if (totalCell) totalCell.textContent = total;
        if (avgCell) {
            const avg = total / 6; // 6 categories total (3 in A, 3 in B)
            avgCell.textContent = isNaN(avg) ? '0.00' : avg.toFixed(2);
        }
    }
}

/**
 * Membuat tabel penilaian untuk Cakalang Beku
 */
function generateCakalangBekuTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'cakalang-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR CAKALANG BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Cakalang Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.id = 'cakalangBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const headerHTML = `
        <thead>
            <tr>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #2193b0, #6dd5ed); color: white;">Spesifikasi</th>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #2193b0, #6dd5ed); color: white;">Nilai</th>
                <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #2193b0, #6dd5ed); color: white;">Kode Contoh</th>
            </tr>
            <tr>
                ${[1, 2, 3, 4, 5, 6].map(i => `<th style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #2193b0, #6dd5ed); color: white;">${i}</th>`).join('')}
            </tr>
        </thead>
    `;
    table.innerHTML = headerHTML;

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan es',
            items: [
                { desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 },
                { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10%.', nilai: 8 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20%-30%.', nilai: 7 },
                { desc: 'Tidak rata, bagian yang terbuka sebanyak 40%-50%.', nilai: 6 },
                { desc: 'Banyak bagian yang terbuka 60%-70%.', nilai: 5 },
                { desc: 'Banyak bagian yang terbuka 80%-90%.', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Pengeringan mulai jelas pada permukaan produk 20%-30%.', nilai: 7 },
                { desc: 'Pengeringan banyak pada permukaan produk 40%-50%.', nilai: 6 },
                { desc: 'Banyak bagian produk yang tampak mengering 60%-70%.', nilai: 5 },
                { desc: 'Banyak bagian produk yang tampak mengering 80%-90%.', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Agak banyak mengalami perubahan warna pada permukaan produk 20%-30%.', nilai: 7 },
                { desc: 'Banyak mengalami perubahan warna pada permukaan produk 40%-50%.', nilai: 6 },
                { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 60%-70%.', nilai: 5 },
                { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 80%-90%.', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit mengkilat, cemerlang.', nilai: 9 },
                { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit mengkilat, cemerlang.', nilai: 8 },
                { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit kurang mengkilat, agak cemerlang.', nilai: 7 },
                { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit hilang, kurang cemerlang.', nilai: 6 },
                { desc: 'Utuh, tidak cacat, warna pelangi permukaan kulit hilang.', nilai: 5 },
                { desc: 'Utuh, tidak cacat, warna permukaan kulit kusam.', nilai: 3 },
                { desc: 'Utuh, tidak cacat, warna permukaan kulit sangat kusam.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Sangat segar.', nilai: 9 },
                { desc: 'Segar.', nilai: 8 },
                { desc: 'Segar mendekati netral.', nilai: 7 },
                { desc: 'Netral.', nilai: 6 },
                { desc: 'Sedikit tengik.', nilai: 5 },
                { desc: 'Tengik sedikit asam.', nilai: 3 },
                { desc: 'Asam dan busuk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '3. Daging/tekstur',
            items: [
                { desc: 'Sayatan daging warna merah kecoklatan sangat cerah, antar jaringan sangat kuat, sangat elastis.', nilai: 9 },
                { desc: 'Sayatan daging warna merah kecoklatan cerah, antar jaringan kuat, elastis.', nilai: 8 },
                { desc: 'Sayatan daging warna merah kecoklatan kurang cerah, antar jaringan kuat, agak elastis.', nilai: 7 },
                { desc: 'Sayatan daging warna kecoklatan kurang cerah, antar jaringan sedikit longgar, kurang elastis.', nilai: 6 },
                { desc: 'Sayatan daging warna kecoklatan kusam, antar jaringan longgar, tidak elastis.', nilai: 5 },
                { desc: 'Sayatan daging warna coklat kusam, antar jaringan longgar.', nilai: 3 },
                { desc: 'Sayatan daging warna coklat kehitaman kusam, antar jaringan sangat longgar.', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(section => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f0f0f0';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsCakalangBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

// Register for hewanNames
if (typeof hewanNames !== 'undefined') {
    hewanNames['lobster-beku'] = 'Lobster Beku';
    hewanNames['cakalang-beku'] = 'Cakalang Beku';
    hewanNames['hiu-utuh-beku'] = 'Hiu Utuh Beku';
    hewanNames['fillet-kakap-beku'] = 'Fillet Kakap Beku';
}

/**
 * Menghitung total dan rata-rata untuk Fillet Kakap Beku
 */
function calculateTotalsFilletKakapBeku() {
    const table = document.getElementById('filletKakapBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

        if (totalCell) totalCell.textContent = total;
        if (avgCell) {
            const avg = total / 6; // 6 categories
            avgCell.textContent = isNaN(avg) ? '0.00' : avg.toFixed(2);
        }
    }
}

/**
 * Membuat tabel penilaian untuk Fillet Kakap Beku
 */
function generateFilletKakapBekuTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'fillet-kakap-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR FILLET KAKAP BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Fillet Kakap Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.id = 'filletKakapBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const headerHTML = `
        <thead>
            <tr>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">Spesifikasi</th>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">Nilai</th>
                <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">Kode Contoh</th>
            </tr>
            <tr>
                ${[1, 2, 3, 4, 5, 6].map(i => `<th style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #FF512F, #DD2476); color: white;">${i}</th>`).join('')}
            </tr>
        </thead>
    `;
    table.innerHTML = headerHTML;

    const criteria = [
        {
            category: 'A. Dalam Keadaan Beku',
            subCategory: '1. Lapisan es',
            items: [
                { desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 },
                { desc: 'Rata, bening, cukup tebal, ada bagian yang terbuka 10%.', nilai: 8 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20-30%.', nilai: 7 },
                { desc: 'Tidak rata, bagian yang terbuka sebanyak 40-50%.', nilai: 6 },
                { desc: 'Banyak bagian yang terbuka 60-70%.', nilai: 5 },
                { desc: 'Banyak bagian yang terbuka 80-90%.', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam Keadaan Beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 },
                { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Pengeringan mulai jelas pada permukaan produk 20-30%.', nilai: 7 },
                { desc: 'Pengeringan banyak pada permukaan produk 40-50%.', nilai: 6 },
                { desc: 'Banyak bagian produk yang tampak mengering 60-70%.', nilai: 5 },
                { desc: 'Banyak bagian produk yang tampak mengering 80-90%.', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam Keadaan Beku',
            subCategory: '3. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Agak banyak mengalami perubahan warna pada permukaan produk 20-30%.', nilai: 7 },
                { desc: 'Banyak mengalami perubahan warna pada permukaan produk 40-50%.', nilai: 6 },
                { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 60-70%.', nilai: 5 },
                { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 80-90%.', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Rapi, bersih, warna daging putih krem kemerahan, sangat cemerlang, linea lateralis berwarna merah muda.', nilai: 9 },
                { desc: 'Rapi, bersih, warna daging putih krem agak kemerahan, cemerlang, linea lateralis berwarna merah muda', nilai: 8 },
                { desc: 'Rapi, bersih, warna daging krem agak kemerahan, kurang cemerlang, garis yang membentuk tulang belakang dan linea lateralis berwarna merah.', nilai: 7 },
                { desc: 'Rapi, bersih, warna daging krem kecoklatan, kusam, linea lateralis berwarna merah agak kecoklatan', nilai: 5 },
                { desc: 'Rapi, kurang bersih, warna daging agak kehijauan-hijauan, kusam, garis yang membentuk bagian tulang belakang berwarna coklat kusam.', nilai: 3 },
                { desc: 'Rapi, kurang bersih, warna daging kehijauan, sangat kusam, garis yang membentuk bagian tulang belakang berwarna kehijauan.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Sangat segar, spesifik jenis.', nilai: 9 },
                { desc: 'Segar, spesifik jenis.', nilai: 8 },
                { desc: 'Kurang segar, mengarah ke netral.', nilai: 7 },
                { desc: 'Apek sedikit tengik.', nilai: 5 },
                { desc: 'Asam, sedikit bau amoniak dan tengik amoniak jelas.', nilai: 3 },
                { desc: 'Busuk, asam dan bau amoniak.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '3. Tekstur',
            items: [
                { desc: 'Padat, kompak dan elastis.', nilai: 9 },
                { desc: 'Padat, kompak, agak elastis.', nilai: 8 },
                { desc: 'Padat, kompak, kurang elastis.', nilai: 7 },
                { desc: 'Kurang padat, kurang kompak.', nilai: 5 },
                { desc: 'Lembek, tidak kompak.', nilai: 3 },
                { desc: 'Lembek sekali.', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(section => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f0f0f0';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '� ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsFilletKakapBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}


/**
 * Menghitung total dan rata-rata untuk Hiu Utuh Beku
 */
function calculateTotalsHiuUtuhBeku() {
    const table = document.getElementById('hiuUtuhBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

        if (totalCell) totalCell.textContent = total;
        if (avgCell) {
            const avg = total / 6; // 6 categories total (2 in A, 4 in B)
            avgCell.textContent = isNaN(avg) ? '0.00' : avg.toFixed(2);
        }
    }
}

/**
 * Membuat tabel penilaian untuk Hiu Utuh Beku
 */
function generateHiuUtuhBekuTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'hiu-utuh-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR HIU UTUH BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Hiu Utuh Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.id = 'hiuUtuhBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const headerHTML = `
        <thead>
            <tr>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #485563, #29323c); color: white;">Spesifikasi</th>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #485563, #29323c); color: white;">Nilai</th>
                <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #485563, #29323c); color: white;">Kode Contoh</th>
            </tr>
            <tr>
                ${[1, 2, 3, 4, 5, 6].map(i => `<th style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #485563, #29323c); color: white;">${i}</th>`).join('')}
            </tr>
        </thead>
    `;
    table.innerHTML = headerHTML;

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10 %.', nilai: 7 },
                { desc: 'Pengeringan mulai jelas pada permukaan produk 20 - 30 %.', nilai: 5 },
                { desc: 'Pengeringan banyak pada permukaan produk 40 - 50 %.', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Perubahan warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10 %', nilai: 7 },
                { desc: 'Agak banyak perubahan warna permukaan produk 20 - 30 %', nilai: 5 },
                { desc: 'Banyak perubahan warna pada permukaan produk 40 - 50 %', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Utuh, bersih, tidak cacat, warna sesuai jenis, cemerlang', nilai: 9 },
                { desc: 'Utuh, bersih, tidak cacat, warna sesuai jenis, kurang cemerlang', nilai: 7 },
                { desc: 'Utuh, bersih, tidak cacat, warna sesuai jenis, agak kusam', nilai: 5 },
                { desc: 'Sedikit rusak, warna kusam', nilai: 3 },
                { desc: 'Rusak, sangat kusam', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Sangat segar., spesifik hiu segar', nilai: 9 },
                { desc: 'Segar.', nilai: 7 },
                { desc: 'Kurang segar., sedikit bau amoniak', nilai: 5 },
                { desc: 'Sedikit busuk bau amoniak kuat', nilai: 3 },
                { desc: 'Busuk', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '3. Daging',
            items: [
                { desc: 'Sayatan daging berwarna putih susu, sangat cemerlang', nilai: 9 },
                { desc: 'Sayatan daging berwarna putih sedikit kusam, agak cemerlang', nilai: 7 },
                { desc: 'Sayatan daging berwarna krem , kurang cemerlang', nilai: 5 },
                { desc: 'Sayatan daging krem kecoklatan, kusam', nilai: 3 },
                { desc: 'Sayatan coklat, sangat kusam', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '4. Tekstur',
            items: [
                { desc: 'Padat, sangat kompak, sangat elastis', nilai: 9 },
                { desc: 'Padat, kompak, elastis', nilai: 7 },
                { desc: 'Kurang Padat, kurang kompak', nilai: 5 },
                { desc: 'lembek, tidak kompak', nilai: 3 },
                { desc: 'Sayatan coklat, sangat kusam', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(section => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f0f0f0';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            updateCheckmark(cb.parentElement, false);
                        });
                    }
                    checkbox.checked = newChecked;
                    updateCheckmark(td, newChecked);
                    setTimeout(() => calculateTotalsHiuUtuhBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}




/**
 * Menghitung total dan rata-rata untuk Fillet Nila (Tilapia sp.) Beku
 */
function calculateTotalsFilletNilaBeku() {
    const table = document.getElementById('filletNilaBekuTable');
    if (!table) return;

    for (let kode = 1; kode <= 6; kode++) {
        let total = 0;
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${kode}"]:checked`);
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${kode}"]`);
        const avgCell = table.querySelector(`.avg-cell[data-kode="${kode}"]`);

        if (totalCell) totalCell.textContent = total;
        if (avgCell) {
            const avg = total / 6; // 6 categories (3 in A, 3 in B)
            avgCell.textContent = isNaN(avg) ? '0.00' : avg.toFixed(2);
        }
    }
}

/**
 * Membuat tabel penilaian untuk Fillet Nila (Tilapia sp.) Beku
 */
function generateFilletNilaBekuTable(container) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'fillet-nila-beku-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR FILLET NILA (TILAPIA SP.) BEKU</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Fillet Nila (Tilapia sp.) Beku" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    const table = document.createElement('table');
    table.id = 'filletNilaBekuTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const headerHTML = `
        <thead>
            <tr>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #00c6ff, #0072ff); color: white;">Spesifikasi</th>
                <th rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #00c6ff, #0072ff); color: white;">Nilai</th>
                <th colspan="6" style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #00c6ff, #0072ff); color: white;">Kode Contoh</th>
            </tr>
            <tr>
                ${[1, 2, 3, 4, 5, 6].map(i => `<th style="border: 1px solid #ddd; padding: 10px; text-align: center; background: linear-gradient(135deg, #00c6ff, #0072ff); color: white;">${i}</th>`).join('')}
            </tr>
        </thead>
    `;
    table.innerHTML = headerHTML;

    const criteria = [
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '1. Lapisan Es',
            items: [
                { desc: 'Rata, bening, cukup tebal pada seluruh permukaan dilapisi es.', nilai: 9 },
                { desc: 'Rata, bening, cukup tebal ada bagian yang terbuka 10%', nilai: 8 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 20%-30%.', nilai: 7 },
                { desc: 'Tidak rata, bagian yang terbuka, sebanyak 40%-50%.', nilai: 6 },
                { desc: 'Banyak bagian yang terbuka 60%-70%.', nilai: 5 },
                { desc: 'Banyak bagian yang terbuka 80%-90%.', nilai: 3 },
                { desc: 'Tidak terdapat lapisan es pada permukaan produk.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '2. Pengeringan (dehidrasi)',
            items: [
                { desc: 'Tidak ada pengeringan pada permukaan produk', nilai: 9 },
                { desc: 'Sedikit mengalami pengeringan pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Pengeringan mulai jelas pada permukaan produk 20%-30%.', nilai: 7 },
                { desc: 'Pengeringan banyak pada permukaan produk 40%-50%.', nilai: 6 },
                { desc: 'Banyak bagian produk yang tampak mengering 60-70%.', nilai: 5 },
                { desc: 'Banyak bagian produk yang tampak mengering 80-90%.', nilai: 3 },
                { desc: 'Seluruh bagian produk luar tampak mengering.', nilai: 1 }
            ]
        },
        {
            category: 'A. Dalam keadaan beku',
            subCategory: '3. Perubahan Warna (diskolorasi)',
            items: [
                { desc: 'Belum mengalami perubahan warna pada permukaan produk.', nilai: 9 },
                { desc: 'Sedikit mengalami perubahan warna pada permukaan produk 10%.', nilai: 8 },
                { desc: 'Agak banyak mengalami perubahan warna pada permukaan produk 20%-30%', nilai: 7 },
                { desc: 'Banyak mengalami perubahan warna pada permukaan produk 40%-50%', nilai: 6 },
                { desc: 'Banyak mengalami perubahan warna pada permukaan produk 60%-70%', nilai: 5 },
                { desc: 'Perubahan warna hampir menyeluruh pada permukaan produk 80%-90%', nilai: 3 },
                { desc: 'Perubahan warna menyeluruh pada permukaan produk', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '1. Kenampakan',
            items: [
                { desc: 'Sayatan daging utuh, bersih, putih susu cemerlang, linea lateralis berwarna merah cerah.', nilai: 9 },
                { desc: 'Sayatan daging utuh, bersih, putih susu kurang cemerlang, linea lateralis berwarna merah kurang cerah.', nilai: 7 },
                { desc: 'Sayatan daging krem, bersih, utuh, kurang cemerlang, linea lateralis berwarna kecoklatan kurang cerah.', nilai: 6 },
                { desc: 'Sayatan daging krem, bersih, sedikit rusak fisik, kurang cemerlang, linea lateralis berwarna coklat kusam.', nilai: 5 },
                { desc: 'Sayatan daging krem, bersih, banyak rusak fisik, keabuan kusam, linea lateralis berwarna coklat kusam.', nilai: 3 },
                { desc: 'Sayatan daging coklat keabuan, bersih, tidak utuh, linea lateralis berwarna coklat kusam.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '2. Bau',
            items: [
                { desc: 'Sangat segar, spesifik jenis ikan air tawar.', nilai: 9 },
                { desc: 'Bau segar, spesifik jenis, agak sedikit bau lumpur.', nilai: 7 },
                { desc: 'Bau mulai netral, bau lumpur agak jelas.', nilai: 6 },
                { desc: 'Bau tidak segar, bau lumpur jelas.', nilai: 5 },
                { desc: 'Bau amoniak mulai tercium.', nilai: 3 },
                { desc: 'Bau busuk, amoniak dan bau asam jelas sekali.', nilai: 1 }
            ]
        },
        {
            category: 'B. Sesudah pelelehan (thawing)',
            subCategory: '3. Tekstur',
            items: [
                { desc: 'Padat, kompak dan elastis.', nilai: 9 },
                { desc: 'Padat, kompak dan agak elastis.', nilai: 7 },
                { desc: 'Padat, agak kompak, kurang elastis.', nilai: 6 },
                { desc: 'Padat, kurang kompak, kurang elastis.', nilai: 5 },
                { desc: 'Mulai lembek, kurang kompak, kurang elastis.', nilai: 3 },
                { desc: 'Lembek, tidak kompak.', nilai: 1 }
            ]
        }
    ];

    const tbody = document.createElement('tbody');
    let rowIndex = 0;

    criteria.forEach(section => {
        const catHeader = document.createElement('tr');
        catHeader.style.backgroundColor = '#f0f0f0';
        catHeader.innerHTML = `<td colspan="8" style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${section.category} - ${section.subCategory}</td>`;
        tbody.appendChild(catHeader);

        section.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.nilai = item.nilai;
            tr.dataset.rowIndex = rowIndex;

            const specCell = document.createElement('td');
            specCell.style.border = '1px solid #ddd';
            specCell.style.padding = '8px';
            specCell.textContent = '- ' + item.desc;
            tr.appendChild(specCell);

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';
                td.style.position = 'relative'; // Ensure positioning context

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                const checkSpan = document.createElement('span');
                checkSpan.className = 'checkmark-span';
                checkSpan.textContent = '\u2713';
                checkSpan.style.display = 'none';
                checkSpan.style.fontSize = '18px';
                checkSpan.style.fontWeight = 'bold';
                checkSpan.style.color = '#333';
                td.appendChild(checkSpan);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.category + ' - ' + section.subCategory;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            const cell = cb.parentElement;
                            const span = cell.querySelector('.checkmark-span');
                            if (span) span.style.display = 'none';
                        });
                    }
                    checkbox.checked = newChecked;
                    checkSpan.style.display = newChecked ? 'inline' : 'none';
                    setTimeout(() => calculateTotalsFilletNilaBeku(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.category + ' - ' + section.subCategory;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function generateIkanPindangTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ikan-pindang-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR IKAN PINDANG</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Ikan Pindang" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Hide catatan section
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const table = document.createElement('table');
    table.id = 'ikanPindangTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; width: 40%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; width: 8%;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 12px; text-align: center;">Kode Contoh</th>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <th style="border: 1px solid #ddd; padding: 8px;"></th>
            <th style="border: 1px solid #ddd; padding: 8px;"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const penilaianData = [
        { kategori: '1. Kenampakan', items: [{ desc: '- Utuh, bersih, warna cemerlang spesifik jenis.', nilai: 9 }, { desc: '- Utuh, bersih, warna kurang cemerlang', nilai: 7 }, { desc: '- Utuh, bersih/kurang bersih, kusam.', nilai: 5 }] },
        { kategori: '2. Bau', items: [{ desc: '- Sangat segar, harum spesifik jenis.', nilai: 9 }, { desc: '- Segar, kurang harum.', nilai: 7 }, { desc: '- Mulai timbul bau asam.', nilai: 5 }] },
        { kategori: '3. Rasa', items: [{ desc: '- Sangat enak, gurih, spesifik jenis.', nilai: 9 }, { desc: '- Enak, kurang gurih.', nilai: 7 }, { desc: '- Timbul rasa gatal pada ujung lidah', nilai: 5 }] },
        { kategori: '4. Tekstur', items: [{ desc: '- Sangat padat, kompak.', nilai: 9 }, { desc: '- Padat, kurang kompak.', nilai: 7 }, { desc: '- Kurang padat, lembek.', nilai: 5 }] },
        { kategori: '5. Lendir', items: [{ desc: '- Tidak berlendir.', nilai: 9 }, { desc: '- Berlendir.', nilai: 3 }] }
    ];

    let rowIndex = 0;
    penilaianData.forEach((section, sIdx) => {
        section.items.forEach((item, iIdx) => {
            const tr = document.createElement('tr');
            if (iIdx === 0) {
                const catTd = document.createElement('td');
                catTd.style.border = '1px solid #ddd';
                catTd.style.padding = '8px';
                catTd.style.backgroundColor = '#fdfdfd';
                catTd.innerHTML = `<strong>${section.kategori}</strong><br><div style="padding-left:10px; font-size: 0.9em;">${item.desc}</div>`;
                tr.appendChild(catTd);
            } else {
                const emptyTd = document.createElement('td');
                emptyTd.style.border = '1px solid #ddd';
                emptyTd.style.padding = '8px 8px 8px 18px';
                emptyTd.style.fontSize = '0.9em';
                emptyTd.textContent = item.desc;
                tr.appendChild(emptyTd);
            }

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';
                td.style.position = 'relative';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                const checkSpan = document.createElement('span');
                checkSpan.className = 'checkmark-span';
                checkSpan.textContent = '\u2713';
                checkSpan.style.display = 'none';
                checkSpan.style.fontSize = '18px';
                checkSpan.style.fontWeight = 'bold';
                checkSpan.style.color = '#333';
                td.appendChild(checkSpan);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.kategori;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            const cell = cb.parentElement;
                            const span = cell.querySelector('.checkmark-span');
                            if (span) span.style.display = 'none';
                        });
                    }
                    checkbox.checked = newChecked;
                    checkSpan.style.display = newChecked ? 'inline' : 'none';
                    setTimeout(() => calculateTotalsIkanPindang(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.kategori;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsIkanPindang() {
    const table = document.getElementById('ikanPindangTable');
    if (!table) return;

    for (let currentKode = 1; currentKode <= 6; currentKode++) {
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${currentKode}"]:checked`);
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${currentKode}"]`);
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector(`.avg-cell[data-kode="${currentKode}"]`);
        if (avgCell) {
            const avg = checkboxes.length > 0 ? (total / 5).toFixed(2) : '0.00';
            avgCell.textContent = avg;
        }
    }
}

function generateTunaSegarSashimiTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'tuna-segar-sashimi-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR TUNA SEGAR UNTUK SASHIMI</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Tuna Segar Sashimi" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Hide catatan section
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const table = document.createElement('table');
    table.id = 'tunaSegarSashimiTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; width: 40%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; width: 8%;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 12px; text-align: center;">Kode Contoh</th>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <th style="border: 1px solid #ddd; padding: 8px;"></th>
            <th style="border: 1px solid #ddd; padding: 8px;"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const penilaianData = [
        {
            kategori: '1. Kenampakan',
            subKategori: 'a. Mata',
            items: [
                { desc: '- Bola mata cembung, kornea dan pupil jernih, mengkilap spesifik jenis ikan', nilai: 9 },
                { desc: '- Bola mata rata, kornea dan pupil jernih, agak mengkilap spesifik jenis ikan', nilai: 8 },
                { desc: '- Bola mata rata, kornea agak keruh, pupil agak keabu-abuan, agak mengkilap spesifik jenis ikan', nilai: 7 },
                { desc: '- Bola mata agak cekung, kornea agak keruh, pupil agak keabu-abuan, agak mengkilap spesifik jenis ikan', nilai: 6 },
                { desc: '- Bola mata agak cekung, kornea keruh, pupil agak keabu-abuan, tidak mengkilap', nilai: 5 },
                { desc: '- Bola mata cekung, kornea keruh, pupil keabu-abuan, tidak mengkilap', nilai: 3 },
                { desc: '- Bola mata sangat cekung, kornea sangat keruh, pupil abu-abu, tidak mengkilap', nilai: 1 }
            ]
        },
        {
            kategori: '1. Kenampakan',
            subKategori: 'b. Insang',
            items: [
                { desc: '- Warna insang merah tua or coklat kemerahan, cemerlang dengan sedikit sekali lendir transparan', nilai: 9 },
                { desc: '- Warna insang merah tua or coklat kemerahan, kurang cemerlang dengan sedikit lendir transparan', nilai: 8 },
                { desc: '- Warna insang merah muda or coklat muda dengan sedikit lendir agak keruh', nilai: 7 },
                { desc: '- Warna insang merah muda or coklat muda dengan lendir agak keruh', nilai: 6 },
                { desc: '- Warna insang merah muda or coklat muda pucat dengan lendir keruh', nilai: 5 },
                { desc: '- Warna insang abu-abu or coklat keabu-abuan dengan lendir putih susu bergumpal', nilai: 3 },
                { desc: '- Warna insang abu-abu, or coklat keabu-abuan dengan lendir coklat bergumpal', nilai: 1 }
            ]
        },
        {
            kategori: '1. Kenampakan',
            subKategori: 'c. Daging pangkal ekor',
            items: [
                { desc: '- warna pelangi belum terbentuk pada irisan melintang pangkal ekor', nilai: 9 },
                { desc: '- warna pelangi sudah terbentuk pada irisan melintang pangkal ekor', nilai: 1 }
            ]
        },
        {
            kategori: '2. Daging',
            items: [
                { desc: '- Sayatan daging sangat cemerlang, merah spesifik jenis, jaringan daging sangat kuat', nilai: 9 },
                { desc: '- Sayatan daging cemerlang, merah spesifik jenis, jaringan daging kuat', nilai: 8 },
                { desc: '- Sayatan daging sedikit kurang cemerlang, merah spesifik jenis, jaringan daging kuat', nilai: 7 },
                { desc: '- Sayatan daging kurang cemerlang, agak merah, jaringan daging sedikit kurang kuat', nilai: 6 },
                { desc: '- Sayatan daging mulai pudar, mulai kusam, jaringan daging kurang kuat', nilai: 5 },
                { desc: '- Sayatan daging kusam, jaringan daging kurang kuat', nilai: 3 },
                { desc: '- Sayatan daging sangat kusam, jaringan daging rusak', nilai: 1 }
            ]
        },
        {
            kategori: '3. Bau',
            items: [
                { desc: '- Sangat segar, spesifik jenis kuat', nilai: 9 },
                { desc: '- Segar, spesifik jenis', nilai: 8 },
                { desc: '- Segar, spesifik jenis kurang', nilai: 7 },
                { desc: '- Netral', nilai: 6 },
                { desc: '- Sedikit bau asam', nilai: 5 },
                { desc: '- Bau asam kuat', nilai: 3 },
                { desc: '- Bau busuk kuat', nilai: 1 }
            ]
        },
        {
            kategori: '4. Tekstur',
            items: [
                { desc: '- Padat, kompak, sangat elastis', nilai: 9 },
                { desc: '- Padat, kompak, elastis', nilai: 8 },
                { desc: '- Agak lunak, agak elastis', nilai: 7 },
                { desc: '- Agak lunak, sedikit kurang elastis', nilai: 6 },
                { desc: '- Agak lunak, kurang elastis', nilai: 5 },
                { desc: '- Lunak bekas jari terlihat dan sangat lambat hilang', nilai: 3 },
                { desc: '- Sangat lunak, bekas jari tidak hilang', nilai: 1 }
            ]
        }
    ];

    let rowIndex = 0;
    penilaianData.forEach((section, sIdx) => {
        section.items.forEach((item, iIdx) => {
            const tr = document.createElement('tr');
            if (iIdx === 0) {
                const catTd = document.createElement('td');
                catTd.style.border = '1px solid #ddd';
                catTd.style.padding = '8px';
                catTd.style.backgroundColor = '#fdfdfd';
                let label = `<strong>${section.kategori}</strong>`;
                if (section.subKategori) {
                    label += `<br><strong>${section.subKategori}</strong>`;
                }
                label += `<br><div style="padding-left:10px; font-size: 0.9em;">${item.desc}</div>`;
                catTd.innerHTML = label;
                tr.appendChild(catTd);
            } else {
                const emptyTd = document.createElement('td');
                emptyTd.style.border = '1px solid #ddd';
                emptyTd.style.padding = '8px 8px 8px 18px';
                emptyTd.style.fontSize = '0.9em';
                emptyTd.textContent = item.desc;
                tr.appendChild(emptyTd);
            }

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';
                td.style.position = 'relative';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                const checkSpan = document.createElement('span');
                checkSpan.className = 'checkmark-span';
                checkSpan.textContent = '\u2713';
                checkSpan.style.display = 'none';
                checkSpan.style.fontSize = '18px';
                checkSpan.style.fontWeight = 'bold';
                checkSpan.style.color = '#333';
                td.appendChild(checkSpan);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        const catId = section.subKategori ? (section.kategori + ' - ' + section.subKategori) : section.kategori;
                        tbody.querySelectorAll(`tr[data-cat-id="${catId}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            const cell = cb.parentElement;
                            const span = cell.querySelector('.checkmark-span');
                            if (span) span.style.display = 'none';
                        });
                    }
                    checkbox.checked = newChecked;
                    checkSpan.style.display = newChecked ? 'inline' : 'none';
                    setTimeout(() => calculateTotalsTunaSegarSashimi(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.subKategori ? (section.kategori + ' - ' + section.subKategori) : section.kategori;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsTunaSegarSashimi() {
    const table = document.getElementById('tunaSegarSashimiTable');
    if (!table) return;

    for (let currentKode = 1; currentKode <= 6; currentKode++) {
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${currentKode}"]:checked`);
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${currentKode}"]`);
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector(`.avg-cell[data-kode="${currentKode}"]`);
        if (avgCell) {
            const paramCount = 4; // Kenampakan, Daging, Bau, Tekstur
            const finalAvg = checkboxes.length > 0 ? (total / paramCount).toFixed(2) : '0.00';
            avgCell.textContent = finalAvg;
        }
    }
}

/**
 * Menghasilkan tabel penilaian untuk Tuna Loin Segar
 */
function generateTunaLoinSegarTable(container) {
    // Header informasi
    const headerDiv = document.createElement('div');
    headerDiv.className = 'tuna-loin-segar-header';
    headerDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: 600;">LEMBAR PENILAIAN UJI SKOR TUNA LOIN SEGAR</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: inline-block; width: 200px;">1. Nomor Sertifikat :</label>
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
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" id="jenisContoh" name="jenisContoh" placeholder="Tuna Loin Segar" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="jumlah" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="ukuran" style="width: 100%; border: none; padding: 5px;"></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><input type="text" name="keterangan" style="width: 100%; border: none; padding: 5px;"></td>
                </tr>
            </tbody>
        </table>
        <p style="margin-bottom: 15px; font-style: italic;">Berilah tanda &#10003; pada nilai yang dipilih sesuai kode contoh yang diuji.</p>
    `;
    container.appendChild(headerDiv);

    // Hide catatan section
    const catatanSection = document.getElementById('catatanSection');
    if (catatanSection) catatanSection.style.display = 'none';

    const table = document.createElement('table');
    table.id = 'tunaLoinSegarTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; width: 40%;">Spesifikasi</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; width: 8%;">Nilai</th>
            <th colspan="6" style="border: 1px solid #ddd; padding: 12px; text-align: center;">Kode Contoh</th>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <th style="border: 1px solid #ddd; padding: 8px;"></th>
            <th style="border: 1px solid #ddd; padding: 8px;"></th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">3</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">4</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">5</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 7%;">6</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const penilaianData = [
        {
            kategori: '1. Kenampakan',
            items: [
                { desc: '- Daging berwarna merah cerah, serat daging merekat kuat sesamanya, mengkilap, tanpa pelangi. Bentuk potongan daging rapi, tidak terikut tulang, tidak ada daging merah', nilai: 9 },
                { desc: '- Daging berwarna merah kurang cerah, serat daging merekat sesamanya, kurang mengkilap, sedikit tampak pelangi. Bentuk potongan daging rapi, tidak terikut tulang, tidak ada daging merah', nilai: 7 },
                { desc: '- Daging berwarna merah kusam, serat daging mulai memisah, kering, tampak pelangi. Bentuk potongan daging tidak rapi, sedikit terikut tulang, ada daging merah', nilai: 5 }
            ]
        },
        {
            kategori: '2. Bau',
            items: [
                { desc: '- Sangat segar, spesifik jenis.', nilai: 9 },
                { desc: '- Segar, spesifik jenis.', nilai: 7 },
                { desc: '- Kurang segar, ada sedikit bau tambahan.', nilai: 5 }
            ]
        },
        {
            kategori: '3. Tekstur',
            items: [
                { desc: '- Padat dan kompak,', nilai: 9 },
                { desc: '- Padat, kurang kompak,', nilai: 7 },
                { desc: '- Agak lembek, tidak kompak', nilai: 5 }
            ]
        }
    ];

    let rowIndex = 0;
    penilaianData.forEach((section, sIdx) => {
        section.items.forEach((item, iIdx) => {
            const tr = document.createElement('tr');
            if (iIdx === 0) {
                const catTd = document.createElement('td');
                catTd.style.border = '1px solid #ddd';
                catTd.style.padding = '8px';
                catTd.style.backgroundColor = '#fdfdfd';
                catTd.innerHTML = `<strong>${section.kategori}</strong><br><div style="padding-left:10px; font-size: 0.9em;">${item.desc}</div>`;
                tr.appendChild(catTd);
            } else {
                const emptyTd = document.createElement('td');
                emptyTd.style.border = '1px solid #ddd';
                emptyTd.style.padding = '8px 8px 8px 18px';
                emptyTd.style.fontSize = '0.9em';
                emptyTd.textContent = item.desc;
                tr.appendChild(emptyTd);
            }

            const valorCell = document.createElement('td');
            valorCell.style.border = '1px solid #ddd';
            valorCell.style.padding = '8px';
            valorCell.style.textAlign = 'center';
            valorCell.style.fontWeight = 'bold';
            valorCell.textContent = item.nilai;
            tr.appendChild(valorCell);

            for (let kode = 1; kode <= 6; kode++) {
                const td = document.createElement('td');
                td.className = 'kode-contoh-cell';
                td.dataset.kode = kode;
                td.dataset.rowIndex = rowIndex;
                td.dataset.nilai = item.nilai;
                td.style.border = '1px solid #ddd';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.cursor = 'pointer';
                td.style.position = 'relative';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'nilai-checkbox';
                checkbox.dataset.kode = kode;
                checkbox.dataset.rowIndex = rowIndex;
                checkbox.dataset.nilai = item.nilai;
                checkbox.style.display = 'none';
                td.appendChild(checkbox);

                const checkSpan = document.createElement('span');
                checkSpan.className = 'checkmark-span';
                checkSpan.textContent = '\u2713';
                checkSpan.style.display = 'none';
                checkSpan.style.fontSize = '18px';
                checkSpan.style.fontWeight = 'bold';
                checkSpan.style.color = '#333';
                td.appendChild(checkSpan);

                td.addEventListener('click', function (e) {
                    if (e.target.type === 'checkbox') return;
                    const newChecked = !checkbox.checked;
                    if (newChecked) {
                        tbody.querySelectorAll(`tr[data-cat-id="${section.kategori}"] input.nilai-checkbox[data-kode="${kode}"]`).forEach(cb => {
                            cb.checked = false;
                            const cell = cb.parentElement;
                            const span = cell.querySelector('.checkmark-span');
                            if (span) span.style.display = 'none';
                        });
                    }
                    checkbox.checked = newChecked;
                    checkSpan.style.display = newChecked ? 'inline' : 'none';
                    setTimeout(() => calculateTotalsTunaLoinSegar(), 10);
                });

                tr.appendChild(td);
            }
            tr.dataset.catId = section.kategori;
            tbody.appendChild(tr);
            rowIndex++;
        });
    });

    const totalTr = document.createElement('tr');
    totalTr.style.backgroundColor = '#f9f9f9';
    totalTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Total</td>`;
    for (let i = 1; i <= 6; i++) {
        totalTr.innerHTML += `<td class="total-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0</td>`;
    }
    tbody.appendChild(totalTr);

    const avgTr = document.createElement('tr');
    avgTr.style.backgroundColor = '#f1f1f1';
    avgTr.innerHTML = `<td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-weight: bold; text-align: center;">Rata-rata</td>`;
    for (let i = 1; i <= 6; i++) {
        avgTr.innerHTML += `<td class="avg-cell" data-kode="${i}" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">0.00</td>`;
    }
    tbody.appendChild(avgTr);

    table.appendChild(tbody);
    container.appendChild(table);

    const formActions = document.querySelector('.form-actions');
    if (formActions) {
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

        formActions.insertBefore(lhuButton, formActions.firstChild);
    }

    const qrWrapper = document.createElement('div');
    qrWrapper.style.marginTop = '20px';
    qrWrapper.style.display = 'flex';
    qrWrapper.style.justifyContent = 'flex-end';
    qrWrapper.innerHTML = `<div id="qrcode-container" style="padding: 10px; background: #fff; border-radius: 8px;"></div>`;
    container.appendChild(qrWrapper);
    setTimeout(updatePanelistQRCode, 300);
}

function calculateTotalsTunaLoinSegar() {
    const table = document.getElementById('tunaLoinSegarTable');
    if (!table) return;

    for (let currentKode = 1; currentKode <= 6; currentKode++) {
        const checkboxes = table.querySelectorAll(`.nilai-checkbox[data-kode="${currentKode}"]:checked`);
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.nilai);
        });

        const totalCell = table.querySelector(`.total-cell[data-kode="${currentKode}"]`);
        if (totalCell) totalCell.textContent = total;

        const avgCell = table.querySelector(`.avg-cell[data-kode="${currentKode}"]`);
        if (avgCell) {
            const paramCount = 3; // Kenampakan, Bau, Tekstur
            const finalAvg = checkboxes.length > 0 ? (total / paramCount).toFixed(2) : '0.00';
            avgCell.textContent = finalAvg;
        }
    }
}



