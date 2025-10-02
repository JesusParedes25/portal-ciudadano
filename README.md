# Portal Ciudadano - Agencia de Digitalización del Estado de Hidalgo

Plataforma Digital Inteligente con **Chatbot IA**, **Búsqueda de Trámites**, y **Mapas Interactivos**.

## ✨ Características Principales

- 🤖 **Chatbot Inteligente** - RutBot con OpenAI GPT-4o-mini
- 🗺️ **Búsqueda Geolocalizada** - 2,863 trámites con mapas interactivos
- 📍 **Street View Integrado** - Vista de oficinas gubernamentales
- 🔍 **Búsqueda Inteligente** - Algoritmo de relevancia avanzado
- 📱 **100% Responsive** - Optimizado para todos los dispositivos

## 🚀 Tecnologías

- **React 19.1.0** - Framework de JavaScript
- **Vite 5.0** - Build tool ultra-rápido
- **OpenAI GPT-4o-mini** - Inteligencia Artificial conversacional
- **Leaflet** - Mapas interactivos OpenStreetMap
- **Tailwind CSS + DaisyUI** - Framework de diseño moderno
- **Google Maps API** - Street View y geolocalización

## 🎨 Colores Institucionales

- **Primary**: `#9F2241` (Pantone 7420 C)
- **Secondary**: `#235B4E` (Pantone 626 C)
- **Accent**: `#DDC9A3` (Pantone 468 C)
- **Neutral**: `#98989A` (Pantone Cool Gray 7 C)

## 📁 Estructura del Proyecto

```
agencia-react/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── ContactForm.jsx
│   │   │   └── ReportForm.jsx
│   │   ├── AboutSection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── LocationsSection.jsx
│   │   ├── Modal.jsx
│   │   ├── NewsSection.jsx
│   │   ├── ParticipationSection.jsx
│   │   ├── PlatformsSection.jsx
│   │   ├── ProgressSection.jsx
│   │   ├── StrategySection.jsx
│   │   └── SuccessMessage.jsx
│   ├── data/
│   │   └── index.js
│   ├── hooks/
│   │   └── useModal.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- API Keys (OpenAI y Google Maps)

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd agencia-react

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
copy .env.example .env

# 4. Editar .env y agregar tus API keys:
# VITE_OPENAI_API_KEY=tu-key-aqui
# VITE_GOOGLE_MAPS_API_KEY=tu-key-aqui

# 5. Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en: `http://localhost:3000`

### Scripts Disponibles
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 📋 Secciones de la Plataforma

1. **🤖 Chatbot RutBot** - Asistente IA para consultas de trámites
2. **Header** - Navegación y botón LlaveMX
3. **Hero Section** - Presentación con video del secretario
4. **About Section** - Misión, Visión y Equipo
5. **Estrategia Digital** - 4 pilares estratégicos
6. **Panel de Avances** - Métricas 2025 y timeline 2022-2026
7. **Plataformas Oficiales** - 6 micrositios + LlaveMX
8. **🗺️ Mapa Interactivo** - Búsqueda geolocalizada + Street View (2,863 trámites)
9. **Educación Digital** - Blog, Guías y FAQ
10. **Participación** - Formularios de contacto y reportes
11. **Noticias** - Comunicados y actualizaciones
12. **Footer** - Enlaces y información de contacto

## ⚡ Funcionalidades Destacadas

### 🤖 Chatbot Inteligente (RutBot)
- Conversaciones naturales con IA (GPT-4o-mini)
- Búsqueda de 2,863 trámites en tiempo real
- Respuestas precisas con requisitos, costos y ubicaciones
- Historial contextual (5 mensajes)
- Integrado con sistema de mapas

### 🗺️ Sistema de Mapas Avanzado
- **Búsqueda Inteligente:** Algoritmo de relevancia con puntuación
- **Autocompletado:** Sugerencias en tiempo real (mínimo 2 caracteres)
- **Geolocalización:** Encuentra oficinas cercanas a tu ubicación
- **Street View:** Vista 360° de cada oficina
- **Distancias:** Cálculo automático desde tu ubicación
- **Filtros:** Por tipo de trámite, municipio, dependencia

