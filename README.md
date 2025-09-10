# 📚 Öğrenci Otomasyon Sistemi

Modern, full-stack eğitim yönetim platformu. .NET 9 Web API backend ve React frontend ile geliştirilmiş, kapsamlı öğrenci, öğretmen ve ders yönetim sistemi.

## 🎯 Proje Açıklaması

Bu proje, eğitim kurumları için tasarlanmış kapsamlı bir öğrenci otomasyon sistemidir. Sistem, üç farklı kullanıcı rolü (Admin, Öğretmen, Öğrenci) ile çalışır ve her rolün kendine özgü yetkileri bulunmaktadır.

### 🏗️ Teknoloji Stack'i

**Backend:**
- .NET 9 Web API
- Entity Framework Core (PostgreSQL)
- ASP.NET Core Identity (JWT Authentication)
- Docker (PostgreSQL Container)

**Frontend:**
- React 18 + Vite
- React Router DOM
- Axios (HTTP Client)
- Recharts (Grafik Kütüphanesi)
- CSS Variables (Dark/Light Mode)

### 🎨 Özellikler

- **🔐 Güvenli Kimlik Doğrulama**: JWT tabanlı authentication
- **👥 Rol Tabanlı Yetkilendirme**: Admin, Öğretmen, Öğrenci rolleri
- **📊 İnteraktif Dashboard**: Gerçek zamanlı istatistikler ve grafikler
- **🌙 Dark/Light Mode**: Kullanıcı dostu tema değiştirme
- **📱 Responsive Tasarım**: Mobil uyumlu modern UI/UX
- **📈 Görsel Raporlama**: Pasta, bar ve çizgi grafikleri
- **🔒 Güvenli Şifre Politikası**: Karmaşık şifre gereksinimleri

## 🚀 Kurulum ve Çalıştırma Adımları

### Önkoşullar
- .NET 9 SDK
- Node.js 18+
- Docker Desktop
- PostgreSQL (Docker ile)

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd ogrenci-otomasyon-sistemi
```

### 2. Backend Kurulumu

#### PostgreSQL'i Başlatın
```bash
docker compose up -d postgres
```

#### Veritabanı Migrasyonlarını Çalıştırın
```bash
cd Backend/OgrenciOtomasyon.API
dotnet ef database update
```

#### API'yi Başlatın
```bash
dotnet run
```
API `http://localhost:5219` adresinde çalışacaktır.

### 3. Frontend Kurulumu

