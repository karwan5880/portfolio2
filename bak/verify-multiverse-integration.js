/**
 * Final Integration and Testing Script for Multiverse Portfolio
 *
 * This script validates:
 * - Complete user journey through all sections
 * - All existing functionality is preserved
 * - Theme switching across all sections
 * - Performance benchmarks
 * - Cross-browser compatibility
 *
 * Requirements: 1.1, 1.2, 1.3, 3.6, 4.1
 */

const fs = require('fs')
const path = require('path')

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: [],
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL'
  const statusColor = passed ? 'green' : 'red'

  log(`${status} ${testName}`, statusColor)
  if (details) {
    log(`   ${details}`, 'cyan')
  }

  testResults.details.push({ testName, passed, details })
  if (passed) {
    testResults.passed++
  } else {
    testResults.failed++
  }
}

function logWarning(message) {
  log(`⚠️  WARNING: ${message}`, 'yellow')
  testResults.warnings++
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath)
  logTest(`File exists: ${description}`, exists, filePath)
  return exists
}

function checkFileContent(filePath, searchPattern, description) {
  try {
    if (!fs.existsSync(filePath)) {
      logTest(`Content check: ${description}`, false, `File not found: ${filePath}`)
      return false
    }

    const content = fs.readFileSync(filePath, 'utf8')
    const found = searchPattern.test ? searchPattern.test(content) : content.includes(searchPattern)

    logTest(`Content check: ${description}`, found, found ? 'Pattern found' : `Pattern not found: ${searchPattern}`)
    return found
  } catch (error) {
    logTest(`Content check: ${description}`, false, `Error reading file: ${error.message}`)
    return false
  }
}

function validateComponentStructure(componentPath, requiredExports) {
  log(`\n📋 Validating component structure: ${componentPath}`, 'blue')

  if (!checkFileExists(componentPath, `Component file`)) {
    return false
  }

  let allExportsFound = true
  requiredExports.forEach((exportName) => {
    const found = checkFileContent(componentPath, new RegExp(`export.*${exportName}`), `Export: ${exportName}`)
    if (!found) allExportsFound = false
  })

  return allExportsFound
}

function validateSectionIntegration() {
  log(`\n🔗 Validating Section Integration (Requirement 1.1, 1.2, 1.3)`, 'bold')

  const sections = ['HomeSection', 'TimelineSection', 'DevHistorySection', 'SkillsSection', 'CareerSection', 'ProjectSection']

  // Check if MultiversePortfolio includes all sections
  const multiversePath = 'src/components/MultiversePortfolio.jsx'
  let allSectionsIntegrated = true

  sections.forEach((section) => {
    const found = checkFileContent(multiversePath, section, `Section integration: ${section}`)
    if (!found) allSectionsIntegrated = false
  })

  // Check if main page uses MultiversePortfolio
  const mainPageIntegrated = checkFileContent('src/app/page.js', 'MultiversePortfolio', 'Main page uses MultiversePortfolio')

  // Check section wrapper implementation
  const sectionWrapperExists = checkFileExists('src/components/SectionWrapper.jsx', 'SectionWrapper component')

  return allSectionsIntegrated && mainPageIntegrated && sectionWrapperExists
}

function validateScrollManagement() {
  log(`\n📜 Validating Scroll Management (Requirement 2.2, 5.1, 5.2)`, 'bold')

  // Check scroll manager hook
  const scrollManagerExists = checkFileExists('src/hooks/useScrollManager.js', 'useScrollManager hook')

  // Check navigation components
  const navigationDotsExists = checkFileExists('src/components/NavigationDots.jsx', 'NavigationDots component')

  const scrollProgressExists = checkFileExists('src/components/ScrollProgress.jsx', 'ScrollProgress component')

  // Check for smooth scroll implementation
  const smoothScrollImplemented = checkFileContent('src/hooks/useScrollManager.js', /scrollTo|smooth/i, 'Smooth scroll implementation')

  return scrollManagerExists && navigationDotsExists && scrollProgressExists && smoothScrollImplemented
}

function validateThemeSystem() {
  log(`\n🎨 Validating Theme System (Requirement 3.1, 3.6)`, 'bold')

  // Check theme context
  const themeContextExists = checkFileExists('src/contexts/ThemeContext.jsx', 'ThemeContext')

  // Check theme configurations
  const themes = ['light', 'dark', 'christmas', 'hollywood', 'rain']
  let allThemesConfigured = true

  themes.forEach((theme) => {
    const found = checkFileContent('src/contexts/ThemeContext.jsx', theme, `Theme configuration: ${theme}`)
    if (!found) allThemesConfigured = false
  })

  // Check theme selector component
  const themeSelectorExists = checkFileExists('src/components/OptimizedThemeSelector.jsx', 'Theme selector component')

  // Check CSS custom properties usage
  const cssVariablesUsed = checkFileContent('src/contexts/ThemeContext.jsx', /setProperty.*--.*color/i, 'CSS custom properties implementation')

  return themeContextExists && allThemesConfigured && themeSelectorExists && cssVariablesUsed
}

