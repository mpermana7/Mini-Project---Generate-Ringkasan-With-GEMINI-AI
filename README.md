# Mini-Project---Generate-Ringkasan-With-GEMINI-AI
Website peringkasan artikel atau konten dengan AI full-stack menggunakan Golang, MongoDB, React, dan Google Gemini API dengan  AI otomatis dan manajemen dokumen secara real-time.
-----------------------------------------------------------------
🚀 Tech Stack
# Backend
- Golang
- MongoDB
- MongoDB Driver
- Google Gemini API

# Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
-----------------------------------------------------------------
✨ Features
- Menyimpan dokumen ke MongoDB
- Generate ringkasan otomatis menggunakan Google Gemini AI
- Menampilkan daftar dokumen secara real-time
- Antarmuka modern menggunakan React dan Tailwind CSS
- Full-stack monolith architecture menggunakan Golang + React
-----------------------------------------------------------------
📦 Installation
1. Clone Repository
```bash
git clone https://github.com/mpermana7/Mini-Project---Generate-Ringkasan-With-GEMINI-AI.git
cd Mini-Project---Generate-Ringkasan-With-GEMINI-AI
```

2. Install Dependency Frontend
```bash
cd frontend
npm install
```

3. Jalankan MongoDB
Pastikan MongoDB sudah berjalan di:
```text
mongodb://localhost:27017
```
Jika menggunakan MongoDB Compass, pastikan server berhasil terkoneksi.

4. Konfigurasi Google Gemini API Key
Buat environment variable:
# Windows PowerShell
```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

# Windows CMD
```cmd
set GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

5. Build Frontend
```bash
cd frontend
npm run build
```

6. Jalankan Backend Golang
```bash
go run main.go
```

Server akan berjalan pada:
```text
http://localhost:8080
```

-----------------------------------------------------------------
📖 Tata Cara Penggunaan

1. Buka browser dan akses:
```text
http://localhost:8080
```

2. Isi form:
   - Judul Dokumen
   - Program Studi
   - Konten atau abstrak dokumen

3. Klik tombol:
```text
Simpan & Trigger AI
```

4. Sistem akan:
   - Menyimpan data ke MongoDB
   - Mengirim konten ke Google Gemini API
   - Menghasilkan ringkasan otomatis
   - Menampilkan hasil pada halaman utama

🗄 Database Structure
Database:
```text
pillbox_db
```

Collection:
```text
documents
```

Contoh data:
```json
{
  "_id": "685de8f17d17f08b7f5e3ab2",
  "title": "Implementasi AI Menggunakan Golang",
  "category": "S1 Teknik Komputer",
  "content": "Penelitian ini membahas...",
  "ai_summary": "Penelitian ini membahas implementasi AI menggunakan Golang dan MongoDB.",
  "created_at": "2026-06-27T01:00:00Z"
}
```

👨‍💻 Pembuat

**Mochamad Permana Ash Shidiq**

GitHub:
https://github.com/mpermana7
