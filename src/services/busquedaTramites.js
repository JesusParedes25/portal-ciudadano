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
  
  // PRIORIDAD MÁXIMA: Coincidencia EXACTA de toda la frase en nombre
  if (consultaNormalizada.length > 5 && nombreNorm.includes(consultaNormalizada)) {
    puntuacion += 500 // Muy alto para garantizar que sea el primero
  }
  
  // PRIORIDAD ALTA: Coincidencia de palabras principales en secuencia en el nombre
  const palabrasPrincipales = palabrasClave.filter(p => p.length > 3)
  if (palabrasPrincipales.length >= 2) {
    const todasEnNombre = palabrasPrincipales.every(p => nombreNorm.includes(p))
    if (todasEnNombre) {
      puntuacion += 200 // Alto puntaje por tener todas las palabras clave principales
    }
  }
  
  // PENALIZACIÓN FUERTE: Reducir dramáticamente trámites que son variantes
  const palabrasVariante = ['provisional', 'reposicion', 'renovacion', 'canje', 'duplicado', 
                            'constancia de no', 'liberacion', 'infraccion']
  const esVariante = palabrasVariante.some(palabra => nombreNorm.includes(palabra))
  
  if (esVariante) {
    // PENALIZACIÓN MUY FUERTE para variantes
    puntuacion = Math.max(0, puntuacion - 300)
  } else {
    // BONUS FUERTE para trámites principales (sin palabras de variante)
    if (palabrasPrincipales.length > 0) {
      const todasPalabrasEnNombre = palabrasPrincipales.every(p => nombreNorm.includes(p))
      if (todasPalabrasEnNombre) {
        puntuacion += 150 // Bonus muy fuerte para trámites principales
      }
    }
  }
  
  // Búsqueda por coincidencia exacta de frase en descripción (menos peso)
  if (consultaNormalizada.length > 5 && descripcionNorm.includes(consultaNormalizada)) {
    puntuacion += 50
  }
  
  // Búsqueda por palabras clave individuales
  palabrasClave.forEach(palabra => {
    // Solo contar palabras significativas (>3 caracteres)
    const peso = palabra.length > 3 ? 1 : 0.3
    
    if (nombreNorm.includes(palabra)) {
      puntuacion += 20 * peso
    }
    if (descripcionNorm.includes(palabra)) {
      puntuacion += 10 * peso
    }
    if (secretariaNorm.includes(palabra)) {
      puntuacion += 8 * peso
    }
    if (dependenciaNorm.includes(palabra)) {
      puntuacion += 8 * peso
    }
    if (requisitosNorm.includes(palabra)) {
      puntuacion += 5 * peso
    }
    if (tipoNorm.includes(palabra)) {
      puntuacion += 3 * peso
    }
  })
  
  // Bonus por múltiples palabras clave encontradas (solo palabras significativas)
  const palabrasEncontradasNombre = palabrasClave.filter(palabra => 
    palabra.length > 3 && nombreNorm.includes(palabra)
  ).length
  
  const palabrasEncontradasTotal = palabrasClave.filter(palabra => 
    palabra.length > 3 && (
      nombreNorm.includes(palabra) || 
      descripcionNorm.includes(palabra)
    )
  ).length
  
  // Bonus especial si están en el nombre
  if (palabrasEncontradasNombre > 1) {
    puntuacion += palabrasEncontradasNombre * 15
  } else if (palabrasEncontradasTotal > 1) {
    puntuacion += palabrasEncontradasTotal * 5
  }
  
  return puntuacion
}

/**
 * Busca trámites relevantes basándose en la consulta del usuario
 * Ahora con expansión de sinónimos para mayor inteligencia
 */
export function buscarTramitesRelevantes(consulta, limite = 8) {
  const consultaNormalizada = normalizarTexto(consulta)
  const palabrasClave = extraerPalabrasClave(consulta)
  
  // Si no hay palabras clave útiles, retornar trámites populares
  if (palabrasClave.length === 0 && consultaNormalizada.length < 3) {
    return tramitesData.slice(0, limite)
  }
  
  // Expandir con sinónimos para búsqueda más inteligente
  const palabrasExpandidas = expandirConSinonimos(palabrasClave)
  
  // Calcular relevancia para cada trámite con palabras expandidas
  const tramitesConPuntuacion = tramitesData.map(tramite => ({
    tramite,
    puntuacion: calcularRelevancia(tramite, palabrasExpandidas, consultaNormalizada)
  }))
  
  // Filtrar solo trámites con puntuación > 0 y ordenar
  const tramitesConPuntuacionFiltrados = tramitesConPuntuacion
    .filter(t => t.puntuacion > 0)
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .slice(0, limite)
  
  // Debug: mostrar los 3 primeros con puntuación
  console.log('🔍 Top 3 trámites encontrados:')
  tramitesConPuntuacionFiltrados.slice(0, 3).forEach((item, idx) => {
    console.log(`  ${idx + 1}. [${item.puntuacion} pts] ${item.tramite.nombre} (ID: ${item.tramite.idtram})`)
  })
  
  const tramitesRelevantes = tramitesConPuntuacionFiltrados.map(t => t.tramite)
  
  // Si aún no hay resultados, buscar por categorías semánticas
  if (tramitesRelevantes.length === 0) {
    console.log('⚠️ Sin resultados directos, buscando por categorías...')
    return buscarPorCategorias(consultaNormalizada, limite)
  }
  
  return tramitesRelevantes
}

