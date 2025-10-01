import React, { useEffect, useRef, useState } from 'react'
import { platformsData } from '../data'
import llaveMXLogo from '../images/logo-llavemx.svg'

const PlatformsSection = () => {
  const sectionRef = useRef(null)
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqData = [
    {
      id: 1,
      question: "¿Comparte mis datos?",
      icon: "🔒",
      answer: "No. LlaveMX protege tu privacidad. Solo compartes la información mínima necesaria para cada trámite, y siempre con tu autorización explícita."
    },
    {
      id: 2,
      question: "¿Mi cuenta es segura?",
      icon: "🔐",
      answer: "Sí. LlaveMX utiliza los más altos estándares de seguridad digital, incluyendo encriptación de extremo a extremo y autenticación multifactor."
    },
    {
      id: 3,
      question: "¿Cómo sé si un sitio es oficial?",
      icon: "✅",
      answer: "Los sitios oficiales del gobierno terminan en .gob.mx y muestran el logo de LlaveMX. Siempre verifica la URL antes de ingresar tus datos."
    },
    {
      id: 4,
      question: "¿Puedo hacer todo en línea?",
      icon: "💻",
      answer: "Cada vez más trámites están disponibles 100% en línea. Consulta el catálogo de servicios digitales para ver todas las opciones disponibles."
    }
  ]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const platforms = entry.target.querySelectorAll('.platform-card')
            platforms.forEach((platform, index) => {
              setTimeout(() => {
                platform.classList.add('fade-in-up')
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

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Plataformas oficiales
          </h2>
          <p className="text-xl text-gray-600">
            Enlaces directos a servicios verificados.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformsData.map((platform, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image Section */}
              <div className="h-40 overflow-hidden rounded-t-lg">
                <img
                  src={platform.image}
                  alt={platform.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {platform.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {platform.description}
                </p>
                <a
                  href={platform.link}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                >
                  Ir al sitio
                  <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* LlaveMX Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Tu identidad digital: LlaveMX
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - LlaveMX Info */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex flex-col items-center text-center mb-8">
                <img 
                  src={llaveMXLogo} 
                  alt="LlaveMX Logo" 
                  className="w-40 h-32 mb-6"
                />
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">¿Qué es?</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Con una sola cuenta entras fácil y seguro a los servicios del gobierno.
                </p>
              </div>
              
              <a
                href="https://www.llave.gob.mx/RegistroCiudadano.xhtml?faces-redirect=true"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-300 inline-block text-center w-full"
              >
                Crear cuenta LlaveMX
              </a>
            </div>

            {/* Right Side - FAQ */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Preguntas rápidas
              </h3>
              <div className="space-y-3">
                {faqData.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="text-lg">{faq.icon}</span>
                      <span className="text-sm font-medium text-gray-700 flex-1">
                        {faq.question}
                      </span>
                      <i className={`fas fa-chevron-${openFAQ === faq.id ? 'up' : 'down'} text-gray-400 text-xs transition-transform duration-200`}></i>
                    </button>
                    
                    {openFAQ === faq.id && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlatformsSection
