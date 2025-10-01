import React, { useState } from 'react'
import { useModalContext } from '../../hooks/useModal.jsx'
import SuccessMessage from '../SuccessMessage'

const ContactForm = () => {
  const { closeModal, openModal } = useModalContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
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
      openModal(<SuccessMessage type="mensaje" onClose={closeModal} />)
      console.log('Formulario de contacto enviado:', formData)
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        Contacto y Sugerencias
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
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de contacto
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selecciona el tipo</option>
            <option value="sugerencia">Sugerencia de mejora</option>
            <option value="duda">Duda o consulta</option>
            <option value="felicitacion">Felicitación</option>
            <option value="queja">Queja o reclamo</option>
            <option value="informacion">Solicitud de información</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Comparte tu mensaje, sugerencia o consulta..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
          ></textarea>
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
              'Enviar Mensaje'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
