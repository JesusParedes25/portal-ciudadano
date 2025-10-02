import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendChatMessage } from '../services/chatbotService'
import { buscarTramitesRelevantes } from '../services/busquedaTramites'
import { calcularDistanciasReales, calcularDistanciaLineaRecta } from '../services/googleMapsService'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const ChatbotMapIntegrado = () => {
  // Estados del chatbot
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy **RutBot**, tu asistente virtual del Gobierno de Hidalgo.\n\nPuedes preguntarme sobre **trámites y servicios**, y te mostraré:\n- ✅ Información del trámite\n- 📍 **Mapa con oficinas cercanas**\n- 🕐 Horarios y requisitos\n\n¿Qué trámite necesitas? 😊'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Estados del mapa
  const [showMap, setShowMap] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [map, setMap] = useState(null)
  const [L, setL] = useState(null)
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [showStreetView, setShowStreetView] = useState(false)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)
  const mapRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Cargar Leaflet
  useEffect(() => {
    if (showMap && !L) {
      loadLeaflet().then(leaflet => {
        setL(leaflet)
      })
    }
  }, [showMap])

  // Inicializar mapa
  useEffect(() => {
    if (showMap && L && mapRef.current && !map) {
      const newMap = L.map(mapRef.current, {
        center: [20.1167, -98.7333], // Pachuca, Hidalgo
        zoom: 13,
        zoomControl: true
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(newMap)

      setMap(newMap)
    }
  }, [showMap, L, mapRef.current])

  // Cargar Leaflet dinámicamente
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

  // Obtener ubicación del usuario
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

  // Buscar trámites y mostrar en mapa
  const buscarYMostrarEnMapa = async (query) => {
    try {
      // Obtener ubicación si no la tenemos
      let currentUserLocation = userLocation
      if (!currentUserLocation) {
        try {
          currentUserLocation = await getUserLocation()
        } catch (error) {
          console.log('Continuando sin ubicación')
        }
      }

      // Buscar trámites
      const tramitesEncontrados = buscarTramitesRelevantes(query, 10)

      console.log(`🔍 Búsqueda: "${query}"`)
      console.log(`✅ Encontrados ${tramitesEncontrados.length} trámites`)

      // Procesar resultados
      const processedResults = tramitesEncontrados.map(tramite => {
        let oficinas = []
        let distanciaMasCercana = Infinity

        if (tramite.atencion && Array.isArray(tramite.atencion)) {
          oficinas = tramite.atencion.map(oficina => ({
            ...oficina,
            tramite: tramite.nombre,
            tramiteId: tramite.idtram,
            distancia: null,
            esDistanciaReal: false
          }))

          if (currentUserLocation) {
            oficinas.forEach(oficina => {
              if (oficina.coordenadas && oficina.coordenadas.coordinates) {
                oficina.distancia = calcularDistanciaLineaRecta(
                  currentUserLocation.lat,
                  currentUserLocation.lng,
                  oficina.coordenadas.coordinates[1],
                  oficina.coordenadas.coordinates[0]
                )

                if (oficina.distancia < distanciaMasCercana) {
                  distanciaMasCercana = oficina.distancia
                }
              }
            })

            oficinas.sort((a, b) => {
              if (a.distancia === null) return 1
              if (b.distancia === null) return -1
              return a.distancia - b.distancia
            })
          }
        }

        return {
          ...tramite,
          oficinasOrdenadas: oficinas,
          distanciaMasCercana: distanciaMasCercana
        }
      })

      // Ordenar por cercanía
      if (currentUserLocation) {
        processedResults.sort((a, b) => {
          if (a.distanciaMasCercana === Infinity) return 1
          if (b.distanciaMasCercana === Infinity) return -1
          return a.distanciaMasCercana - b.distanciaMasCercana
        })
      }

      setSearchResults(processedResults)
      setShowMap(true)

      return processedResults
    } catch (error) {
      console.error('Error buscando trámites:', error)
      return []
    }
  }

  // Manejar mensaje del chatbot
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Buscar trámites relacionados para mostrar en mapa
      const tramitesEncontrados = await buscarYMostrarEnMapa(userMessage)

      // Obtener respuesta del chatbot
      const response = await sendChatMessage(userMessage, messages)

      // Agregar información sobre el mapa si encontró trámites
      let finalResponse = response
      if (tramitesEncontrados && tramitesEncontrados.length > 0) {
        finalResponse += `\n\n📍 **He desplegado el mapa** con las oficinas donde puedes realizar este trámite. Las oficinas están ordenadas por cercanía. ¡Haz clic en los marcadores del mapa para más información!`
      }

      setMessages(prev => [...prev, { role: 'assistant', content: finalResponse }])
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

  // Calcular distancia de oficina específica
  const calcularDistanciaOficina = async (oficina) => {
    if (!userLocation || !oficina.coordenadas) return oficina

    setIsCalculatingDistance(true)

    try {
      const destino = {
        lat: oficina.coordenadas.coordinates[1],
        lng: oficina.coordenadas.coordinates[0]
      }

      const distancias = await calcularDistanciasReales(userLocation, [destino])

      if (distancias && distancias[0]) {
        return {
          ...oficina,
          distancia: distancias[0].distancia,
          distanciaTexto: distancias[0].distanciaTexto,
          duracion: distancias[0].duracion,
          duracionTexto: distancias[0].duracionTexto,
          esDistanciaReal: true
        }
      }
    } catch (error) {
      console.error('Error calculando distancia:', error)
    } finally {
      setIsCalculatingDistance(false)
    }

    return {
      ...oficina,
      distancia: calcularDistanciaLineaRecta(
        userLocation.lat,
        userLocation.lng,
        oficina.coordenadas.coordinates[1],
        oficina.coordenadas.coordinates[0]
      ),
      esDistanciaReal: false
    }
  }

  // Dibujar marcadores en el mapa
  useEffect(() => {
    if (!map || !L || searchResults.length === 0) return

    // Limpiar marcadores anteriores
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Obtener todas las oficinas
    const allOffices = []
    searchResults.forEach(tramite => {
      if (tramite.oficinasOrdenadas) {
        tramite.oficinasOrdenadas.forEach(oficina => {
          if (oficina.coordenadas && oficina.coordenadas.coordinates) {
            allOffices.push(oficina)
          }
        })
      }
    })

    // Agregar marcadores
    allOffices.forEach((oficina) => {
      const lat = oficina.coordenadas.coordinates[1]
      const lng = oficina.coordenadas.coordinates[0]

      const officeIcon = L.divIcon({
        html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><i class="fas fa-building" style="font-size: 10px;"></i></div>`,
        iconSize: [24, 24],
        className: 'custom-div-icon'
      })

      const marker = L.marker([lat, lng], { icon: officeIcon }).addTo(map)

      marker.on('click', async () => {
        const oficinaConDistancia = await calcularDistanciaOficina(oficina)
        setSelectedOffice(oficinaConDistancia)
        map.setView([lat, lng], 15)
      })
    })

    // Ajustar vista
    if (allOffices.length > 0) {
      const group = new L.featureGroup(map._layers)
      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds().pad(0.1))
      }
    }
  }, [map, L, searchResults, userLocation])

  const openInGoogleMaps = (lat, lng, nombre) => {
    window.open(`https://www.google.com/maps/dir/${userLocation ? `${userLocation.lat},${userLocation.lng}` : ''}/${lat},${lng}`, '_blank')
  }

  return (
    <section id="chatbot-mapa" className="py-20 relative bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            🤖 Asistente Virtual con Mapa Inteligente
          </h2>
          <p className="text-lg text-gray-600">
            Pregúntame sobre cualquier trámite y te mostraré dónde puedes realizarlo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel del Chatbot */}
          <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[700px] border-2 border-primary">
            {/* Header del chat */}
            <div className="bg-gradient-to-r from-[#9F2241] to-[#235B4E] text-white p-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">RutBot</h3>
                  <p className="text-sm opacity-90">Asistente Virtual de Hidalgo</p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#9F2241] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
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
              <div className="px-4 py-2 border-t border-gray-200">
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
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

          {/* Panel del Mapa */}
          <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[700px] border-2 border-secondary overflow-hidden">
            {!showMap ? (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <i className="fas fa-map-marked-alt text-6xl text-secondary mb-4"></i>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Mapa Interactivo</h3>
                  <p className="text-gray-600">
                    Pregúntame sobre un trámite y te mostraré<br />
                    las oficinas más cercanas en el mapa
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Mapa */}
                <div className="flex-1 relative">
                  <div ref={mapRef} className="w-full h-full"></div>

                  {/* Panel de oficina seleccionada */}
                  {selectedOffice && (
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg max-w-sm z-[1000] border-2 border-primary">
                      <button
                        onClick={() => {
                          setSelectedOffice(null)
                          setShowStreetView(false)
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cerrar"
                      >
                        <i className="fas fa-times"></i>
                      </button>

                      <h4 className="font-semibold text-sm mb-2 pr-6">{selectedOffice.nombre}</h4>
                      <p className="text-xs text-gray-600 mb-2">{selectedOffice.direccion}</p>
                      <p className="text-xs text-gray-600 mb-2">
                        <i className="fas fa-clock mr-1"></i>{selectedOffice.horario}
                      </p>
                      {selectedOffice.telefonos && (
                        <p className="text-xs text-gray-600 mb-2">
                          <i className="fas fa-phone mr-1"></i>{selectedOffice.telefonos}
                        </p>
                      )}

                      {selectedOffice.distancia && (
                        <div className="mb-3">
                          <p className="text-xs text-green-600 font-medium">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {selectedOffice.esDistanciaReal ? (
                              <>
                                {selectedOffice.distanciaTexto || `${selectedOffice.distancia.toFixed(1)} km`}
                                {selectedOffice.duracionTexto && ` (${selectedOffice.duracionTexto})`}
                              </>
                            ) : (
                              `${selectedOffice.distancia.toFixed(1)} km (línea recta)`
                            )}
                          </p>
                        </div>
                      )}

                      {isCalculatingDistance && (
                        <div className="mb-3 text-xs text-gray-500 italic">
                          <i className="fas fa-spinner fa-spin mr-1"></i>
                          Calculando distancia real...
                        </div>
                      )}

                      {selectedOffice.tramiteId && (
                        <div className="mb-3">
                          <a
                            href={`https://ruts.hidalgo.gob.mx/ver/${selectedOffice.tramiteId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-accent text-white px-3 py-1 rounded text-xs font-medium hover:bg-accent-700 transition-colors duration-300 flex items-center gap-1 w-full justify-center"
                          >
                            <i className="fas fa-file-alt"></i>
                            Ver Requisitos
                          </a>
                        </div>
                      )}

                      {showStreetView && selectedOffice.coordenadas && (
                        <div className="mb-3">
                          <iframe
                            src={`https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_MAPS_API_KEY}&location=${selectedOffice.coordenadas.coordinates[1]},${selectedOffice.coordenadas.coordinates[0]}&heading=0&pitch=0&fov=90`}
                            width="100%"
                            height="180"
                            style={{ border: 0, borderRadius: '6px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openInGoogleMaps(
                            selectedOffice.coordenadas.coordinates[1],
                            selectedOffice.coordenadas.coordinates[0],
                            selectedOffice.nombre
                          )}
                          className="w-full bg-primary text-white px-3 py-2 rounded text-xs font-medium hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center gap-1"
                        >
                          <i className="fas fa-route"></i>
                          Cómo Llegar (Google Maps)
                        </button>

                        <button
                          onClick={() => setShowStreetView(!showStreetView)}
                          className={`w-full ${showStreetView ? 'bg-gray-500' : 'bg-secondary'} text-white px-3 py-2 rounded text-xs font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-1`}
                        >
                          <i className={`fas fa-${showStreetView ? 'eye-slash' : 'street-view'}`}></i>
                          {showStreetView ? 'Ocultar' : 'Ver'} Street View
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lista de resultados */}
                <div className="bg-gray-50 p-3 border-t border-gray-200 max-h-48 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-primary mb-2">
                    Resultados ({searchResults.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.slice(0, 5).map((tramite, index) => (
                      <div key={index} className="bg-white p-2 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-800">{tramite.nombre}</p>
                        {tramite.distanciaMasCercana !== Infinity && (
                          <p className="text-xs text-green-600 mt-1">
                            📍 Oficina más cercana: {tramite.distanciaMasCercana.toFixed(1)} km
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatbotMapIntegrado
