// Importar imágenes locales
import rutsImg from '../images/ruts.png'
import hablemosImg from '../images/hablemos.jpg'
import protestaImg from '../images/protesta.jpg'
import migrantesImg from '../images/migrantes.jpg'
import pueblosImg from '../images/pueblos.jpg'
import sairImg from '../images/sair.jpg'

// Datos de oficinas gubernamentales
export const governmentOffices = {
  "licencia de conducir": [
    {
      name: "Oficina de Tránsito Municipal - Pachuca",
      address: "Av. Revolución 1234, Centro, Pachuca",
      phone: "(771) 123-4567",
      hours: "Lunes a Viernes 8:00 - 15:00",
      coordinates: [20.1011, -98.7591]
    },
    {
      name: "Módulo de Tránsito - Plaza Galerías",
      address: "Blvd. Colosio 1500, Pachuca",
      phone: "(771) 234-5678",
      hours: "Lunes a Sábado 9:00 - 18:00",
      coordinates: [20.0847, -98.7514]
    }
  ],
  "acta de nacimiento": [
    {
      name: "Registro Civil - Pachuca Centro",
      address: "Plaza Independencia s/n, Centro, Pachuca",
      phone: "(771) 345-6789",
      hours: "Lunes a Viernes 8:00 - 15:00",
      coordinates: [20.1219, -98.7324]
    },
    {
      name: "Registro Civil - Tulancingo",
      address: "Av. Juárez 456, Centro, Tulancingo",
      phone: "(775) 456-7890",
      hours: "Lunes a Viernes 8:00 - 14:00",
      coordinates: [20.0833, -98.3667]
    }
  ],
  "pasaporte": [
    {
      name: "Delegación SRE - Pachuca",
      address: "Blvd. Felipe Ángeles 2020, Pachuca",
      phone: "(771) 567-8901",
      hours: "Lunes a Viernes 8:00 - 13:00",
      coordinates: [20.1167, -98.7333]
    }
  ],
  "curp": [
    {
      name: "Módulo CURP - Palacio Municipal",
      address: "Plaza Independencia s/n, Centro, Pachuca",
      phone: "(771) 678-9012",
      hours: "Lunes a Viernes 8:00 - 15:00",
      coordinates: [20.1219, -98.7324]
    }
  ]
}

// Datos del timeline
export const timelineData = [
  {
    year: "2022",
    title: "Se fortalece la Comisión Estatal de Mejora Regulatoria."
  },
  {
    year: "2023",
    title: "Implementación de plataformas digitales."
  },
  {
    year: "2024",
    title: "Digitalización masiva de trámites."
  },
  {
    year: "2025",
    title: "Ley Nacional para eliminar trámites burocráticos."
  },
  {
    year: "2026",
    title: "Creación de la Agencia Estatal de Simplificación y Digitalización."
  }
]

// Métricas de avance
export const metricsData = [
  {
    number: "128",
    label: "Trámites simplificados/digitalizados",
    change: "+10% este año",
    positive: true,
    icon: "fas fa-file-alt"
  },
  {
    number: "342",
    label: "Requisitos eliminados",
    change: "+12 nuevas",
    positive: true,
    icon: "fas fa-cut"
  },
  {
    number: "-37%",
    label: "Tiempo promedio reducido",
    change: "+30% este año",
    positive: true,
    icon: "fas fa-clock"
  },
  {
    number: "34",
    label: "Protestas Ciudadanas Atendidas",
    change: "+10% este año",
    positive: true,
    icon: "fas fa-bullhorn"
  },
  {
    number: "61",
    label: "Trámites gestionados a través de la plataforma Migrantes Hidalgo",
    change: "",
    positive: true,
    icon: "fas fa-plane"
  },
  {
    number: "24",
    label: "Requisitos eliminados",
    change: "+30% este año",
    positive: true,
    icon: "fas fa-minus-circle"
  },
  {
    number: "83",
    label: "Comerciantes dados de alta en la plataforma de Pueblos indígenas",
    change: "-60% vs anterior",
    positive: true,
    icon: "fas fa-feather-alt"
  }
]

