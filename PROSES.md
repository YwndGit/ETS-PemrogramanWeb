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
Alasan pemilihan struktur data: Saya memutuskan "transfer" sebagai satu tipe transaksi dengan atribut tambahan dompetTujuan, alih-alih membuat dua transaksi terpisah (pengeluaran dari Dompet A dan pemasukan ke Dompet B). Ini membuat data lebih rapi di localStorage dan mencegah perhitungan ganda di ringkasan saldo utama.

