export type Lang = 'en' | 'es'

export const nav = {
  en: {
    home: 'Home',
    about: 'Who We Are',
    process: 'Our Process',
    craft: 'Craftsmanship',
    products: 'Collections',
    contact: 'Contact',
    enquire: 'Enquire',
  },
  es: {
    home: 'Inicio',
    about: 'Quiénes Somos',
    process: 'Nuestro Proceso',
    craft: 'Artesanía',
    products: 'Colecciones',
    contact: 'Contacto',
    enquire: 'Contactar',
  },
} as const

export const routes = {
  home: '/',
  about: '/who-we-are',
  process: '/process',
  craft: '/craftsmanship',
  products: '/collections',
  contact: '/contact',
} as const

export const home = {
  en: {
    heroEyebrow: 'León, México · Est. Manufacture',
    heroTitle: 'Refined craftsmanship, executed to an international standard.',
    heroSubtitle:
      'Premium footwear and leather goods, made by hand in one of the world’s great shoemaking capitals.',
    heroCta: 'Discover the house',
    heroCtaSecondary: 'Our collections',
    introLabel: 'The House',
    intro:
      'Lyon’s Artisans was built on a simple belief — that true luxury is created through craftsmanship, intention, and authenticity. For decades our team has refined an approach that unites traditional shoemaking with modern development and global production standards.',
    pillarLabel: 'Our Difference',
    pillarTitle: 'Human hands. Refined machinery. Premium materials.',
    pillars: [
      {
        no: '01',
        title: 'Human Hands',
        body: 'Behind every product is a team of skilled artisans whose decades of experience shape each pair with care and intent.',
      },
      {
        no: '02',
        title: 'Refined Machinery',
        body: 'Modern development technology supports the craft — never replacing it — for precision, consistency, and lasting comfort.',
      },
      {
        no: '03',
        title: 'Premium Materials',
        body: 'Carefully selected leathers and components, chosen for character, durability, and a refined hand feel.',
      },
    ],
    quote:
      '“Our products are not only made by hand — they are made with pride, responsibility, and respect for the craft.”',
    statsLabel: 'A Manufacturing House',
    stats: [
      { value: 'Decades', label: 'Of collaboration with global brands' },
      { value: 'León, MX', label: 'A world footwear capital' },
      { value: 'Family-owned', label: 'Built by people who care' },
    ],
    featureLabel: 'Selected Work',
    featureTitle: 'Footwear & leather goods with timeless character.',
    featureBody:
      'From development to finishing, every detail is considered. Explore the categories we produce for the brands and partners we serve.',
    featureCta: 'View collections',
    ctaTitle: 'Let’s build something enduring.',
    ctaBody:
      'We partner with brands seeking premium manufacturing with a human touch. Tell us about your project.',
    ctaButton: 'Start a conversation',
  },
  es: {
    heroEyebrow: 'León, México · Manufactura',
    heroTitle: 'Artesanía refinada, ejecutada a un estándar internacional.',
    heroSubtitle:
      'Calzado y artículos de piel premium, hechos a mano en una de las grandes capitales zapateras del mundo.',
    heroCta: 'Conoce la casa',
    heroCtaSecondary: 'Nuestras colecciones',
    introLabel: 'La Casa',
    intro:
      'Lyon’s Artisans nació de una creencia simple: el verdadero lujo se crea a través de la artesanía, la intención y la autenticidad. Durante décadas nuestro equipo ha refinado un enfoque que une la zapatería tradicional con el desarrollo moderno y los estándares globales de producción.',
    pillarLabel: 'Nuestra Diferencia',
    pillarTitle: 'Manos humanas. Maquinaria refinada. Materiales premium.',
    pillars: [
      {
        no: '01',
        title: 'Manos Humanas',
        body: 'Detrás de cada producto hay un equipo de artesanos cuyas décadas de experiencia dan forma a cada par con cuidado e intención.',
      },
      {
        no: '02',
        title: 'Maquinaria Refinada',
        body: 'La tecnología moderna de desarrollo acompaña al oficio —nunca lo reemplaza— para lograr precisión, consistencia y confort duradero.',
      },
      {
        no: '03',
        title: 'Materiales Premium',
        body: 'Pieles y componentes cuidadosamente seleccionados por su carácter, durabilidad y un tacto refinado.',
      },
    ],
    quote:
      '“Nuestros productos no solo están hechos a mano: están hechos con orgullo, responsabilidad y respeto por el oficio.”',
    statsLabel: 'Una Casa de Manufactura',
    stats: [
      { value: 'Décadas', label: 'De colaboración con marcas globales' },
      { value: 'León, MX', label: 'Capital mundial del calzado' },
      { value: 'Familiar', label: 'Construida por gente que se entrega' },
    ],
    featureLabel: 'Trabajo Selecto',
    featureTitle: 'Calzado y artículos de piel con carácter atemporal.',
    featureBody:
      'Del desarrollo al acabado, cada detalle se cuida. Explora las categorías que producimos para las marcas y socios a quienes servimos.',
    featureCta: 'Ver colecciones',
    ctaTitle: 'Construyamos algo perdurable.',
    ctaBody:
      'Colaboramos con marcas que buscan manufactura premium con un toque humano. Cuéntanos sobre tu proyecto.',
    ctaButton: 'Iniciar una conversación',
  },
} as const

