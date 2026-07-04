# WebNotarisBiondy

Website profil profesional **Kantor Notaris & PPAT Biondy Utama, S.H., M.Kn.**

Situs statis (HTML/CSS/JS tanpa framework) yang memperkenalkan profil, layanan, dan
cara menghubungi kantor notaris kepada calon klien.

## Halaman

| Berkas | Isi |
|--------|-----|
| `index.html` | Beranda — hero, segel notaris, ringkasan layanan, artikel terbaru |
| `tentang.html` | Profil notaris, kredensial, dan prinsip kerja |
| `layanan.html` | Daftar layanan kenotariatan & pertanahan + Tanya Jawab (FAQ) |
| `artikel.html` | Kerangka artikel/blog |
| `kontak.html` | Formulir kontak **email-only** + peta lokasi |

## Ciri khas

- Gaya formal-klasik (navy & emas), tipografi Cormorant Garamond + Spectral.
- Elemen tanda tangan: **segel notaris SVG terukir**.
- **Kontak melalui email saja** (tanpa WhatsApp) — formulir merakit tautan `mailto:`
  otomatis untuk menyaring pesan agar lebih relevan.
- Responsif hingga perangkat mobile, mendukung navigasi keyboard & `prefers-reduced-motion`.

## Menjalankan secara lokal

```bash
# dari folder proyek
python -m http.server 5500
# lalu buka http://localhost:5500/index.html
```

Atau cukup buka `index.html` langsung di peramban.

## Yang perlu disesuaikan

Data bertanda `*` pada situs masih berupa contoh dan perlu diganti dengan data resmi:

- Email resmi kantor (saat ini contoh: `kantor@notaris-biondy.co.id` di `js/main.js` dan `kontak.html`)
- Alamat kantor dan titik Google Maps (`kontak.html`)
- Nomor SK pengangkatan Notaris & PPAT (`tentang.html`)
- Foto profesional notaris (`tentang.html`)

## Struktur

```
.
├── index.html
├── tentang.html
├── layanan.html
├── artikel.html
├── kontak.html
├── css/style.css
└── js/main.js
```
