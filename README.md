# Mini Wallet App (Frontend)

Antarmuka pengguna (SPA - Single Page Application) untuk sistem Mini Wallet. Proyek ini dibangun menggunakan ekosistem React + Vite, di desain menggunakan Tailwind CSS dan Shacdn UI.

URL Frontend (Live): https://mywallet-lanz2.vercel.app

## 🛠 Tech Stack

- **Core:** React.js + Vite
- **Styling:** Tailwind CSS (Glassmorphism Design)
- **HTTP Client:** Axios (Dilengkapi interceptors untuk *error handling*)
- **Routing:** React Router DOM
- **Authentication:** Bearer Token via `localStorage`
- **Deployment:** Vercel

## ✨ Core Features

- **Authentication UI:** Halaman Login dan Register dengan pelindung *route* (hanya *user* yang sudah *login* yang bisa mengakses *dashboard*).
- **Dashboard Interaktif:** Menampilkan saldo terkini yang ditarik langsung dari API.
- **Transaksi (Top Up & Transfer):** Form interaktif dengan validasi input bawaan (*frontend-side validation* untuk mencegah *submit* huruf atau nilai negatif, serta mencegah klik ganda saat koneksi lambat).
- **Transaction History:** Tabel data yang merender riwayat mutasi masuk dan keluar secara kronologis.
- **Error Feedback:** Pesan notifikasi yang jelas jika terjadi kegagalan sistem (seperti saldo tidak cukup atau *server error*).

## 🚀 Cara Menjalankan Project (Local Development)

Pastikan di komputer Anda sudah terinstall **Node.js** (versi 18+ direkomendasikan) dan `npm`.

**1. Clone repository**
```bash
git clone https://github.com/yosefflanes/wallet-app.git
cd wallet-app
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup Environment Variables**
Buat file `.env` di *root directory* proyek (sejajar dengan file `package.json`). Jika ada `.env.example`, Anda bisa men-copy nya:
```bash
cp .env.example .env
```
Buka file `.env` dan atur URL agar menembak ke *backend* Laravel lokal Anda:
```env
VITE_API_URL=http://localhost:8000/api
```

**4. Jalankan Development Server**
```bash
npm run dev
```
Buka browser dan akses aplikasi melalui URL yang tertera di terminal (biasanya `http://localhost:5173`).