### 🎨 Diseño e Interacción
- **Responsive Design** - Móvil, tablet, desktop
- **Sistema de Modales** - Formularios y confirmaciones
- **Tabs Interactivos** - Navegación intuitiva
- **FAQ Accordion** - Preguntas frecuentes expandibles
- **Timeline Animado** - Logros 2022-2026
- **Smooth Scrolling** - Navegación fluida
- **Animaciones** - IntersectionObserver API

## 🎯 Características Técnicas

- **Componentes Modulares** - Arquitectura escalable
- **Hooks Personalizados** - Para manejo de estado
- **Context API** - Para modales globales
- **CSS Custom Properties** - Colores institucionales
- **Accesibilidad** - Navegación por teclado y ARIA labels
- **SEO Optimizado** - Meta tags y estructura semántica

## 🚀 Despliegue a Producción

### Guía Rápida (5 minutos)

```bash
# 1. Configurar API Keys para producción
copy .env.production.example .env.production
# Edita .env.production con tus keys reales

# 2. Crear build
npm run build
# o usa el script automatizado:
deploy.bat  # Windows
bash deploy.sh  # Linux/Mac

# 3. Subir al servidor
# Via FTP: Sube todo el contenido de dist/ + .htaccess
# Via SSH: Ejecuta bash deploy.sh (automatizado)
```

### 📚 Documentación Completa

- **📖 [DESPLIEGUE_RAPIDO.md](DESPLIEGUE_RAPIDO.md)** - Guía en 5 minutos
- **📖 [DEPLOY.md](DEPLOY.md)** - Guía detallada paso a paso
- **🔐 Seguridad:** Configura restricciones de API en las consolas

### 🔒 Configuración de Seguridad (IMPORTANTE)

#### Google Maps API
1. https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Application restrictions: **HTTP referrers**
4. Agrega tu dominio: `tudominio.com/*`

#### OpenAI API
1. https://platform.openai.com/account/limits
2. Configura límites: **$5-$10 USD/mes**
3. Habilita alertas por email

### 🖥️ Servidor Recomendado
- **OS:** Rocky Linux 9 / Ubuntu 20+
- **Web Server:** Apache 2.4+ con mod_rewrite
- **Node.js:** 18+ (para build local)
- **RAM:** Mínimo 1GB
- **Disco:** Mínimo 5GB

## 📊 Datos del Sistema

- **Total de Trámites:** 2,863
- **Oficinas Registradas:** 500+
- **Municipios Cubiertos:** 84 (todo Hidalgo)
- **Dependencias:** 50+
- **Fuente de Datos:** RUTS (Registro Único de Trámites y Servicios)

## 📚 Documentación Adicional

- **[CHATBOT_README.md](CHATBOT_README.md)** - Documentación técnica del chatbot
- **[GUIA_PRUEBAS_CHATBOT.md](GUIA_PRUEBAS_CHATBOT.md)** - Casos de prueba
- **[GOOGLE_MAPS_README.md](GOOGLE_MAPS_README.md)** - Configuración de mapas
- **[INSTALACION.md](INSTALACION.md)** - Guía de instalación detallada

## 🐛 Solución de Problemas

### Chatbot no responde
- Verifica API Key de OpenAI en `.env`
- Verifica límites de gasto en OpenAI
- Revisa consola del navegador (F12)

### Mapa no carga
- Verifica API Key de Google Maps
- Verifica que las APIs estén habilitadas en Google Cloud
- Revisa restricciones de dominio

### Build falla
- Verifica que `.env.production` existe y tiene las keys
- Ejecuta `npm install` para asegurar dependencias
- Revisa errores en la terminal

## 📄 Licencia

© 2025 Gobierno del Estado de Hidalgo. Todos los derechos reservados.

## 🤝 Contribución

Proyecto desarrollado con React y las mejores prácticas modernas de desarrollo web.

**Tecnologías clave:**
- React 19 con Hooks
- OpenAI API (GPT-4o-mini)
- Leaflet + OpenStreetMap
- Tailwind CSS + DaisyUI
- Vite para build optimizado

## 📞 Contacto

- **Web**: https://agenciadigital.hidalgo.gob.mx
- **Email**: contacto@agenciadigital.hidalgo.gob.mx
- **Teléfono**: (771) 123-4567
- **Ubicación**: Pachuca de Soto, Hidalgo

---

**Desarrollado con ❤️ para el Estado de Hidalgo**
