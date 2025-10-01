import React, { useEffect } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StrategySection from './components/StrategySection'
import ProgressSection from './components/ProgressSection'
import PlatformsSection from './components/PlatformsSection'
import LocationsSection from './components/LocationsSection'
import EducationSection from './components/EducationSection'
import ParticipationSection from './components/ParticipationSection'
import NewsSection from './components/NewsSection'
import Footer from './components/Footer'
import Modal from './components/Modal'
import Chatbot from './components/Chatbot'
import { ModalProvider, useModalContext } from './hooks/useModal.jsx'

function AppContent() {
  const { isModalOpen, modalContent, closeModal } = useModalContext()

  // Smooth scrolling para enlaces internos
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (target) {
        e.preventDefault()
        const targetElement = document.querySelector(target.getAttribute('href'))
        if (targetElement) {
          const headerOffset = 100
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }
    }

    document.addEventListener('click', handleSmoothScroll)
    return () => document.removeEventListener('click', handleSmoothScroll)
  }, [])

  // Actualizar navegación activa en scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const navLinks = document.querySelectorAll('.nav-link')
      
      let current = ''
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top
        if (sectionTop <= 150) {
          current = section.getAttribute('id')
        }
      })

      navLinks.forEach(link => {
        link.classList.remove('active')
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <StrategySection />
        <ProgressSection />
        <LocationsSection />
        <PlatformsSection />
        <EducationSection />
        <ParticipationSection />
        <NewsSection />
      </main>

      <Footer />

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {modalContent}
        </Modal>
      )}

      {/* Chatbot flotante */}
      <Chatbot />
    </div>
  )
}

function App() {
  return (
    <ModalProvider>
      <AppContent />
    </ModalProvider>
  )
}

export default App