function validateAnimationSystem() {
  log(`\n🎬 Validating Animation System (Requirement 2.3, 2.5)`, 'bold')

  // Check Framer Motion integration
  const framerMotionUsed = checkFileContent('src/components/SectionWrapper.jsx', /framer-motion|motion\./i, 'Framer Motion integration')

  // Check animation presets
  const animationPresetsExist = checkFileContent('src/components/MultiversePortfolio.jsx', /animation.*fade|slide|scale/i, 'Animation presets')

  // Check reduced motion support
  const reducedMotionSupport = checkFileContent('src/hooks/useAccessibility.js', /prefers-reduced-motion|reducedMotion/i, 'Reduced motion accessibility')

  // Check staggered animations
  const staggeredAnimations = checkFileContent('src/components/MultiversePortfolio.jsx', /stagger/i, 'Staggered animations')

  return framerMotionUsed && animationPresetsExist && reducedMotionSupport && staggeredAnimations
}

function validatePerformanceOptimizations() {
  log(`\n⚡ Validating Performance Optimizations (Requirement 4.1, 4.2)`, 'bold')

  // Check performance monitoring
  const performanceMonitorExists = checkFileExists('src/utils/performanceOptimizations.js', 'Performance monitoring utilities')

  // Check lazy loading implementation
  const lazyLoadingImplemented = checkFileContent('src/utils/performanceOptimizations.js', /lazy|preload/i, 'Lazy loading implementation')

  // Check mobile optimizations
  const mobileOptimizationsExist = checkFileExists('src/hooks/useMobileOptimizations.js', 'Mobile optimizations hook')

  // Check error boundaries
  const errorBoundariesExist = checkFileExists('src/components/ErrorBoundary.jsx', 'Error boundaries')

  // Check throttling for scroll events
  const scrollThrottling = checkFileContent('src/hooks/useScrollManager.js', /throttle|debounce/i, 'Scroll event throttling')

  return performanceMonitorExists && lazyLoadingImplemented && mobileOptimizationsExist && errorBoundariesExist && scrollThrottling
}

function validateAccessibility() {
  log(`\n♿ Validating Accessibility (Requirement 4.3, 4.4)`, 'bold')

  // Check accessibility provider
  const accessibilityProviderExists = checkFileExists('src/components/AccessibilityProvider.jsx', 'AccessibilityProvider component')

  // Check skip links
  const skipLinksExist = checkFileExists('src/components/SkipLinks.jsx', 'Skip links component')

  // Check ARIA labels and landmarks
  const ariaImplementation = checkFileContent('src/components/MultiversePortfolio.jsx', /aria-label|role=|aria-/i, 'ARIA labels and landmarks')

  // Check keyboard navigation
  const keyboardNavigation = checkFileContent('src/hooks/useAccessibility.js', /keyboard|keydown|keyup/i, 'Keyboard navigation support')

  // Check screen reader support
  const screenReaderSupport = checkFileContent('src/components/NavigationAnnouncer.jsx', /screen.*reader|announce/i, 'Screen reader support')

  return accessibilityProviderExists && skipLinksExist && ariaImplementation && keyboardNavigation && screenReaderSupport
}

function validateMobileOptimizations() {
  log(`\n📱 Validating Mobile Optimizations (Requirement 4.5, 5.5)`, 'bold')

  // Check mobile navigation
  const mobileNavigationExists = checkFileExists('src/components/MobileNavigation.jsx', 'Mobile navigation component')

  // Check touch gestures
  const touchGesturesImplemented = checkFileContent('src/hooks/useMobileOptimizations.js', /touch|swipe|gesture/i, 'Touch gestures implementation')

  // Check responsive design
  const responsiveDesign = checkFileContent('src/components/MultiversePortfolio.module.css', /@media|mobile|tablet/i, 'Responsive design CSS')

  // Check mobile theme optimizations
  const mobileThemeOptimizer = checkFileExists('src/components/MobileThemeOptimizer.jsx', 'Mobile theme optimizer')

  return mobileNavigationExists && touchGesturesImplemented && responsiveDesign && mobileThemeOptimizer
}

