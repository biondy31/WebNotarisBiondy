# WebNotarisBiondy

Website statis Kantor Notaris & PPAT Biondy Utama, S.H., M.Kn., Kota Cimahi. Rancangan scrollytelling dengan fokus badan usaha dan pendekatan soft selling.

## Isi

- Beranda: profil kantor, tiga bab pendirian/perkembangan/kesinambungan, panduan, FAQ dan kontak.
- `/wawasan/`: koleksi 20 artikel kasus ilustratif PT/CV dengan rujukan resmi, daftar persiapan dan artikel terkait.
- `/panduan/`: tiga panduan persiapan.
- `tentang.html`, `layanan.html`, `artikel.html`, `kontak.html`: pengalihan untuk mempertahankan tautan lama.

Kasus bukan cerita klien. Tidak memuat data klien, testimoni rekaan, angka pencapaian atau formulir pengumpulan data. Identitas kantor mengacu pada profil Google yang diberikan pengguna: https://share.google/tJf8WvjuAEufzdTzH. Hero memakai ilustrasi editorial, bukan foto kantor. Tidak menggunakan email contoh dari rancangan lama.

## Menjalankan dan memeriksa

Node.js, tanpa dependensi tambahan. Jalankan dari akar repositori:

```sh
node build-pages.mjs
node --test tests/wawasan.test.mjs
node validate.mjs
node serve.mjs
```

Server mencetak alamat loopback dengan port otomatis. Hanya halaman/aset publik yang dilayani. Situs harus dilayani melalui HTTP pada akar domain; tidak mendukung membuka HTML lewat file:// atau subpath GitHub Pages tanpa penyesuaian URL.

Sumber isi: `content/badan-usaha.mjs`. Generator: `build-pages.mjs` dan `build-wawasan.mjs`. HTML hasil build tetap di akar, `panduan/` dan `wawasan/`, sehingga tidak memerlukan framework atau proses build di hosting.

## Validasi dan publikasi

20 September 2026: 4 pengujian Node lulus; validasi 29 halaman (25 halaman isi dan 4 pengalihan), metadata, JSON-LD, tautan/jangkar lokal dan sintaks JavaScript lulus. Website asal sudah diperiksa pada desktop dan bingkai ponsel; penyesuaian struktur GitHub diperiksa melalui build dan pengujian tersebut.

Canonical dan sitemap mengacu pada https://notaris-biondy-utama-cimahi.biondy31.chatgpt.site. Situs Sites saat ini privat. PR ini hanya menyimpan sumber di GitHub dan tidak mengubah akses atau menerbitkan ulang Sites. Bila domain berubah, perbarui origin di build-pages.mjs, canonical pengalihan, lalu build ulang. Belum ada jaminan indeks Google atau traffic.

Rujukan desain: Lusion, Obys Agency dan Apple AirPods Pro; mengambil prinsip tipografi besar, bab guliran dan visual fokus, tanpa menyalin aset/kode mereka. Font eksternal memiliki fallback. Mode gerak minimal tersedia.

`content/provenance.json` mencatat sumber topik repo, hash dan rujukan resmi. Hukum diperiksa melalui sumber resmi pada 20 September 2026; pemeriksaan agen bukan persetujuan editorial Notaris. Sumber awal website Sites: revisi 789bb5f9ed010a95325c7b5810b2eb650e9fd685.
