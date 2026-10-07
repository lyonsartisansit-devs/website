import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'

// Helper to load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim()
        let val = trimmed.slice(eqIdx + 1).trim()
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }
}

loadEnv()

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || projectId === 'placeholder_project_id') {
  console.error(
    '❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID is not configured in .env.local'
  )
  console.error('Please add NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id" to .env.local')
  process.exit(1)
}

if (!token) {
  console.error('❌ Error: SANITY_WRITE_TOKEN is missing.')
  console.error(
    'Please obtain a Sanity write token (Sanity Manage > Project > API > Tokens) and add SANITY_WRITE_TOKEN="your_token" to .env.local'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

// Helper to upload image asset from public/images
async function uploadLocalImage(relPath: string, filename: string) {
  const fullPath = path.resolve(process.cwd(), relPath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ Warning: Image ${fullPath} not found.`)
    return null
  }
  try {
    const stream = fs.createReadStream(fullPath)
    const asset = await client.assets.upload('image', stream, {
      filename,
    })
    return asset
  } catch (err) {
    console.error(`Error uploading image ${relPath}:`, err)
    return null
  }
}

// Portable text paragraph helper
function ptBlock(text: string, style: 'normal' | 'h2' | 'h3' = 'normal') {
  return {
    _key: Math.random().toString(36).substring(2, 9),
    _type: 'block',
    style,
    markDefs: [],
    children: [
      {
        _key: Math.random().toString(36).substring(2, 9),
        _type: 'span',
        marks: [],
        text,
      },
    ],
  }
}

// Helper to create translation metadata linking localized documents
async function linkTranslations(
  metadataId: string,
  schemaType: string,
  translations: { locale: string; ref: string }[]
) {
  await client.createOrReplace({
    _id: metadataId,
    _type: 'translation.metadata',
    schemaTypes: [schemaType],
    translations: translations.map(({ locale, ref }) => ({
      _key: locale,
      value: {
        _type: 'reference',
        _ref: ref,
      },
    })),
  })
}

async function seed() {
  console.log('🚀 Starting Multilingual Sanity Journal seed (en + es)...')
  console.log(`📡 Target Project: ${projectId} (Dataset: ${dataset})`)

  // 1. Create localized Categories
  console.log('\n📂 Creating localized categories...')
  const categoriesData = [
    {
      key: 'heritage',
      order: 1,
      en: { title: 'Heritage', slug: 'heritage' },
      es: { title: 'Herencia', slug: 'herencia' },
    },
    {
      key: 'events',
      order: 2,
      en: { title: 'Events', slug: 'events' },
      es: { title: 'Eventos', slug: 'eventos' },
    },
    {
      key: 'collection',
      order: 3,
      en: { title: 'Collection', slug: 'collection' },
      es: { title: 'Colección', slug: 'coleccion' },
    },
    {
      key: 'celebrities',
      order: 4,
      en: { title: 'Celebrities', slug: 'celebrities' },
      es: { title: 'Celebridades', slug: 'celebridades' },
    },
  ]

  for (const cat of categoriesData) {
    const enId = `category-${cat.key}-en`
    const esId = `category-${cat.key}-es`

    // English Category
    await client.createOrReplace({
      _id: enId,
      _type: 'category',
      language: 'en',
      title: cat.en.title,
      slug: { _type: 'slug', current: cat.en.slug },
      order: cat.order,
    })

    // Spanish Category
    await client.createOrReplace({
      _id: esId,
      _type: 'category',
      language: 'es',
      title: cat.es.title,
      slug: { _type: 'slug', current: cat.es.slug },
      order: cat.order,
    })

    // Translation Metadata
    await linkTranslations(`translation.metadata.category-${cat.key}`, 'category', [
      { locale: 'en', ref: enId },
      { locale: 'es', ref: esId },
    ])

    console.log(`  ✓ Category created and linked: ${cat.en.title} (en) / ${cat.es.title} (es)`)
  }

  // 2. Create localized Journal Page documents
  console.log('\n📄 Creating localized Journal Page documents...')
  await client.createOrReplace({
    _id: 'journalPage-en',
    _type: 'journalPage',
    language: 'en',
    eyebrow: 'Journal',
    heading: 'Stories, heritage, and events.',
    seo: {
      _type: 'seo',
      title: "Journal | Lyon's Artisans",
      description:
        "Explore stories, craftsmanship heritage, and events from Lyon's Artisans.",
    },
  })

  await client.createOrReplace({
    _id: 'journalPage-es',
    _type: 'journalPage',
    language: 'es',
    eyebrow: 'Diario',
    heading: 'Historias, herencia y eventos.',
    seo: {
      _type: 'seo',
      title: "Diario | Lyon's Artisans",
      description:
        "Explora historias, herencia artesanal y eventos de Lyon's Artisans.",
    },
  })

  await linkTranslations('translation.metadata.journalPage', 'journalPage', [
    { locale: 'en', ref: 'journalPage-en' },
    { locale: 'es', ref: 'journalPage-es' },
  ])
  console.log('  ✓ Journal Page (en + es) created and linked')

  // 3. Upload images for sample posts
  console.log('\n🖼️ Uploading sample images...')
  const imgCraftHero = await uploadLocalImage('public/images/craft-hero.png', 'craft-hero.png')
  const imgHero = await uploadLocalImage('public/images/hero.png', 'hero.png')
  const imgFeatured = await uploadLocalImage('public/images/featured.png', 'featured.png')
  const imgProcess1 = await uploadLocalImage('public/images/process-1.png', 'process-1.png')
  const imgProcess2 = await uploadLocalImage('public/images/process-2.png', 'process-2.png')
  const imgProcess3 = await uploadLocalImage('public/images/process-3.png', 'process-3.png')
  const imgProcess4 = await uploadLocalImage('public/images/process-4.png', 'process-4.png')
  const imgProcess5 = await uploadLocalImage('public/images/process-5.png', 'process-5.png')
  const imgLeather = await uploadLocalImage('public/images/leather-texture.png', 'leather.png')

  const fallbackAsset = imgCraftHero || imgHero || imgFeatured

  function makeImage(asset: any, alt: string) {
    const targetAsset = asset || fallbackAsset
    return targetAsset
      ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: targetAsset._id,
          },
          alt,
          hotspot: { x: 0.5, y: 0.5 },
        }
      : null
  }

  // 4. Create Sample Posts
  console.log('\n📝 Creating sample posts...')

  // ==========================================
  // POST 1: SHORT POST (Fully Translated EN + ES)
  // ==========================================
  console.log('  → Creating Post 1: Short Post (EN + ES)...')
  const post1EnId = 'post-short-essence-of-leon-en'
  const post1EsId = 'post-short-essence-of-leon-es'

  await client.createOrReplace({
    _id: post1EnId,
    _type: 'post',
    language: 'en',
    title: 'The Essence of León: Centuries of Cordwaining Legacy',
    slug: { _type: 'slug', current: 'the-essence-of-leon-craftsmanship' },
    category: { _type: 'reference', _ref: 'category-heritage-en' },
    excerpt:
      'A brief reflection on how the historic workshops of León continue to define international high-grade footwear artisanship.',
    coverImage: makeImage(
      imgCraftHero,
      'Artisan preparing leather sole in León workshop'
    ),
    featured: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    marqueeText: 'Centuries of Cordwaining Legacy — León, México',
    body: [
      {
        _key: 'b1',
        _type: 'textSection',
        lead:
          'In the heart of Guanajuato, the rhythmic cadence of leather cutting and welt stitching has echoed across generations.',
        body: [
          ptBlock(
            "León has stood as the premier leatherworking capital of the Americas for over four centuries. At Lyon's Artisans, we inherit this venerable lineage, infusing traditional hand-welted techniques with contemporary silhouettes."
          ),
          ptBlock(
            'Every pair that leaves our workshop is an homage to the hands that shaped it—master craftspeople who view shoe construction not merely as assembly, but as an architectural art form.'
          ),
        ],
      },
    ],
    seo: {
      _type: 'seo',
      title: "The Essence of León | Lyon's Artisans",
      description:
        'A brief reflection on how the historic workshops of León continue to define high-grade leather artisanship.',
    },
  })

  await client.createOrReplace({
    _id: post1EsId,
    _type: 'post',
    language: 'es',
    title: 'La Esencia de León: Siglos de Legado Zapatero',
    slug: { _type: 'slug', current: 'la-esencia-de-leon-artesania' },
    category: { _type: 'reference', _ref: 'category-heritage-es' },
    excerpt:
      'Una breve reflexión sobre cómo los talleres históricos de León continúan definiendo la artesanía zapatera de alto nivel internacional.',
    coverImage: makeImage(
      imgCraftHero,
      'Artesano preparando suela de cuero en taller de León'
    ),
    featured: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    marqueeText: 'Siglos de Legado Zapatero — León, México',
    body: [
      {
        _key: 'b1',
        _type: 'textSection',
        lead:
          'En el corazón de Guanajuato, la cadencia rítmica del corte de piel y el cosido de viras ha resonado a través de generaciones.',
        body: [
          ptBlock(
            "León se ha mantenido como la capital de la piel en América por más de cuatro siglos. En Lyon's Artisans, heredamos este venerable linaje, fusionando técnicas tradicionales de cosido a mano con siluetas contemporáneas."
          ),
          ptBlock(
            'Cada par que sale de nuestro taller es un homenaje a las manos que le dieron forma: maestros artesanos que no ven la construcción del zapato como un simple ensamblaje, sino como una forma de arte arquitectónico.'
          ),
        ],
      },
    ],
    seo: {
      _type: 'seo',
      title: "La Esencia de León | Lyon's Artisans",
      description:
        'Una breve reflexión sobre cómo los talleres históricos de León continúan definiendo la artesanía zapatera.',
    },
  })

  await linkTranslations('translation.metadata.post-short-essence-of-leon', 'post', [
    { locale: 'en', ref: post1EnId },
    { locale: 'es', ref: post1EsId },
  ])

  // ==========================================
  // POST 2: LONG POST (Fully Translated EN + ES)
  // ==========================================
  console.log('  → Creating Post 2: Long Post (8+ blocks, EN + ES)...')
  const post2EnId = 'post-long-bespoke-boot-en'
  const post2EsId = 'post-long-bespoke-boot-es'

  await client.createOrReplace({
    _id: post2EnId,
    _type: 'post',
    language: 'en',
    title: 'Anatomy of a Bespoke Boot: 120 Steps to Perfection',
    slug: { _type: 'slug', current: 'anatomy-of-a-bespoke-boot' },
    category: { _type: 'reference', _ref: 'category-collection-en' },
    excerpt:
      'From hand-selected French calfskin to the final burnish, step inside the master atelier and explore the rigorous 120-step process.',
    coverImage: makeImage(
      imgFeatured,
      'Handcrafted bespoke boot finished in rich espresso patina'
    ),
    featured: true,
    publishedAt: new Date().toISOString(),
    marqueeText: '120 Steps to Perfection — Bespoke Footwear Masterclass',
    body: [
      {
        _key: 'b2-1',
        _type: 'textSection',
        lead:
          'A truly bespoke boot is never manufactured; it is sculpted over dozens of hours of meticulous manual precision.',
        body: [
          ptBlock(
            'Our process begins in the selection room, where full-grain hides are inspected by touch and sight under natural northern daylight. Only the tightest, most uniform sections of the skin are earmarked for the upper.'
          ),
        ],
      },
      {
        _key: 'b2-2',
        _type: 'imageGallery',
        images: [
          {
            _key: 'g1',
            ...makeImage(imgProcess1, 'Selecting full grain leather hides'),
          },
          {
            _key: 'g2',
            ...makeImage(imgProcess2, 'Hand-cutting leather pattern with brass stencils'),
          },
        ],
      },
      {
        _key: 'b2-3',
        _type: 'pullQuote',
        quote:
          'True luxury is measured not in haste, but in the patience of unyielding standards.',
        supportingText: 'Master Cordwainer, Lyon’s Artisans Atelier',
      },
      {
        _key: 'b2-4',
        _type: 'textSection',
        label: 'The Lasting Process',
        lead:
          'Forming the leather over wooden lasts demands intuition that cannot be programmed.',
        body: [
          ptBlock(
            'The upper is soaked, stretched, and hand-nailed around the beechwood last. It rests for seven full days to memorize the contours of the human foot before welt stitching commences.'
          ),
          ptBlock(
            'This rest period is critical: it prevents premature creasing and ensures the leather retains its sculptural integrity for decades.'
          ),
        ],
      },
      {
        _key: 'b2-5',
        _type: 'imageGallery',
        images: [
          {
            _key: 'g3',
            ...makeImage(imgProcess3, 'Lasting the shoe upper over beechwood forms'),
          },
          {
            _key: 'g4',
            ...makeImage(imgProcess4, 'Hand-carving the channel groove in sole'),
          },
          {
            _key: 'g5',
            ...makeImage(imgProcess5, 'Goodyear welt stitching with waxed flax thread'),
          },
        ],
      },
      {
        _key: 'b2-6',
        _type: 'pullQuote',
        quote:
          'Every cut honors the material before the blade touches the leather.',
      },
      {
        _key: 'b2-7',
        _type: 'textSection',
        label: 'Hand-Welted Soles',
        lead:
          'Durability engineered for a lifetime of resolute steps.',
        body: [
          ptBlock(
            'We use dense oak-bark tanned leather outsoles sourced from centuries-old tanneries. The welt is stitched using heavy waxed linen cord, creating a natural moisture barrier and allowing infinite resoling.'
          ),
        ],
      },
      {
        _key: 'b2-8',
        _type: 'imageGallery',
        images: [
          {
            _key: 'g6',
            ...makeImage(imgLeather, 'Oak-bark tanned outsole preparation'),
          },
          {
            _key: 'g7',
            ...makeImage(imgHero, 'Edge beveling and heel building'),
          },
          {
            _key: 'g8',
            ...makeImage(imgCraftHero, 'Applying natural beeswax and carnauba edge polish'),
          },
          {
            _key: 'g9',
            ...makeImage(imgFeatured, 'Final hand burnish and mirror shine'),
          },
        ],
      },
      {
        _key: 'b2-9',
        _type: 'textSection',
        label: 'The Final Polish',
        lead:
          'The completion of an heirloom.',
        body: [
          ptBlock(
            'Layer upon layer of natural pigment and carnauba wax are gently rubbed into the grain, bringing forth deep amber and espresso undertones that will deepen with every passing year.'
          ),
        ],
      },
    ],
    seo: {
      _type: 'seo',
      title: 'Anatomy of a Bespoke Boot | Lyon’s Artisans',
      description:
        'From hand-selected French calfskin to the final burnish, step inside the master atelier.',
    },
  })

  await client.createOrReplace({
    _id: post2EsId,
    _type: 'post',
    language: 'es',
    title: 'Anatomía de una Bota a Medida: 120 Pasos a la Perfección',
    slug: { _type: 'slug', current: 'anatomia-de-una-bota-a-medida' },
    category: { _type: 'reference', _ref: 'category-collection-es' },
    excerpt:
      'De la selección manual de piel de becerro francés al pulido final, adéntrate en el taller maestro y descubre el riguroso proceso de 120 pasos.',
    coverImage: makeImage(
      imgFeatured,
      'Bota artesanal a medida terminada en rica pátina espresso'
    ),
    featured: true,
    publishedAt: new Date().toISOString(),
    marqueeText: '120 Pasos a la Perfección — Calzado a Medida',
    body: [
      {
        _key: 'b2-1',
        _type: 'textSection',
        lead:
          'Una bota verdaderamente a medida nunca se manufactura en masa; se esculpe a lo largo de decenas de horas de minuciosa precisión manual.',
        body: [
          ptBlock(
            'Nuestro proceso comienza en la sala de selección, donde las pieles de flor entera son inspeccionadas al tacto y a la vista bajo luz natural del norte. Solo las secciones más firmes y uniformes se reservan para el corte.'
          ),
        ],
      },
      {
        _key: 'b2-2',
        _type: 'imageGallery',
        images: [
          {
            _key: 'g1',
            ...makeImage(imgProcess1, 'Seleccionando pieles de flor entera'),
          },
          {
            _key: 'g2',
            ...makeImage(imgProcess2, 'Corte a mano de patrones con plantillas de latón'),
          },
        ],
      },
      {
        _key: 'b2-3',
        _type: 'pullQuote',
        quote:
          'El verdadero lujo no se mide en la prisa, sino en la paciencia de estándares inquebrantables.',
        supportingText: 'Maestro Zapatero, Taller Lyon’s Artisans',
      },
      {
        _key: 'b2-4',
        _type: 'textSection',
        label: 'El Proceso de Montado',
        lead:
          'Dar forma a la piel sobre hormas de madera exige una intuición que no se puede programar.',
        body: [
          ptBlock(
            'El corte se humedece, se estira y se clava a mano alrededor de la horma de haya. Reposa durante siete días completos para memorizar los contornos del pie humano antes de iniciar el cosido de la vira.'
          ),
          ptBlock(
            'Este periodo de reposo es fundamental: previene pliegues prematuros y asegura que la piel mantenga su integridad escultórica por décadas.'
          ),
        ],
      },
      {
        _key: 'b2-5',
        _type: 'imageGallery',
        images: [
          {
            _key: 'g3',
            ...makeImage(imgProcess3, 'Montado del corte sobre hormas de madera'),
          },
          {
            _key: 'g4',
            ...makeImage(imgProcess4, 'Tallado a mano del canal en la suela'),
          },
          {
            _key: 'g5',
            ...makeImage(imgProcess5, 'Cosido de vira Goodyear con hilo de lino encerado'),
          },
        ],
      },
      {
        _key: 'b2-6',
        _type: 'pullQuote',
        quote:
          'Cada corte honra el material antes de que la cuchilla toque la piel.',
      },
      {
        _key: 'b2-7',
        _type: 'textSection',
        label: 'Suelas Cosidas a Mano',
        lead:
          'Durabilidad diseñada para toda una vida de pasos firmes.',
        body: [
          ptBlock(
            'Utilizamos suelas de piel densa curtida al roble provenientes de curtidurías centenarias. La vira se cose con cordón de lino encerado, creando una barrera natural contra la humedad y permitiendo un resolado infinito.'
          ),
        ],
      },
      {
        _key: 'b2-8',
        _type: 'imageGallery',
        images: [
          {
            _key: 'g6',
            ...makeImage(imgLeather, 'Preparación de la suela curtida al roble'),
          },
          {
            _key: 'g7',
            ...makeImage(imgHero, 'Biselado de cantos y construcción del tacón'),
          },
          {
            _key: 'g8',
            ...makeImage(imgCraftHero, 'Aplicación de cera de abeja natural y carnauba en cantos'),
          },
          {
            _key: 'g9',
            ...makeImage(imgFeatured, 'Pulido a mano y brillo espejo final'),
          },
        ],
      },
      {
        _key: 'b2-9',
        _type: 'textSection',
        label: 'El Lustrado Final',
        lead:
          'La culminación de una pieza de herencia.',
        body: [
          ptBlock(
            'Capa tras capa de pigmentos naturales y cera de carnauba se frotan suavemente en el grano, revelando profundos matices de ámbar y espresso que madurarán con el paso de los años.'
          ),
        ],
      },
    ],
    seo: {
      _type: 'seo',
      title: 'Anatomía de una Bota a Medida | Lyon’s Artisans',
      description:
        'De la selección manual de piel de becerro francés al pulido final, adéntrate en el taller maestro.',
    },
  })

  await linkTranslations('translation.metadata.post-long-bespoke-boot', 'post', [
    { locale: 'en', ref: post2EnId },
    { locale: 'es', ref: post2EsId },
  ])

  // =========================================================================
  // POST 3: ENGLISH-ONLY POST (To verify strict 404 / no-fallback behavior)
  // =========================================================================
  console.log('  → Creating Post 3: English-Only Post (tests no-fallback / 404 in ES)...')
  const post3EnId = 'post-english-only-salon-preview-en'

  await client.createOrReplace({
    _id: post3EnId,
    _type: 'post',
    language: 'en',
    title: 'Private Salon: The Autumn/Winter 2026 Presentation',
    slug: { _type: 'slug', current: 'private-preview-autumn-winter' },
    category: { _type: 'reference', _ref: 'category-events-en' },
    excerpt:
      'An intimate evening gathering collectors and patrons to preview our forthcoming handcrafted footwear collection.',
    coverImage: makeImage(
      imgProcess1,
      'Atmosphere at the Autumn/Winter private salon'
    ),
    featured: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    marqueeText: 'Autumn / Winter 2026 Salon Preview — Atelier Notes',
    body: [
      {
        _key: 'b3-1',
        _type: 'textSection',
        lead:
          'An evening dedicated to the tactile beauty of raw materials and the people who mold them.',
        body: [
          ptBlock(
            'Patrons were invited directly into our private salon for a preview of new Chelsea boot iterations, woven oxfords, and hand-patinated accessories.'
          ),
        ],
      },
      {
        _key: 'b3-2',
        _type: 'imageGallery',
        images: [
          {
            _key: 'g12',
            ...makeImage(imgProcess3, 'Exhibition table with wooden lasts'),
          },
          {
            _key: 'g13',
            ...makeImage(imgProcess4, 'Display of prototype calfskin leathers'),
          },
        ],
      },
      {
        _key: 'b3-3',
        _type: 'pullQuote',
        quote:
          'When you touch the leather and observe the welt stitch up close, the true soul of the workshop is revealed.',
      },
    ],
    seo: {
      _type: 'seo',
      title: 'Private Salon Preview | Lyon’s Artisans',
      description: 'An intimate evening gathering collectors and patrons.',
    },
  })

  // English-only metadata document (no 'es' reference)
  await client.createOrReplace({
    _id: 'translation.metadata.post-english-only-salon-preview',
    _type: 'translation.metadata',
    schemaTypes: ['post'],
    translations: [
      {
        _key: 'en',
        value: {
          _type: 'reference',
          _ref: post3EnId,
        },
      },
    ],
  })

  console.log('\n✅ Multilingual seeding completed successfully!')
}

seed().catch((err) => {
  console.error('\n❌ Seed script failed:', err)
  process.exit(1)
})