export const about = {
  en: {
    eyebrow: 'Who We Are',
    title: 'Heritage, craftsmanship, and global experience.',
    lead: 'Founded in León, México — one of the world’s most recognized footwear capitals — Lyon’s Artisans was built on the belief that true luxury is created through craftsmanship, intention, and authenticity.',
    body: [
      'For decades, our team has collaborated with internationally recognized brands, refining a manufacturing approach that combines traditional shoemaking techniques with modern development technologies and global production standards.',
      'Today, we continue creating premium footwear and leather goods defined by comfort, quality, and timeless character.',
    ],
    valuesLabel: 'What We Stand For',
    values: [
      { title: 'Mexican Heritage', body: 'Rooted in the craft traditions of León, Guanajuato.' },
      { title: 'Family-Owned', body: 'A company guided by long-term care, not short-term scale.' },
      { title: 'Social Responsibility', body: 'Creating stability and opportunity for our people.' },
      { title: 'Authenticity', body: 'Honest products, made with intention and respect.' },
    ],
  },
  es: {
    eyebrow: 'Quiénes Somos',
    title: 'Herencia, artesanía y experiencia global.',
    lead: 'Fundada en León, México —una de las capitales del calzado más reconocidas del mundo—, Lyon’s Artisans nació de la creencia de que el verdadero lujo se crea a través de la artesanía, la intención y la autenticidad.',
    body: [
      'Durante décadas, nuestro equipo ha colaborado con marcas reconocidas internacionalmente, refinando un enfoque de manufactura que combina técnicas tradicionales de zapatería con tecnologías modernas de desarrollo y estándares globales de producción.',
      'Hoy seguimos creando calzado y artículos de piel premium definidos por el confort, la calidad y un carácter atemporal.',
    ],
    valuesLabel: 'Lo Que Defendemos',
    values: [
      { title: 'Herencia Mexicana', body: 'Arraigada en las tradiciones artesanales de León, Guanajuato.' },
      { title: 'Empresa Familiar', body: 'Guiada por el cuidado a largo plazo, no por la escala inmediata.' },
      { title: 'Responsabilidad Social', body: 'Generamos estabilidad y oportunidad para nuestra gente.' },
      { title: 'Autenticidad', body: 'Productos honestos, hechos con intención y respeto.' },
    ],
  },
} as const

