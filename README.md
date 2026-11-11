# Hadi Portfolio

Portofolio pribadi Abdul Hadi dengan HTML, CSS, dan JavaScript vanilla. Desain
dark navy dan cyan dipertahankan dengan Hero, tujuh section, tata letak responsif,
animasi ringan, dan aksesibilitas dasar. Tidak memerlukan framework atau proses build.

## Menjalankan dengan WAMP

1. Pastikan folder proyek berada di `C:\wamp64\www\hadi-portfolio`.
2. Jalankan WAMP dan pastikan layanan Apache aktif.
3. Buka `http://localhost/hadi-portfolio/` di browser.

Halaman juga dapat dibuka langsung melalui `index.html`.

## Struktur

```text
hadi-portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── memories-data.js
└── assets/
    ├── images/
    │   ├── about-hadi-hero.jpg
    │   └── about-hadi-about.jpg
    ├── memories/
    │   └── photo-001.jpeg ... photo-090.jpeg
    └── certificates/
        └── hcia-datacom-v1.png
```

## Data yang perlu dilengkapi

- **CV:** letakkan PDF CV di folder aset, lalu isi `cvUrl` di bagian awal
  `js/script.js`, misalnya `assets/cv/abdul-hadi-cv.pdf`. Tombol unduh tetap
  nonaktif sampai file dikonfigurasi.
- **Proyek Temukan:** lengkapi ringkasan, screenshot, teknologi, dan URL demo
  serta repository asli di `index.html`. Tautan belum aktif selama datanya kosong.
- **LinkedIn:** tambahkan URL profil yang benar setelah tersedia.
- **Formulir kontak:** isi formulir hanya divalidasi di browser dan tidak mengirim
  pesan. Hubungkan ke endpoint backend HTTPS yang memvalidasi serta membatasi
  request di server sebelum mengaktifkan pengiriman; jangan menyimpan kredensial
  layanan email di JavaScript publik. Perbarui status formulir setelah integrasi
  diuji end-to-end.
- **Pendidikan:** nama institusi, bidang, dan angkatan ditampilkan sesuai detail
  yang tersedia. Tambahkan tanggal kelulusan hanya setelah dikonfirmasi.
- **Sertifikat:** letakkan gambar baru di `assets/certificates/`, lalu tambahkan
  objek ke `portfolioConfig.certificates` di awal `js/script.js`. Isi `title`,
  `issuer`, `description`, `image`, dan `alt`; tambahkan `issuedAt` (format
  `YYYY-MM-DD`) serta `issuedLabel` jika tanggal tercetak di sertifikat. Kartu
  galeri dan preview modal akan dibuat otomatis dari daftar tersebut. Perubahan
  dikelola di source project, bukan upload pengunjung atau backend.
- **Memories:** 90 foto yang diberikan ditampilkan pada galeri konstelasi interaktif.
  Pilih pola Ring, Spiral, atau Globe untuk mengatur ulang foto; pada pola Ring,
  kartu mengorbit terus dalam beberapa lingkaran dengan kecepatan lembut yang
  berbeda antar-orbit. Semua kartu juga memiliki gerakan melayang halus. Desktop mendukung seret/lempar
  dengan pantulan batas. Ini bukan simulasi tumbukan rigid-body. Tombol panah
  menyediakan alternatif keyboard. Tombol Susun Ulang mengulang animasi pada
  pola aktif. Foto baru dapat
  diunggah lewat browser (JPG, PNG, atau WebP, maksimal 10 MB per foto dan 20 file per unggahan),
  diberi kategori/keterangan, dan dihapus dari dialog foto. Unggahan disimpan di
  IndexedDB pada browser/perangkat yang sama; unggahan tidak dikirim ke server dan
  tidak ikut tersedia untuk pengunjung lain.

Sertifikat Huawei ICT Academy HCIA-Datacom V1.0 menggunakan gambar yang diberikan,
beserta tanggal penerbitan yang tercetak pada dokumen. Jangan menambahkan informasi
proyek, profil sosial, atau dokumen yang belum diverifikasi.

Foto Hero dan About menggunakan versi JPEG yang diperkecil dari foto yang tersedia
(sekitar 200 KB per gambar); gambar untuk section lain dimuat secara lazy.

## Interaksi dan aksesibilitas

- Navigasi aktif mengikuti section yang sedang terlihat; menu mobile mendukung Escape.
- Efek mengetik, marquee, reveal, glow, dan stagger pada judul/teks pilihan
  menggunakan CSS dan JavaScript vanilla serta menghormati `prefers-reduced-motion`.
- Staggered Text dibuat sebagai alternatif ringan yang kompatibel dengan project
  HTML/CSS/JavaScript ini; React Bits Pro dan registry komponennya tidak terpasang.
- Preview sertifikat dapat dibuka dengan dialog native dan ditutup dengan Escape.
- Memories memakai foto asli, filter kategori, lightbox dengan navigasi tombol,
  panah keyboard dan Escape, serta gerakan jatuh yang hanya dimulai saat dinding
  masuk viewport dan tidak berulang ketika pengguna scroll kembali. Gerakan
  dihentikan saat tab tersembunyi dan disederhanakan ketika `prefers-reduced-motion`
  aktif.
- Project ini menggunakan HTML/CSS/JavaScript vanilla dan tidak memiliki React,
  `components.json`, atau konfigurasi registry React Bits Pro. Galeri konstelasi
  merupakan implementasi ringan yang kompatibel dengan project, bukan komponen
  React Bits Pro resmi. Instalasi registry Pro belum dilakukan karena variabel
  `REACTBITS_LICENSE_KEY` tidak tersedia pada environment lokal yang menjalankan
  proses instalasi; jangan menaruh key di source code atau mengirimkannya lewat chat.
- Form kontak menampilkan hasil validasi tanpa mengklaim pesan berhasil dikirim.
