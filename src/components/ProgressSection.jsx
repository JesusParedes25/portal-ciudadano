import React, { useEffect, useRef, useState } from 'react'
import { metricsData, timelineData } from '../data'

const ProgressSection = () => {
  const sectionRef = useRef(null)
  const [animatedValues, setAnimatedValues] = useState({
    tramites: 0,
    digitalizacion: 0,
    satisfaccion: 0,
    corrupcion: 0
  })

  // Datos de secretarías
  const secretariasData = [
    { nombre: 'Secretaría de Gobierno', tramites: 93, color: '#9F2241' },
    { nombre: 'Medio Ambiente y Recursos Naturales', tramites: 31, color: '#235B4E' },
    { nombre: 'Transporte Convencional Hidalgo', tramites: 27, color: '#DDC9A3' },
    { nombre: 'Infraestructura Pública', tramites: 21, color: '#3B82F6' },
    { nombre: 'Secretaría de Agricultura', tramites: 20, color: '#10B981' },
    { nombre: 'Desarrollo Económico', tramites: 9, color: '#F59E0B' },
    { nombre: 'Procuraduría General de Justicia', tramites: 8, color: '#8B5CF6' },
    { nombre: 'Secretaría de Contraloría', tramites: 8, color: '#EF4444' },
    { nombre: 'Transporte Masivo Hidalgo', tramites: 8, color: '#EC4899' },
    { nombre: 'Seguridad Pública', tramites: 6, color: '#6366F1' },
    { nombre: 'Secretaría de Movilidad', tramites: 2, color: '#14B8A6' }
  ]

  // Trámites más buscados
  const tramitesMasBuscados = [
    { nombre: 'Licencia para conducir vehículos', icon: 'fa-id-card', color: 'from-blue-500 to-blue-600' },
    { nombre: 'Constancia de no antecedentes penales', icon: 'fa-file-shield', color: 'from-green-500 to-green-600' },
    { nombre: 'Alta de vehículo particular', icon: 'fa-car', color: 'from-purple-500 to-purple-600' },
    { nombre: 'Canje de placas', icon: 'fa-exchange-alt', color: 'from-orange-500 to-orange-600' },
    { nombre: 'Expedición de actas del registro familiar', icon: 'fa-certificate', color: 'from-pink-500 to-pink-600' },
    { nombre: 'Impuesto sobre tenencia vehicular', icon: 'fa-money-bill-wave', color: 'from-red-500 to-red-600' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animar números
            animateValue('tramites', 0, 232, 2000)
            animateValue('digitalizacion', 0, 2.2, 2000)
            animateValue('satisfaccion', 0, 72.2, 2000)
            animateValue('corrupcion', 0, 3.6, 2000)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateValue = (key, start, end, duration) => {
    const range = end - start
    const increment = range / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end
        clearInterval(timer)
      }
      setAnimatedValues(prev => ({ ...prev, [key]: current }))
    }, 16)
  }

  return (
    <section id="avances" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Panel Ciudadano 2025
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce el avance en digitalización y simplificación de trámites en Hidalgo
          </p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Trámites en simplificación */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-[#9F2241] transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-14 h-14 bg-[#9F2241] bg-opacity-10 rounded-full flex items-center justify-center">
                <i className="fas fa-tasks text-2xl text-[#9F2241]"></i>
              </div>
              <div className="text-5xl font-bold text-[#9F2241]">
                {Math.floor(animatedValues.tramites)}
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">Trámites</p>
            <p className="text-sm text-gray-500 mt-1">En proceso de simplificación</p>
          </div>

          {/* Nivel de digitalización */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-[#235B4E] transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-14 h-14 bg-[#235B4E] bg-opacity-10 rounded-full flex items-center justify-center">
                <i className="fas fa-chart-line text-2xl text-[#235B4E]"></i>
              </div>
              <div className="text-5xl font-bold text-[#235B4E]">
                {animatedValues.digitalizacion.toFixed(1)}
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">Digitalización</p>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#235B4E] h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${(animatedValues.digitalizacion / 4) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Nivel de {animatedValues.digitalizacion.toFixed(1)} de 4</p>
            </div>
          </div>

          {/* Satisfacción ciudadana */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-14 h-14 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center">
                <i className="fas fa-smile text-2xl text-green-500"></i>
              </div>
              <div className="text-5xl font-bold text-green-500">
                {Math.floor(animatedValues.satisfaccion)}%
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">Satisfacción</p>
            <p className="text-sm text-gray-500 mt-1">Ciudadana (ENCIG 2023)</p>
          </div>

          {/* Transparencia */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-14 h-14 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-2xl text-blue-500"></i>
              </div>
              <div className="text-5xl font-bold text-blue-500">
                {animatedValues.corrupcion.toFixed(1)}%
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">Corrupción</p>
            <p className="text-sm text-gray-500 mt-1">Reportes de actos indebidos</p>
          </div>
        </div>

        {/* Dos columnas: Secretarías y Trámites más buscados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Secretarías con trámites en simplificación */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                <i className="fas fa-building text-[#9F2241] mr-2"></i>
                Trámites por Secretaría
              </h3>
              <p className="text-gray-600">Distribución de los 232 trámites en simplificación</p>
            </div>

            <div className="space-y-4">
              {secretariasData.map((sec, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#9F2241] transition-colors">
                      {sec.nombre}
                    </span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {sec.tramites}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(sec.tramites / 93) * 100}%`,
                        backgroundColor: sec.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trámites más buscados */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                <i className="fas fa-fire text-orange-500 mr-2"></i>
                Trámites Más Buscados
              </h3>
              <p className="text-gray-600">Los más consultados en RUTS desde 2022</p>
            </div>

            <div className="space-y-3">
              {tramitesMasBuscados.map((tramite, idx) => (
                <div 
                  key={idx} 
                  className={`bg-gradient-to-r ${tramite.color} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <i className={`fas ${tramite.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{tramite.nombre}</span>
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Datos ENCIG 2023 - Satisfacción y Canales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Satisfacción General */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                <i className="fas fa-chart-pie text-green-500 mr-2"></i>
                Satisfacción General
              </h3>
              <p className="text-gray-600 text-sm">Fuente: ENCIG 2023 (INEGI)</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Muy satisfecho</span>
                </div>
                <span className="text-lg font-bold text-green-600">18.8%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Satisfecho</span>
                </div>
                <span className="text-lg font-bold text-green-400">53.4%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Algo satisfecho</span>
                </div>
                <span className="text-lg font-bold text-yellow-500">12.6%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Algo insatisfecho</span>
                </div>
                <span className="text-lg font-bold text-orange-500">5.6%</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-xs font-medium text-gray-700">Insatisfecho</span>
                  </div>
                  <span className="text-sm font-bold text-red-400">4.1%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    <span className="text-xs font-medium text-gray-700">Muy insatisf.</span>
                  </div>
                  <span className="text-sm font-bold text-red-600">5.4%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <i className="fas fa-thumbs-up text-3xl text-green-600"></i>
                <div>
                  <p className="text-2xl font-bold text-green-700">72.2%</p>
                  <p className="text-sm text-gray-600">Satisfacción positiva total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Canales de atención */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                <i className="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                Canales de Atención
              </h3>
              <p className="text-gray-600 text-sm">¿Dónde realizan sus trámites los ciudadanos?</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-building text-orange-500"></i>
                    <span className="text-sm font-medium text-gray-700">Instalaciones de gobierno</span>
                  </div>
                  <span className="text-lg font-bold text-orange-500">74.6%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{ width: '74.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-globe text-pink-500"></i>
                    <span className="text-sm font-medium text-gray-700">Internet</span>
                  </div>
                  <span className="text-lg font-bold text-pink-500">9.6%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-pink-500 h-3 rounded-full" style={{ width: '9.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-phone text-yellow-500"></i>
                    <span className="text-sm font-medium text-gray-700">Línea telefónica</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-500">9.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '9.4%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-store text-blue-500"></i>
                    <span className="text-sm font-medium text-gray-700">Banco/Tienda/Farmacia</span>
                  </div>
                  <span className="text-lg font-bold text-blue-500">4.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '4.4%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-ellipsis-h text-gray-400"></i>
                    <span className="text-sm font-medium text-gray-700">Otros</span>
                  </div>
                  <span className="text-lg font-bold text-gray-400">2.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gray-400 h-3 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <i className="fas fa-info-circle text-2xl text-blue-600"></i>
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-blue-700">Oportunidad:</span> Incrementar el uso de canales digitales para mayor comodidad ciudadana
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ProgressSection
