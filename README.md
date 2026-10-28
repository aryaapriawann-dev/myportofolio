# 🚀 Softvision — Crafted Digital

Website resmi dan Aplikasi Mobile dari **Softvision** (Software house yang menggabungkan sistem clean, cinematic UI, dan AI-first).

---

## 📱 Panduan Download & Install Aplikasi Android (APK)

Kamu bisa langsung mencoba aplikasi Softvision di smartphone Android kamu tanpa perlu setup coding apapun!

### Langkah 1: Download File APK dari GitHub
1. Buka link rilis resmi kami langsung melalui browser di HP Android kamu:
   👉 **[Download Softvision APK Terbaru](https://github.com/aryaapriawann-dev/myportofolio/releases)**
2. Cari rilis terbaru dengan judul **`Softvision Android App (Latest APK)`**.
3. Di bagian **Assets** (klik panah kecil jika tertutup), klik file **`Softvision-debug.apk`**.
4. Jika browser menampilkan peringatan *"File ini mungkin berbahaya"* atau *"File might be harmful"*, klik **Tetap Download (Download anyway)**.  
   *(Catatan: Peringatan ini wajar karena aplikasi diunduh langsung dari GitHub / belum terdaftar di Google Play Store).*

---

### Langkah 2: Cara Install di HP Android
1. Setelah proses download selesai, buka notifikasi unduhan atau buka aplikasi **File Manager (Pengelola File)** ➔ masuk ke folder **Download**.
2. Klik file **`Softvision-debug.apk`**.
3. **Jika muncul izin "Sumber Tidak Dikenal" (Unknown Sources):**
   - Klik **Setelan (Settings)** pada pop-up yang muncul.
   - Nyalakan saklar **Izinkan dari sumber ini (Allow from this source)** untuk browser atau File Manager kamu.
   - Tekan tombol kembali (Back), lalu klik **Instal (Install)**.
4. **Jika muncul peringatan Google Play Protect:**
   - Klik **Rincian lebih lanjut (More details)**.
   - Klik **Tetap instal (Install anyway)**.
5. Tunggu proses instalasi beberapa detik hingga selesai.
6. Klik **Buka (Open)** — Aplikasi Softvision siap digunakan di HP kamu! 🎉

---

## 💻 Pengembangan Lokal (Web Development)

Jika ingin menjalankan versi web di komputer:

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server lokal
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

---

## 📲 Build Versi Android Manual (Opsional)

Jika ingin melakukan sync ke project Android lokal:

```bash
# Build web dan sync ke Android
npm run cap:sync

# Buka project di Android Studio (jika terinstall)
npm run cap:open
```

File APK baru juga akan otomatis di-build oleh **GitHub Actions** setiap kali kamu melakukan `git push origin main`.