```bash
cd Frontend/ogrenci-otomasyon-client
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

### 4. Ortam Değişkenleri (Opsiyonel)

Frontend için `.env` dosyası oluşturun:
```env
VITE_API_BASE=http://localhost:5219/api
```

## 👤 Kullanıcı Test Bilgileri

### 🔑 Admin Kullanıcısı
- **Email:** `admin@test.com`
- **Şifre:** `Admin123!*`
- **Yetkiler:** Tüm sistem yönetimi, kullanıcı yönetimi, şifre sıfırlama

### 👨‍🏫 Test Öğretmen Kullanıcısı
- **Email:** `teacher@test.com`
- **Şifre:** `Teacher123!*`
- **Yetkiler:** Öğrenci yönetimi, ders yönetimi, not verme, devam takibi

### 👨‍🎓 Test Öğrenci Kullanıcısı
- **Email:** `ogrenci@test.com`
- **Şifre:** `Ogrenci123!*`
- **Yetkiler:** Kendi bilgilerini görüntüleme, notlarını görme, devam durumunu takip etme

### 📝 Yeni Kullanıcı Kaydı
Sistem üzerinden yeni öğrenci ve öğretmen hesapları oluşturabilirsiniz. Kayıt sırasında güvenli şifre gereksinimleri uygulanır.

## ⭐ Yapılan Bonus Görevler

### 🎨 UI/UX İyileştirmeleri
- ✅ **Modern Dashboard**: Gradient header, istatistik kartları, interaktif grafikler
- ✅ **Dark/Light Mode**: Tam tema desteği, smooth geçişler
- ✅ **Responsive Tasarım**: Mobil ve tablet uyumlu layout
- ✅ **Emoji İkonlar**: Görsel zenginlik için emoji kullanımı
- ✅ **Hover Efektleri**: İnteraktif buton ve link animasyonları

### 📊 Gelişmiş Grafik Sistemi
- ✅ **Recharts Entegrasyonu**: Profesyonel grafik kütüphanesi
- ✅ **Pasta Grafik**: Ders durumları dağılımı
- ✅ **Bar Grafik**: Öğrenci sınıf dağılımı
- ✅ **Çizgi Grafik**: Öğrenci not takibi
- ✅ **Responsive Grafikler**: Tüm ekran boyutlarında uyumlu

### 🔐 Güvenlik İyileştirmeleri
- ✅ **Güçlü Şifre Politikası**: 8+ karakter, büyük/küçük harf, rakam, özel karakter
- ✅ **Şifre Sıfırlama**: Admin tarafından kullanıcı şifrelerini sıfırlama
- ✅ **JWT Token Yönetimi**: Güvenli authentication sistemi
- ✅ **Rol Tabanlı Erişim**: Her endpoint için uygun yetkilendirme

### 🚀 Performans ve Kullanılabilirlik
- ✅ **Lazy Loading**: Sayfa yükleme optimizasyonu
- ✅ **Error Handling**: Kapsamlı hata yönetimi
- ✅ **Loading States**: Kullanıcı geri bildirimi
- ✅ **Form Validasyonu**: Gerçek zamanlı doğrulama
- ✅ **Toast Notifications**: Başarı/hata mesajları

### 🛠️ Gelişmiş Özellikler
- ✅ **Inline Editing**: Öğrenci bilgilerini doğrudan düzenleme
- ✅ **Bulk Operations**: Toplu işlemler (silme, güncelleme)
- ✅ **Search & Filter**: Gelişmiş arama ve filtreleme
- ✅ **Export Functionality**: Veri dışa aktarma (gelecek için hazır)
- ✅ **Audit Trail**: İşlem geçmişi takibi

### 📱 Modern Web Standartları
- ✅ **PWA Ready**: Progressive Web App desteği
- ✅ **SEO Optimized**: Arama motoru optimizasyonu
- ✅ **Accessibility**: Erişilebilirlik standartları
- ✅ **Cross-Browser**: Tüm modern tarayıcı desteği

## 🎯 Rol Bazlı Özellikler

### 👑 Admin
- Tüm öğrenci ve öğretmen yönetimi
- Ders oluşturma ve yönetimi
- Kullanıcı şifrelerini sıfırlama
- Sistem istatistiklerini görüntüleme
- Tüm verileri silme yetkisi

### 👨‍🏫 Öğretmen
- Öğrenci listesi ve yönetimi
- Kendi derslerini görüntüleme ve güncelleme
- Öğrencilere not verme
- Devam takibi yapma
- Öğrenci yorumları ekleme

### 👨‍🎓 Öğrenci
- Kendi bilgilerini görüntüleme
- Kayıtlı olduğu dersleri görme
- Kendi notlarını takip etme
- Devam durumunu kontrol etme
- Not grafiklerini görüntüleme

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Yeni kullanıcı kaydı

### Admin
- `POST /api/admin/reset-password` - Şifre sıfırlama

### Students
- `GET /api/students` - Öğrenci listesi
- `POST /api/students` - Yeni öğrenci
- `PUT /api/students/{id}` - Öğrenci güncelleme
- `DELETE /api/students/{id}` - Öğrenci silme
- `POST /api/students/{id}/comments` - Öğrenci yorumu ekleme

### Teachers
- `GET /api/teachers` - Öğretmen listesi
- `POST /api/teachers` - Yeni öğretmen
- `PUT /api/teachers/{id}` - Öğretmen güncelleme
- `DELETE /api/teachers/{id}` - Öğretmen silme

### Courses
- `GET /api/courses` - Ders listesi
- `POST /api/courses` - Yeni ders
- `GET /api/courses/{id}` - Ders detayı
- `PUT /api/courses/{id}/status` - Ders durumu güncelleme
- `DELETE /api/courses/{id}` - Ders silme
- `POST /api/courses/{courseId}/students/{studentId}` - Derse öğrenci ekleme
- `DELETE /api/courses/{courseId}/students/{studentId}` - Dersten öğrenci çıkarma

### Grades & Attendance
- `POST /api/grades` - Not verme
- `GET /api/grades/my-grades` - Kendi notları görüntüleme
- `DELETE /api/grades/{id}` - Not silme
- `POST /api/attendance` - Devam kaydetme
- `DELETE /api/attendance/{id}` - Devam kaydı silme

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

---

**🎉 Proje başarıyla tamamlanmıştır! Modern, güvenli ve kullanıcı dostu bir eğitim yönetim sistemi.**



