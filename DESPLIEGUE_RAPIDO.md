# 🚀 DESPLIEGUE RÁPIDO - 5 MINUTOS

## ⚡ RESUMEN ULTRA RÁPIDO

**Tu servidor:** `root@31.97.144.118` (srv885729.hstgr.cloud)

---

## 📝 PASOS RÁPIDOS

### **1. Configurar API Keys (2 min)**

```bash
# Copia el ejemplo
copy .env.production.example .env.production

# Edita .env.production y agrega:
VITE_OPENAI_API_KEY=sk-proj-tu-key-real
VITE_GOOGLE_MAPS_API_KEY=AIza-tu-key-real
```

**⚠️ IMPORTANTE - Configura límites:**
- **OpenAI:** https://platform.openai.com/account/limits → Límite $5-$10/mes
- **Google Maps:** https://console.cloud.google.com/ → Restricción: `srv885729.hstgr.cloud/*`

---

### **2. Crear Build (1 min)**

```bash
# Opción A: Windows
deploy.bat

# Opción B: Manual
npm run build
```

Esto crea la carpeta `dist/` con tu sitio compilado.

---

### **3. Subir al Servidor (2 min)**

#### **OPCIÓN A: FileZilla (MÁS FÁCIL) ⭐**

1. Abre FileZilla
2. Conecta:
   - **Host:** `sftp://31.97.144.118`
   - **Usuario:** `root`
   - **Puerto:** `22`
   - **Contraseña:** [tu contraseña]

3. Navega a: `/var/www/html/` (o `/home/root/public_html/`)

4. Sube TODOS los archivos de `dist/`:
   - Arrastra todo el contenido de la carpeta `dist/`
   - Incluye la carpeta `assets/`

5. Sube también `.htaccess` (está en la raíz del proyecto)

#### **OPCIÓN B: SSH Automatizado (Git Bash)**

```bash
bash deploy.sh
```

---

### **4. Verificar (30 seg)**

Abre en tu navegador:
```
https://srv885729.hstgr.cloud/
```

✅ Verifica:
- Página carga correctamente
- Rutas funcionan: `/tramites`, `/contacto`
- Chatbot responde (pregunta algo)
- Mapa muestra ubicaciones

---

## 🔒 SEGURIDAD - CONFIGURAR RESTRICCIONES

### **Google Maps API (5 min)**

1. https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Edita tu API Key
4. Application restrictions: **HTTP referrers**
5. Agrega: `srv885729.hstgr.cloud/*`
6. Guarda

### **OpenAI API (2 min)**

1. https://platform.openai.com/account/limits
2. Hard limit: **$10/mes**
3. Soft limit: **$5/mes**
4. Habilita alertas por email

---

## 🐛 PROBLEMAS COMUNES

| Problema | Solución Rápida |
|----------|----------------|
| 404 al recargar en /tramites | Verifica que `.htaccess` esté en el servidor |
| Chatbot no responde | Verifica API Key de OpenAI y límites |
| Mapa no carga | Verifica API Key de Google Maps y restricciones |
| CSS no se aplica | Verifica que carpeta `assets/` se subió completa |

---

## 🔄 ACTUALIZAR EL SITIO

Cuando hagas cambios:

```bash
# 1. Hacer build
npm run build

# 2. Subir dist/ al servidor (via FTP)

# 3. Limpiar caché navegador
Ctrl + Shift + R
```

---

## 📚 MÁS INFORMACIÓN

- **Guía completa:** Lee `DEPLOY.md`
- **Configuración servidor:** SSH a `root@31.97.144.118`
- **Monitoreo APIs:**
  - OpenAI: https://platform.openai.com/usage
  - Google Maps: https://console.cloud.google.com/

---

## ✅ CHECKLIST FINAL

- [ ] `.env.production` creado con API keys reales
- [ ] Restricciones configuradas en Google Maps
- [ ] Límites configurados en OpenAI ($5-$10/mes)
- [ ] Build creado (`npm run build`)
- [ ] Archivos subidos al servidor (todo `dist/` + `.htaccess`)
- [ ] Sitio verificado en navegador
- [ ] Chatbot probado y funciona
- [ ] Mapa probado y funciona

---

**¡Listo! Tu sitio está en producción 🎉**
