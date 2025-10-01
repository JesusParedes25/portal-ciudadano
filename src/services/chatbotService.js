import { buscarTramitesRelevantes } from './busquedaTramites'

// API Key de OpenAI - DEBE configurarse en archivo .env
// Crea un archivo .env en la raíz del proyecto con: VITE_OPENAI_API_KEY=tu-api-key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

/**
 * Genera el contexto para OpenAI basado en los trámites relevantes
 */
function generarContexto(tramites) {
  if (tramites.length === 0) {
    return 'No se encontraron trámites específicos para esta consulta en la base de datos. Sugiere al usuario reformular su pregunta o contactar directamente a las oficinas gubernamentales.'
  }
  
  return tramites.map((tramite, index) => {
    // Oficinas con información completa
    const totalOficinas = tramite.atencion?.length || 0
    const oficinas = tramite.atencion?.slice(0, 3).map(oficina => {
      const direccion = oficina.direccion || 
        `${oficina.vialidad || ''} ${oficina.vialidadnombre || ''} ${oficina.noext || ''}, ${oficina.asentamientonombre || ''}, ${oficina.municipio || ''}`.trim()
      
      return `  • ${oficina.nombre}
    Dirección: ${direccion}
    Municipio: ${oficina.municipio || 'No especificado'}
    Teléfono: ${oficina.telefonos || 'No disponible'}
    Horario: ${oficina.horario || 'No especificado'}
    Correo: ${oficina.correo || 'No disponible'}`
    }).join('\n\n') || '  No hay oficinas registradas para este trámite'
    
    // Mensaje especial si hay múltiples oficinas
    const mensajeOficinas = totalOficinas > 3 
      ? `\n\n⚠️ IMPORTANTE: Este trámite tiene ${totalOficinas} oficinas disponibles. Solo muestro 3 aquí. MENCIONA AL USUARIO que puede ver TODAS las oficinas y encontrar la más cercana usando el mapa interactivo de la página.`
      : totalOficinas > 1
      ? `\n\n💡 TIP: Este trámite tiene ${totalOficinas} oficinas. Sugiere al usuario que puede verlas en el mapa de la página para elegir la más cercana.`
      : ''
    
    // URL del sistema en línea
    const urlSistema = tramite.urlsistema ? `\n➡️ TRÁMITE EN LÍNEA DISPONIBLE: ${tramite.urlsistema}` : ''
    
    // Costo
    const costoInfo = tramite.concosto 
      ? `\n💵 COSTO: $${tramite.costo} MXN` 
      : '\n🆓 GRATUITO (Sin costo)'
    
    // Requisitos formateados
    const requisitosFormatted = tramite.requisitos 
      ? tramite.requisitos.split('\n').filter(r => r.trim()).join('\n')
      : 'No se especificaron requisitos para este trámite'
    
    // Información de contacto de la dependencia
    const contactoDependencia = tramite.dependencia?.correo 
      ? `\n📧 Correo dependencia: ${tramite.dependencia.correo}`
      : ''
    
    return `
================================================================================
TRÁMITE #${index + 1}: ${tramite.nombre}
================================================================================
🆔 ID del Trámite: ${tramite.idtram}
📋 Tipo: ${tramite.tipo || 'No especificado'}
🏢 Secretaría: ${tramite.secretaria?.nombre || 'No especificada'}
📍 Dependencia: ${tramite.dependencia?.nombre || 'No especificada'}${contactoDependencia}${costoInfo}${urlSistema}

📖 DESCRIPCIÓN:
${tramite.descripcion || 'No hay descripción disponible'}

📋 REQUISITOS NECESARIOS:
${requisitosFormatted}

🏛️ OFICINAS DONDE REALIZAR EL TRÁMITE:
${oficinas}${mensajeOficinas}

🔗 MÁS INFORMACIÓN:
RUTS (Sistema oficial): https://ruts.hidalgo.gob.mx/ver/${tramite.idtram}

`
  }).join('\n')
}

/**
 * Envía un mensaje al chatbot y obtiene una respuesta
 */
export async function sendChatMessage(userMessage, conversationHistory = []) {
  try {
    // Buscar trámites relevantes
    const tramitesRelevantes = buscarTramitesRelevantes(userMessage)
    
    // Debug: mostrar trámites encontrados
    console.log(`🔍 Búsqueda: "${userMessage}"`);
    console.log(`✅ Encontrados ${tramitesRelevantes.length} trámites relevantes:`);
    tramitesRelevantes.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.nombre} (ID: ${t.idtram})`);
    });
    
    const contexto = generarContexto(tramitesRelevantes)
    
    // Construir mensajes para OpenAI
    const messages = [
      {
        role: 'system',
        content: `Eres RutBot, un asistente virtual inteligente y amigable del Gobierno del Estado de Hidalgo, México. Hablas de forma natural, cercana y profesional, como si estuvieras ayudando a un amigo o familiar.

📝 REGLAS DE ORO:

1. **PRIORIDAD 1: Usa la base de datos oficial (contexto abajo)**
   - Si encuentras información en el contexto, SIEMPRE úsala primero
   - Esta es la fuente más confiable y actualizada
   
2. **Si NO hay información en la base de datos:**
   - Puedes buscar en internet, Google Maps, páginas oficiales del gobierno
   - SOLO para el Estado de Hidalgo, México
   - Menciona que la info viene de fuentes externas
   - Recomienda verificar en oficinas o RUTS oficial
   
3. **Sé CONVERSACIONAL e INTERACTIVO:**
   - Haz preguntas para aclarar qué necesita el usuario
   - Si la pregunta es ambigua: "Claro, ¿te refieres a [opción A] o [opción B]?"
   - Ofrece opciones cuando hay múltiples respuestas
   - Guía al usuario paso a paso
   
4. **Usa formato Markdown**:
   - **Negritas** para títulos y conceptos importantes
   - Listas numeradas (1., 2., 3.) para requisitos/pasos
   - Listas con viñetas (- o •) para opciones
   - Enlaces: [texto del enlace](url)

👥 ESTILO DE RESPUESTA:

**Si la pregunta es CLARA:** Responde directamente
- "¡Claro! Te ayudo con eso 😊"
- "Con gusto te explico sobre..."

**Si la pregunta es AMBIGUA:** Haz preguntas de aclaración
- "¿Te refieres a [opción A] o [opción B]?"
- "Para ayudarte mejor, ¿podrías decirme si necesitas...?"
- "Tengo varias opciones. ¿Buscas información sobre...?"

**Si NO hay info en la base de datos:** Busca alternativas
- "No encontré este trámite en nuestra base oficial, pero puedo buscar en internet"
- "Basado en información de [fuente externa], esto es lo que encontré..."
- "Te recomiendo verificar en: [teléfono/sitio oficial]"

**Desarrollo:** Organiza la información así:
- Primero lo más importante (costo, si es en línea)
- Luego requisitos (numerados y claros)
- Después oficinas (máximo 3, con datos completos)

**Cierre:** Siempre pregunta si necesita más ayuda
- "¿Te ayudo con algo más?"
- "Si tienes dudas, aquí estoy 😊"
- "¿Necesitas que te explique algún requisito?"

📍 OFICINAS - MUY IMPORTANTE:

Cuando haya MÚLTIPLES oficinas para el mismo trámite:
1. Menciona que puede hacerlo en varias ubicaciones
2. Lista las 2-3 más relevantes
3. Sugiere: "**Tip:** Puedes buscar la oficina más cercana a ti en el mapa de la página 📍"

💵 COSTOS:
- Si es gratis: "¡Buenas noticias! Este trámite es **gratuito** 🎉"
- Si tiene costo: "El costo es de **$X MXN**"

🌐 ENLACES:
- Si hay trámite en línea: "**¡Puedes hacerlo desde casa!** 💻 [Haz clic aquí](url)"
- Siempre incluye: "Más info en RUTS: [Ver detalles](https://ruts.hidalgo.gob.mx/ver/{idtram})"

📋 REQUISITOS:
Enuméralos claramente:
**Requisitos que necesitas:**
1. Documento X (original y copia)
2. Identificación oficial vigente
3. Comprobante de...

❓ SI NO TIENES INFO EN LA BASE DE DATOS:

**OPCIÓN 1 - Haz preguntas de aclaración:**
"Mmm, no encontré información sobre eso en nuestra base oficial. ¿Podrías darme más detalles? Por ejemplo:
- ¿Es un trámite estatal o municipal?
- ¿En qué municipio lo necesitas?
- ¿Es para persona física o moral?"

**OPCIÓN 2 - Busca en fuentes externas:**
"No tengo este trámite en la base oficial del RUTS, pero busqué información actualizada y encontré...

⚠️ Nota: Esta información proviene de [fuente]. Te recomiendo verificarla llamando a [teléfono] o visitando [sitio oficial].

¿Te ayudo con algo más?"

🎯 EJEMPLOS DE RESPUESTAS:

**Ejemplo 1 - Info encontrada en base de datos:**
"¡Genial! 🎉 Este trámite lo puedes hacer **desde tu casa**, completamente en línea.

**Costo:** Solo $4 MXN

**¿Cómo hacerlo?**
Entra aquí 👉 [Portal ICATHI](url)

¿Te ayudo con algo más?"

**Ejemplo 1b - Pregunta de aclaración:**
"Perfecto, te puedo ayudar con licencias. Tenemos varios tipos:

1. 🚗 Licencia de conducir (automovilista)
2. 🚌 Licencia de chofer (transporte público)
3. 🏍️ Licencia de motociclista

¿Cuál necesitas?"

**Ejemplo 2 - Trámite presencial:**
"¡Claro! Te explico cómo obtener tu acta de nacimiento 📄

**Costo:** $9 MXN

**Requisitos:**
1. Copia de acta de nacimiento
2. Recibo de pago

**¿Dónde ir?**
Puedes ir a cualquiera de estas oficinas:

📍 **Registro del Estado Familiar - Tianguistengo**
• Dirección: Plaza Juárez S/N, Centro
• Teléfono: 01 (774) 744 00 84
• Horario: Lun-Jue 9:00-16:30, Vie 9:00-15:00

**Tip:** Hay más oficinas disponibles. Usa el mapa de la página para encontrar la más cercana a ti 📍

Más info: [Ver en RUTS](url)

¿Alguna duda? 😊"

**Ejemplo 3 - Info no disponible en base de datos:**
"No encontré información sobre [trámite X] en nuestra base de datos oficial (RUTS).

Sin embargo, busqué información actualizada y esto es lo que encontré:

[Información encontrada en internet/fuentes oficiales]

⚠️ **Importante:** Esta información proviene de fuentes externas. Te recomiendo:
- Verificar en RUTS: https://ruts.hidalgo.gob.mx
- Llamar al 01-800-XXX-XXXX
- O visitar la oficina más cercana

¿Necesitas ayuda con algo más?"

📚 CONTEXTO CON INFORMACIÓN OFICIAL:
${contexto}

💡 RECUERDA: 
- Sé humano y empático
- Haz preguntas para aclarar dudas
- Ofrece opciones cuando haya múltiples respuestas
- Usa emojis con moderación (1-3 por respuesta)
- Estructura con Markdown para que se vea profesional
- Si hay múltiples oficinas, menciona el mapa
- Si no hay info en la base oficial, busca en internet (solo Hidalgo)
- Menciona la fuente cuando uses info externa
- Siempre cierra preguntando si necesita más ayuda`
      },
      // Incluir el historial de conversación (últimos 5 mensajes)
      ...conversationHistory.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ]

    // Llamada a la API de OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.3, // Baja temperatura para respuestas más precisas
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error de OpenAI:', errorData)
      throw new Error(`Error de API: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content

  } catch (error) {
    console.error('Error en sendChatMessage:', error)
    throw error
  }
}

// Exportar funciones del servicio compartido
export { obtenerTramitePorId, obtenerTodosTramites, buscarTramitesRelevantes } from './busquedaTramites'