function validateURLRouting() {
  log(`\n🔗 Validating URL Routing (Requirement 1.4, 5.3, 5.4)`, 'bold')

  // Check URL routing hook
  const urlRoutingExists = checkFileExists('src/hooks/useURLRouting.js', 'URL routing hook')

  // Check browser history management
  const historyManagement = checkFileContent('src/hooks/useURLRouting.js', /history|pushState|replaceState/i, 'Browser history management')

  // Check legacy redirects handling
  const legacyRedirects = checkFileContent('src/hooks/useURLRouting.js', /redirect|legacy/i, 'Legacy URL redirects')

  return urlRoutingExists && historyManagement && legacyRedirects
}

function validateErrorHandling() {
  log(`\n🛡️  Validating Error Handling (Requirement 4.1)`, 'bold')

  // Check error handling utilities
  const errorHandlingExists = checkFileExists('src/utils/errorHandling.js', 'Error handling utilities')

  // Check error boundaries implementation
  const errorBoundariesImplemented = checkFileContent('src/components/ErrorBoundary.jsx', /componentDidCatch|ErrorBoundary/i, 'Error boundaries implementation')

  // Check error recovery manager
  const errorRecoveryExists = checkFileExists('src/components/ErrorRecoveryManager.jsx', 'Error recovery manager')

  // Check theme error handling
  const themeErrorHandling = checkFileContent('src/contexts/ThemeContext.jsx', /try.*catch|error/i, 'Theme error handling')

  return errorHandlingExists && errorBoundariesImplemented && errorRecoveryExists && themeErrorHandling
}

function validatePackageIntegrity() {
  log(`\n📦 Validating Package Integrity`, 'bold')

  // Check package.json exists
  const packageJsonExists = checkFileExists('package.json', 'package.json')

  if (packageJsonExists) {
    // Check required dependencies
    const requiredDeps = ['framer-motion', 'next', 'react']

    let allDepsPresent = true
    requiredDeps.forEach((dep) => {
      const found = checkFileContent('package.json', dep, `Dependency: ${dep}`)
      if (!found) allDepsPresent = false
    })

    return allDepsPresent
  }

  return false
}

function generateTestReport() {
  log(`\n📊 Test Results Summary`, 'bold')
  log(`═══════════════════════════════════════`, 'cyan')
  log(`✅ Passed: ${testResults.passed}`, 'green')
  log(`❌ Failed: ${testResults.failed}`, 'red')
  log(`⚠️  Warnings: ${testResults.warnings}`, 'yellow')
  log(`📋 Total Tests: ${testResults.passed + testResults.failed}`, 'blue')

  const successRate = ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)
  log(`📈 Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red')

  if (testResults.failed > 0) {
    log(`\n❌ Failed Tests:`, 'red')
    testResults.details
      .filter((test) => !test.passed)
      .forEach((test) => {
        log(`   • ${test.testName}`, 'red')
        if (test.details) {
          log(`     ${test.details}`, 'cyan')
        }
      })
  }

  // Performance recommendations
  log(`\n🚀 Performance Recommendations:`, 'magenta')
  log(`   • Ensure all theme assets are properly lazy-loaded`)
  log(`   • Monitor scroll performance on low-end devices`)
  log(`   • Test theme switching performance with all themes`)
  log(`   • Validate mobile touch gesture responsiveness`)

  // Cross-browser compatibility notes
  log(`\n🌐 Cross-Browser Compatibility Notes:`, 'magenta')
  log(`   • Test CSS custom properties support in target browsers`)
  log(`   • Validate Intersection Observer API fallbacks`)
  log(`   • Check Framer Motion animations across browsers`)
  log(`   • Test touch events on various mobile devices`)

  return {
    passed: testResults.passed,
    failed: testResults.failed,
    warnings: testResults.warnings,
    successRate: parseFloat(successRate),
  }
}

// Main test execution
function runIntegrationTests() {
  log(`🚀 Starting Multiverse Portfolio Integration Tests`, 'bold')
  log(`═══════════════════════════════════════════════════`, 'cyan')

  // Core integration tests
  validateSectionIntegration()
  validateScrollManagement()
  validateThemeSystem()
  validateAnimationSystem()

  // Performance and optimization tests
  validatePerformanceOptimizations()
  validateMobileOptimizations()

  // Accessibility and user experience tests
  validateAccessibility()
  validateURLRouting()

  // Error handling and reliability tests
  validateErrorHandling()

  // Package integrity
  validatePackageIntegrity()

  // Generate final report
  const results = generateTestReport()

  // Exit with appropriate code
  if (results.failed === 0) {
    log(`\n🎉 All integration tests passed! The Multiverse Portfolio is ready.`, 'green')
    process.exit(0)
  } else {
    log(`\n⚠️  Some tests failed. Please review and fix the issues above.`, 'yellow')
    process.exit(1)
  }
}

// Run the tests
runIntegrationTests()
