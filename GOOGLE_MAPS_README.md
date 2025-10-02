# 🗺️ Integración Google Maps APIs

Documentación de las funcionalidades avanzadas de mapas en el Portal Ciudadano.

---

## 📋 **APIs Implementadas**

### **1. Distance Matrix API** ⭐
Calcula distancias y tiempos **REALES** de viaje entre el usuario y las oficinas.

**Ventajas:**
- ✅ Distancias por carretera (no en línea recta)
- ✅ Tiempo estimado de viaje en carro
- ✅ Considera rutas reales y tráfico
- ✅ Más preciso para planificar visitas

**Uso:**
```javascript
import { calcularDistanciasReales } from './services/googleMapsService'

const resultados = await calcularDistanciasReales(
  { lat: 20.1219, lng: -98.7324 }, // Origen (usuario)
  [
    { lat: 20.1119, lng: -98.7424 }, // Destino 1
    { lat: 20.1319, lng: -98.7224 }  // Destino 2
  ]
)

// Retorna:
// [
//   {
//     destino: {lat, lng},
//     distancia: 5.2,          // km
//     distanciaTexto: "5.2 km",
//     duracion: 12,            // minutos
//     duracionTexto: "12 min"
//   },
//   ...
// ]
```

---

### **2. Directions API** ⭐
Obtiene rutas detalladas para dibujar en el mapa Leaflet.

**Ventajas:**
- ✅ Dibuja la ruta exacta en el mapa
- ✅ Muestra paso a paso las indicaciones
- ✅ Calcula distancia y tiempo total
- ✅ Visualización intuitiva para el usuario

**Uso:**
```javascript
import { obtenerRuta } from './services/googleMapsService'

const ruta = await obtenerRuta(
  { lat: 20.1219, lng: -98.7324 }, // Origen
  { lat: 20.1119, lng: -98.7424 }  // Destino
)

// Retorna:
// {
//   polyline: [{lat, lng}, ...],  // Coordenadas de la ruta
//   distancia: 5.2,               // km
//   distanciaTexto: "5.2 km",
//   duracion: 12,                 // minutos
//   duracionTexto: "12 min",
//   pasos: [
//     {
//       instruccion: "Gira a la derecha en...",
//       distancia: "200 m",
//       duracion: "1 min"
//     },
//     ...
//   ]
// }
```

---

### **3. Street View (Ya existía)**
Muestra vista de calle de la oficina en popups del mapa.

---

## 🎯 **Funcionalidades en LocationsSection**

### **Distancias Inteligentes:**
1. **Con API Key configurada**: Usa Distance Matrix (distancias reales)
2. **Sin API Key**: Fallback a Haversine (línea recta)

**Indicadores visuales:**
- `15.2 km (18 min)` = Distancia real por carretera
- `15.2 km (línea recta)` = Fallback sin API

