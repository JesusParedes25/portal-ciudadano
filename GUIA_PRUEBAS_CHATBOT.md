# 🧪 Guía de Pruebas del Chatbot

## ✅ Checklist de Instalación

### 1. Verificar Archivos Creados
- [x] `src/components/Chatbot.jsx` - Componente UI
- [x] `src/services/chatbotService.js` - Servicio de OpenAI
- [x] `src/App.jsx` - Integración en app principal
- [x] `.env.example` - Ejemplo de configuración
- [x] `CHATBOT_README.md` - Documentación
- [x] `GUIA_PRUEBAS_CHATBOT.md` - Este archivo

### 2. Iniciar el Proyecto
```bash
cd agencia-react
npm run dev
```

### 3. Abrir en Navegador
Abre `http://localhost:5173` (o el puerto que Vite asigne)

## 🎯 Casos de Prueba

### Prueba 1: Verificar Botón Flotante
**Objetivo**: Confirmar que el chatbot aparece correctamente

**Pasos**:
1. Busca un botón circular rojo en la esquina inferior derecha
2. Debe tener un icono de chat
3. Al pasar el mouse, debe hacer efecto de escala (hover)

**Resultado esperado**: ✅ Botón visible y funcional

---

### Prueba 2: Abrir/Cerrar Chatbot
**Objetivo**: Verificar la interacción básica

**Pasos**:
1. Haz clic en el botón flotante
2. Debe aparecer una ventana de chat
3. Haz clic en el botón X o en el botón flotante nuevamente
4. La ventana debe cerrarse

**Resultado esperado**: ✅ Ventana se abre y cierra correctamente

---

### Prueba 3: Mensaje de Bienvenida
**Objetivo**: Verificar el mensaje inicial

**Resultado esperado**: 
```
¡Hola! Soy tu asistente virtual de la Agencia de Simplificación 
y Digitalización del Estado de Hidalgo. ¿En qué trámite puedo 
ayudarte hoy?
```

---

### Prueba 4: Preguntas Rápidas
**Objetivo**: Probar preguntas predefinidas

**Pasos**:
1. Abre el chatbot
2. Verás 4 botones de preguntas rápidas
3. Haz clic en cualquiera de ellas
4. La pregunta debe aparecer en el input

**Preguntas disponibles**:
- ¿Qué requisitos necesito para contratar agua potable?
- ¿Dónde puedo hacer un trámite de licencia de conducir?
- ¿Qué trámites puedo hacer en línea?
- Buscar oficinas cerca de mí

**Resultado esperado**: ✅ Preguntas se insertan correctamente

---

### Prueba 5: Búsqueda de Trámite Específico
**Objetivo**: Verificar búsqueda y respuesta inteligente

**Consulta de prueba**: 
```
¿Qué necesito para contratar agua potable?
```

**Resultado esperado**: 
- ✅ Lista de requisitos del trámite
- ✅ Información de oficinas de atención
- ✅ Horarios y teléfonos
- ✅ Costo del trámite
- ✅ Enlace a RUTS
- ✅ Enlace al sistema en línea (si disponible)

**Verifica que incluya**:
```
- Requisitos detallados (INE, escrituras, etc.)
- Secretaría: SIPDUS/CAASIM
- Oficinas con direcciones reales
- Enlaces funcionales
```

---

### Prueba 6: Trámite con Enlace en Línea
**Objetivo**: Verificar que proporciona URLs cuando están disponibles

**Consulta de prueba**: 
```
¿Puedo hacer el trámite de agua en línea?
```

**Resultado esperado**: 
- ✅ Menciona disponibilidad en línea
- ✅ Proporciona URL del sistema
- ✅ Proporciona enlace RUTS

---

### Prueba 7: Búsqueda Sin Resultados
**Objetivo**: Verificar comportamiento cuando no hay información

**Consulta de prueba**: 
```
¿Cómo puedo viajar a Marte?
```

**Resultado esperado**: 
```
Lo siento, no tengo información sobre ese tema en mi base de datos.
Puedo ayudarte con trámites y servicios del Gobierno de Hidalgo.
¿Hay algún trámite específico en el que pueda asistirte?
```

---

### Prueba 8: Información de Oficinas
**Objetivo**: Verificar datos de ubicación precisos

**Consulta de prueba**: 
```
¿Dónde están las oficinas de CAASIM?
```

**Resultado esperado**: 
- ✅ Nombre de oficinas reales
- ✅ Direcciones completas
- ✅ Horarios de atención
- ✅ Números de teléfono
- ✅ NO inventa ubicaciones

---

### Prueba 9: Conversación Contextual
**Objetivo**: Verificar que mantiene contexto

**Pasos**:
1. Pregunta: "¿Qué necesito para agua potable?"
2. Respuesta del bot con requisitos
3. Pregunta: "¿Cuánto cuesta?"
4. Debe responder basándose en el trámite anterior

**Resultado esperado**: ✅ Mantiene contexto de conversación

---

### Prueba 10: Enlaces RUTS
**Objetivo**: Verificar enlaces funcionales

**Pasos**:
1. Haz una consulta sobre cualquier trámite
2. Busca el enlace "RUTS" en la respuesta
3. Debe tener formato: `https://www.ruts.hidalgo.gob.mx/ver/{idtram}`

**Resultado esperado**: ✅ Enlaces con formato correcto

---

## 🐛 Pruebas de Errores

### Error 1: Sin API Key
**Simular**: Comentar la API key en el código
**Resultado esperado**: Mensaje de error amigable

### Error 2: API Key Inválida
**Simular**: Usar API key incorrecta
**Resultado esperado**: Mensaje de error sin exponer detalles técnicos

### Error 3: Sin Conexión
**Simular**: Desconectar internet temporalmente
**Resultado esperado**: Error de red manejado correctamente

---

## 📱 Pruebas Responsive

### Desktop (>1024px)
- ✅ Botón en esquina inferior derecha
- ✅ Ventana de 400px de ancho
- ✅ Altura máxima de 600px

### Tablet (768px - 1024px)
- ✅ Chatbot visible y usable
- ✅ No interfiere con otros elementos

### Móvil (<768px)
- ✅ Botón flotante visible
- ✅ Ventana ocupa espacio apropiado
- ✅ Texto legible
- ✅ Input accesible con teclado móvil

---

## ♿ Pruebas de Accesibilidad

### Navegación por Teclado
- [ ] Tab navega entre elementos
- [ ] Enter envía mensaje
- [ ] Escape cierra el chatbot
- [ ] Focus visible en todos los elementos

### Lectores de Pantalla
- [ ] Botón flotante tiene aria-label
- [ ] Mensajes son leídos correctamente
- [ ] Estado de carga es anunciado

---

## 🔒 Pruebas de Seguridad

### 1. No Exponer API Key
- [ ] Revisar código fuente del navegador
- [ ] API key NO debe estar visible en el HTML
- [ ] Usar variables de entorno en producción

### 2. Validación de Entrada
- [ ] Mensajes muy largos son manejados
- [ ] Caracteres especiales no rompen el sistema
- [ ] Inyección de código no es posible

### 3. Datos Sensibles
- [ ] NO almacena información personal
- [ ] Conversaciones son locales al navegador
- [ ] No hay logs de conversaciones en servidor

---

## 📊 Pruebas de Rendimiento

### Velocidad de Respuesta
- Tiempo promedio: 2-5 segundos
- Máximo aceptable: 10 segundos

### Uso de Tokens
- Por mensaje: ~300-800 tokens
- Costo estimado por consulta: $0.001 - $0.003 USD

### Optimizaciones
- ✅ Solo envía trámites relevantes (máximo 5)
- ✅ Limita historial a 5 mensajes
- ✅ Temperatura baja (0.3) reduce variabilidad
- ✅ Max tokens: 1000 (evita respuestas largas)

---

## ✅ Checklist Final

### Funcionalidad
- [ ] Botón flotante visible
- [ ] Ventana se abre/cierra correctamente
- [ ] Mensaje de bienvenida aparece
- [ ] Preguntas rápidas funcionan
- [ ] Búsqueda de trámites precisa
- [ ] Información de requisitos correcta
- [ ] Datos de oficinas reales
- [ ] Enlaces RUTS funcionan
- [ ] Enlaces de sistemas en línea funcionan
- [ ] Manejo de errores apropiado

### Diseño
- [ ] Colores institucionales correctos
- [ ] Tipografía legible
- [ ] Responsive en todos los tamaños
- [ ] Animaciones suaves
- [ ] Scroll automático funciona
- [ ] Loading state visible

### Integración
- [ ] No interfiere con otras secciones
- [ ] Modales siguen funcionando
- [ ] Navegación no afectada
- [ ] Formularios siguen funcionando
- [ ] Mapa de ubicaciones no afectado

### Seguridad
- [ ] Variables de entorno configuradas
- [ ] .gitignore protege .env
- [ ] No expone API keys
- [ ] Datos oficiales verificados

---

## 🎉 Prueba de Aceptación Final

**Escenario Real**:
1. Usuario abre la página
2. Ve el chatbot flotante
3. Hace clic y pregunta: "Necesito contratar agua en Pachuca"
4. Recibe:
   - Lista completa de requisitos
   - 3 oficinas con direcciones reales en Pachuca
   - Horarios de atención
   - Teléfonos de contacto
   - Costo del trámite
   - Enlace a RUTS para más detalles
   - Enlace al sistema en línea
5. Usuario pregunta: "¿Puedo hacerlo en línea?"
6. Bot responde con enlace directo al sistema
7. Usuario satisfecho ✅

---

## 📞 Reporte de Problemas

Si encuentras algún problema:

1. **Captura de pantalla** del error
2. **Descripción** del problema
3. **Pasos** para reproducirlo
4. **Navegador** y versión
5. **Consola** (F12 → Console)

---

**¡Chatbot listo para usar!** 🚀
