# KeyForge — Katalog Keyboard Mekanik & Switch (PWA)

Tugas Akhir Praktikum PPB 2026. Platform: **PWA (React + Vite)**. API: **Node.js + Express + Supabase** (sesuai Modul 1).

Isi project:
- `keyforge-api/` → "dapur": server API + database
- `keyforge-app/` → "ruang tamu": aplikasi yang dilihat pengguna

## Memenuhi aturan TA
| Aturan | Di KeyForge |
|---|---|
| API buatan sendiri (Modul 1) | `keyforge-api` (Express + Supabase) |
| Bottom Navigation Bar | `src/components/BottomNav.jsx` |
| Minimal 5 halaman | 6: Beranda, Daftar Keyboard, Detail Keyboard, Daftar Switch, Detail Switch, Profil |
| 2 halaman list + detail | Keyboard → detail, Switch → detail |
| Halaman Profile/About | `src/pages/About.jsx` |
| GitHub | Panduan langkah 6 |
| PWA wajib hosting gratis | Vercel, langkah 7 |

---

## LANGKAH 1 — Siapkan alat (sekali saja)
Pasang **Node.js** (nodejs.org, pilih LTS), **VS Code**, dan **Git**. Alat ini sudah dipakai di praktikum.

## LANGKAH 2 — Buat "gudang data" di Supabase
1. Buka https://supabase.com, masuk, klik **New project** (nama bebas, mis. `keyforge`).
2. Menu kiri **SQL Editor** → **New query**.
3. Buka file `keyforge-api/database.sql`, salin SEMUA isinya, tempel, klik **RUN**.
4. Cek **Table Editor**: harus ada tabel `switches` (8 baris) dan `keyboards` (8 baris).
5. **Project Settings → Data API** → salin **Project URL**. Di **API Keys** salin **anon public key**.

## LANGKAH 3 — Jalankan API
Buka terminal di folder `keyforge-api`:
```bash
copy .env.example .env      # (Mac/Linux: cp .env.example .env)
```
Buka file `.env`, isi `SUPABASE_URL` dan `SUPABASE_KEY` dengan hasil langkah 2.5. Lalu:
```bash
npm install
npm run dev
```
Jika muncul `Server running on port 3000`, berhasil. Coba buka di browser: http://localhost:3000/api/keyboards (harus muncul data). Biarkan terminal ini tetap menyala.

**Tes dengan Postman** (seperti Modul 1): GET `http://localhost:3000/api/keyboards`, POST dengan body JSON, dst.

## LANGKAH 4 — Jalankan aplikasi
Buka terminal BARU di folder `keyforge-app`:
```bash
copy .env.example .env
npm install
npm run icons
npm run dev
```
Buka alamat yang muncul (biasanya http://localhost:5173). Selesai, aplikasinya sudah jalan.

## LANGKAH 5 — Ganti data diri
Buka `keyforge-app/src/pages/About.jsx`, ganti nama, NIM, kelas, dan link GitHub.

## LANGKAH 6 — Unggah ke GitHub
Buat satu repository di github.com (mis. `keyforge`), lalu di folder induk (`keyforge`):
```bash
git init
git add .
git commit -m "KeyForge TA PPB"
git branch -M main
git remote add origin https://github.com/USERNAME/keyforge.git
git push -u origin main
```
Ganti `USERNAME` dengan username GitHub kamu. File `.env` tidak ikut terunggah (sudah diatur).

## LANGKAH 7 — Deploy ke Vercel (gratis)
1. Daftar di https://vercel.com dengan akun GitHub.
2. **Deploy API dulu**: New Project → pilih repo `keyforge` → **Root Directory: `keyforge-api`** → buka **Environment Variables**, isi `SUPABASE_URL` dan `SUPABASE_KEY` → Deploy. Salin alamat hasilnya (mis. `https://keyforge-api.vercel.app`).
3. **Deploy aplikasi**: New Project → repo yang sama → **Root Directory: `keyforge-app`** → Framework **Vite** → Environment Variable `VITE_API_URL` = alamat API tadi (tanpa garis miring di akhir) → Deploy.
4. Buka alamat aplikasi di HP, lalu pilih "Tambahkan ke layar utama" untuk memasangnya (PWA).

## Nilai tambah & asistensi
- Wajib asistensi minimal 1 kali ke asisten dan isi lembar asistensi.
- Responsi 25–28 November. Pelajari alur: Supabase → API (model, controller, routes) → `api.js` → halaman.
