import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendChatMessage } from '../services/chatbotService'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy **RutBot**, tu asistente virtual del Gobierno de Hidalgo. Estoy aquí para ayudarte con trámites y servicios del estado. ¿En qué puedo ayudarte hoy? 😊'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Enviar mensaje al servicio de chatbot
      const response = await sendChatMessage(userMessage, messages)
      
      // Agregar respuesta del asistente
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Error al obtener respuesta:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInput(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const quickQuestions = [
    '¿Qué requisitos necesito para contratar agua potable?',
    '¿Dónde puedo hacer un trámite de licencia de conducir?',
    '¿Qué trámites puedo hacer en línea?',
    'Buscar oficinas cerca de mí'
  ]

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-[#235B4E]' : 'bg-[#9F2241]'
        }`}
        aria-label="Abrir asistente virtual"
      >
        {isOpen ? (
          <svg className="w-8 h-8 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-[#9F2241]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#9F2241] to-[#235B4E] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#9F2241]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">RutBot - Asistente Virtual</h3>
                <p className="text-xs text-white/90">Gobierno de Hidalgo</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-[#9F2241] text-white'
                      : 'bg-white text-gray-800 shadow-md border border-gray-200'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          // Estilos personalizados para elementos markdown
                          p: ({node, ...props}) => <p className="mb-2" {...props} />,
                          a: ({node, ...props}) => <a className="text-[#9F2241] hover:text-[#235B4E] font-medium underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="ml-2" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                          h3: ({node, ...props}) => <h3 className="font-bold text-base mt-2 mb-1" {...props} />,
                          h4: ({node, ...props}) => <h4 className="font-semibold text-sm mt-2 mb-1" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#9F2241] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#235B4E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#DDC9A3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Preguntas rápidas (solo mostrar al inicio) */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center font-semibold">Preguntas frecuentes:</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left bg-white hover:bg-[#9F2241] hover:text-white text-sm text-gray-700 rounded-lg px-3 py-2 border border-gray-200 transition-colors duration-200 shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9F2241] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#9F2241] hover:bg-[#235B4E] text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                aria-label="Enviar mensaje"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Proporciono información oficial basada en datos gubernamentales
            </p>
          </form>
        </div>
      )}
    </>
  )
}

export default Chatbot
