import React, { useState, useEffect, useRef } from 'react'
import { buscarTramitesRelevantes, generarSugerencias } from '../services/busquedaTramites'
import { calcularDistanciasReales, calcularDistanciaLineaRecta } from '../services/googleMapsService'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

// Cargar Leaflet dinámicamente
const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L)
      return
    }

    // Cargar CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Cargar JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => resolve(window.L)
    document.head.appendChild(script)
  })
}

const LocationsSection = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [selectedTramite, setSelectedTramite] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [map, setMap] = useState(null)
  const [L, setL] = useState(null)
  const mapRef = useRef(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showStreetView, setShowStreetView] = useState(false) // Controlar visibilidad de Street View
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false) // Loading de distancia


  // Obtener geolocalización del usuario solo cuando busque
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
            console.log('Error obteniendo ubicación:', error)
            setIsLoadingLocation(false)
            reject(error)
          }
        )
      } else {
        reject(new Error('Geolocalización no disponible'))
      }
    })
  }

  // Función para calcular distancia de UNA oficina específica
  const calcularDistanciaOficina = async (oficina) => {
    if (!userLocation || !oficina.coordenadas || !oficina.coordenadas.coordinates) {
      return oficina
    }

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
    
    // Fallback: línea recta
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

  // Función para generar sugerencias de autocompletado usando el servicio inteligente
  const handleGenerateSuggestions = (query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const suggestionsList = generarSugerencias(query, 8)
    setSuggestions(suggestionsList)
    setShowSuggestions(suggestionsList.length > 0)
  }


  // Buscar trámites usando el servicio inteligente compartido
  const handleSearch = async () => {
    const query = searchTerm.trim()
    
    if (!query) {
      setShowResults(false)
      return
    }

    setIsSearching(true)

    try {
      // Obtener ubicación del usuario al buscar
      let currentUserLocation = userLocation
      if (!currentUserLocation) {
        try {
          currentUserLocation = await getUserLocation()
        } catch (error) {
          console.log('No se pudo obtener la ubicación, continuando sin ella')
        }
      }

      // Usar el servicio de búsqueda inteligente compartido
      const tramitesRelevantesEncontrados = buscarTramitesRelevantes(query, 10)
      
      console.log(`🔍 Búsqueda en mapa: "${query}"`);
      console.log(`✅ Encontrados ${tramitesRelevantesEncontrados.length} trámites`);
      tramitesRelevantesEncontrados.forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.nombre} (ID: ${t.idtram})`);
      });

      // Procesar resultados SIN calcular distancias (optimización de costos)
      // Las distancias se calcularán solo cuando el usuario seleccione una oficina
      const processedResults = tramitesRelevantesEncontrados.map(tramite => {
        let oficinas = []
        let distanciaMasCercana = Infinity
        
        if (tramite.atencion && Array.isArray(tramite.atencion)) {
          oficinas = tramite.atencion.map(oficina => ({
            ...oficina,
            tramite: tramite.nombre,
            tramiteId: tramite.idtram,
            distancia: null, // No calcular todavía
            esDistanciaReal: false
          }))
          
          // Ordenar por línea recta si tenemos ubicación (sin API)
          if (currentUserLocation) {
            oficinas.forEach(oficina => {
              if (oficina.coordenadas && oficina.coordenadas.coordinates) {
                oficina.distancia = calcularDistanciaLineaRecta(
                  currentUserLocation.lat,
                  currentUserLocation.lng,
                  oficina.coordenadas.coordinates[1],
                  oficina.coordenadas.coordinates[0]
                )
                
                // Guardar la distancia más cercana para ordenar trámites
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
          distanciaMasCercana: distanciaMasCercana // Para ordenar trámites
        }
      })

      // Ordenar trámites por la oficina más cercana de cada uno
      if (currentUserLocation) {
        processedResults.sort((a, b) => {
          if (a.distanciaMasCercana === Infinity) return 1
          if (b.distanciaMasCercana === Infinity) return -1
          return a.distanciaMasCercana - b.distanciaMasCercana
        })
        
        console.log('📊 Trámites ordenados por cercanía:');
        processedResults.forEach((t, i) => {
          if (t.distanciaMasCercana !== Infinity) {
            console.log(`  ${i + 1}. ${t.nombre} - Oficina más cercana: ${t.distanciaMasCercana.toFixed(1)} km`);
          }
        });
      }

      setSearchResults(processedResults)
      setShowResults(true)
    } catch (error) {
      console.error('Error en la búsqueda:', error)
      setSearchResults([])
      setShowResults(true)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false)
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    handleGenerateSuggestions(value)
  }

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    // Auto-buscar cuando selecciona una sugerencia
    setTimeout(() => handleSearch(), 100)
  }

  const openInGoogleMaps = (lat, lng, name) => {
    let url
    if (userLocation) {
      // Si tenemos la ubicación del usuario, mostrar ruta
      url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}/@${lat},${lng},15z/data=!3m1!4b1!4m2!4m1!3e0`
    } else {
      // Si no tenemos ubicación, solo mostrar el punto
      url = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m&hl=es&gl=MX`
    }
    window.open(url, '_blank')
  }

  const showTramiteDetails = (tramite) => {
    setSelectedTramite(tramite)
  }

  // Inicializar mapa Leaflet
  useEffect(() => {
    const initMap = async () => {
      const leaflet = await loadLeaflet()
      setL(leaflet)
      
      if (mapRef.current && !map) {
        const newMap = leaflet.map(mapRef.current).setView([20.1219, -98.7324], 12)
        
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(newMap)
        
        setMap(newMap)
      }
    }
    
    if (showResults) {
      initMap()
    }
  }, [showResults, map])

  // Actualizar marcadores cuando cambien los resultados
  useEffect(() => {
    if (map && L && searchResults.length > 0) {
      // Limpiar marcadores existentes
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Agregar marcador de usuario
      if (userLocation) {
        const userIcon = L.divIcon({
          html: '<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">U</div>',
          iconSize: [30, 30],
          className: 'custom-div-icon'
        })
        
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('Tu ubicación')
      }

      // Agregar marcadores de oficinas
      const allOffices = searchResults.flatMap(tramite => 
        tramite.oficinasOrdenadas || []
      ).filter(oficina => oficina.coordenadas && oficina.coordenadas.coordinates)

      allOffices.forEach((oficina, index) => {
        const lat = oficina.coordenadas.coordinates[1]
        const lng = oficina.coordenadas.coordinates[0]
        
        const officeIcon = L.divIcon({
          html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><i class="fas fa-building" style="font-size: 10px;"></i></div>`,
          iconSize: [24, 24],
          className: 'custom-div-icon'
        })
        
        const marker = L.marker([lat, lng], { icon: officeIcon }).addTo(map)
        
        // SIN POPUP - Solo evento de clic para mostrar en panel inferior
        marker.on('click', async () => {
          // Calcular distancia real solo al seleccionar
          const oficinaConDistancia = await calcularDistanciaOficina(oficina)
          setSelectedOffice(oficinaConDistancia)
          
          // Centrar mapa en la oficina
          map.setView([lat, lng], 15)
        })
      })

      // Ajustar vista para mostrar todos los marcadores
      if (allOffices.length > 0) {
        const group = new L.featureGroup(map._layers)
        if (group.getLayers().length > 0) {
          map.fitBounds(group.getBounds().pad(0.1))
        }
      }
    }
  }, [map, L, searchResults, userLocation])

  // Función para seleccionar oficina
  const selectOffice = (oficina, tramiteId = null) => {
    const oficinaConTramite = { ...oficina, tramiteId }
    setSelectedOffice(oficinaConTramite)
    if (map && oficina.coordenadas) {
      const lat = oficina.coordenadas.coordinates[1]
      const lng = oficina.coordenadas.coordinates[0]
      map.setView([lat, lng], 16)
    }
  }

  return (
    <>
      {/* Estilos personalizados para scroll */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9f2241;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7d1a33;
        }
        .suggestion-item:hover {
          background-color: #f9fafb;
        }
      `}</style>
      
      <section id="ubicaciones" className="py-20 relative">
      {/* Fondo con gradiente institucional */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            Encuentra tu trámite más cercano
          </h2>
          <p className="text-lg text-gray-600">
            Busca cualquier trámite y te mostramos las oficinas más cercanas a tu ubicación.
          </p>
        </div>

        {/* Compact Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. Licencia de conducir, acta de nacimiento..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => handleGenerateSuggestions(searchTerm)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors duration-300 pr-10"
                />
                <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              
              {/* Sugerencias de autocompletado */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-[9999] max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-sm"
                    >
                      <i className="fas fa-file-alt text-primary mr-2"></i>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isLoadingLocation || isSearching}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-40"
            >
              {isLoadingLocation ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Ubicación...
                </>
              ) : isSearching ? (
                <>
                  <i className="fas fa-brain fa-pulse"></i>
                  Buscando...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  Buscar
                </>
              )}
            </button>
          </div>
          
          {userLocation && (
            <div className="flex items-center justify-center gap-2 text-green-600 mt-2">
              <i className="fas fa-map-marker-alt"></i>
              <span className="text-xs">Ubicación detectada</span>
            </div>
          )}
        </div>

        {/* Map and Results Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-[500px]">
            {/* Interactive Leaflet Map - 3/4 del espacio */}
            <div className="lg:col-span-3 relative h-full">
              {!showResults ? (
                <div className="h-full bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <i className="fas fa-map-marked-alt text-6xl text-primary mb-4"></i>
                    <p className="text-xl font-medium mb-2">Busca un trámite</p>
                    <p className="text-sm">Te mostraremos las oficinas más cercanas en el mapa interactivo</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  <div ref={mapRef} className="w-full h-full"></div>
                  
                  {/* Controles del mapa */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        if (map && userLocation) {
                          map.setView([userLocation.lat, userLocation.lng], 14)
                        }
                      }}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 transition-all duration-200"
                      disabled={!userLocation}
                    >
                      <i className="fas fa-crosshairs mr-2"></i>
                      Mi ubicación
                    </button>
                    
                    <button
                      onClick={() => {
                        if (map) {
                          const allOffices = searchResults.flatMap(tramite => 
                            tramite.oficinasOrdenadas || []
                          ).filter(oficina => oficina.coordenadas && oficina.coordenadas.coordinates)
                          
                          if (allOffices.length > 0) {
                            const bounds = L.latLngBounds(allOffices.map(oficina => [
                              oficina.coordenadas.coordinates[1],
                              oficina.coordenadas.coordinates[0]
                            ]))
                            if (userLocation) {
                              bounds.extend([userLocation.lat, userLocation.lng])
                            }
                            map.fitBounds(bounds, { padding: [20, 20] })
                          }
                        }
                      }}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 transition-all duration-200"
                    >
                      <i className="fas fa-expand-arrows-alt mr-2"></i>
                      Ver todo
                    </button>
                  </div>

                  {/* Información de la oficina seleccionada */}
                  {selectedOffice && (
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg max-w-sm z-[1000] border-2 border-primary">
                      <button
                        onClick={() => setSelectedOffice(null)}
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
                      {/* Distancia con loading state */}
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

                      {/* Botón Ver Requisitos si tenemos el trámite asociado */}
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

                      {/* Street View (solo si usuario lo solicita) */}
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
                      
                      {/* Botones de acción */}
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
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Panel - 1/4 del espacio */}
            <div className="lg:col-span-1 border-l border-gray-100 h-full">
              {showResults ? (
                <div className="h-full flex flex-col">
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-sm font-semibold text-primary">
                      Resultados ({searchResults.length})
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 custom-scrollbar" style={{ maxHeight: '400px' }}>
                    {searchResults.length > 0 ? (
                      <div className="space-y-3 pr-2">
                        {searchResults.map((tramite, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-sm transition-all duration-300"
                          >
                            <div className="p-3">
                              <h4 className="font-semibold text-primary mb-2 text-sm leading-tight">
                                {tramite.nombre}
                              </h4>
                              
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {tramite.descripcion}
                              </p>
                              
                              <div className="flex flex-wrap gap-1 mb-2">
                                <span className="text-xs text-secondary font-medium bg-secondary bg-opacity-10 px-2 py-1 rounded">
                                  {tramite.secretaria.siglas}
                                </span>
                                {tramite.dependencia && (
                                  <span className="text-xs text-accent font-medium bg-accent bg-opacity-10 px-2 py-1 rounded">
                                    {tramite.dependencia.siglas}
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-gray-500 mb-3">
                                <p><strong>Secretaría:</strong> {tramite.secretaria.nombre}</p>
                                {tramite.dependencia && tramite.dependencia.nombre !== tramite.secretaria.nombre && (
                                  <p><strong>Dependencia:</strong> {tramite.dependencia.nombre}</p>
                                )}
                              </div>

                              {/* Botón Ver Requisitos */}
                              <div className="mb-3">
                                <a
                                  href={`https://ruts.hidalgo.gob.mx/ver/${tramite.idtram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-accent text-white px-3 py-2 rounded text-xs font-medium hover:bg-accent-700 transition-colors duration-300 flex items-center gap-1 w-full justify-center"
                                >
                                  <i className="fas fa-file-alt"></i>
                                  Ver Requisitos Completos
                                </a>
                              </div>
                            </div>
                            
                            {/* Mostrar oficina más cercana */}
                            {tramite.oficinasOrdenadas && tramite.oficinasOrdenadas.length > 0 && (
                              <div className="border-t border-gray-100 p-3 bg-gray-50">
                                <div className="text-xs text-gray-600 mb-2">
                                  <p className="font-medium text-gray-700 mb-1">Oficina más cercana:</p>
                                  <p className="font-medium truncate">
                                    {tramite.oficinasOrdenadas[0].nombre}
                                  </p>
                                  <p className="truncate text-gray-500">
                                    {tramite.oficinasOrdenadas[0].direccion}
                                  </p>
                                  {tramite.oficinasOrdenadas[0].distancia && (
                                    <p className="text-green-600 font-medium mt-1 text-xs">
                                      <i className="fas fa-map-marker-alt mr-1"></i>
                                      {tramite.oficinasOrdenadas[0].esDistanciaReal ? (
                                        <>
                                          {tramite.oficinasOrdenadas[0].distanciaTexto || `${tramite.oficinasOrdenadas[0].distancia.toFixed(1)} km`}
                                          {tramite.oficinasOrdenadas[0].duracionTexto && (
                                            <> ({tramite.oficinasOrdenadas[0].duracionTexto})</>
                                          )}
                                        </>
                                      ) : (
                                        `${tramite.oficinasOrdenadas[0].distancia.toFixed(1)} km`
                                      )}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => selectOffice(tramite.oficinasOrdenadas[0], tramite.idtram)}
                                    className="bg-secondary text-white px-2 py-1 rounded text-xs font-medium hover:bg-secondary-700 transition-colors duration-300 flex items-center gap-1 flex-1 justify-center"
                                  >
                                    <i className="fas fa-map-pin"></i>
                                    Seleccionar oficina
                                  </button>
                                  <button
                                    onClick={() => {
                                      const lat = tramite.oficinasOrdenadas[0].coordenadas.coordinates[1]
                                      const lng = tramite.oficinasOrdenadas[0].coordenadas.coordinates[0]
                                      window.open(`https://www.google.com/maps/@${lat},${lng},3a,75y,90t/data=!3m1!1e3`, '_blank')
                                    }}
                                    className="bg-accent text-white px-2 py-1 rounded text-xs font-medium hover:bg-accent-700 transition-colors duration-300 flex items-center gap-1"
                                    title="Ver en Street View"
                                  >
                                    <i className="fas fa-street-view"></i>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <i className="fas fa-search text-2xl text-gray-300 mb-2"></i>
                        <h4 className="text-xs font-medium text-gray-600 mb-1">
                          No se encontraron trámites
                        </h4>
                        <p className="text-gray-500 text-xs">
                          Intenta con: "licencia", "acta", "agua"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center">
                    <i className="fas fa-info-circle text-2xl text-primary mb-2"></i>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">
                      ¿Cómo funciona?
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Busca cualquier trámite y verás las oficinas en el mapa.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default LocationsSection
