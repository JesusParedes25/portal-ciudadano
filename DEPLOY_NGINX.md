# 🚀 DESPLIEGUE CON NGINX

Si tu servidor usa **Nginx** en lugar de Apache, sigue esta guía.

---

## ✅ VERIFICAR QUÉ SERVIDOR TIENES

```bash
# Conecta a tu servidor
ssh root@31.97.144.118

# Verificar Apache
systemctl status httpd
# Si aparece "active (running)" → Tienes Apache

# Verificar Nginx
systemctl status nginx
# Si aparece "active (running)" → Tienes Nginx
```

---

## 📦 DESPLIEGUE CON NGINX

### **PASO 1: Build Local (Igual que antes)**

```bash
# En tu PC
cd c:\Users\UPLAPH\COEMERE\portal-ciudadano\agencia-react

# Crear .env.production
copy .env.production.example .env.production
# Edita y agrega tus API keys

# Crear build
npm run build
```

---

### **PASO 2: Subir Archivos**

**Via FTP/SFTP:**
1. Conecta a `sftp://31.97.144.118`
2. Sube **TODO** el contenido de `dist/` a `/var/www/html/`
3. **NO subas `.htaccess`** (es solo para Apache)

**Via SSH:**
```bash
# Comprimir
cd dist
tar -czf ../build.tar.gz .
cd ..

# Subir
scp build.tar.gz root@31.97.144.118:/tmp/

# Desplegar
ssh root@31.97.144.118
cd /var/www/html
rm -rf *
tar -xzf /tmp/build.tar.gz
rm /tmp/build.tar.gz
```

---

### **PASO 3: Configurar Nginx**

```bash
# En el servidor
ssh root@31.97.144.118

# Crear archivo de configuración
sudo nano /etc/nginx/conf.d/portal-ciudadano.conf
```

**Pega esta configuración:**

```nginx
server {
    listen 80;
    server_name srv885729.hstgr.cloud;
    
    root /var/www/html;
    index index.html;
    
    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # GZIP
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

### **PASO 4: Verificar y Reiniciar**

```bash
# Verificar sintaxis
sudo nginx -t

# Si dice "syntax is ok" → Continúa
# Si hay error → Revisa la configuración

# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar que está corriendo
sudo systemctl status nginx
```

---

### **PASO 5: Configurar SSL (HTTPS)**

```bash
# Instalar Certbot
sudo dnf install certbot python3-certbot-nginx

# Obtener certificado (sigue las instrucciones)
sudo certbot --nginx -d srv885729.hstgr.cloud

# Certbot configurará automáticamente HTTPS
# Y agregará redirección de HTTP → HTTPS
```

---

## 🔄 ACTUALIZAR EL SITIO

Cuando hagas cambios:

```bash
# 1. Build local
npm run build

# 2. Subir al servidor (via FTP)
# Sube el contenido de dist/ a /var/www/html/

# 3. Limpiar caché Nginx (opcional)
ssh root@31.97.144.118
sudo systemctl reload nginx
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **Problema: 404 al recargar en /tramites**

**Causa:** React Router no está configurado

**Solución:**
```bash
# Verifica que en nginx.conf esté:
location / {
    try_files $uri $uri/ /index.html;
}

# Reinicia Nginx
sudo systemctl restart nginx
```

### **Problema: Cambios no se reflejan**

**Solución:**
```bash
# Limpiar caché
sudo systemctl reload nginx

# O en el navegador
Ctrl + Shift + R
```

### **Problema: CSS no se aplica**

**Solución:**
```bash
# Verificar permisos
sudo chmod 755 /var/www/html/assets
sudo chmod 644 /var/www/html/assets/*
sudo chown -R nginx:nginx /var/www/html
```

---

## 📊 COMANDOS ÚTILES NGINX

```bash
# Ver logs de errores
sudo tail -f /var/log/nginx/error.log

# Ver logs de acceso
sudo tail -f /var/log/nginx/access.log

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Recargar configuración (sin downtime)
sudo systemctl reload nginx

# Ver estado
sudo systemctl status nginx
```

---

## 🔐 PERMISOS CORRECTOS

```bash
# Usuario que corre Nginx
ps aux | grep nginx
# Generalmente: nginx o www-data

# Ajustar permisos
sudo chown -R nginx:nginx /var/www/html
sudo chmod 755 /var/www/html
sudo find /var/www/html -type f -exec chmod 644 {} \;
sudo find /var/www/html -type d -exec chmod 755 {} \;
```

---

## 📚 DIFERENCIAS CON APACHE

| Aspecto | Apache | Nginx |
|---------|--------|-------|
| Archivo config | `.htaccess` en cada directorio | `nginx.conf` centralizado |
| Ubicación | Junto a `index.html` | `/etc/nginx/conf.d/` |
| Rewrite | En `.htaccess` | En server block |
| Reinicio | Automático al cambiar `.htaccess` | Manual: `nginx -s reload` |

---

## ✅ CHECKLIST NGINX

- [ ] Build creado (`npm run build`)
- [ ] Archivos de `dist/` subidos a `/var/www/html/`
- [ ] Configuración Nginx creada en `/etc/nginx/conf.d/`
- [ ] Sintaxis verificada (`nginx -t`)
- [ ] Nginx reiniciado (`systemctl restart nginx`)
- [ ] SSL configurado (Certbot)
- [ ] Sitio verificado en navegador
- [ ] Rutas funcionando (reload en /tramites)
- [ ] Chatbot y mapa funcionando

---

**¡Listo con Nginx! 🚀**
