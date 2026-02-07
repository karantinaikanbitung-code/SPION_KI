const API_URL = "https://spion-api.karantinaikanbitung.workers.dev";

// ==============================
// SIMPAN LHU
// ==============================
document.getElementById("lhuForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const no_ptk = document.getElementById("no_ptk").value;
  const nama_panelis = document.getElementById("nama_panelis").value;
  const lokasi_pelayanan = document.getElementById("lokasi_pelayanan").value;
  const jenis_ikan = document.getElementById("jenis_ikan").value;

  // 👉 isi HTML LHU (INI FILE YANG AKAN DIPREVIEW)
  const htmlLHU = `
    <html>
    <head><title>LHU ${no_ptk}</title></head>
    <body>
      <h2>Lembar Hasil Uji</h2>
      <p>No PTK: ${no_ptk}</p>
      <p>Nama Panelis: ${nama_panelis}</p>
      <p>Lokasi Pelayanan: ${lokasi_pelayanan}</p>
      <p>Jenis Ikan: ${jenis_ikan}</p>
    </body>
    </html>
  `;

  // SIMPAN HTML KE GITHUB / SERVER (sementara pakai Blob)
  const blob = new Blob([htmlLHU], { type: "text/html" });
  const fileURL = URL.createObjectURL(blob);

  // KIRIM DATA KE API
  const res = await fetch(API_URL + "/lhu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      no_ptk,
      nama_panelis,
      lokasi_pelayanan,
      jenis_ikan,
      file_url: fileURL
    })
  });

  const result = await res.json();
  console.log("HASIL API:", result);

  if (result.success) {
    alert("LHU berhasil disimpan");
    loadTable();
    document.getElementById("lhuForm").reset();
  } else {
    alert("Gagal menyimpan");
  }
});

// ==============================
// LOAD TABEL
// ==============================
async function loadTable() {
  const res = await fetch(API_URL + "/lhu");
  const data = await res.json();

  const tbody = document.getElementById("tabelLHU");
  tbody.innerHTML = "";

  data.results.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.no_ptk}</td>
      <td>${row.nama_panelis || "-"}</td>
      <td>${row.lokasi_pelayanan || "-"}</td>
      <td>${row.jenis_ikan || "-"}</td>
      <td><a href="${row.file_url}" target="_blank">👁️ Lihat LHU</a></td>
    `;

    tbody.appendChild(tr);
  });
}

loadTable();
