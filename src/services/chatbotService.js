import { buscarTramitesRelevantes, obtenerTodosTramites } from './busquedaTramites'

// API Key de OpenAI - DEBE configurarse en archivo .env
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

// Obtener el total de trámites en la base de datos
const TOTAL_TRAMITES = obtenerTodosTramites().length

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
    const tieneUrlSistema = tramite.urlsistema && tramite.urlsistema.trim() !== '' && tramite.urlsistema !== 'No aplica' && tramite.urlsistema !== 'ruts.hidalgo.gob.mx'
    const urlSistema = tieneUrlSistema 
      ? `\n➡️ TRÁMITE EN LÍNEA DISPONIBLE: ${tramite.urlsistema}` 
      : `\n📍 MODALIDAD: Presencial (acude a una oficina)`
    
    // Costo
    const costoInfo = tramite.concosto 
      ? `\n💵 COSTO: $${tramite.costo} MXN` 
      : '\n🆓 GRATUITO (Sin costo)'
    
    // Requisitos formateados
    const requisitosFormatted = tramite.requisitos && tramite.requisitos.trim() !== ''
      ? tramite.requisitos.split('\n').filter(r => r.trim()).join('\n')
      : 'Los requisitos específicos no están detallados en la base de datos. Contacta la oficina para información completa.'
    
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
        content: `Eres RutBot, un asistente virtual amigable del Gobierno del Estado de Hidalgo, México. 

Tu misión es ayudar a ciudadanos con información sobre trámites y servicios del estado.

INFORMACIÓN QUE MANEJAS:
- Tienes acceso a ${TOTAL_TRAMITES} trámites del RUTS (Registro Único de Trámites y Servicios)
- El contexto abajo muestra los trámites más relevantes para cada consulta
- Usa la información del contexto como base, pero puedes complementarla cuando sea necesario

TU ESTILO:
- Natural y conversacional, como ayudar a un amigo
- Haz preguntas cuando necesites aclarar algo (ubicación, tipo de trámite, etc.)
- Organiza la información de forma clara: costo, modalidad, requisitos, oficinas
- Usa emojis con moderación y Markdown para formato
- Si hay varias oficinas, pregunta la ubicación del usuario para personalizarla respuesta
- Siempre cierra ofreciendo más ayuda

CUANDO USES INFO DEL CONTEXTO:
- No mezcles datos entre diferentes trámites
- Usa los costos y URLs exactos que aparecen
- Si falta información, puedes buscar en fuentes oficiales del gobierno de Hidalgo
- Menciona cuando uses información externa al contexto

SI NO ENCUENTRAS INFO:
- Busca en internet/páginas oficiales del gobierno
- Menciona la fuente y recomienda verificar
- Sugiere contactar oficinas o visitar RUTS

IMPORTANTE SOBRE OFICINAS:
- Si hay 3+ oficinas y no conoces el municipio del usuario → Pregunta primero
- Si conoces su ubicación → Muestra solo las oficinas cercanas
- Siempre menciona que pueden ver todas las oficinas en el mapa de la página

📚 INFORMACIÓN DISPONIBLE:
${contexto}`
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
