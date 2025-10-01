import tramitesData from '../tramites/ruts.tramites_sept.json'

/**
 * Normaliza texto removiendo acentos y caracteres especiales
 */
export function normalizarTexto(texto) {
  if (!texto) return ''
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
}

/**
 * Extrae palabras clave significativas de una consulta
 */
export function extraerPalabrasClave(consulta) {
  const palabrasComunes = [
    'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'para', 'por', 
    'con', 'en', 'que', 'como', 'donde', 'cual', 'cuando', 'necesito', 
    'quiero', 'puedo', 'hacer', 'tramite', 'servicio', 'informacion', 
    'sobre', 'dame', 'busco', 'me', 'mi', 'tu', 'su', 'hay', 'tiene',
    'esta', 'esa', 'ese', 'estos', 'estas'
  ]
  
  const palabras = normalizarTexto(consulta)
    .split(/\s+/)
    .filter(p => p.length > 2 && !palabrasComunes.includes(p))
  
  return palabras
}

/**
 * Calcula puntuación de relevancia entre consulta y trámite
 */
export function calcularRelevancia(tramite, palabrasClave, consultaNormalizada) {
  let puntuacion = 0
  
  // Preparar textos del trámite
  const nombreNorm = normalizarTexto(tramite.nombre)
  const descripcionNorm = normalizarTexto(tramite.descripcion || '')
  const requisitosNorm = normalizarTexto(tramite.requisitos || '')
  const secretariaNorm = normalizarTexto(tramite.secretaria?.nombre || '')
  const dependenciaNorm = normalizarTexto(tramite.dependencia?.nombre || '')
  const tipoNorm = normalizarTexto(tramite.tipo || '')
  
  // Búsqueda por coincidencia exacta de frase en nombre (máxima prioridad)
  if (consultaNormalizada.length > 3 && nombreNorm.includes(consultaNormalizada)) {
    puntuacion += 100
  }
  
  // Búsqueda por coincidencia exacta de frase en descripción
  if (consultaNormalizada.length > 3 && descripcionNorm.includes(consultaNormalizada)) {
    puntuacion += 50
  }
  
  // Puntuación por palabras clave
  palabrasClave.forEach(palabra => {
    // En nombre (alta prioridad)
    if (nombreNorm.includes(palabra)) {
      puntuacion += 20
    }
    
    // En descripción (media prioridad)
    if (descripcionNorm.includes(palabra)) {
      puntuacion += 10
    }
    
    // En requisitos (baja prioridad pero útil)
    if (requisitosNorm.includes(palabra)) {
      puntuacion += 5
    }
    
    // En secretaría o dependencia
    if (secretariaNorm.includes(palabra) || dependenciaNorm.includes(palabra)) {
      puntuacion += 8
    }
    
    // En tipo de trámite
    if (tipoNorm.includes(palabra)) {
      puntuacion += 3
    }
  })
  
  // Bonus por múltiples palabras clave encontradas
  const palabrasEncontradas = palabrasClave.filter(palabra => 
    nombreNorm.includes(palabra) || 
    descripcionNorm.includes(palabra) ||
    requisitosNorm.includes(palabra)
  ).length
  
  if (palabrasEncontradas > 1) {
    puntuacion += palabrasEncontradas * 5
  }
  
  return puntuacion
}

/**
 * Busca trámites relevantes basándose en la consulta del usuario
 */
export function buscarTramitesRelevantes(consulta, limite = 8) {
  const consultaNormalizada = normalizarTexto(consulta)
  const palabrasClave = extraerPalabrasClave(consulta)
  
  // Si no hay palabras clave útiles, retornar trámites populares
  if (palabrasClave.length === 0 && consultaNormalizada.length < 3) {
    return tramitesData.slice(0, limite)
  }
  
  // Calcular relevancia para cada trámite
  const tramitesConPuntuacion = tramitesData.map(tramite => ({
    tramite,
    puntuacion: calcularRelevancia(tramite, palabrasClave, consultaNormalizada)
  }))
  
  // Filtrar solo trámites con puntuación > 0 y ordenar
  const tramitesRelevantes = tramitesConPuntuacion
    .filter(t => t.puntuacion > 0)
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .slice(0, limite)
    .map(t => t.tramite)
  
  // Si aún no hay resultados, buscar por categorías semánticas
  if (tramitesRelevantes.length === 0) {
    return buscarPorCategorias(consultaNormalizada, limite)
  }
  
  return tramitesRelevantes
}