export const process = {
  en: {
    eyebrow: 'Our Process',
    title: 'Nine essential stages where craftsmanship, technology, and attention to detail come together.',
    lead: 'From the first selection of raw materials to international delivery, every stage is designed to create exceptional products — balancing human skill with refined engineering.',
    stepsLabel: 'The Sequence',
    valuesLabel: 'Brand values',
    steps: [
      {
        no: '01',
        title: 'Material Selection & Evaluation',
        tagline: 'Premium materials as the foundation of quality',
        body: 'Every exceptional product begins with exceptional materials. We carefully select and evaluate premium leathers, components, and raw materials from trusted suppliers, inspecting each one for durability, texture, comfort, and performance. Strict selection criteria ensure consistency and long-term quality in every pair we produce.',
        values: ['High-end quality', 'Premium materials', 'Long-lasting products', 'Attention to detail'],
      },
      {
        no: '02',
        title: 'Product Development & Engineering',
        tagline: 'Designing for comfort, efficiency, and precision',
        body: 'Our development process combines craftsmanship with modern digital engineering. Using advanced digital pattern-making systems, we optimize material usage, reduce development times, and improve accuracy — transforming concepts into production-ready designs while preserving the flexibility that handcrafted manufacturing requires.',
        values: ['Innovation', 'Comfort-focused development', 'Engineering precision', 'Efficiency'],
      },
      {
        no: '03',
        title: 'Pattern Making & Digital Optimization',
        tagline: 'Smart engineering behind every pattern',
        body: 'Precision during development directly impacts the final product. Our digital pattern-making process creates highly accurate components while optimizing leather consumption and minimizing waste — improving consistency and supporting more sustainable manufacturing. Technology helps us work smarter; craftsmanship keeps the human touch.',
        values: ['Sustainability', 'Technology integration', 'Precision', 'Efficiency'],
      },
      {
        no: '04',
        title: 'Cutting Process',
        tagline: 'Advanced cutting technology with artisan oversight',
        body: 'We utilize advanced Teseo cutting technology to ensure consistency and precision. This automated system improves accuracy, reduces material waste, and increases efficiency, while experienced craftsmen supervise and complement the process so every component meets our quality standards.',
        values: ['Technology + craftsmanship', 'Efficiency', 'Precision', 'Quality control'],
      },
      {
        no: '05',
        title: 'Stitching & Upper Construction',
        tagline: 'Handcrafted skill in every stitch',
        body: 'The stitching process is where craftsmanship becomes visible. Our artisans assemble each upper with precision and consistency developed over years of experience. Every seam contributes to the aesthetics, durability, structure, and comfort of the product — true craftsmanship recognized in the smallest details.',
        values: ['Handmade processes', 'Skilled artisans', 'Heritage', 'Detail-oriented'],
      },
      {
        no: '06',
        title: 'Lasting & Assembly',
        tagline: 'Traditional lasting techniques for superior fit',
        body: 'Lasting directly influences comfort, shape, and overall quality. Our process relies on traditional handcrafted lasting techniques that require precision, experience, and manual skill — allowing greater control over fit, structure, and finishing than mass-production methods.',
        values: ['Traditional craftsmanship', 'Comfort', 'Handmade quality', 'Heritage manufacturing'],
      },
      {
        no: '07',
        title: 'Finishing & Hand Detailing',
        tagline: 'Attention to detail in every pair',
        body: 'The finishing stage reflects our commitment to refinement. Each pair is hand-finished — inspected, cleaned, polished, and refined to achieve our presentation standards. From edge finishing to final visual details, every pair receives individual attention before final inspection.',
        values: ['Premium quality', 'Attention to detail', 'Human touch', 'Refinement'],
      },
      {
        no: '08',
        title: 'Quality Control',
        tagline: 'Multiple quality filters throughout the entire process',
        body: 'Quality control is integrated throughout our entire process, not limited to the final stage. From raw material evaluation to final finishing, every pair passes through multiple inspection points. Our team reviews each product pair by pair, maintaining strict standards to meet the expectations of international markets.',
        values: ['High standards', 'Consistency', 'Reliability', 'International quality'],
      },
      {
        no: '09',
        title: 'Packaging & International Logistics',
        tagline: 'Prepared for global distribution',
        body: 'With extensive experience serving international clients, we understand the operational, technical, and logistical requirements of global distribution. Our logistics team follows organized export procedures and international shipping standards to ensure products are properly handled, packaged, and delivered efficiently worldwide.',
        values: ['Export expertise', 'Professionalism', 'Reliability', 'International operations'],
      },
    ],
  },
  es: {
    eyebrow: 'Nuestro Proceso',
    title: 'Nueve etapas esenciales donde la artesanía, la tecnología y la atención al detalle se unen.',
    lead: 'Desde la primera selección de materias primas hasta la entrega internacional, cada etapa está diseñada para crear productos excepcionales, equilibrando la destreza humana con una ingeniería refinada.',
    stepsLabel: 'La Secuencia',
    valuesLabel: 'Valores de marca',
    steps: [
      {
        no: '01',
        title: 'Selección y Evaluación de Materiales',
        tagline: 'Materiales premium como base de la calidad',
        body: 'Todo producto excepcional comienza con materiales excepcionales. Seleccionamos y evaluamos cuidadosamente pieles, componentes y materias primas premium de proveedores de confianza, inspeccionando cada uno por su durabilidad, textura, confort y desempeño. Criterios estrictos garantizan consistencia y calidad duradera en cada par.',
        values: ['Calidad de alta gama', 'Materiales premium', 'Productos duraderos', 'Atención al detalle'],
      },
      {
        no: '02',
        title: 'Desarrollo de Producto e Ingeniería',
        tagline: 'Diseñar para el confort, la eficiencia y la precisión',
        body: 'Nuestro desarrollo combina artesanía con ingeniería digital moderna. Mediante sistemas avanzados de patronaje digital optimizamos el uso de materiales, reducimos los tiempos de desarrollo y mejoramos la precisión, transformando conceptos en diseños listos para producción sin perder la flexibilidad que exige la manufactura artesanal.',
        values: ['Innovación', 'Desarrollo centrado en el confort', 'Precisión de ingeniería', 'Eficiencia'],
      },
      {
        no: '03',
        title: 'Patronaje y Optimización Digital',
        tagline: 'Ingeniería inteligente detrás de cada patrón',
        body: 'La precisión durante el desarrollo impacta directamente en el producto final. Nuestro patronaje digital crea componentes altamente precisos mientras optimiza el consumo de piel y minimiza el desperdicio, mejorando la consistencia y favoreciendo una manufactura más sustentable. La tecnología nos hace trabajar mejor; la artesanía conserva el toque humano.',
        values: ['Sustentabilidad', 'Integración tecnológica', 'Precisión', 'Eficiencia'],
      },
      {
        no: '04',
        title: 'Proceso de Corte',
        tagline: 'Tecnología de corte avanzada con supervisión artesanal',
        body: 'Utilizamos tecnología de corte Teseo avanzada para asegurar consistencia y precisión. Este sistema automatizado mejora la exactitud, reduce el desperdicio de material y aumenta la eficiencia, mientras artesanos experimentados supervisan y complementan el proceso para que cada componente cumpla nuestros estándares.',
        values: ['Tecnología + artesanía', 'Eficiencia', 'Precisión', 'Control de calidad'],
      },
      {
        no: '05',
        title: 'Costura y Construcción del Corte',
        tagline: 'Destreza artesanal en cada puntada',
        body: 'La costura es donde la artesanía se hace visible. Nuestros artesanos ensamblan cada corte con precisión y consistencia desarrolladas a lo largo de años de experiencia. Cada costura aporta a la estética, durabilidad, estructura y confort del producto: la verdadera artesanía se reconoce en los detalles más pequeños.',
        values: ['Procesos hechos a mano', 'Artesanos calificados', 'Herencia', 'Orientación al detalle'],
      },
      {
        no: '06',
        title: 'Montado y Ensamblaje',
        tagline: 'Técnicas tradicionales de montado para un ajuste superior',
        body: 'El montado influye directamente en el confort, la forma y la calidad general. Nuestro proceso se apoya en técnicas tradicionales de montado a mano que requieren precisión, experiencia y habilidad manual, permitiendo mayor control sobre el ajuste, la estructura y el acabado que los métodos de producción masiva.',
        values: ['Artesanía tradicional', 'Confort', 'Calidad hecha a mano', 'Manufactura con herencia'],
      },
      {
        no: '07',
        title: 'Acabado y Detallado a Mano',
        tagline: 'Atención al detalle en cada par',
        body: 'La etapa de acabado refleja nuestro compromiso con la refinación. Cada par se termina a mano: se inspecciona, limpia, lustra y refina hasta alcanzar nuestros estándares de presentación. Del acabado de cantos a los detalles visuales finales, cada par recibe atención individual antes de la inspección final.',
        values: ['Calidad premium', 'Atención al detalle', 'Toque humano', 'Refinación'],
      },
      {
        no: '08',
        title: 'Control de Calidad',
        tagline: 'Múltiples filtros de calidad a lo largo de todo el proceso',
        body: 'El control de calidad está integrado en todo nuestro proceso, no solo en la etapa final. De la evaluación de la materia prima al acabado final, cada par pasa por múltiples puntos de inspección. Nuestro equipo revisa cada producto par por par, manteniendo estándares estrictos para cumplir las expectativas de los mercados internacionales.',
        values: ['Altos estándares', 'Consistencia', 'Confiabilidad', 'Calidad internacional'],
      },
      {
        no: '09',
        title: 'Empaque y Logística Internacional',
        tagline: 'Preparados para la distribución global',
        body: 'Con amplia experiencia atendiendo clientes internacionales, comprendemos los requisitos operativos, técnicos y logísticos de la distribución global. Nuestro equipo de logística sigue procedimientos de exportación organizados y estándares internacionales de envío para que los productos se manejen, empaquen y entreguen de forma eficiente en todo el mundo.',
        values: ['Experiencia en exportación', 'Profesionalismo', 'Confiabilidad', 'Operaciones internacionales'],
      },
    ],
  },
} as const

