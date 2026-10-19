// ===== 1. Ambil elemen dari HTML =====
const form = document.querySelector("#form-transaksi");
const inputTanggal = document.querySelector("#input-tanggal");
const inputJenis = document.querySelector("#input-jenis");
const inputDompet = document.querySelector("#input-dompet");
const fieldDompetTujuan = document.querySelector("#field-dompet-tujuan");
const inputDompetTujuan = document.querySelector("#input-dompet-tujuan");
const inputKategori = document.querySelector("#input-kategori");
const inputNominal = document.querySelector("#input-nominal");
const inputCatatan = document.querySelector("#input-catatan");
const errorNominal = document.querySelector("#error-nominal");
const daftarElemen = document.querySelector("#daftar-transaksi");
const pesanKosong = document.querySelector("#pesan-kosong");
const elemenTotalPemasukan = document.querySelector("#total-pemasukan");
const elemenTotalPengeluaran = document.querySelector("#total-pengeluaran");
const elemenSaldo = document.querySelector("#saldo");
const elemenSaldoPribadi = document.querySelector("#saldo-pribadi");
const elemenSaldoUsaha = document.querySelector("#saldo-usaha");

// ===== 2. State (data aplikasi) =====
const KUNCI_STORAGE = "transaksi";
let daftarTransaksi = [];

// ===== 3. Fungsi localStorage (W4) =====
function muatData() {
  try {
    const teksRaw = localStorage.getItem(KUNCI_STORAGE);
    if (teksRaw) {
      const hasil = JSON.parse(teksRaw);
      if (Array.isArray(hasil)) {
        daftarTransaksi = hasil;
      }
    }
  } catch (error) {
    console.error("Data storage rusak, memakai data kosong", error);
    daftarTransaksi = [];
  }
}

function simpanData() {
  localStorage.setItem(KUNCI_STORAGE, JSON.stringify(daftarTransaksi));
}

// ===== 4. Fungsi bantu =====
function formatRupiah(nominal) {
  return `Rp ${nominal.toLocaleString("id-ID")}`;
}

// Tampilkan "Dompet Tujuan" hanya jika jenis = Transfer
function aturDompetTujuan() {
  const adalahTransfer = inputJenis.value === "transfer";
  fieldDompetTujuan.hidden = !adalahTransfer;
  inputDompetTujuan.disabled = !adalahTransfer;
}

// ===== 5. Render ke layar (W2) =====
// Membuat satu <li> untuk satu transaksi
function buatItemTransaksi(transaksi) {
  const li = document.createElement("li");
  li.className = "item-transaksi";

  // Bagian kiri: kategori, detail, catatan
  const info = document.createElement("div");

  const judul = document.createElement("strong");
  judul.textContent = transaksi.kategori || "Tanpa kategori";
  info.appendChild(judul);

  let teksDompet = transaksi.dompet;
  if (transaksi.jenis === "transfer") {
    teksDompet = `${transaksi.dompet} → ${transaksi.dompetTujuan}`;
  }
  const detail = document.createElement("p");
  detail.className = "item-detail";
  detail.textContent = `${transaksi.tanggal} | ${teksDompet}`;
  info.appendChild(detail);

  if (transaksi.catatan) {
    const catatan = document.createElement("p");
    catatan.className = "item-detail";
    catatan.textContent = transaksi.catatan;
    info.appendChild(catatan);
  }

  // Bagian kanan: nominal berwarna sesuai jenis
  let tanda = "";
  if (transaksi.jenis === "pemasukan") tanda = "+ ";
  if (transaksi.jenis === "pengeluaran") tanda = "- ";

  const nominal = document.createElement("span");
  nominal.className = `item-nominal angka-${transaksi.jenis}`;
  nominal.textContent = tanda + formatRupiah(transaksi.nominal);

  // Tombol hapus (W3)
  const tombolHapus = document.createElement("button");
  tombolHapus.type = "button";
  tombolHapus.className = "btn-hapus";
  tombolHapus.textContent = "Hapus";
  tombolHapus.addEventListener("click", () => hapusTransaksi(transaksi.id));

  // Kolom kanan: nominal di atas, tombol di bawah
  const kanan = document.createElement("div");
  kanan.className = "item-kanan";
  kanan.appendChild(nominal);
  kanan.appendChild(tombolHapus);

  li.appendChild(info);
  li.appendChild(kanan);
  return li;
}

