import React, { useState } from 'react'
import { blogArticles, guidesData, faqData } from '../data'

const EducationSection = () => {
  const [activeTab, setActiveTab] = useState('blog')
  const [openFAQ, setOpenFAQ] = useState(null)

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const tabs = [
    { id: 'blog', label: 'Blog' },
    { id: 'guides', label: 'Guías' },
    { id: 'faq', label: 'Preguntas Frecuentes' }
  ]

  return (
    <section id="educacion" className="py-20 bg-accent bg-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Educación Digital
          </h2>
          <p className="text-xl text-gray-600">
            Aprende sobre la transformación digital y cómo aprovechar las nuevas tecnologías
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogArticles.map((article, index) => (
                <article
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.description}
                    </p>
                    <a
                      href={article.link}
                      className="text-primary font-medium hover:underline"
                    >
                      Leer más
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Guides Tab */}
          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {guidesData.map((guide, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform duration-300 hover:-translate-y-2"
                >
                  <i className={`${guide.icon} text-5xl text-primary mb-6`}></i>
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {guide.description}
                  </p>
                  <a
                    href={guide.link}
                    className="bg-transparent text-primary border border-primary px-6 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Descargar PDF
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-300"
                    >
                      <span className="font-medium text-primary">
                        {faq.question}
                      </span>
                      <i className={`fas fa-chevron-down transition-transform duration-300 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}></i>
                    </button>
                    <div className={`px-6 transition-all duration-300 ${
                      openFAQ === index ? 'pb-4 max-h-96' : 'max-h-0 overflow-hidden'
                    }`}>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default EducationSection
