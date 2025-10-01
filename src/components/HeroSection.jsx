import React from 'react'

const HeroSection = () => {
  return (
    <section id="inicio" className="hero-bg min-h-screen flex items-center pt-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-shadow leading-tight">
              Transformando Hidalgo hacia el Futuro Digital
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-shadow-sm opacity-95 leading-relaxed">
              Somos la Agencia de Simplificación y Digitalización del Estado de Hidalgo, 
              el nodo estratégico que impulsa la modernización de la gestión pública para 
              una mejor experiencia ciudadana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#ubicaciones"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1 shadow-lg"
              >
                Encontrar Oficinas
              </a>
              <a
                href="#estrategia"
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-primary"
              >
                Conoce Nuestra Estrategia
              </a>
            </div>
          </div>

          {/* Video */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/hQMX2v8Q5yI"
                  title="Mensaje del Secretario"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="text-center mt-4">
                <h4 className="text-lg font-semibold mb-2">Mensaje del Secretario</h4>
                <p className="text-sm opacity-90">
                  Conoce nuestra visión para la transformación digital
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
