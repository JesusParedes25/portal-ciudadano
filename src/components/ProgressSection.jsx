import React, { useEffect, useRef } from 'react'
import { metricsData, timelineData } from '../data'

const ProgressSection = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const metrics = entry.target.querySelectorAll('.metric-card')
            const timelineItems = entry.target.querySelectorAll('.timeline-item')
            
            metrics.forEach((metric, index) => {
              setTimeout(() => {
                metric.classList.add('fade-in-up')
              }, index * 100)
            })

            timelineItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('fade-in-up')
              }, (metrics.length * 100) + (index * 200))
            })
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

  return (
    <section id="avances" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Avances 2025
          </h2>
          <p className="text-xl text-gray-600">
            Cambios reales que ya hacen tu trámite más sencillo.
          </p>
        </div>

        {/* Metrics Grid - Primera fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <i className="fas fa-file-alt text-2xl text-gray-400"></i>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">128</div>
                <div className="text-gray-600 text-sm">Trámites simplificados/digitalizados</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <i className="fas fa-cut text-2xl text-gray-400"></i>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">342</div>
                <div className="text-gray-600 text-sm">Requisitos eliminados</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <i className="fas fa-clock text-2xl text-gray-400"></i>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">-37%</div>
                <div className="text-gray-600 text-sm">Tiempo promedio reducido</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Nuestro avance, año con año
          </h3>
          
          {/* Timeline Items */}
          <div className="relative">
            {/* Línea vertical conectora */}
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gray-300"></div>
            
            <div className="space-y-4 relative">
              {timelineData.map((item, index) => (
                <div key={index} className="flex items-start gap-3 relative">
                  {/* Year Dot */}
                  <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-1.5 relative z-10"></div>
                  
                  {/* Content */}
                  <div>
                    <span className="text-base font-bold text-primary">{item.year}</span>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProgressSection
