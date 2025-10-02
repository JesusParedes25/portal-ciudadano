import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendChatMessage } from '../services/chatbotService'
import { buscarTramitesRelevantes } from '../services/busquedaTramites'
import { calcularDistanciaLineaRecta } from '../services/googleMapsService'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const ChatbotConMapa = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy **RutBot**, tu asistente virtual del Gobierno de Hidalgo.\n\nPuedes preguntarme sobre **trámites y servicios**, y te mostraré:\n- ✅ Información del trámite\n- 📍 **Mapa con oficinas cercanas**\n- 🕐 Horarios y requisitos\n\n¿Qué trámite necesitas? 😊'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Estados para mapas individuales
  const [mapInstances, setMapInstances] = useState({})
  const [L, setL] = useState(null)

  const scrollToBottom = () => {
    // Deshabilitado: No hacer scroll automático para no molestar al usuario
    // El usuario puede hacer scroll manualmente si lo necesita
  }

  useEffect(() => {
    // No hacer scroll automático
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Cargar Leaflet cuando se abre el chatbot
  useEffect(() => {
    if (isOpen && !L) {
      loadLeaflet().then(leaflet => {
        setL(leaflet)
      })
    }
  }, [isOpen])

  // Recalcular tamaño de mapas cuando cambian los mensajes (importante en móvil)
  useEffect(() => {
    if (L && isOpen) {
      setTimeout(() => {
        Object.values(mapInstances).forEach(map => {
          if (map && map.invalidateSize) {
            map.invalidateSize()
          }
        })
      }, 200)
    }
  }, [messages, isOpen, L])

  const loadLeaflet = () => {
    return new Promise((resolve) => {
      if (window.L) {
        resolve(window.L)
        return
      }

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => resolve(window.L)
      document.body.appendChild(script)
    })
  }

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        setIsLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            setUserLocation(location)
            setIsLoadingLocation(false)
            resolve(location)
          },
          (error) => {
            console.error('Error obteniendo ubicación:', error)
            setIsLoadingLocation(false)
            reject(error)
          }
        )
      } else {
        reject(new Error('Geolocalización no disponible'))
      }
    })
  }

  // Inicializar mapa para un mensaje específico
  const initializeMap = (mapId, oficinas, userLoc) => {
    if (!L || mapInstances[mapId]) return

    const mapElement = document.getElementById(mapId)
    if (!mapElement) {
      console.log('⚠️ Elemento del mapa no encontrado:', mapId)
      return
    }
    
    console.log('🗺️ Inicializando mapa:', mapId, 'con', oficinas.length, 'oficinas')

    try {
      const newMap = L.map(mapElement, {
        center: [20.1167, -98.7333],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false, // Desactivado para mejor UX en móvil
        touchZoom: true,
        dragging: true,
        tap: true, // Importante para móvil
        tapTolerance: 15
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
      }).addTo(newMap)

      // Agregar marcadores
      const markers = []
      oficinas.forEach((oficina) => {
        if (oficina.coordenadas && oficina.coordenadas.coordinates) {
          const lat = oficina.coordenadas.coordinates[1]
          const lng = oficina.coordenadas.coordinates[0]

          const officeIcon = L.divIcon({
            html: `<div style="background-color: #9F2241; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-center: font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"><i class="fas fa-building" style="font-size: 14px;"></i></div>`,
            iconSize: [32, 32],
            className: 'custom-div-icon'
          })

          const marker = L.marker([lat, lng], { icon: officeIcon }).addTo(newMap)

          const popupContent = `
            <div style="min-width: 200px;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${oficina.nombre}</h4>
              <p style="margin: 4px 0; font-size: 12px; color: #666;">${oficina.direccion}</p>
              <p style="margin: 4px 0; font-size: 12px;"><i class="fas fa-clock"></i> ${oficina.horario}</p>
              ${oficina.telefonos ? `<p style="margin: 4px 0; font-size: 12px;"><i class="fas fa-phone"></i> ${oficina.telefonos}</p>` : ''}
              ${oficina.distancia ? `<p style="margin: 4px 0; font-size: 12px; color: #10b981;"><i class="fas fa-map-marker-alt"></i> ${oficina.distancia.toFixed(1)} km</p>` : ''}
              <a href="https://www.google.com/maps/dir/${userLoc ? `${userLoc.lat},${userLoc.lng}` : ''}/${lat},${lng}" target="_blank" style="display: inline-block; margin-top: 8px; padding: 4px 8px; background: #9F2241; color: white; text-decoration: none; border-radius: 4px; font-size: 11px;">
                <i class="fas fa-route"></i> Cómo llegar
              </a>
            </div>
          `

          marker.bindPopup(popupContent)
          markers.push(marker)
        }
      })

      // Ajustar vista a los marcadores
      if (markers.length > 0) {
        const group = new L.featureGroup(markers)
        newMap.fitBounds(group.getBounds().pad(0.2))
      }

      // Forzar que el mapa recalcule su tamaño (importante en móvil)
      setTimeout(() => {
        newMap.invalidateSize()
      }, 100)

      // Guardar instancia del mapa para poder controlarlo
      setMapInstances(prev => {
        const updated = { ...prev, [mapId]: newMap }
        console.log('✅ Mapa inicializado correctamente:', mapId)
        return updated
      })
    } catch (error) {
      console.error('Error inicializando mapa:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Agregar mensaje del usuario
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Obtener ubicación si no la tenemos
      let currentUserLocation = userLocation
      if (!currentUserLocation) {
        try {
          currentUserLocation = await getUserLocation()
        } catch (error) {
          console.log('Sin ubicación')
        }
      }

      // Obtener respuesta del chatbot primero (con historial completo)
      const response = await sendChatMessage(userMessage, newMessages.filter(m => m.role !== 'map'))

      // Agregar respuesta del asistente
      setMessages(prev => [...prev, { role: 'assistant', content: response }])

      // Detectar si la respuesta del chatbot indica que debe mostrar ubicaciones
      const responseLower = response.toLowerCase()
      const userMessageLower = userMessage.toLowerCase()
      
      // CASO 1: Usuario pide explícitamente el mapa o cómo llegar
      const pideMapa = (
        userMessageLower.includes('mapa') ||
        userMessageLower.includes('muestra') ||
        userMessageLower.includes('mostrar') ||
        userMessageLower.includes('ver') ||
        (userMessageLower.includes('como') && (userMessageLower.includes('llegar') || userMessageLower.includes('llego'))) ||
        (userMessageLower.includes('cómo') && (userMessageLower.includes('llegar') || userMessageLower.includes('llego'))) ||
        userMessageLower.includes('ubicacion') ||
        userMessageLower.includes('ubicación') ||
        userMessageLower.includes('donde esta') ||
        userMessageLower.includes('dónde está')
      )

      // CASO 2: El chatbot mencionó dirección/oficina (ya dio información)
      const mencionaDirecciones = (
        (response.match(/dirección:/gi) || []).length > 0 ||
        (response.match(/📍/g) || []).length > 0 ||
        responseLower.includes('puedes acudir') ||
        responseLower.includes('puedes ir a') ||
        responseLower.includes('teléfono:') ||
        responseLower.includes('horario:') ||
        responseLower.includes('oficina')
      )
      
      // NO mostrar mapa si el chatbot está haciendo preguntas de aclaración
      const esPreguntaAclaracion = (
        response.includes('?') && (
          responseLower.includes('cuál') ||
          responseLower.includes('cual') ||
          responseLower.includes('qué tipo') ||
          responseLower.includes('que tipo') ||
          responseLower.includes('necesitas saber') ||
          responseLower.includes('podrías decirme') ||
          responseLower.includes('qué municipio')
        )
      )
      
      // SÍ mostrar mapa si:
      const deberíaMostrarMapa = !esPreguntaAclaracion && (
        mencionaDirecciones || // El chatbot ya dio direcciones
        pideMapa // O el usuario pide el mapa explícitamente
      )
      
      console.log('🔍 Debug Mapa:', { 
        pideMapa,
        mencionaDirecciones, 
        esPreguntaAclaracion,
        deberíaMostrarMapa 
      })
      
      // Solo buscar trámites si realmente necesitamos mostrar el mapa
      let tramitesEncontrados = []
      let municipioFiltro = null
      
      if (deberíaMostrarMapa) {
        // BUSCAR EL TRÁMITE EN EL CONTEXTO DE LA CONVERSACIÓN
        // Juntar los últimos 3 mensajes del usuario para tener contexto
        const mensajesRecientes = newMessages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-6) // Últimos 3 intercambios
          .map(m => m.content)
          .join(' ')
        
        console.log('📝 Contexto completo:', mensajesRecientes.substring(0, 200))
        
        // Extraer ID de RUTS si está en la conversación
        const rutsmatch = mensajesRecientes.match(/ruts\.hidalgo\.gob\.mx\/ver\/(\d+)/i)
        if (rutsmatch) {
          const idtram = rutsmatch[1]
          console.log('🔍 ID RUTS encontrado:', idtram)
          // Buscar por ID exacto
          tramitesEncontrados = buscarTramitesRelevantes(idtram, 1)
        }
        
        // Si no encontró por ID, buscar por palabras clave del contexto
        if (tramitesEncontrados.length === 0) {
          // Buscar con el contexto completo
          tramitesEncontrados = buscarTramitesRelevantes(mensajesRecientes, 3)
          
          console.log('🔍 Búsqueda por contexto:', tramitesEncontrados.length, 'resultados')
          
          // Filtrar solo los más relevantes
          tramitesEncontrados = tramitesEncontrados.filter((t, idx) => {
            // Mantener el primero siempre (más relevante)
            if (idx === 0) return true
            
            // Para los demás, verificar que sean realmente relevantes
            const contextoLower = mensajesRecientes.toLowerCase()
            const nombreLower = (t.nombre || '').toLowerCase()
            
            // Buscar palabras clave significativas (>3 caracteres)
            const palabrasClaveNombre = nombreLower.split(/\s+/).filter(p => p.length > 3)
            const tieneCoincidencia = palabrasClaveNombre.some(palabra => 
              contextoLower.includes(palabra)
            )
            
            return tieneCoincidencia
          })
        }
        
        // Detectar municipio mencionado en todo el contexto
        const municipiosHidalgo = ['pachuca', 'tulancingo', 'tula', 'huejutla', 'ixmiquilpan', 'actopan', 'mineral de la reforma', 'san agustín tlaxiaca', 'zimapan']
        const contextoLower = mensajesRecientes.toLowerCase()
        municipioFiltro = municipiosHidalgo.find(m => contextoLower.includes(m))
        
        console.log('🏛️ Municipio detectado:', municipioFiltro || 'ninguno')
        console.log('✅ Trámites encontrados:', tramitesEncontrados.length)
        console.log('📊 Trámites:', tramitesEncontrados.map(t => t.nombre).join(', '))
      }

      // Validar que realmente encontramos oficinas válidas
      const tieneOficinasValidas = tramitesEncontrados.some(t => 
        t.atencion && 
        Array.isArray(t.atencion) && 
        t.atencion.length > 0 &&
        t.atencion.some(o => o.coordenadas && o.coordenadas.coordinates)
      )
      
      // Si encontramos trámites con oficinas Y debeíamos mostrar el mapa, agregarlo
      if (tramitesEncontrados && tramitesEncontrados.length > 0 && deberíaMostrarMapa && tieneOficinasValidas) {
        const mapMessageId = `map-${Date.now()}`
        
        // Procesar oficinas con distancias
        const oficinasProcesadas = []
        tramitesEncontrados.forEach(tramite => {
          if (tramite.atencion && Array.isArray(tramite.atencion)) {
            tramite.atencion.forEach(oficina => {
              if (oficina.coordenadas && oficina.coordenadas.coordinates) {
                // Filtrar por municipio si se detectó uno
                if (municipioFiltro) {
                  const direccionLower = (oficina.direccion || '').toLowerCase()
                  const nombreLower = (oficina.nombre || '').toLowerCase()
                  if (!direccionLower.includes(municipioFiltro) && !nombreLower.includes(municipioFiltro)) {
                    return // Saltar esta oficina
                  }
                }
                
                const oficinaConInfo = {
                  ...oficina,
                  tramite: tramite.nombre,
                  tramiteId: tramite.idtram
                }

                // Calcular distancia si tenemos ubicación
                if (currentUserLocation) {
                  oficinaConInfo.distancia = calcularDistanciaLineaRecta(
                    currentUserLocation.lat,
                    currentUserLocation.lng,
                    oficina.coordenadas.coordinates[1],
                    oficina.coordenadas.coordinates[0]
                  )
                }

                oficinasProcesadas.push(oficinaConInfo)
              }
            })
          }
        })
        
        console.log('📍 Oficinas después de filtrar:', oficinasProcesadas.length)

        // Ordenar por distancia
        if (currentUserLocation) {
          oficinasProcesadas.sort((a, b) => {
            if (!a.distancia) return 1
            if (!b.distancia) return -1
            return a.distancia - b.distancia
          })
        }

        // Agregar mensaje con mapa (solo si hay oficinas procesadas)
        if (oficinasProcesadas.length > 0) {
          setMessages(prev => [...prev, {
            role: 'map',
            mapId: mapMessageId,
            oficinas: oficinasProcesadas.slice(0, 10), // Máximo 10 oficinas
            tramites: tramitesEncontrados,
            tramiteNombre: tramitesEncontrados[0]?.nombre || 'este trámite'
          }])

          // Inicializar mapa después de que el mensaje se renderice (más tiempo en móvil)
          setTimeout(() => {
            initializeMap(mapMessageId, oficinasProcesadas.slice(0, 10), currentUserLocation)
            
            // Reintento si no se inicializó (común en móvil)
            setTimeout(() => {
              const mapElement = document.getElementById(mapMessageId)
              if (mapElement && !mapInstances[mapMessageId]) {
                console.log('🔄 Reintentando inicializar mapa...')
                initializeMap(mapMessageId, oficinasProcesadas.slice(0, 10), currentUserLocation)
              }
            }, 800)
          }, 300)
        } else {
          console.log('⚠️ No hay oficinas para mostrar en el mapa')
        }
      } else {
        if (deberíaMostrarMapa) {
          console.log('⚠️ No se encontraron trámites relevantes o no tienen oficinas')
        }
      }

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInput(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const quickQuestions = [
    '¿Cómo saco mi licencia de conducir?',
    'Necesito un acta de nacimiento',
    '¿Dónde pago el predial?',
    'Quiero abrir un negocio'
  ]

  return (
    <>
      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#9F2241] text-white rounded-full p-4 shadow-2xl hover:bg-[#7d1a33] transition-all duration-300 hover:scale-110 group"
          aria-label="Abrir asistente virtual"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {messages.length === 1 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
              !
            </span>
          )}
        </button>
      )}

      {/* Ventana del Chatbot */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[650px] h-full sm:h-[750px] flex flex-col bg-white sm:rounded-2xl shadow-2xl border-t-2 sm:border-2 border-[#9F2241] overflow-hidden animate-slideIn">
          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .animate-slideIn {
              animation: slideIn 0.3s ease-out;
            }
          `}</style>
          {/* Header del chat */}
          <div className="bg-[#9F2241] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">RutBot</h3>
                <p className="text-sm opacity-90">Asistente Virtual de Hidalgo</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Cerrar chatbot"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                {message.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-[#9F2241] text-white">
                      <div className="text-sm">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {message.role === 'assistant' && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white shadow-md border border-gray-200">
                      <div className="text-sm text-gray-800 prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {message.role === 'map' && (
                  <div className="flex justify-start">
                    <div className="w-full max-w-[90%] rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-[#235B4E]">
                      <div className="bg-[#235B4E] text-white px-4 py-2">
                        <p className="text-sm font-semibold">
                          📍 Oficinas para: {message.tramiteNombre}
                        </p>
                        <p className="text-xs opacity-90">
                          {message.oficinas.length} {message.oficinas.length === 1 ? 'oficina encontrada' : 'oficinas encontradas'}
                        </p>
                      </div>
                      
                      {/* Mapa */}
                      <div id={message.mapId} className="w-full h-[350px] sm:h-[400px] min-h-[300px] relative bg-gray-100 flex items-center justify-center" style={{ touchAction: 'pan-y' }}>
                        {!mapInstances[message.mapId] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <div className="text-center">
                              <div className="w-12 h-12 border-4 border-[#9F2241] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                              <p className="text-sm text-gray-600">Cargando mapa...</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Lista de oficinas */}
                      <div className="p-3 bg-gray-50 max-h-48 overflow-y-auto">
                        <div className="space-y-2">
                          {message.oficinas.slice(0, 5).map((oficina, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-[#235B4E] hover:shadow-md transition-all duration-200 cursor-pointer">
                              <p className="text-xs font-semibold text-gray-800">{oficina.nombre}</p>
                              <p className="text-xs text-gray-600 mt-1">{oficina.direccion}</p>
                              {oficina.tramite && (
                                <p className="text-xs text-[#235B4E] mt-1 font-medium">
                                  📄 {oficina.tramite}
                                </p>
                              )}
                              {oficina.distancia && (
                                <p className="text-xs text-green-600 mt-1 font-medium">
                                  📍 {oficina.distancia.toFixed(1)} km de distancia
                                </p>
                              )}
                              {oficina.tramiteId && (
                                <a
                                  href={`https://ruts.hidalgo.gob.mx/ver/${oficina.tramiteId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 text-xs text-[#9F2241] hover:underline font-medium"
                                >
                                  Ver requisitos completos →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#9F2241] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#235B4E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#DDC9A3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas rápidas */}
          {messages.length === 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2">Preguntas frecuentes:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#9F2241] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7d1a33] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatbotConMapa
