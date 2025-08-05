/**
 * Accessibility Testing Utilities
 * Provides functions to test and validate accessibility features
 */

/**
 * Test screen reader announcements
 */
export const testScreenReaderAnnouncements = () => {
  console.log('🔍 Testing Screen Reader Announcements...')

  // Check for live regions
  const liveRegions = document.querySelectorAll('[aria-live]')
  console.log(`✓ Found ${liveRegions.length} live regions`)

  // Check for proper ARIA labels
  const ariaLabels = document.querySelectorAll('[aria-label]')
  console.log(`✓ Found ${ariaLabels.length} elements with aria-label`)

  // Check for landmarks
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="region"]')
  console.log(`✓ Found ${landmarks.length} landmark elements`)

  return {
    liveRegions: liveRegions.length,
    ariaLabels: ariaLabels.length,
    landmarks: landmarks.length,
  }
}

/**
 * Test keyboard navigation
 */
export const testKeyboardNavigation = () => {
  console.log('⌨️ Testing Keyboard Navigation...')

  // Check for focusable elements
  const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  console.log(`✓ Found ${focusableElements.length} focusable elements`)

  // Check for skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]')
  console.log(`✓ Found ${skipLinks.length} skip links`)

  // Check for proper tabindex usage
  const tabindexElements = document.querySelectorAll('[tabindex]')
  const negativeTabindex = document.querySelectorAll('[tabindex="-1"]')
  console.log(`✓ Found ${tabindexElements.length} elements with tabindex (${negativeTabindex.length} with -1)`)

  return {
    focusableElements: focusableElements.length,
    skipLinks: skipLinks.length,
    tabindexElements: tabindexElements.length,
    negativeTabindex: negativeTabindex.length,
  }
}

/**
 * Test ARIA attributes and landmarks
 */
export const testAriaAttributes = () => {
  console.log('🏷️ Testing ARIA Attributes...')

  // Check sections have proper roles
  const sections = document.querySelectorAll('section')
  const sectionsWithRole = document.querySelectorAll('section[role="region"]')
  console.log(`✓ Found ${sections.length} sections, ${sectionsWithRole.length} with role="region"`)

  // Check navigation elements
  const navElements = document.querySelectorAll('nav, [role="navigation"]')
  console.log(`✓ Found ${navElements.length} navigation elements`)

  // Check for aria-current usage
  const ariaCurrent = document.querySelectorAll('[aria-current]')
  console.log(`✓ Found ${ariaCurrent.length} elements with aria-current`)

  // Check for aria-expanded usage
  const ariaExpanded = document.querySelectorAll('[aria-expanded]')
  console.log(`✓ Found ${ariaExpanded.length} elements with aria-expanded`)

  return {
    sections: sections.length,
    sectionsWithRole: sectionsWithRole.length,
    navElements: navElements.length,
    ariaCurrent: ariaCurrent.length,
    ariaExpanded: ariaExpanded.length,
  }
}

/**
 * Test theme-aware focus styles
 */
export const testFocusStyles = () => {
  console.log('🎨 Testing Focus Styles...')

  // Get current theme
  const body = document.body
  const currentTheme = body.getAttribute('data-theme') || 'light'
  console.log(`✓ Current theme: ${currentTheme}`)

  // Check CSS custom properties for focus
  const computedStyle = getComputedStyle(body)
  const focusColor = computedStyle.getPropertyValue('--focus-color')
  console.log(`✓ Focus color: ${focusColor || 'default'}`)

  // Check for reduced motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  console.log(`✓ Reduced motion: ${reducedMotion ? 'enabled' : 'disabled'}`)

  // Check for high contrast
  const highContrast = window.matchMedia('(prefers-contrast: high)').matches
  console.log(`✓ High contrast: ${highContrast ? 'enabled' : 'disabled'}`)

  return {
    currentTheme,
    focusColor,
    reducedMotion,
    highContrast,
  }
}

/**
 * Test skip links functionality
 */
export const testSkipLinks = () => {
  console.log('🔗 Testing Skip Links...')

  // Check if skip links container exists
  const skipLinksContainer = document.querySelector('.skipLinks')
  console.log(`✓ Skip links container: ${skipLinksContainer ? 'found' : 'not found'}`)

  if (skipLinksContainer) {
    const skipLinks = skipLinksContainer.querySelectorAll('a')
    console.log(`✓ Found ${skipLinks.length} skip links`)

    // Test each skip link target
    let validTargets = 0
    skipLinks.forEach((link) => {
      const href = link.getAttribute('href')
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href)
        if (target) validTargets++
      }
    })
    console.log(`✓ ${validTargets} skip links have valid targets`)

    return {
      container: !!skipLinksContainer,
      linkCount: skipLinks.length,
      validTargets,
    }
  }

  return {
    container: false,
    linkCount: 0,
    validTargets: 0,
  }
}

/**
 * Run comprehensive accessibility test
 */
export const runAccessibilityTest = () => {
  console.log('🚀 Running Comprehensive Accessibility Test...')
  console.log('='.repeat(50))

  const results = {
    screenReader: testScreenReaderAnnouncements(),
    keyboard: testKeyboardNavigation(),
    aria: testAriaAttributes(),
    focus: testFocusStyles(),
    skipLinks: testSkipLinks(),
  }

  console.log('='.repeat(50))
  console.log('📊 Test Results Summary:')
  console.log('Screen Reader Support:', results.screenReader)
  console.log('Keyboard Navigation:', results.keyboard)
  console.log('ARIA Attributes:', results.aria)
  console.log('Focus Styles:', results.focus)
  console.log('Skip Links:', results.skipLinks)

  // Calculate overall score
  const totalChecks = Object.values(results).reduce((sum, category) => {
    return (
      sum +
      Object.values(category)
        .filter((value) => typeof value === 'number')
        .reduce((a, b) => a + b, 0)
    )
  }, 0)

  console.log(`✅ Total accessibility features detected: ${totalChecks}`)

  return results
}

/**
 * Test specific accessibility feature
 */
export const testAccessibilityFeature = (feature) => {
  switch (feature) {
    case 'screenReader':
      return testScreenReaderAnnouncements()
    case 'keyboard':
      return testKeyboardNavigation()
    case 'aria':
      return testAriaAttributes()
    case 'focus':
      return testFocusStyles()
    case 'skipLinks':
      return testSkipLinks()
    default:
      console.warn(`Unknown accessibility feature: ${feature}`)
      return null
  }
}
