'use client'

/**
 * Fallback components for missing or broken dependencies
 * These provide basic functionality when the main components fail
 */

// Basic fallback for section components
export const FallbackSection = ({ children, title = 'Section', isMobile = false, ...props }) => {
  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg-color, #f8f9fa)',
        color: 'var(--text-color, #333)',
      }}
      {...props}
    >
      <h2 style={{ marginBottom: '1rem', fontSize: isMobile ? '1.5rem' : '2rem' }}>{title}</h2>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>{children || <p>This section is temporarily unavailable. Please check back later.</p>}</div>
    </section>
  )
}

// Fallback for navigation components
export const FallbackNavigation = ({ sections = [], currentSection = '', onSectionClick = () => {}, ...props }) => {
  return (
    <nav
      style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
      {...props}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(section.id)}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid #333',
            backgroundColor: currentSection === section.id ? '#333' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          aria-label={`Navigate to ${section.title}`}
        />
      ))}
    </nav>
  )
}

// Fallback for mobile navigation
export const FallbackMobileNavigation = ({ sections = [], currentSection = '', onSectionClick = () => {}, onNext = () => {}, onPrevious = () => {}, canNavigateNext = true, canNavigatePrevious = true, ...props }) => {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '10px',
        borderRadius: '25px',
      }}
      {...props}
    >
      <button
        onClick={onPrevious}
        disabled={!canNavigatePrevious}
        style={{
          padding: '8px 12px',
          backgroundColor: canNavigatePrevious ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          cursor: canNavigatePrevious ? 'pointer' : 'not-allowed',
        }}
      >
        ←
      </button>

      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: currentSection === section.id ? '#007bff' : '#666',
              cursor: 'pointer',
            }}
            aria-label={`Navigate to ${section.title}`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!canNavigateNext}
        style={{
          padding: '8px 12px',
          backgroundColor: canNavigateNext ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          cursor: canNavigateNext ? 'pointer' : 'not-allowed',
        }}
      >
        →
      </button>
    </nav>
  )
}

// Fallback for theme selector
export const FallbackThemeSelector = ({ className = '', ...props }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '8px',
        color: 'white',
      }}
      className={className}
      {...props}
    >
      <span style={{ fontSize: '12px' }}>Theme Selector Unavailable</span>
    </div>
  )
}

// Fallback for scroll progress
export const FallbackScrollProgress = ({ progress = 0, className = '', ...props }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
      className={className}
      {...props}
    >
      <div
        style={{
          height: '100%',
          backgroundColor: '#007bff',
          width: `${progress * 100}%`,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
}

// Fallback for share button
export const FallbackShareButton = ({ position = 'bottom-left', isMobile = false, ...props }) => {
  const positionStyles = {
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
  }

  return (
    <button
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 1000,
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        fontSize: '18px',
      }}
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: 'Portfolio',
            url: window.location.href,
          })
        } else {
          navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
        }
      }}
      {...props}
    >
      📤
    </button>
  )
}

// Fallback for skip links
export const FallbackSkipLinks = ({ sections = [], onSkipToSection = () => {} }) => {
  return (
    <div style={{ position: 'absolute', left: '-9999px' }}>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          onClick={(e) => {
            e.preventDefault()
            onSkipToSection(section.id)
          }}
          style={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 999999,
            padding: '8px',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
          onFocus={(e) => {
            e.target.style.left = '6px'
            e.target.style.top = '6px'
          }}
          onBlur={(e) => {
            e.target.style.left = '-9999px'
          }}
        >
          Skip to {section.title}
        </a>
      ))}
    </div>
  )
}

// Generic fallback wrapper
export const FallbackWrapper = ({ children, componentName = 'Component', error = null }) => {
  return (
    <div
      style={{
        padding: '20px',
        margin: '10px',
        border: '2px dashed #ffa500',
        borderRadius: '8px',
        backgroundColor: '#fff3cd',
        color: '#856404',
        textAlign: 'center',
      }}
    >
      <h4>⚠️ {componentName} Unavailable</h4>
      <p>Using fallback implementation</p>
      {error && (
        <details style={{ marginTop: '10px', textAlign: 'left' }}>
          <summary>Error Details</summary>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>{error.toString()}</pre>
        </details>
      )}
      {children}
    </div>
  )
}
