# PROSES.md

## Persona dan Masalah
Pedagang Kecil, Seseorang yang memiliki masalah pelik, yaitu uang pribadi dan uang usaha sering tercampur di satu tempat. Dia ingin bisa memiliki aplikasi / software yang mempermudah dia untuk memisahkkan kedua urusan itu, sehingga keuntungan dari usahanya bisa jelas dan dapat dilacak.

## Rancangan Struktur Data
Karena persona saya adalah pedagang kecil, setiap transaksi wajib memiliki label "dompet" tambahan ("Pribadi" atau "Usaha") untuk memisahkan saldo.

```javascript
{
    id: Date.now(),
    tanggal: "2026-10-19",
    jenis: "pemasukan" | "pengeluaran" | "transfer",
    dompet: "pribadi" | "usaha",
    kategori: "Penjualan" | "Belanja Stok" | "Operasional" | "Transfer Dana" | "Sewa" | "Lainnya",
    nominal: 25000,
    catatan: "",
    dompetTujuan: "usaha"   // hanya ada kalau jenis === "transfer"
}
```
## Alasan pemilihan struktur data:
 Saya memutuskan "transfer" sebagai satu tipe transaksi dengan atribut tambahan dompetTujuan, alih-alih membuat dua transaksi terpisah (pengeluaran dari Dompet A dan pemasukan ke Dompet B). Ini membuat data lebih rapi di localStorage dan mencegah perhitungan ganda di ringkasan saldo utama.


## Keputusan Desain & Alasan

Keputusan: Saya memutuskan bahwa transaksi berjenis "transfer" dikecualikan dari perhitungan total Pemasukan dan Pengeluaran di ringkasan utama layar.
Alasan: Transfer antar dompet (misalnya memindahkan keuntungan usaha ke dompet pribadi) hanyalah perpindahan internal. Jika dihitung sebagai pengeluaran/pemasukan, itu akan merusak laporan omzet murni dari usaha si pedagang.


## Bug / Kendala yang Ditemui

1. **Atribut Hidden Tertimpa CSS** 
   - **Gejala:** Field *input* "Dompet Tujuan" pada form HTML tetap muncul di layar, meskipun atribut `hidden` sudah di-set aktif lewat JavaScript saat jenis transaksi yang dipilih bukan "Transfer". 
   - **Penyebab:** Atribut `hidden` bawaan HTML rupanya kalah prioritas oleh aturan `display: flex;` pada kelas `.field` yang saya buat di CSS utama. 
   - **Cara mengatasi:** Menambahkan aturan CSS spesifik `.field[hidden] { display: none; }` di `style.css` agar *field* tersebut dipaksa hilang dari layar.

2. **Halaman Refresh Otomatis Saat Data Disimpan**
   - **Gejala:** Saat menekan tombol "Simpan Transaksi", halamannya otomatis *refresh*, data yang diketik hilang, dan isi input form malah menempel memanjang di URL browser.
   - **Penyebab:** Tombol bertipe `submit` di dalam tag `<form>` memiliki perilaku bawaan (*default behavior*) dari HTML yang secara otomatis mengirimkan data menggunakan metode GET ke URL lalu memuat ulang halaman.
   - **Cara mengatasi:** Saya memanggil fungsi `event.preventDefault()` di baris teratas dalam blok *event listener* `form.addEventListener("submit", ...)` untuk mematikan *refresh* otomatis tersebut dan menyerahkan prosesnya ke JavaScript.