import React, { useEffect, useRef } from 'react'

const AboutSection = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.about-card')
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('fade-in-up')
              }, index * 200)
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

  const aboutCards = [
    {
      icon: 'fas fa-bullseye',
      title: 'Nuestra Misión',
      description: 'Simplificar y digitalizar los procesos gubernamentales para crear un gobierno más eficiente, transparente y cercano a la ciudadanía hidalguense.'
    },
    {
      icon: 'fas fa-eye',
      title: 'Nuestra Visión',
      description: 'Ser el referente nacional en transformación digital gubernamental, posicionando a Hidalgo como un estado líder en innovación y modernización administrativa.'
    },
    {
      icon: 'fas fa-users',
      title: 'Nuestro Equipo',
      description: 'Profesionales especializados en tecnología, gestión pública y experiencia de usuario, comprometidos con la transformación digital del estado.'
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="about-card text-center p-8 rounded-xl bg-accent bg-opacity-5 border border-secondary border-opacity-10 transition-transform duration-300 hover:-translate-y-2 card-hover"
            >
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <i className={`${card.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