/**
 * Sinónimos y variaciones coloquiales para búsqueda inteligente
 */
const SINONIMOS = {
  // Licencia de conducir - SIN incluir "permiso" para evitar confusión con "permiso provisional"
  'licencia': ['licencia', 'carnet', 'credencial'],
  'conducir': ['conducir', 'manejar', 'automovilista', 'conductor', 'vehiculo', 'vehiculos'],
  'renovar': ['renovar', 'revalidar', 'actualizar', 'refrendo', 'refrendar'],
  
  // Actas
  'acta': ['acta', 'certificado', 'constancia', 'documento'],
  'nacimiento': ['nacimiento', 'nacer', 'nacido', 'nacio'],
  'matrimonio': ['matrimonio', 'casamiento', 'boda', 'casarse', 'casar'],
  'defuncion': ['defuncion', 'muerte', 'fallecimiento', 'fallecido', 'muerto'],
  'divorcio': ['divorcio', 'separacion', 'divorciarse'],
  
  // Predial
  'predial': ['predial', 'impuesto', 'contribucion', 'pago'],
  'propiedad': ['propiedad', 'terreno', 'predio', 'inmueble', 'casa', 'lote'],
  
  // Construcción
  'construccion': ['construccion', 'obra', 'edificar', 'construir', 'albañil'],
  'permiso': ['permiso', 'autorizacion', 'visto bueno'],
  
  // Negocios
  'negocio': ['negocio', 'empresa', 'comercio', 'local', 'tienda', 'establecimiento'],
  'abrir': ['abrir', 'apertura', 'iniciar', 'empezar', 'poner'],
  
  // Agua
  'agua': ['agua', 'hidrico', 'potable', 'caev'],
  'toma': ['toma', 'conexion', 'instalacion', 'contrato', 'servicio'],
  
  // Documentos
  'apostilla': ['apostilla', 'apostillar', 'legalizar', 'legalizacion', 'validar'],
  'copia': ['copia', 'duplicado', 'reposicion', 'otra'],
  
  // Vehículos
  'placas': ['placas', 'placa', 'tarjeta', 'circulacion', 'emplacamiento'],
  'tarjeton': ['tarjeton', 'tarjeta', 'circulacion', 'vehicular'],
  
  // Pensiones y apoyos
  'pension': ['pension', 'adulto mayor', 'tercera edad', 'jubilado'],
  'apoyo': ['apoyo', 'ayuda', 'subsidio', 'beca', 'programa'],
  
  // Antecedentes
  'antecedentes': ['antecedentes', 'penales', 'no penales', 'carta'],
  
  // Salud
  'medico': ['medico', 'clinica', 'hospital', 'salud', 'sanitario', 'doctor'],
  
  // Educación
  'titulo': ['titulo', 'certificado', 'diploma', 'cedula', 'estudios'],
  'escuela': ['escuela', 'colegio', 'preparatoria', 'universidad', 'educacion']
}

/**
 * Expande una consulta con sinónimos
 */
function expandirConSinonimos(palabrasClave) {
  const palabrasExpandidas = new Set(palabrasClave)
  
  palabrasClave.forEach(palabra => {
    // Buscar sinónimos
    for (const [termino, sinonimos] of Object.entries(SINONIMOS)) {
      if (palabra === termino || sinonimos.includes(palabra)) {
        // Agregar todos los sinónimos
        sinonimos.forEach(sin => palabrasExpandidas.add(sin))
      }
    }
  })
  
  return Array.from(palabrasExpandidas)
}

/**
 * Búsqueda por categorías semánticas cuando no hay coincidencias directas
 */
export function buscarPorCategorias(consultaNormalizada, limite = 8) {
  const categorias = {
    'licencia_conducir': ['licencia', 'conducir', 'manejo', 'chofer', 'automovilista', 'manejar', 'carnet', 'permiso conducir'],
    'actas': ['acta', 'nacimiento', 'matrimonio', 'defuncion', 'registro', 'civil', 'nacer', 'casamiento', 'muerte'],
    'predial': ['predial', 'impuesto', 'propiedad', 'catastro', 'terreno', 'contribucion', 'predio'],
    'construccion': ['construccion', 'obra', 'edificar', 'permiso', 'construir', 'albañil'],
    'agua': ['agua', 'potable', 'alcantarillado', 'drenaje', 'hidrico', 'toma', 'caev', 'conexion'],
    'salud': ['salud', 'medico', 'clinica', 'hospital', 'sanitario', 'doctor'],
    'educacion': ['educacion', 'escuela', 'certificado', 'titulo', 'estudios', 'diploma'],
    'negocio': ['negocio', 'comercio', 'establecimiento', 'apertura', 'empresa', 'tienda', 'local'],
    'vehiculos': ['transporte', 'vehiculo', 'placas', 'tarjeton', 'circulacion', 'emplacamiento'],
    'apostilla': ['apostilla', 'apostillar', 'legalizar', 'legalizacion', 'validar'],
    'antecedentes': ['antecedentes', 'penales', 'no penales', 'carta'],
    'pension': ['pension', 'adulto mayor', 'tercera edad', 'jubilado', 'apoyo'],
    'copias': ['copia', 'duplicado', 'reposicion', 'otra']
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
