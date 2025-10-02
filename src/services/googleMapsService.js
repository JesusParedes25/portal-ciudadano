/**
 * Servicio para interactuar con Google Maps APIs
 * - Distance Matrix API: Calcular distancias y tiempos reales usando SDK
 * - Directions API: Obtener rutas para dibujar en el mapa usando SDK
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

// Variable para el SDK de Google Maps
let googleMapsLoaded = false
let googleMapsLoading = false

/**
 * Carga el SDK de Google Maps JavaScript API
 * @returns {Promise<boolean>}
 */
function loadGoogleMapsSDK() {
  return new Promise((resolve, reject) => {
    // Si ya está cargado
    if (window.google && window.google.maps) {
      googleMapsLoaded = true
      resolve(true)
      return
    }

    // Si ya se está cargando, esperar
    if (googleMapsLoading) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval)
          googleMapsLoaded = true
          resolve(true)
        }
      }, 100)
      return
    }

    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error('Google Maps API Key no configurada'))
      return
    }

    googleMapsLoading = true

    // Crear script tag
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      googleMapsLoaded = true
      googleMapsLoading = false
      console.log('✅ Google Maps SDK cargado')
      resolve(true)
    }
    
    script.onerror = () => {
      googleMapsLoading = false
      reject(new Error('Error cargando Google Maps SDK'))
    }
    
    document.head.appendChild(script)
  })
}

/**
 * Calcula la distancia y tiempo real usando Distance Matrix API
 * @param {Object} origen - {lat, lng}
 * @param {Array} destinos - Array de {lat, lng}
 * @returns {Promise<Array>} Array con {distancia (km), duracion (min), origen, destino}
 */
export async function calcularDistanciasReales(origen, destinos) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Google Maps API Key no configurada. Usando cálculo de línea recta.')
    return null
  }

  if (!origen || !destinos || destinos.length === 0) {
    return null
  }

  try {
    // Cargar SDK si no está cargado
    await loadGoogleMapsSDK()

    // Crear servicio de Distance Matrix
    const service = new window.google.maps.DistanceMatrixService()
    
    // Formatear origen y destinos
    const origenLatLng = new window.google.maps.LatLng(origen.lat, origen.lng)
    const destinosLatLng = destinos
      .slice(0, 25) // Máximo 25 destinos
      .map(d => new window.google.maps.LatLng(d.lat, d.lng))

    // Llamar a Distance Matrix API usando SDK
    const response = await new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [origenLatLng],
          destinations: destinosLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        },
        (response, status) => {
          if (status === 'OK') {
            resolve(response)
          } else {
            reject(new Error(`Distance Matrix error: ${status}`))
          }
        }
      )
    })

    // Procesar resultados
    const resultados = []
    const row = response.rows[0]
    
    if (row && row.elements) {
      row.elements.forEach((element, index) => {
        if (element.status === 'OK') {
          resultados.push({
            destino: destinos[index],
            distancia: element.distance.value / 1000, // Convertir metros a km
            distanciaTexto: element.distance.text,
            duracion: element.duration.value / 60, // Convertir segundos a minutos
            duracionTexto: element.duration.text
          })
        } else {
          // Si no se puede calcular ruta, retornar null para ese destino
          resultados.push({
            destino: destinos[index],
            distancia: null,
            distanciaTexto: null,
            duracion: null,
            duracionTexto: null
          })
        }
      })
    }

    return resultados
  } catch (error) {
    console.error('❌ Error calculando distancias reales:', error)
    return null
  }
}

/**
 * Obtiene la ruta entre dos puntos usando Directions API
 * @param {Object} origen - {lat, lng}
 * @param {Object} destino - {lat, lng}
 * @returns {Promise<Object>} {polyline, pasos, distancia, duracion}
 */
export async function obtenerRuta(origen, destino) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Google Maps API Key no configurada')
    return null
  }

  if (!origen || !destino) {
    return null
  }

  try {
    // Cargar SDK si no está cargado
    await loadGoogleMapsSDK()

    // Crear servicio de Directions
    const service = new window.google.maps.DirectionsService()
    
    // Formatear origen y destino
    const origenLatLng = new window.google.maps.LatLng(origen.lat, origen.lng)
    const destinoLatLng = new window.google.maps.LatLng(destino.lat, destino.lng)

    // Llamar a Directions API usando SDK
    const response = await new Promise((resolve, reject) => {
      service.route(
        {
          origin: origenLatLng,
          destination: destinoLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (response, status) => {
          if (status === 'OK') {
            resolve(response)
          } else {
            reject(new Error(`Directions error: ${status}`))
          }
        }
      )
    })

    const route = response.routes[0]
    if (!route) {
      return null
    }

    // Obtener la polyline de la ruta
    const path = route.overview_path
    
    // Convertir a formato simple {lat, lng}
    const coordinates = path.map(point => ({
      lat: point.lat(),
      lng: point.lng()
    }))

    // Extraer información útil
    const leg = route.legs[0]
    
    return {
      polyline: coordinates, // Array de {lat, lng}
      distancia: leg.distance.value / 1000, // km
      distanciaTexto: leg.distance.text,
      duracion: leg.duration.value / 60, // minutos
      duracionTexto: leg.duration.text,
      pasos: leg.steps.map(step => ({
        instruccion: step.instructions.replace(/<[^>]*>/g, ''), // Remover HTML
        distancia: step.distance.text,
        duracion: step.duration.text
      })),
      startLocation: { lat: leg.start_location.lat(), lng: leg.start_location.lng() },
      endLocation: { lat: leg.end_location.lat(), lng: leg.end_location.lng() }
    }
  } catch (error) {
    console.error('❌ Error obteniendo ruta:', error)
    return null
  }
}

/**
 * Decodifica una polyline codificada de Google Maps a coordenadas
 * @param {string} encoded - Polyline codificada
 * @returns {Array} Array de {lat, lng}
 */
function decodePolyline(encoded) {
  const coordinates = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b, shift = 0, result = 0
    
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lat += dlat
    
    shift = 0
    result = 0
    
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lng += dlng
    
    coordinates.push({
      lat: lat / 1e5,
      lng: lng / 1e5
    })
  }

  return coordinates
}

/**
 * Calcula distancia en línea recta (fallback si no hay API key)
 * Fórmula de Haversine
 */
export function calcularDistanciaLineaRecta(lat1, lng1, lat2, lng2) {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
