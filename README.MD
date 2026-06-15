# Praktikum Komputasi Awan - Docker 🐳

Repository ini berisi implementasi dan penyelesaian tugas dari Modul Praktikum Komputasi Awan mengenai Docker. Proyek ini mendemonstrasikan orkestrasi aplikasi *multi-container* dengan arsitektur 3-tier (Frontend, Backend API, dan Database) menggunakan praktik terbaik *containerization*.

---

## 📌 Cakupan Praktikum

Proyek ini mencakup implementasi tiga pilar utama Docker:
1. **Docker Volume**: Memastikan persistensi data pada database PostgreSQL sehingga data tidak hilang saat kontainer dihancurkan.
2. **Docker Network**: Menggunakan *custom bridge network* untuk menyediakan resolusi DNS internal dan mengisolasi database agar tidak terekspos ke *host* publik.
3. **Docker Compose**: Mengorkestrasi seluruh *service* dalam satu file konfigurasi deklaratif (`docker-compose.yml`) untuk proses *build* dan *deployment* yang mulus.

---

## 🏗️ Arsitektur Sistem & Tugas Mandiri

Arsitektur aplikasi telah dimodifikasi untuk memenuhi penyelesaian Tugas Mandiri, meliputi:
* **Pemisahan Jaringan (Network Isolation)**: Terdapat dua jaringan terpisah (`frontend` dan `backend`). Service `web` tidak memiliki akses langsung ke `db`, melainkan harus melalui service `api` sebagai perantara.
* **Healthcheck & Dependency**: Service API dikonfigurasi untuk hanya melakukan *startup* (via `depends_on: condition: service_healthy`) setelah PostgreSQL benar-benar siap menerima koneksi, mencegah *crash* saat inisialisasi.
* **Horizontal Scaling**: Mendukung *scaling* untuk *service* API (contoh: `docker compose up -d --scale api=2`).

---

## 🛠️ Tech Stack

* **Database**: PostgreSQL 15 (Alpine)
* **Backend API**: Python (Flask) + Psycopg2
* **Frontend Web**: Python (Flask) + Requests
* **UI**: Tailwind CSS (Play CDN) + Vanilla JavaScript
* **Orchestration**: Docker Compose

---

## 🎨 Fitur Antarmuka Web

Antarmuka frontend dibangun dengan tema *dark glassmorphism* yang modern dan responsif, menggunakan **Tailwind CSS** via Play CDN (tanpa *build step* sehingga kontainer tetap ringan).

* **Operasi CRUD**: Tambah, edit (modal), dan hapus barang (modal konfirmasi) terhadap data inventaris.
* **Pencarian Realtime**: Filter daftar barang secara langsung berdasarkan nama atau ID tanpa *reload* halaman.
* **Sorting Kolom**: Urutkan tabel secara *ascending/descending* dengan mengklik header kolom (ID, Nama, Harga).
* **Statistik Ringkas**: Kartu statistik untuk total barang, total nilai inventaris, dan status API.
* **Umpan Balik**: Notifikasi *toast* untuk setiap aksi serta *empty state* saat data masih kosong.

> **Catatan**: Karena Tailwind dimuat lewat Play CDN, halaman membutuhkan koneksi internet saat dibuka. Untuk kebutuhan produksi sebaiknya Tailwind di-*compile* saat *build image*.

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
Pastikan Docker dan Docker Desktop/Compose sudah terinstal di sistem Anda.

### 2. Kloning Repositori
```bash
git clone https://github.com/willyrafaelfs/praktikum-komputasi-awan-docker.git
cd praktikum-komputasi-awan-docker
```

### 3. Build & Jalankan Kontainer
Jalankan perintah berikut untuk melakukan *build* dan menjalankan semua kontainer di latar belakang (*background*):
```bash
docker compose up -d --build
```

### 4. Akses Aplikasi
Buka peramban (*browser*) Anda dan akses tautan berikut:
* **Frontend Web**: [http://localhost:8000](http://localhost:8000)

---

## 🧹 Menghentikan Layanan

Untuk menghentikan dan menghapus seluruh kontainer serta jaringan yang telah dibuat, jalankan:
```bash
docker compose down
```
*(Tambahkan flag `-v` jika Anda ingin menghapus Docker Volume beserta seluruh data di dalam database: `docker compose down -v`)*
