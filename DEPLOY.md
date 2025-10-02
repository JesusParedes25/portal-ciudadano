# 🚀 GUÍA DE DESPLIEGUE - PRODUCCIÓN

## 📋 INFORMACIÓN DEL SERVIDOR

- **Servidor:** Rocky Linux 9 (Hostinger VPS)
- **IP:** 31.97.144.118
- **Hostname:** srv885729.hstgr.cloud
- **Usuario SSH:** root
- **Directorio web:** `/var/www/html/` o `/home/usuario/public_html/`

---

## 🔐 PASO 1: CONFIGURAR API KEYS (IMPORTANTE)

### **A. Google Maps API Key**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **APIs & Services → Credentials**
4. Edita tu API Key
5. Configura restricciones:
   - **Application restrictions:** HTTP referrers (web sites)
   - **Website restrictions:** Agrega:
     ```
     srv885729.hstgr.cloud/*
     http://srv885729.hstgr.cloud/*
     https://srv885729.hstgr.cloud/*
     ```
6. **API restrictions:** Asegúrate que estén habilitadas:
   - Maps JavaScript API
   - Maps Embed API
   - Street View Static API
7. Guarda los cambios

### **B. OpenAI API Key**

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Ve a **Settings → Limits**
3. Configura límites de gasto:
   - **Hard limit:** $10 USD/mes (máximo absoluto)
   - **Soft limit:** $5 USD/mes (alerta por email)
4. Habilita notificaciones por email
5. **⚠️ IMPORTANTE:** Estos límites protegen tu cuenta de gastos excesivos

### **C. Crear archivo .env.production**

```bash
# En tu PC, copia el ejemplo
copy .env.production.example .env.production

# Edita .env.production y agrega tus keys reales:
VITE_OPENAI_API_KEY=sk-proj-tu-key-real-aqui
VITE_GOOGLE_MAPS_API_KEY=AIza-tu-key-real-aqui
```

**⚠️ NUNCA subas `.env.production` a GitHub** (ya está en .gitignore)

---

## 📦 PASO 2: CREAR BUILD DE PRODUCCIÓN

```bash
# En tu PC, en la carpeta del proyecto
cd c:\Users\UPLAPH\COEMERE\portal-ciudadano\agencia-react

# Instalar dependencias (si no las tienes)
npm install

# Crear build de producción
npm run build
```

Esto creará la carpeta `dist/` con todos los archivos optimizados.

**Verifica que se creó correctamente:**
```bash
dir dist
```

Deberías ver:
- `index.html`
- Carpeta `assets/` con archivos `.js` y `.css`
- Otros archivos estáticos

---

## 🌐 PASO 3: SUBIR ARCHIVOS AL SERVIDOR

### **Opción A: Via FTP/SFTP (MÁS FÁCIL)**

1. **Descarga FileZilla o WinSCP**
2. **Conecta al servidor:**
   - Host: `sftp://31.97.144.118`
   - Usuario: `root`
   - Puerto: `22`
   - Contraseña: [tu contraseña]

3. **Navega al directorio web:**
   - `/var/www/html/` (Apache estándar)
   - O `/home/root/public_html/` (Hostinger)

4. **Sube TODOS los archivos de `dist/`:**
   - `index.html`
   - Carpeta `assets/` completa
   - Cualquier otro archivo en `dist/`

5. **Sube también el archivo `.htaccess`**
   - Debe estar en la misma carpeta que `index.html`

### **Opción B: Via SSH (Para usuarios avanzados)**

```bash
# 1. Comprimir la carpeta dist
cd c:\Users\UPLAPH\COEMERE\portal-ciudadano\agencia-react
tar -czf build.tar.gz -C dist/ .

# 2. Subir al servidor (desde Git Bash o PowerShell)
scp build.tar.gz .htaccess root@31.97.144.118:/tmp/

# 3. Conectar al servidor
ssh root@31.97.144.118

# 4. En el servidor, desplegar
cd /var/www/html/
# ⚠️ CUIDADO: Esto borra archivos existentes
rm -rf *
tar -xzf /tmp/build.tar.gz
mv /tmp/.htaccess .
rm /tmp/build.tar.gz

# 5. Configurar permisos
chmod 644 index.html .htaccess
chmod 755 assets/
chmod 644 assets/*
```

---

## 🔧 PASO 4: CONFIGURAR APACHE

### **Verificar que mod_rewrite está habilitado:**

```bash
# Conectar al servidor
ssh root@31.97.144.118

# Verificar módulos
httpd -M | grep rewrite
# Debe mostrar: rewrite_module (shared)

# Si no está habilitado, habilítalo:
# En Rocky Linux:
sudo dnf install mod_rewrite
sudo systemctl restart httpd
```

### **Configurar permisos de .htaccess:**

