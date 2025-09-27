/**
 * Content purification utility for cleaning HTML content
 * Removes unwanted HTML tags and attributes while preserving safe formatting
 */

export interface PurifyOptions {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  stripEmpty?: boolean
}

const DEFAULT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'pre', 'code'
]

const DEFAULT_ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  'div': ['class'],
  'span': ['class'],
  'p': ['class'],
  'h1': ['class'],
  'h2': ['class'],
  'h3': ['class'],
  'h4': ['class'],
  'h5': ['class'],
  'h6': ['class']
}

/**
 * Purifies HTML content by removing unwanted tags and attributes
 */
export function purifyContent(
  content: string | null | undefined,
  options: PurifyOptions = {}
): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    stripEmpty = true
  } = options

  let purified = content

  // Remove script tags and their content
  purified = purified.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove style tags and their content
  purified = purified.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Remove dangerous attributes
  purified = purified.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  purified = purified.replace(/\s*javascript\s*:/gi, '')
  
  // Remove unwanted tags (keep only allowed ones)
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g
  purified = purified.replace(tagRegex, (match, tagName) => {
    const lowerTagName = tagName.toLowerCase()
    
    if (!allowedTags.includes(lowerTagName)) {
      return '' // Remove unwanted tags
    }
    
    // Clean attributes for allowed tags
    const attributeRegex = /(\w+)\s*=\s*["']([^"']*)["']/g
    let cleanMatch = match.replace(attributeRegex, (attrMatch, attrName, attrValue) => {
      const lowerAttrName = attrName.toLowerCase()
      const allowedAttrs = allowedAttributes[lowerTagName] || []
      
      if (allowedAttrs.includes(lowerAttrName)) {
        // Clean attribute value
        let cleanValue = attrValue
        if (lowerAttrName === 'href' && !cleanValue.startsWith('http') && !cleanValue.startsWith('/') && !cleanValue.startsWith('#')) {
          cleanValue = '#' // Make relative links safe
        }
        return `${attrName}="${cleanValue}"`
      }
      return '' // Remove unwanted attributes
    })
    
    return cleanMatch
  })
  
  // Remove empty tags if requested
  if (stripEmpty) {
    purified = purified.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '')
    purified = purified.replace(/<(\w+)[^>]*\/>/g, '')
  }
  
  // Clean up extra whitespace
  purified = purified.replace(/\s+/g, ' ')
  purified = purified.replace(/>\s+</g, '><')
  purified = purified.trim()
  
  return purified
}

/**
 * Extract plain text from HTML content
 */
export function extractTextContent(html: string | null | undefined): string {
  if (!html) return ''
  
  // Remove HTML tags
  const textContent = html.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities
  const textarea = document.createElement('textarea')
  textarea.innerHTML = textContent
  const decoded = textarea.value
  
  // Clean up whitespace
  return decoded.replace(/\s+/g, ' ').trim()
}

/**
 * Truncate content to specified length
 */
export function truncateContent(
  content: string | null | undefined,
  maxLength: number = 150,
  suffix: string = '...'
): string {
  if (!content) return ''
  
  const text = extractTextContent(content)
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength).trim() + suffix
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Format date for Arabic display
 */
export function formatDateArabic(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting Arabic date:', error)
    return dateString
  }
}

/**
 * Format date in Arabic numbers (YYYY/MM/DD)
 */
export function formatDateArabicNumbers(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    
    // Convert to Arabic-Indic digits
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    
    const convertToArabic = (num: number): string => {
      return num.toString().replace(/\d/g, (digit) => arabicDigits[parseInt(digit)])
    }
    
    return `${convertToArabic(year)}/${convertToArabic(month)}/${convertToArabic(day)}`
  } catch (error) {
    console.error('Error formatting Arabic numbers date:', error)
    return dateString
  }
}