export const craft = {
  en: {
    eyebrow: 'Craftsmanship & People',
    title: 'Built by people who care about the craft.',
    lead: 'Behind every product is a team of skilled artisans, technicians, and professionals who bring decades of experience and dedication to their work.',
    body: [
      'As a family-owned company based in León, Guanajuato — one of México’s most important footwear capitals — we believe quality begins with people.',
      'We are committed to preserving traditional craftsmanship while creating opportunities for growth, stability, and professional development within our team.',
    ],
    processLabel: 'How We Work',
    process: [
      {
        no: '01',
        title: 'Development',
        body: 'Ideas are refined with our partners — translating vision into patterns, lasts, and material selection.',
      },
      {
        no: '02',
        title: 'Crafting',
        body: 'Skilled hands assemble each piece, guided by traditional technique and supported by precise tooling.',
      },
      {
        no: '03',
        title: 'Finishing',
        body: 'Every pair is inspected, finished, and prepared with the care that defines a premium product.',
      },
    ],
    peopleQuote:
      '“We believe quality begins with people — and we are committed to creating opportunities for growth and stability within our team.”',
  },
  es: {
    eyebrow: 'Artesanía y Personas',
    title: 'Hecho por personas que aman el oficio.',
    lead: 'Detrás de cada producto hay un equipo de artesanos, técnicos y profesionales que aportan décadas de experiencia y dedicación a su trabajo.',
    body: [
      'Como empresa familiar con sede en León, Guanajuato —una de las capitales del calzado más importantes de México—, creemos que la calidad comienza con las personas.',
      'Estamos comprometidos con preservar la artesanía tradicional mientras creamos oportunidades de crecimiento, estabilidad y desarrollo profesional dentro de nuestro equipo.',
    ],
    processLabel: 'Cómo Trabajamos',
    process: [
      {
        no: '01',
        title: 'Desarrollo',
        body: 'Las ideas se refinan junto a nuestros socios, traduciendo la visión en patrones, hormas y selección de materiales.',
      },
      {
        no: '02',
        title: 'Confección',
        body: 'Manos expertas ensamblan cada pieza, guiadas por la técnica tradicional y apoyadas por herramientas precisas.',
      },
      {
        no: '03',
        title: 'Acabado',
        body: 'Cada par se inspecciona, termina y prepara con el cuidado que define a un producto premium.',
      },
    ],
    peopleQuote:
      '“Creemos que la calidad comienza con las personas, y estamos comprometidos con crear oportunidades de crecimiento y estabilidad para nuestro equipo.”',
  },
} as const