function renderDaftar() {
  daftarElemen.innerHTML = ""; // kosongkan dulu supaya tidak dobel
  pesanKosong.hidden = daftarTransaksi.length > 0;

  // Loop dari belakang supaya transaksi terbaru tampil paling atas
  for (let i = daftarTransaksi.length - 1; i >= 0; i--) {
    daftarElemen.appendChild(buatItemTransaksi(daftarTransaksi[i]));
  }

  hitungRingkasan(); // <-- tambahan
}

// ===== W3: Hapus transaksi =====
function hapusTransaksi(id) {
  if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
    return; // user menekan Cancel, berhenti
  }

  daftarTransaksi = daftarTransaksi.filter((transaksi) => transaksi.id !== id);
  simpanData();
  renderDaftar();
}

// ===== W5: Ringkasan =====
function hitungRingkasan() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  const saldoDompet = { Pribadi: 0, Usaha: 0 };

  daftarTransaksi.forEach((transaksi) => {
    if (transaksi.jenis === "pemasukan") {
      totalPemasukan += transaksi.nominal;
      saldoDompet[transaksi.dompet] += transaksi.nominal;
    } else if (transaksi.jenis === "pengeluaran") {
      totalPengeluaran += transaksi.nominal;
      saldoDompet[transaksi.dompet] -= transaksi.nominal;
    } else if (transaksi.jenis === "transfer") {
      // Transfer tidak masuk total, hanya memindahkan saldo antar dompet
      saldoDompet[transaksi.dompet] -= transaksi.nominal;
      saldoDompet[transaksi.dompetTujuan] += transaksi.nominal;
    }
  });

  const saldoUtama = totalPemasukan - totalPengeluaran;

  elemenTotalPemasukan.textContent = formatRupiah(totalPemasukan);
  elemenTotalPengeluaran.textContent = formatRupiah(totalPengeluaran);
  elemenSaldo.textContent = formatRupiah(saldoUtama);
  elemenSaldoPribadi.textContent = formatRupiah(saldoDompet.Pribadi);
  elemenSaldoUsaha.textContent = formatRupiah(saldoDompet.Usaha);
}

// ===== 6. Event listener (W1) =====
inputJenis.addEventListener("change", aturDompetTujuan);

form.addEventListener("submit", (event) => {
  event.preventDefault(); // cegah halaman reload

  // Validasi: nominal harus lebih dari 0
  const nominal = Number(inputNominal.value);
  if (!(nominal > 0)) {
    errorNominal.textContent = "Nominal harus lebih dari 0.";
    return;
  }
  errorNominal.textContent = "";

  const transaksiBaru = {
    id: Date.now(),
    tanggal: inputTanggal.value,
    jenis: inputJenis.value,
    dompet: inputDompet.value,
    kategori: inputKategori.value,
    nominal: nominal,
    catatan: inputCatatan.value.trim()
  };

  // Fitur khas: transfer punya dompet tujuan
  if (transaksiBaru.jenis === "transfer") {
    transaksiBaru.dompetTujuan = inputDompetTujuan.value;
    transaksiBaru.kategori = "Transfer";
  }

  daftarTransaksi.push(transaksiBaru);
  simpanData();
  renderDaftar();

  form.reset();
  aturDompetTujuan(); // reset tidak memicu event "change", jadi panggil manual
});

// ===== 7. Jalankan saat halaman dibuka =====
muatData();
aturDompetTujuan();
renderDaftar();