# sera_tech_test

run app :
1. masuk ke direktori crud_api, lalu jalankan   `npm run dev`
2. masuk ke direktori send_email jalankan `node app.js`
3. jalankan `docker compose up -d` untuk menjalankan rabbitMQ
4. import postman collection untuk menjalankan API

# jawaban test logic nomor 1
- kelompokan kelererng menjadi 3, A = 3 buah, B = 3 buah, C = 2 buah.
- timbang A dan B.
- jika berat sama maka klereng terberat ada di C, maka tinggal di timbang saja mana yang lebih berat di kelompok C.
- Jika berbeda maka ambil yang terberat (misal B).
- timbang 2 kelereng  dari B, jika berat sama maka kelereng adalah yang tidak di timbang, jika beda maka kita sudah tau mana yang terberat.
