import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Enlaces Rápidos',
      links: [
        { label: 'Nuestra Estrategia', href: '#estrategia' },
        { label: 'Panel de Avances', href: '#avances' },
        { label: 'Educación Digital', href: '#educacion' },
        { label: 'Participa', href: '#participa' }
      ]
    },
    {
      title: 'Plataformas',
      links: [
        { label: 'RUTS', href: '#' },
        { label: 'Protesta Ciudadana', href: '#' },
        { label: 'Migrantes Hidalgo', href: '#' },
        { label: 'Pueblos Indígenas', href: '#' }
      ]
    },
    {
      title: 'Transparencia',
      links: [
        { label: 'Portal de Transparencia', href: '#' },
        { label: 'Datos Abiertos', href: '#' },
        { label: 'Rendición de Cuentas', href: '#' },
        { label: 'Aviso de Privacidad', href: '#' }
      ]
    }
  ]

  const socialLinks = [
    { icon: 'fab fa-facebook', href: '#', label: 'Facebook' },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
    { icon: 'fab fa-linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'fab fa-youtube', href: '#', label: 'YouTube' }
  ]

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Agency Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">
              Agencia de Simplificación y Digitalización
            </h3>
            <p className="text-white text-opacity-90 mb-6 leading-relaxed">
              Transformando Hidalgo hacia el futuro digital
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-300"
                  aria-label={social.label}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-white border-opacity-20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <i className="fas fa-envelope text-accent"></i>
              <span className="text-white text-opacity-90">
                contacto@agenciadigital.hidalgo.gob.mx
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <i className="fas fa-phone text-accent"></i>
              <span className="text-white text-opacity-90">
                (771) 123-4567
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <i className="fas fa-map-marker-alt text-accent"></i>
              <span className="text-white text-opacity-90">
                Pachuca de Soto, Hidalgo
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white border-opacity-20 pt-8 text-center">
          <p className="text-white text-opacity-80">
            &copy; {currentYear} Gobierno del Estado de Hidalgo. Todos los derechos reservados.
          </p>
          <p className="text-white text-opacity-60 text-sm mt-2">
            Desarrollado con tecnología moderna para una mejor experiencia ciudadana
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