// Plataformas oficiales
export const platformsData = [
  {
    title: "RUTS",
    description: "Requisitos de trámites estatales.",
    icon: "fas fa-file-alt",
    link: "#",
    image: rutsImg
  },
  {
    title: "Hablemos Hidalgo",
    description: "Agendas de simplificación y regulación.",
    icon: "fas fa-comments",
    link: "#",
    image: hablemosImg
  },
  {
    title: "Protesta Ciudadana",
    description: "Reporta incumplimientos.",
    icon: "fas fa-bullhorn",
    link: "#",
    image: protestaImg
  },
  {
    title: "Migrantes",
    description: "Apoyo y notificaciones.",
    icon: "fas fa-plane",
    link: "#",
    image: migrantesImg
  },
  {
    title: "Pueblos Indígenas",
    description: "Escaparate digital.",
    icon: "fas fa-feather-alt",
    link: "#",
    image: pueblosImg
  },
  {
    title: "SAIR",
    description: "Consulta y comentarios regulatorios.",
    icon: "fas fa-shield-alt",
    link: "#",
    image: sairImg
  }
]

// Artículos del blog
export const blogArticles = [
  {
    title: "¿Qué es LlaveMX y cómo te beneficia?",
    description: "Descubre cómo esta herramienta de identidad digital simplifica tus trámites gubernamentales.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&auto=format&q=80",
    link: "#"
  },
  {
    title: "Protege tus datos en el mundo digital",
    description: "Consejos esenciales para mantener tu información personal segura en línea.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&auto=format&q=80",
    link: "#"
  },
  {
    title: "Mitos y realidades del gobierno digital",
    description: "Desmitificamos las ideas erróneas sobre la digitalización gubernamental.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop&auto=format&q=80",
    link: "#"
  }
]

// Guías disponibles
export const guidesData = [
  {
    title: "Guía de Apps Móviles",
    description: "Aprende a usar las aplicaciones móviles del gobierno estatal",
    icon: "fas fa-mobile-alt",
    link: "#"
  },
  {
    title: "Seguridad Digital",
    description: "Manual completo de buenas prácticas en seguridad digital",
    icon: "fas fa-shield-alt",
    link: "#"
  }
]

// Preguntas frecuentes
export const faqData = [
  {
    question: "¿Es seguro usar mi LlaveMX en línea?",
    answer: "Sí, LlaveMX utiliza los más altos estándares de seguridad digital, incluyendo encriptación de extremo a extremo y autenticación multifactor."
  },
  {
    question: "¿Qué hago si no tengo acceso a internet?",
    answer: "Muchos trámites siguen disponibles de forma presencial. Consulta las oficinas de atención ciudadana más cercanas."
  },
  {
    question: "¿Cómo sé si un sitio es oficial?",
    answer: "Los sitios oficiales del gobierno de Hidalgo terminan en .hidalgo.gob.mx y tienen el sello de seguridad correspondiente."
  },
  {
    question: "¿Puedo hacer todo en línea?",
    answer: "Cada vez más trámites están disponibles completamente en línea. Consulta el catálogo de servicios digitales para ver las opciones disponibles."
  }
]

// Noticias
export const newsData = [
  {
    title: "Nueva actualización de la plataforma de trámites en línea",
    description: "Mejoras significativas en velocidad y experiencia de usuario para todos los servicios digitales.",
    category: "Comunicado",
    date: "15 de Agosto, 2024",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&auto=format&q=80",
    featured: true,
    link: "#"
  },
  {
    title: "Taller de Capacitación Digital",
    description: "Próximo taller para servidores públicos sobre nuevas herramientas.",
    category: "Evento",
    date: "10 de Agosto, 2024",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop&auto=format&q=80",
    featured: false,
    link: "#"
  },
  {
    title: "Hidalgo reconocido por innovación digital",
    description: "El estado recibe premio nacional por sus avances en gobierno digital.",
    category: "Logro",
    date: "5 de Agosto, 2024",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&auto=format&q=80",
    featured: false,
    link: "#"
  }
]
