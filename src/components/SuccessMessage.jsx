import React from 'react'

const SuccessMessage = ({ type, onClose }) => {
  const getTypeLabel = (formType) => {
    const types = {
      'mensaje': 'mensaje',
      'reporte de falla': 'reporte de falla'
    }
    return types[formType] || 'información'
  }

  return (
    <div className="text-center py-12">
      <i className="fas fa-check-circle text-6xl text-green-500 mb-6"></i>
      <h2 className="text-2xl font-bold text-primary mb-4">
        ¡Enviado exitosamente!
      </h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Gracias por tu participación. Hemos recibido tu {getTypeLabel(type)} y te contactaremos pronto.
      </p>
      <button
        onClick={onClose}
        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
      >
        Cerrar
      </button>
    </div>
  )
}

export default SuccessMessage
