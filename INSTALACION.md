# 🚀 Guía de Instalación - Agencia Digital Hidalgo (React)

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior
- **npm** (viene incluido con Node.js) o **yarn**
- **Git** para clonar el repositorio

## 📥 Instalación

### 1. Navegar al directorio del proyecto React
```bash
cd c:\Users\UPLAPH\COEMERE\portal-ciudadano\agencia-react
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 4. Abrir en el navegador
El proyecto se ejecutará en: `http://localhost:3000`

## 🛠️ Scripts Disponibles

```bash
# Desarrollo - Inicia servidor con hot reload
npm run dev

# Build - Genera archivos para producción
npm run build

# Preview - Vista previa del build de producción
npm run preview

# Lint - Revisa el código en busca de errores
npm run lint
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno (Opcional)
Crea un archivo `.env.local` en la raíz del proyecto si necesitas configurar variables:

```env
VITE_API_URL=https://api.hidalgo.gob.mx
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### Extensiones Recomendadas para VS Code
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## 🚀 Despliegue en Producción

### Build para Producción
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

### Servir archivos estáticos
```bash
# Con serve (instalar globalmente: npm install -g serve)
serve -s dist -l 3000

# Con Python
cd dist && python -m http.server 3000

# Con Node.js
npx serve -s dist -l 3000
```

## 🐳 Despliegue con Docker

### Crear Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Crear nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Construir y ejecutar
```bash
# Construir imagen
docker build -t agencia-hidalgo-react .

# Ejecutar contenedor
docker run -p 8080:80 agencia-hidalgo-react
```

## 🔍 Solución de Problemas

### Error: "Module not found"
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 is already in use"
```bash
# Cambiar puerto en vite.config.js
export default defineConfig({
  server: {
    port: 3001
  }
})
```

### Problemas con Tailwind CSS
```bash
# Verificar que PostCSS esté configurado
npm run build

# Si hay errores, reinstalar dependencias de Tailwind
npm install -D tailwindcss postcss autoprefixer
```

## 📱 Testing

### Verificar Responsividad
1. Abrir DevTools (F12)
2. Activar modo dispositivo móvil
3. Probar diferentes resoluciones:
   - Mobile: 375px
   - Tablet: 768px  
   - Desktop: 1024px+

### Verificar Funcionalidades
- ✅ Navegación entre secciones
- ✅ Búsqueda de oficinas
- ✅ Modales de contacto y reporte
- ✅ Tabs de educación digital
- ✅ FAQ accordion
- ✅ Botón LlaveMX
- ✅ Responsive design

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Revisa que Node.js sea versión 18+: `node --version`
2. Verifica que npm funcione: `npm --version`
3. Consulta los logs de error en la consola
4. Revisa que todos los archivos estén en su lugar

## 🎯 Próximos Pasos

Una vez que el proyecto esté funcionando:

1. **Personalizar datos**: Edita `src/data/index.js` con información real
2. **Configurar APIs**: Conecta con servicios reales del gobierno
3. **Optimizar SEO**: Ajusta meta tags en `index.html`
4. **Configurar Analytics**: Agrega Google Analytics o similar
5. **Testing**: Implementa pruebas unitarias con Vitest

¡Listo! Tu plataforma digital está funcionando en React. 🎉
