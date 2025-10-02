import React, { useState, useEffect } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Manejar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLlaveMXLogin = () => {
    alert('Redirigiendo a LlaveMX para autenticación...\n\nEsta es una demostración. En producción se conectaría con el sistema real de LlaveMX.')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#estrategia', label: 'Nuestra Estrategia' },
    { href: '#avances', label: 'Panel de Avances' },
    { href: '#educacion', label: 'Educación Digital' },
    { href: '#participa', label: 'Participa' },
    { href: '#noticias', label: 'Noticias' }
  ]

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img 
              src="https://images.seeklogo.com/logo-png/48/3/gobierno-del-estado-de-hidalgo-logo-png_seeklogo-488593.png" 
              alt="Gobierno de Hidalgo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation Menu - Desktop */}
          <ul className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav-link text-gray-700 hover:text-primary font-medium transition-colors duration-300 relative group"
                  onClick={closeMenu}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Login Button */}
            <button
              onClick={handleLlaveMXLogin}
              className="bg-primary text-white border-2 border-primary px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 hover:bg-white hover:text-primary flex items-center gap-2"
            >
              <i className="fas fa-user text-sm"></i>
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}></span>
              <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <ul className="py-4 space-y-2 border-t border-gray-200">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 font-medium transition-colors duration-300"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header
