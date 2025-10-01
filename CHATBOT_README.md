# 🤖 Chatbot de Asistencia Virtual - Gobierno de Hidalgo

## Descripción
Chatbot inteligente que proporciona información en tiempo real sobre trámites y servicios gubernamentales del Estado de Hidalgo, **basándose únicamente en datos oficiales** del archivo `ruts.tramites_sept.json`.

## ✨ Características

### 🎯 Funcionalidades Principales
- **Búsqueda inteligente de trámites** por palabras clave
- **Información precisa de requisitos** sin inventar datos
- **Recomendación de oficinas** con ubicaciones, horarios y teléfonos
- **Enlaces directos a RUTS** para ver detalles completos
- **Enlaces a trámites en línea** cuando están disponibles
- **Respuestas contextuales** basadas en la conversación

### 🛡️ Seguridad de la Información
- ✅ **NO inventa información**: Solo usa datos del JSON
- ✅ **Temperatura baja (0.3)**: Respuestas más precisas y menos creativas
- ✅ **Contexto limitado**: Solo envía trámites relevantes a la consulta
- ✅ **Validación de datos**: Verifica existencia antes de proporcionar información

## 📁 Estructura de Archivos

```
agencia-react/
├── src/
│   ├── components/
│   │   └── Chatbot.jsx          # Componente UI del chatbot
│   ├── services/
│   │   └── chatbotService.js    # Lógica de búsqueda y API OpenAI
│   └── tramites/
│       └── ruts.tramites_sept.json  # Base de datos de trámites
├── .env.example                  # Ejemplo de configuración
└── CHATBOT_README.md            # Este archivo
```

## 🚀 Instalación y Configuración

### 1. Configurar API Key de OpenAI

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_OPENAI_API_KEY=tu-api-key-de-openai
```

**Nota de Seguridad**: La API key está temporalmente en el código para desarrollo. En producción, **SIEMPRE** usa variables de entorno.

### 2. No se requiere instalación adicional
El chatbot usa la API de OpenAI directamente desde el navegador. No necesitas instalar paquetes adicionales.

## 💡 Uso

### Para Usuarios
1. Haz clic en el **botón flotante** en la esquina inferior derecha
2. Escribe tu pregunta sobre trámites
3. O selecciona una **pregunta rápida**
4. Recibe información oficial instantánea

### Ejemplos de Preguntas
- "¿Qué requisitos necesito para contratar agua potable?"
- "¿Dónde puedo tramitar mi licencia de conducir?"
- "Buscar oficinas cerca de Pachuca"
- "¿Qué trámites puedo hacer en línea?"
- "Información sobre actas de nacimiento"

## 🔧 Funcionamiento Técnico

### 1. Búsqueda de Trámites Relevantes
```javascript
buscarTramitesRelevantes(consulta)
```
- Analiza palabras clave en la consulta
- Busca en nombre, descripción y secretaría del trámite
- Retorna máximo 5 trámites más relevantes

### 2. Generación de Contexto
```javascript
generarContexto(tramites)
```
- Extrae información completa de cada trámite
- Incluye: nombre, descripción, requisitos, oficinas, costos, enlaces
- Formatea para consumo de OpenAI

### 3. Llamada a OpenAI API
```javascript
sendChatMessage(userMessage, conversationHistory)
```
- Modelo: `gpt-4o-mini` (rápido y económico)
- Temperatura: `0.3` (respuestas precisas)
- Máximo tokens: `1000`
- Incluye historial de conversación (últimos 5 mensajes)

### 4. Sistema de Prompts
El prompt del sistema establece reglas estrictas:
- ✅ Solo usar información del contexto proporcionado
- ✅ No inventar datos, requisitos, direcciones o costos
- ✅ Proporcionar enlaces cuando estén disponibles
- ✅ Enumerar requisitos de forma clara
- ✅ Reconocer cuando no tiene información

## 🎨 Diseño UI

### Colores Institucionales
- **Primary**: `#9F2241` (Vino)
- **Secondary**: `#235B4E` (Verde)
- **Accent**: `#DDC9A3` (Dorado)

### Componentes
- Botón flotante con icono de chat
- Ventana modal responsive (600px altura)
- Header con información del asistente
- Área de mensajes con scroll automático
- Preguntas rápidas al inicio
- Indicador de "escribiendo..." mientras procesa
- Input con envío por Enter o botón

### Responsive
- ✅ Desktop: Ventana completa en esquina inferior derecha
- ✅ Móvil: Adaptado para pantallas pequeñas
- ✅ Accesible: Etiquetas ARIA y navegación por teclado

## 📊 Datos Utilizados

### Estructura de Trámite
```json
{
  "idtram": 335,
  "nombre": "Nombre del trámite",
  "descripcion": "Descripción",
  "concosto": true,
  "costo": "103.74",
  "requisitos": "Lista de requisitos...",
  "urlsistema": "http://ventanillaunica...",
  "tipo": "Trámite",
  "secretaria": {
    "nombre": "Secretaría...",
    "siglas": "SIPDUS"
  },
  "dependencia": {
    "nombre": "Dependencia..."
  },
  "atencion": [{
    "nombre": "Oficina...",
    "direccion": "Dirección...",
    "horario": "Lunes a Viernes...",
    "telefonos": "771...",
    "coordenadas": {...}
  }]
}
```

## 🔐 Seguridad

### Variables de Entorno (Producción)
```bash
# En tu servidor/plataforma de hosting
VITE_OPENAI_API_KEY=sk-proj-xxxxx

# O usando secretos de GitHub Actions
secrets.OPENAI_API_KEY
```

### .gitignore
Asegúrate de incluir:
```
.env
.env.local
.env.production
```

## 🚨 Solución de Problemas

### Error: "API Key inválida"
- Verifica que la API key sea correcta
- Asegúrate de que tenga créditos en OpenAI
- Revisa que esté configurada en `.env`

### Error: "No se encontraron trámites"
- Verifica que `ruts.tramites_sept.json` esté en la ruta correcta
- Asegúrate de que el JSON tenga el formato correcto
- Revisa la consola del navegador para errores

### El chatbot no responde
- Abre la consola del navegador (F12)
- Revisa errores de red o CORS
- Verifica que tengas conexión a internet
- Confirma que la API key tenga cuota disponible

## 📈 Mejoras Futuras

### Corto Plazo
- [ ] Persistencia de conversaciones en localStorage
- [ ] Búsqueda por ubicación geográfica
- [ ] Soporte para archivos adjuntos
- [ ] Calificación de respuestas

### Mediano Plazo
- [ ] Integración con base de datos en tiempo real
- [ ] Notificaciones de actualizaciones de trámites
- [ ] Modo de voz (speech-to-text)
- [ ] Múltiples idiomas (español, náhuatl, otomí)

### Largo Plazo
- [ ] Chatbot híbrido (AI + humano)
- [ ] Analytics de consultas más frecuentes
- [ ] Recomendaciones personalizadas
- [ ] Integración con WhatsApp/Telegram

## 📝 Licencia
Desarrollado para el Gobierno del Estado de Hidalgo - Agencia de Simplificación y Digitalización

## 👥 Soporte
Para soporte técnico, contacta al equipo de desarrollo de la Agencia.

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