Edita la configuración de Apache:

```bash
sudo nano /etc/httpd/conf/httpd.conf
```

Busca tu directorio web y asegúrate que diga:

```apache
<Directory "/var/www/html">
    Options Indexes FollowSymLinks
    AllowOverride All  # ← IMPORTANTE: debe ser "All"
    Require all granted
</Directory>
```

Reinicia Apache:

```bash
sudo systemctl restart httpd
```

---

## 🔒 PASO 5: CONFIGURAR SSL (HTTPS)

### **Opción A: Via Panel de Hostinger (MÁS FÁCIL)**

1. Inicia sesión en Hostinger
2. Ve a **VPS → Tu servidor**
3. Ve a **SSL/TLS**
4. Activa **Let's Encrypt SSL**
5. Espera 10-15 minutos

### **Opción B: Via SSH con Certbot**

```bash
# Instalar Certbot
sudo dnf install certbot python3-certbot-apache

# Obtener certificado SSL
sudo certbot --apache -d srv885729.hstgr.cloud

# Seguir las instrucciones
# Certbot configurará automáticamente Apache

# Renovación automática (verificar)
sudo certbot renew --dry-run
```

### **Activar redirección HTTPS:**

Una vez tengas SSL, edita `.htaccess` y descomenta:

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## ✅ PASO 6: VERIFICACIÓN POST-DESPLIEGUE

### **1. Verificar que el sitio carga:**

```
https://srv885729.hstgr.cloud/
```

✅ Debe cargar la página principal

### **2. Verificar rutas de React Router:**

```
https://srv885729.hstgr.cloud/tramites
https://srv885729.hstgr.cloud/contacto
```

✅ Deben cargar las páginas (no 404)
✅ Recarga la página (F5) → Debe seguir funcionando

### **3. Verificar el Chatbot:**

- Abre el chatbot (botón flotante)
- Pregunta: "¿Cómo saco mi acta de nacimiento?"
- ✅ Debe responder con información

### **4. Verificar el Mapa:**

- Ve a la sección de mapa
- Busca un trámite (ej: "licencia de conducir")
- ✅ Debe mostrar el mapa con marcadores

### **5. Verificar la consola del navegador:**

- Presiona F12 → Console
- ✅ No debe haber errores críticos en rojo

---

## 📊 MONITOREO

### **Revisar uso de APIs:**

**OpenAI:**
- https://platform.openai.com/usage
- Revisa diariamente los primeros días

**Google Maps:**
- https://console.cloud.google.com/
- APIs & Services → Dashboard

---

## 🐛 PROBLEMAS COMUNES

### **Problema: 404 al recargar en /tramites**

**Solución:**
- Verifica que `.htaccess` esté en el directorio raíz
- Verifica que `AllowOverride All` en Apache config
- Reinicia Apache: `sudo systemctl restart httpd`

### **Problema: Chatbot no responde**

**Solución:**
- Verifica la API Key de OpenAI en la consola del navegador
- Verifica límites de gasto en OpenAI
- Revisa errores en F12 → Console

### **Problema: Mapa no carga**

**Solución:**
- Verifica la API Key de Google Maps
- Verifica que las APIs estén habilitadas en Google Cloud
- Verifica restricciones de dominio

### **Problema: CSS no se aplica**

**Solución:**
- Verifica que la carpeta `assets/` se subió correctamente
- Verifica permisos: `chmod 755 assets/`
- Limpia caché del navegador (Ctrl+Shift+R)

---

## 🔄 ACTUALIZAR EL SITIO

Cuando hagas cambios:

```bash
# 1. En tu PC
npm run build

# 2. Sube los archivos del dist/ al servidor (via FTP o SSH)

# 3. Limpia caché del navegador
Ctrl + Shift + R
```

---

## 📞 SOPORTE

Si tienes problemas:

1. Revisa logs de Apache: `sudo tail -f /var/log/httpd/error_log`
2. Revisa logs de acceso: `sudo tail -f /var/log/httpd/access_log`
3. Verifica permisos: `ls -la /var/www/html/`
4. Verifica que Apache está corriendo: `sudo systemctl status httpd`

---

## ✨ MEJORAS FUTURAS (OPCIONAL)

### **Backend Proxy para OpenAI (Más Seguro)**

Para mayor seguridad, crea un backend simple que maneje las llamadas a OpenAI:

1. Crea un archivo PHP o Node.js en el servidor
2. Mueve la API Key al backend
3. El frontend llama a tu backend, no a OpenAI directamente

**Ejemplo: `api-proxy.php`**

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$apiKey = getenv('OPENAI_API_KEY'); // Variable de entorno del servidor
$data = json_decode(file_get_contents('php://input'), true);

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
echo $response;
?>
```

---

**¡Listo para desplegar! 🚀**
