import { useState, createContext, useContext } from 'react'

const ModalContext = createContext()

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  const openModal = (content) => {
    setModalContent(content)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
  }

  return {
    isModalOpen,
    modalContent,
    openModal,
    closeModal
  }
}

export const ModalProvider = ({ children }) => {
  const modal = useModal()
  
  return (
    <ModalContext.Provider value={modal}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }
  return context
}
