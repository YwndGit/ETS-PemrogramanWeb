# AI-LOG.md

Link percakapan AI : 
- https://notebook.google.com/notebook/fd852feb-c176-44b8-b54b-a38f5ad34401 ( NOTEBOOK LM, untuk membuat readme agar tidak overscope)
-  (CLAUDE, sebagai assisten code)

## 1. Setup Kerangka HTML dan CSS Dasar
- Prompt: Briefing Ai terlebih dahulu, kemudian Meminta AI untuk membuat kode index html dengan kerangka lengkap serta style.css dasar (reset box-sizing, :root variables, Flexbox/Grid, responsif dasar).
- Dipakai: Seluruh struktur kerangka `index.html` (termasuk meta tags dan elemen semantik) serta `style.css` dasar (termasuk reset box-sizing, variabel warna, Flexbox, dan Grid).
- Diubah: Pada elemen HTML form transaksi (`<select id="input-kategori">`), saya menambahkan opsi kategori baru secara manual yaitu `<option value="Sewa">Sewa</option>`.

## 2. JavaScript Dasar & Fitur Transfer (W1, W2, W4, Fitur Khas)
- Prompt: Meminta modifikasi HTML untuk input dompet tujuan dan JavaScript dasar dari nol (muatData, simpanData, renderDaftar, aturDompetTujuan, dan event submit).
- Dipakai: Fungsi `muatData()`, `simpanData()`, `aturDompetTujuan()`, `buatItemTransaksi()`, dan event listener submit.
- Diubah: Menyesuaikan aturan CSS `.field[hidden]` secara manual agar tidak tertimpa oleh `display: flex`.

## 3. Menghapus Data & Ringkasan Saldo (W3, W5)
- Prompt: Meminta fungsi hapusTransaksi(id) dengan konfirmasi window.confirm() dan fungsi hitungRingkasan() untuk menghitung saldo dengan memisahkan transaksi transfer antar dompet.
- Dipakai: Fungsi `hapusTransaksi()`, `hitungRingkasan()`, dan penambahan tombol "Hapus" pada render DOM `<li>`.
- Diubah: Menambahkan kartu "Saldo Pribadi" dan "Saldo Usaha" pada HTML secara manual agar sinkron dengan output JavaScript.