export const products = {
  en: {
    eyebrow: 'Collections',
    title: 'Footwear and leather goods, made to endure.',
    lead: 'A look at the categories we develop and produce for the brands and partners we serve — each defined by comfort, quality, and timeless character.',
    items: [
      { name: 'Dress & Derby', body: 'Classic constructions with a refined, contemporary line.' },
      { name: 'Loafers & Mocassins', body: 'Soft, hand-finished comfort with an elegant silhouette.' },
      { name: 'Minimal Sneakers', body: 'Clean, considered everyday footwear in premium leather.' },
      { name: 'Boots', body: 'Durable, characterful constructions built to last.' },
      { name: 'Leather Goods', body: 'Belts, small goods, and accessories with the same care.' },
      { name: 'Bespoke Development', body: 'Custom programs developed alongside your brand.' },
    ],
    note: 'We manufacture to order for our partners. Collections shown are representative of our capabilities.',
  },
  es: {
    eyebrow: 'Colecciones',
    title: 'Calzado y artículos de piel, hechos para perdurar.',
    lead: 'Un vistazo a las categorías que desarrollamos y producimos para las marcas y socios a quienes servimos, cada una definida por el confort, la calidad y un carácter atemporal.',
    items: [
      { name: 'Vestir & Derby', body: 'Construcciones clásicas con una línea refinada y contemporánea.' },
      { name: 'Mocasines', body: 'Confort suave y acabado a mano con una silueta elegante.' },
      { name: 'Sneakers Minimal', body: 'Calzado diario limpio y cuidado en piel premium.' },
      { name: 'Botas', body: 'Construcciones duraderas y con carácter, hechas para durar.' },
      { name: 'Artículos de Piel', body: 'Cinturones, marroquinería y accesorios con el mismo cuidado.' },
      { name: 'Desarrollo a Medida', body: 'Programas personalizados desarrollados junto a tu marca.' },
    ],
    note: 'Fabricamos sobre pedido para nuestros socios. Las colecciones mostradas son representativas de nuestras capacidades.',
  },
} as const