/**
 * Búsqueda por categorías semánticas cuando no hay coincidencias directas
 */
export function buscarPorCategorias(consultaNormalizada, limite = 8) {
  const categorias = {
    'agua': ['agua', 'potable', 'alcantarillado', 'drenaje', 'hidrico', 'toma'],
    'licencia': ['licencia', 'conducir', 'manejo', 'chofer', 'automovilista', 'vehiculo'],
    'acta': ['acta', 'nacimiento', 'matrimonio', 'defuncion', 'registro', 'civil'],
    'predial': ['predial', 'impuesto', 'propiedad', 'catastro', 'terreno'],
    'construccion': ['construccion', 'obra', 'edificar', 'permiso', 'licencia'],
    'salud': ['salud', 'medico', 'clinica', 'hospital', 'sanitario'],
    'educacion': ['educacion', 'escuela', 'certificado', 'titulo', 'estudios'],
    'negocio': ['negocio', 'comercio', 'establecimiento', 'apertura', 'empresa'],
    'transporte': ['transporte', 'vehiculo', 'placas', 'tarjeton', 'circulacion'],
    'medio_ambiente': ['ambiente', 'ecologia', 'residuos', 'basura', 'ambiental']
  }
  
  for (const [categoria, terminos] of Object.entries(categorias)) {
    const tieneCategoria = terminos.some(termino => consultaNormalizada.includes(termino))
    
    if (tieneCategoria) {
      const resultados = tramitesData.filter(tramite => {
        const nombreNorm = normalizarTexto(tramite.nombre)
        const descripcionNorm = normalizarTexto(tramite.descripcion || '')
        
        return terminos.some(termino => 
          nombreNorm.includes(termino) || descripcionNorm.includes(termino)
        )
      })
      
      if (resultados.length > 0) {
        return resultados.slice(0, limite)
      }
    }
  }
  
  // Si nada funciona, retornar los primeros trámites
  return tramitesData.slice(0, limite)
}

/**
 * Genera sugerencias de autocompletado inteligente
 */
export function generarSugerencias(query, limite = 8) {
  if (!query || query.length < 2) {
    return []
  }

  const queryNormalizado = normalizarTexto(query)
  const palabrasClave = extraerPalabrasClave(query)
  
  // Encontrar trámites relevantes
  const tramitesRelevantes = buscarTramitesRelevantes(query, 15)
  
  // Generar sugerencias únicas basadas en los trámites encontrados
  const sugerencias = new Set()
  
  tramitesRelevantes.forEach(tramite => {
    // Agregar el nombre completo del trámite
    sugerencias.add(tramite.nombre)
    
    // Si el query está en el nombre, agregarlo como sugerencia
    const nombreNorm = normalizarTexto(tramite.nombre)
    if (nombreNorm.includes(queryNormalizado)) {
      sugerencias.add(tramite.nombre)
    }
  })
  
  return Array.from(sugerencias).slice(0, limite)
}

/**
 * Obtiene todos los trámites
 */
export function obtenerTodosTramites() {
  return tramitesData
}

/**
 * Obtiene un trámite por ID
 */
export function obtenerTramitePorId(idtram) {
  return tramitesData.find(tramite => tramite.idtram === parseInt(idtram))
}

/**
 * Obtiene un trámite por nombre exacto
 */
export function obtenerTramitePorNombre(nombre) {
  return tramitesData.find(tramite => tramite.nombre === nombre)
}