### **Visualización de Rutas:**
1. Usuario hace búsqueda
2. Click en una oficina
3. Click en "Ver Ruta en el Mapa"
4. ✨ Se dibuja la ruta en color institucional (#9F2241)
5. Popup muestra distancia y tiempo
6. Click en "Limpiar Ruta" para borrarla

---

## 🔑 **Configuración**

### **1. Obtener API Key de Google:**

1. Ve a: https://console.cloud.google.com/google/maps-apis
2. Crea un proyecto o selecciona uno existente
3. Habilita estas APIs:
   - ✅ **Maps Embed API** (para Street View)
   - ✅ **Distance Matrix API** (para distancias reales)
   - ✅ **Directions API** (para rutas)
4. Ve a "Credenciales" y crea una API Key
5. **Restricciones recomendadas:**
   - Restricción de aplicación: HTTP referrers
   - Agrega tu dominio: `srv885729.hstgr.cloud/*`
   - Restricción de API: Solo las 3 APIs mencionadas

### **2. Configurar en el Proyecto:**

**Desarrollo (.env):**
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy....tu-key-aqui
```

**Producción (Hostinger):**
```bash
# En el servidor, crea .env:
nano /home/tu-usuario/public_html/.env

# Agrega:
VITE_GOOGLE_MAPS_API_KEY=AIzaSy....tu-key-aqui
```

---

## 💰 **Costos (Precios Google Maps 2024)**

| API | Primeras 200 USD | Después de $200 |
|-----|------------------|----------------|
| **Maps Embed** | Gratis ilimitado | Gratis ✅ |
| **Distance Matrix** | $5 por 1000 llamadas | $5 por 1000 |
| **Directions** | $5 por 1000 llamadas | $5 por 1000 |

### **Crédito Mensual:**
- Google da **$200 USD gratis cada mes**
- Con $200 puedes hacer:
  - **40,000 cálculos de Distance Matrix**
  - **40,000 rutas con Directions**
  - **Ilimitado Street View**

### **Ejemplo con 1000 visitantes/mes:**
- Distance Matrix: 1000 búsquedas × $5/1000 = **$5 USD**
- Directions: 100 rutas × $5/1000 = **$0.50 USD**
- **Total: $5.50 USD/mes** (dentro del crédito gratuito)

---

## 🚀 **Uso en la Aplicación**

### **Búsqueda de Trámites:**

1. Usuario busca: "licencia de conducir"
2. Sistema obtiene ubicación del usuario
3. **Distance Matrix calcula distancias reales** a todas las oficinas
4. Resultados ordenados por cercanía
5. Muestra: "5.2 km (12 min)" en cada oficina

### **Visualización de Ruta:**

1. Usuario selecciona una oficina
2. Click en "Ver Ruta en el Mapa"
3. **Directions API obtiene la ruta**
4. Se dibuja en el mapa con Leaflet (polyline)
5. Popup muestra: "Distancia: 5.2 km, Tiempo: 12 min"
6. Usuario puede limpiar la ruta

---

## 📊 **Comparación: Antes vs Ahora**

### **ANTES (Sin Google Maps APIs):**
```
Usuario busca "licencia de conducir"
↓
Sistema calcula línea recta (Haversine)
↓
Muestra: "5.2 km" (poco preciso)
↓
Usuario no sabe cuánto tardará
```

### **AHORA (Con Google Maps APIs):**
```
Usuario busca "licencia de conducir"
↓
Distance Matrix calcula distancia real
↓
Muestra: "7.8 km (15 min)" (preciso)
↓
Usuario puede ver la ruta en el mapa
↓
Sabe exactamente cómo llegar
```

---

## 🔧 **Archivos Modificados**

```
src/
├── services/
│   ├── googleMapsService.js      ← NUEVO: Funciones de Google Maps
│   └── busquedaTramites.js       (sin cambios)
├── components/
│   └── LocationsSection.jsx      ← ACTUALIZADO: Integración APIs
└── .env                          ← AGREGAR: API Key
```

---

## 🐛 **Troubleshooting**

### **Problema: "No se calculan distancias reales"**
```bash
# Verificar que la API Key esté configurada:
1. Revisar archivo .env
2. Reiniciar servidor: npm run dev
3. Verificar en consola: "📍 Calculando distancias reales..."
```

### **Problema: "Distance Matrix API error"**
```bash
# Verificar:
1. API Key habilitada en Google Console
2. Distance Matrix API activada
3. No excediste el límite de cuota
4. Restricciones de dominio correctas
```

### **Problema: "No se dibuja la ruta"**
```bash
# Verificar:
1. Directions API habilitada
2. Usuario tiene ubicación activada
3. Oficina tiene coordenadas válidas
4. Revisa la consola del navegador (F12)
```

---

## 📝 **Notas Importantes**

1. **Fallback Automático**: Si Google Maps falla, usa Haversine (línea recta)
2. **Sin API Key**: Funciona con distancias aproximadas
3. **Límite de APIs**: Máximo 25 destinos por llamada a Distance Matrix
4. **Caché**: Considera implementar caché para reducir llamadas
5. **Optimización**: Las distancias se calculan solo cuando el usuario busca

---

## 🎉 **Beneficios para el Usuario**

✅ **Distancias más precisas** (por carretera vs línea recta)  
✅ **Tiempo estimado de viaje** (sabe cuánto tardará)  
✅ **Visualización de ruta** (ve el camino exacto)  
✅ **Mejor experiencia** (información más útil)  
✅ **Planificación efectiva** (puede elegir mejor oficina)

---

## 📞 **Soporte**

Si encuentras problemas o tienes preguntas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs: "🔍", "📍", "✅", "❌"
3. Asegúrate que la API Key esté configurada correctamente
4. Revisa los límites de cuota en Google Console

---

**¡Disfruta de las nuevas funcionalidades! 🚀**
