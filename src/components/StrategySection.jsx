import React, { useEffect, useRef } from 'react'

const StrategySection = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pillars = entry.target.querySelectorAll('.strategy-pillar')
            pillars.forEach((pillar, index) => {
              setTimeout(() => {
                pillar.classList.add('fade-in-up')
              }, index * 150)
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

  const strategyPillars = [
    {
      number: '01',
      title: 'Simplificación de Procesos',
      description: 'Eliminamos barreras burocráticas y optimizamos los trámites para reducir tiempos y mejorar la experiencia ciudadana.'
    },
    {
      number: '02',
      title: 'Digitalización Inteligente',
      description: 'Implementamos tecnologías modernas que facilitan el acceso a servicios gubernamentales desde cualquier lugar y momento.'
    },
    {
      number: '03',
      title: 'Capacitación y Adopción',
      description: 'Educamos y acompañamos a ciudadanos y servidores públicos en el uso de las nuevas herramientas digitales.'
    },
    {
      number: '04',
      title: 'Transparencia y Participación',
      description: 'Promovemos un gobierno abierto que facilite la participación ciudadana y el acceso a la información pública.'
    }
  ]

  return (
    <section id="estrategia" ref={sectionRef} className="py-20 bg-accent bg-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Nuestra Estrategia Digital
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un enfoque integral para la transformación del gobierno hidalguense
          </p>
        </div>

        {/* Strategy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {strategyPillars.map((pillar, index) => (
            <div
              key={index}
              className="strategy-pillar bg-white p-8 rounded-xl shadow-lg relative transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 left-8 w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{pillar.number}</span>
              </div>

              {/* Content */}
              <div className="pt-6">
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StrategySection
