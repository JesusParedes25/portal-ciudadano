# Agencia de Simplificación y Digitalización - Estado de Hidalgo (React)

Plataforma Digital React de la Agencia de Simplificación y Digitalización del Estado de Hidalgo.

## 🚀 Tecnologías

- **React 19.1.0** - Framework de JavaScript
- **Vite** - Build tool y servidor de desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **DaisyUI** - Componentes de UI para Tailwind
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografías (Montserrat, Inter)

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

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd agencia-react

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

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

1. **Header** - Navegación y botón LlaveMX
2. **Hero Section** - Presentación con video del secretario
3. **About Section** - Misión, Visión y Equipo
4. **Estrategia Digital** - 4 pilares estratégicos
5. **Panel de Avances** - Métricas 2025 y timeline 2022-2026
6. **Plataformas Oficiales** - 6 micrositios + LlaveMX
7. **Ubicaciones** - Búsqueda de oficinas con mapa
8. **Educación Digital** - Blog, Guías y FAQ
9. **Participación** - Formularios de contacto y reportes
10. **Noticias** - Comunicados y actualizaciones
11. **Footer** - Enlaces y información de contacto

## ⚡ Funcionalidades

- **Responsive Design** - Optimizado para todos los dispositivos
- **Búsqueda de Oficinas** - Sistema de búsqueda por tipo de trámite
- **Sistema de Modales** - Para formularios de participación
- **Tabs Interactivos** - En la sección de educación
- **FAQ Accordion** - Preguntas frecuentes expandibles
- **Timeline Animado** - Logros desde 2022 hasta 2026
- **Smooth Scrolling** - Navegación suave entre secciones
- **Animaciones** - Efectos de entrada con IntersectionObserver

## 🎯 Características Técnicas

- **Componentes Modulares** - Arquitectura escalable
- **Hooks Personalizados** - Para manejo de estado
- **Context API** - Para modales globales
- **CSS Custom Properties** - Colores institucionales
- **Accesibilidad** - Navegación por teclado y ARIA labels
- **SEO Optimizado** - Meta tags y estructura semántica

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Con Docker (Opcional)
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📄 Licencia

© 2025 Gobierno del Estado de Hidalgo. Todos los derechos reservados.

## 🤝 Contribución

Este proyecto mantiene la funcionalidad exacta del proyecto original HTML/CSS/JS, convertido a React con las mejores prácticas modernas.

## 📞 Contacto

- **Email**: contacto@agenciadigital.hidalgo.gob.mx
- **Teléfono**: (771) 123-4567
- **Ubicación**: Pachuca de Soto, Hidalgo
