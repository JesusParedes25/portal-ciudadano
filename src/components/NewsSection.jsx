import React, { useEffect, useRef } from 'react'
import { newsData } from '../data'

const NewsSection = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newsCards = entry.target.querySelectorAll('.news-card')
            newsCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('fade-in-up')
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="noticias" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Noticias y Comunicados
          </h2>
          <p className="text-xl text-gray-600">
            Mantente informado sobre nuestras últimas actualizaciones
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {newsData.map((news, index) => (
            <article
              key={index}
              className={`news-card bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${
                news.featured ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <img
                src={news.image}
                alt={news.title}
                className={`w-full object-cover ${
                  news.featured ? 'h-64 lg:h-80' : 'h-48'
                }`}
              />
              <div className="p-6">
                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {news.category}
                </span>
                <h3 className={`font-bold text-primary mb-3 leading-tight ${
                  news.featured ? 'text-2xl lg:text-3xl' : 'text-xl'
                }`}>
                  {news.title}
                </h3>
                <p className={`text-gray-600 mb-4 leading-relaxed ${
                  news.featured ? 'text-lg' : ''
                }`}>
                  {news.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    {news.date}
                  </span>
                  {news.featured && (
                    <a
                      href={news.link}
                      className="text-primary font-medium hover:underline"
                    >
                      Leer completo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* More News Button */}
        <div className="text-center mt-12">
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300">
            Ver más noticias
          </button>
        </div>
      </div>
    </section>
  )
}

export default NewsSection
