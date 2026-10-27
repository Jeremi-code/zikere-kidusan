import { ETHIOPIAN_MONTHS, numberToGeez, ethiopianToJDN, jdnToGregorian } from './ethiopianCalendar'

export interface SeoMetadataParams {
  month: number
  day: number
  year: number
  titleAm: string
  titleEn?: string
  storyAm?: string | string[]
  storyEn?: string | string[]
  scriptureVerse?: string
  scriptureRef?: string
  annualFeasts?: string[]
  monthlyFeasts?: string[]
  language: 'am' | 'en'
}

function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attributeName, attributeValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function cleanStorySnippet(story?: string | string[]): string {
  if (!story) return ''
  const rawText = Array.isArray(story) ? story.filter(Boolean).join(' ') : String(story)
  const flattened = rawText.replace(/\s+/g, ' ').trim()
  if (flattened.length <= 165) return flattened
  return flattened.slice(0, 162).trim() + '…'
}

function injectJsonLd(data: object) {
  let script = document.getElementById('synaxarium-jsonld') as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = 'synaxarium-jsonld'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data, null, 2)
}

export function updateSeoMetadata(params: SeoMetadataParams) {
  if (typeof document === 'undefined') return

  const monthInfo = ETHIOPIAN_MONTHS[params.month - 1] || ETHIOPIAN_MONTHS[0]
  const isEn = params.language === 'en'
  const activeTitle = (isEn && params.titleEn ? params.titleEn : params.titleAm) || (isEn ? 'Daily Reading' : 'ዕለታዊ ንባብ')
  const monthName = isEn ? monthInfo.nameEn : monthInfo.nameAm
  const formattedDay = isEn ? String(params.day) : numberToGeez(params.day)
  const appBrand = isEn ? 'Zikere Kidusan' : 'ዝክረ ቅዱሳን'
  const fullDocumentTitle = `${monthName} ${formattedDay} — ${activeTitle} | ${appBrand}`

  document.title = fullDocumentTitle

  const activeStory = isEn && params.storyEn ? params.storyEn : params.storyAm
  const snippet = cleanStorySnippet(activeStory)
  const defaultDescAm = `ዝክረ ቅዱሳን — ${monthName} ${formattedDay} የቅዱሳን መታሰቢያና ታሪክ። ${activeTitle}።`
  const defaultDescEn = `Zikere Kidusan — ${monthName} ${formattedDay} Commemoration of the Saints. ${activeTitle}.`
  const metaDescription = snippet || (isEn ? defaultDescEn : defaultDescAm)

  setMetaTag('name', 'description', metaDescription)
  setMetaTag('name', 'author', 'Zikere Kidusan')

  const origin = window.location.origin || import.meta.env.VITE_SITE_URL || 'https://zikere-kidusan.vercel.app'
  const currentPath = `${origin}/?month=${params.month}&day=${params.day}`
  const ogImageUrl = `${origin}/favicon.svg`

  setCanonicalUrl(currentPath)

  setMetaTag('property', 'og:site_name', isEn ? 'Zikere Kidusan — Ethiopian Synaxarium' : 'ዝክረ ቅዱሳን — መጽሐፈ ስንክሳር')
  setMetaTag('property', 'og:title', fullDocumentTitle)
  setMetaTag('property', 'og:description', metaDescription)
  setMetaTag('property', 'og:type', 'article')
  setMetaTag('property', 'og:url', currentPath)
  setMetaTag('property', 'og:image', ogImageUrl)
  setMetaTag('property', 'og:locale', isEn ? 'en_US' : 'am_ET')
  setMetaTag('property', 'og:locale:alternate', isEn ? 'am_ET' : 'en_US')

  setMetaTag('name', 'twitter:card', 'summary')
  setMetaTag('name', 'twitter:title', fullDocumentTitle)
  setMetaTag('name', 'twitter:description', metaDescription)
  setMetaTag('name', 'twitter:image', ogImageUrl)

  const jdn = ethiopianToJDN(params.year, params.month, params.day)
  const greg = jdnToGregorian(jdn)
  const isoPublishedDate = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        'url': origin,
        'name': isEn ? 'Zikere Kidusan' : 'ዝክረ ቅዱሳን',
        'alternateName': 'Ethiopian Orthodox Synaxarium',
        'inLanguage': ['am', 'en'],
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${origin}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Article',
        '@id': `${currentPath}#article`,
        'isPartOf': {
          '@type': 'Book',
          'name': 'መጽሐፈ ስንክሳር (The Ethiopian Synaxarium)',
          'inLanguage': ['gez', 'am', 'en']
        },
        'headline': activeTitle,
        'name': `${monthName} ${formattedDay} — ${activeTitle}`,
        'description': metaDescription,
        'inLanguage': params.language,
        'datePublished': isoPublishedDate,
        'mainEntityOfPage': currentPath,
        'citation': params.scriptureRef ? `${params.scriptureVerse || ''} (${params.scriptureRef})` : undefined,
        'about': {
          '@type': 'Thing',
          'name': 'Ethiopian Orthodox Tewahedo Church Saints and Commemorations'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'ዝክረ ቅዱሳን (Zikere Kidusan)',
          'url': origin
        }
      }
    ]
  }

  injectJsonLd(jsonLdData)
}
