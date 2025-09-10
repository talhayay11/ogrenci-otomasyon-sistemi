# 🚀 Deployment Guide

## Backend Deployment

### Azure App Service (Önerilen)

1. **Azure CLI ile giriş:**
```bash
az login
```

2. **Resource Group oluştur:**
```bash
az group create --name ogrenci-otomasyon-rg --location "West Europe"
```

3. **App Service Plan oluştur:**
```bash
az appservice plan create --name ogrenci-otomasyon-plan --resource-group ogrenci-otomasyon-rg --sku B1 --is-linux
```

4. **Web App oluştur:**
```bash
az webapp create --resource-group ogrenci-otomasyon-rg --plan ogrenci-otomasyon-plan --name ogrenci-otomasyon-api --runtime "DOTNET|9.0"
```

5. **PostgreSQL Database oluştur:**
```bash
az postgres flexible-server create --resource-group ogrenci-otomasyon-rg --name ogrenci-otomasyon-db --admin-user adminuser --admin-password AdminPass123! --sku-name Standard_B1ms --tier Burstable --public-access 0.0.0.0
```

6. **Environment Variables ayarla:**
```bash
az webapp config appsettings set --resource-group ogrenci-otomasyon-rg --name ogrenci-otomasyon-api --settings ASPNETCORE_ENVIRONMENT=Production
az webapp config appsettings set --resource-group ogrenci-otomasyon-rg --name ogrenci-otomasyon-api --settings JWT__Key="your-super-secret-jwt-key-here-min-32-chars"
az webapp config appsettings set --resource-group ogrenci-otomasyon-rg --name ogrenci-otomasyon-api --settings JWT__Issuer="ogrenci-otomasyon-api"
az webapp config appsettings set --resource-group ogrenci-otomasyon-rg --name ogrenci-otomasyon-api --settings JWT__Audience="ogrenci-otomasyon-client"
```

7. **Deploy:**
```bash
cd Backend/OgrenciOtomasyon.API
az webapp deployment source config --resource-group ogrenci-otomasyon-rg --name ogrenci-otomasyon-api --repo-url https://github.com/yourusername/ogrenci-otomasyon-sistemi --branch main --manual-integration
```

### Heroku (Kolay Seçenek)

1. **Heroku CLI ile giriş:**
```bash
heroku login
```

2. **App oluştur:**
```bash
cd Backend/OgrenciOtomasyon.API
heroku create ogrenci-otomasyon-api
```

3. **PostgreSQL Add-on:**
```bash
heroku addons:create heroku-postgresql:mini
```

4. **Environment Variables:**
```bash
heroku config:set ASPNETCORE_ENVIRONMENT=Production
heroku config:set JWT__Key="your-super-secret-jwt-key-here-min-32-chars"
heroku config:set JWT__Issuer="ogrenci-otomasyon-api"
heroku config:set JWT__Audience="ogrenci-otomasyon-client"
```

5. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

6. **Database Migration:**
```bash
heroku run dotnet ef database update
```

## Frontend Deployment (Netlify)

1. **Build hazırlığı:**
```bash
cd Frontend/ogrenci-otomasyon-client
npm run build
```

2. **Netlify'da site oluştur:**
   - Netlify.com'a git
   - "New site from Git" seç
   - GitHub repository'ni bağla
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Environment Variables (Netlify Dashboard):**
```
VITE_API_BASE=https://your-backend-url.com/api
```

## Production Checklist

### Backend
- [ ] Environment variables ayarlandı
- [ ] Database connection string güncellendi
- [ ] JWT key güvenli hale getirildi
- [ ] CORS policy production URL'leri için güncellendi
- [ ] Logging seviyesi ayarlandı

### Frontend
- [ ] API base URL production'a güncellendi
- [ ] Build optimizasyonu yapıldı
- [ ] Environment variables ayarlandı
- [ ] HTTPS zorunlu hale getirildi

### Database
- [ ] Production database oluşturuldu
- [ ] Migration'lar çalıştırıldı
- [ ] Seed data eklendi
- [ ] Backup stratejisi belirlendi

### Security
- [ ] HTTPS sertifikası aktif
- [ ] JWT key güvenli
- [ ] Database credentials güvenli
- [ ] CORS policy sıkılaştırıldı
- [ ] Rate limiting eklendi (opsiyonel)

## Troubleshooting

### Backend Issues
- **Database connection failed:** Connection string'i kontrol et
- **JWT token invalid:** JWT key'in aynı olduğundan emin ol
- **CORS errors:** Frontend URL'ini CORS policy'ye ekle

### Frontend Issues
- **API calls failing:** API base URL'ini kontrol et
- **Build errors:** Node.js version'ını kontrol et
- **Environment variables not working:** Netlify dashboard'da kontrol et

## Cost Estimation

### Azure
- App Service B1: ~$13/month
- PostgreSQL Flexible Server: ~$25/month
- **Total: ~$38/month**

### Heroku
- Basic Dyno: $7/month
- PostgreSQL Mini: $5/month
- **Total: $12/month**

### Netlify
- Pro Plan: $19/month (opsiyonel)
- **Free tier available**

## Monitoring

### Azure
- Application Insights
- Azure Monitor
- Log Analytics

### Heroku
- Heroku Metrics
- New Relic (add-on)
- Logentries (add-on)

### Netlify
- Netlify Analytics
- Build logs
- Function logs