export const contact = {
  en: {
    eyebrow: 'Contact',
    title: 'Let’s talk about your project.',
    lead: 'We partner with brands seeking premium footwear and leather goods manufacturing with a human touch. Reach out and our team will respond personally.',
    form: {
      name: 'Full name',
      company: 'Company / Brand',
      email: 'Email',
      phone: 'Phone (optional)',
      message: 'Tell us about your project',
      submit: 'Send enquiry',
      success: 'Thank you. We’ve received your message and will be in touch shortly.',
    },
    detailsLabel: 'Direct',
    locationLabel: 'Atelier',
    location: 'León, Guanajuato — México',
    emailLabel: 'Email',
    email: 'hello@lyonsartisans.mx',
  },
  es: {
    eyebrow: 'Contacto',
    title: 'Hablemos de tu proyecto.',
    lead: 'Colaboramos con marcas que buscan manufactura de calzado y artículos de piel premium con un toque humano. Escríbenos y nuestro equipo te responderá personalmente.',
    form: {
      name: 'Nombre completo',
      company: 'Empresa / Marca',
      email: 'Correo electrónico',
      phone: 'Teléfono (opcional)',
      message: 'Cuéntanos sobre tu proyecto',
      submit: 'Enviar solicitud',
      success: 'Gracias. Hemos recibido tu mensaje y te contactaremos pronto.',
    },
    detailsLabel: 'Directo',
    locationLabel: 'Taller',
    location: 'León, Guanajuato — México',
    emailLabel: 'Correo',
    email: 'hola@lyonsartisans.mx',
  },
} as const

export const footer = {
  en: {
    tagline: 'Premium footwear & leather goods. Made in León, México.',
    explore: 'Explore',
    rights: 'All rights reserved.',
  },
  es: {
    tagline: 'Calzado y artículos de piel premium. Hecho en León, México.',
    explore: 'Explorar',
    rights: 'Todos los derechos reservados.',
  },
} as const
