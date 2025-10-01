import React from 'react'
import { useModalContext } from '../hooks/useModal.jsx'
import ContactForm from './forms/ContactForm'
import ReportForm from './forms/ReportForm'

const ParticipationSection = () => {
  const { openModal } = useModalContext()

  const handleContactModal = () => {
    openModal(<ContactForm />)
  }

  const handleReportModal = () => {
    openModal(<ReportForm />)
  }

  return (
    <section id="participa" className="py-20 bg-accent bg-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Participa
          </h2>
          <p className="text-xl text-gray-600">
            Tu voz es importante para mejorar nuestros servicios digitales
          </p>
        </div>

        {/* Participation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Option */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform duration-300 hover:-translate-y-2">
            <i className="fas fa-comments text-5xl text-primary mb-6"></i>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Contacto y Sugerencias
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Comparte tus ideas, dudas o comentarios para mejorar nuestros servicios
            </p>
            <button
              onClick={handleContactModal}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
            >
              Contactar
            </button>
          </div>

          {/* Report Option */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform duration-300 hover:-translate-y-2">
            <i className="fas fa-exclamation-triangle text-5xl text-primary mb-6"></i>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Reportar Falla en Plataforma
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Informa sobre problemas técnicos en alguna plataforma gubernamental
            </p>
            <button
              onClick={handleReportModal}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
            >
              Reportar Falla
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <i className="fas fa-info-circle text-3xl text-primary mb-4"></i>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              ¿Necesitas ayuda inmediata?
            </h4>
            <p className="text-gray-600 mb-6">
              Si tienes una emergencia o necesitas asistencia urgente, puedes contactarnos directamente:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-700">
                <i className="fas fa-phone text-primary"></i>
                <span>(771) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <i className="fas fa-envelope text-primary"></i>
                <span>contacto@agenciadigital.hidalgo.gob.mx</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ParticipationSection
