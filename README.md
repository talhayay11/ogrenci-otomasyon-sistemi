# Öğrenci Otomasyon Sistemi

Full-stack .NET 9 + React tabanlı örnek Öğrenci Otomasyon Sistemi.

## Proje Yapısı

```
OgrenciOtomasyonSistemi/
├── Backend/
│   └── OgrenciOtomasyon.API/ (.NET 9 Web API)
└── Frontend/
    └── ogrenci-otomasyon-client/ (Vite + React)
```

## Backend (API) Kurulum

Önkoşullar: .NET 9 SDK, PostgreSQL (Docker veya lokal), dotnet-ef CLI.

1. Paketler yüklü gelmektedir. PostgreSQL bağlantı bilgisini `Backend/OgrenciOtomasyon.API/appsettings.json` içinde `ConnectionStrings:DefaultConnection` alanında güncelleyin.
2. PostgreSQL’i Docker ile başlatmak için proje kökünde:

```bash
docker compose up -d postgres
```

3. Veritabanı migrasyonlarını çalıştırın:

```bash
cd Backend/OgrenciOtomasyon.API
dotnet ef database update
dotnet run
```

API varsayılan olarak `http://localhost:5179` adresinde çalışır (port makinenize göre değişebilir).

### Kimlik ve Roller

Uygulama başlangıcında "Admin", "Teacher", "Student" rolleri oluşturulur ve test admin kullanıcısı eklenir.

- Email: admin@test.com
- Şifre: Admin123!*

## Frontend (React) Kurulum

Önkoşullar: Node.js 18+

```bash
cd Frontend/ogrenci-otomasyon-client
npm install
npm run dev
```

Frontend `http://localhost:5173` üzerinde çalışır. `.env` dosyasına API adresini ekleyebilirsiniz:

```
VITE_API_BASE=http://localhost:5179/api
```

## Özellikler

- Kimlik Doğrulama: Kayıt, Giriş, JWT ile korumalı istekler
- Öğrenci Yönetimi: Listeleme, ekleme, güncelleme
- Öğretmen Yönetimi: Listeleme, ekleme, güncelleme
- Ders Yönetimi: Listeleme, detay, derse öğrenci ekleme/çıkarma, öğretmene bağlama
- Notlar: Öğrencinin kendi notlarını görüntülemesi

Not: Örnek olması için bazı eşleştirmeler (Identity User ↔ Domain Öğrenci/Öğretmen) basitleştirilmiştir.



