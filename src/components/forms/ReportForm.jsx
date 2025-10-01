import React, { useState } from 'react'
import { useModalContext } from '../../hooks/useModal.jsx'
import SuccessMessage from '../SuccessMessage'

const ReportForm = () => {
  const { closeModal, openModal } = useModalContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: '',
    url: '',
    severity: '',
    description: '',
    browser: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false)
      openModal(<SuccessMessage type="reporte de falla" onClose={closeModal} />)
      console.log('Reporte de falla enviado:', formData)
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        Reportar Falla en Plataforma
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma con falla
          </label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selecciona la plataforma</option>
            <option value="ruts">RUTS - Registro Único de Trámites</option>
            <option value="aid-ruts">Aid RUTS - Asistencia para trámites</option>
            <option value="protesta">Protesta Ciudadana</option>
            <option value="migrantes">Plataforma Migrantes Hidalgo</option>
            <option value="pueblos">Plataforma Pueblos Indígenas</option>
            <option value="sair">SAIR - Sistema de Atención Integral</option>
            <option value="otra">Otra plataforma gubernamental</option>
          </select>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL de la plataforma (opcional)
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://ejemplo.hidalgo.gob.mx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <small className="text-gray-500 text-xs">
            Incluye la dirección web donde encontraste el problema
          </small>
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
            Severidad del problema
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selecciona la severidad</option>
            <option value="baja">Baja - Problema cosmético o menor</option>
            <option value="media">Media - Afecta algunas funciones</option>
            <option value="alta">Alta - Funcionalidad principal no funciona</option>
            <option value="critica">Crítica - Plataforma completamente inaccesible</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción detallada del problema
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe paso a paso qué estabas haciendo cuando ocurrió el problema, qué esperabas que pasara y qué pasó realmente..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
          ></textarea>
        </div>

        <div>
          <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-1">
            Navegador y dispositivo (opcional)
          </label>
          <input
            type="text"
            id="browser"
            name="browser"
            value={formData.browser}
            onChange={handleChange}
            placeholder="Ej: Chrome en Windows, Safari en iPhone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isSubmitting ? (
              <>
                <span className="spinner mr-2"></span>
                Enviando...
              </>
            ) : (
              'Reportar Falla'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReportForm
