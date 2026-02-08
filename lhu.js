const API_URL = "https://spion-api.karantinaikanbitung.workers.dev/lhu";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("penilaianForm");
  if (!form) return;

  form.addEventListener("submit", handleFormSubmit);
});

async function handleFormSubmit(e) {
  e.preventDefault();

  try {
    const form = e.target;
    const formData = new FormData(form);

    // ambil HTML preview LHU
    const preview = document.getElementById("previewLHU");
    if (!preview) {
      alert("Preview LHU tidak ditemukan");
      return;
    }

    formData.append(
      "html_content",
      "<html><body>" + preview.innerHTML + "</body></html>"
    );

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    console.log("HASIL API:", result);

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Gagal simpan");
    }

    alert("✅ LHU berhasil disimpan");
    form.reset();

  } catch (err) {
    console.error("ERROR:", err);
    alert("❌ Gagal menyimpan LHU");
  }
}
