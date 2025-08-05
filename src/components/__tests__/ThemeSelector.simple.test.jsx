import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '@/contexts/ThemeContext.jsx'
// Import useTheme after defining the component
import { useTheme } from '@/contexts/ThemeContext.jsx'

// Simple ThemeSelector component without CSS modules for testing
const SimpleThemeSelector = () => {
  const { currentTheme, availableThemes, setTheme, isLoading } = useTheme()

  if (isLoading) {
    return <div data-testid="loading">Loading themes...</div>
  }

  return (
    <div data-testid="theme-selector">
      <div>Theme:</div>
      <div>
        {availableThemes.map((theme) => (
          <button key={theme} data-testid={`theme-${theme}`} className={currentTheme === theme ? 'active' : ''} onClick={() => setTheme(theme)} aria-label={`Switch to ${theme} theme`}>
            {theme === 'light' ? '☀️' : '🌙'} {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

describe('SimpleThemeSelector', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render theme selector with available themes', async () => {
    localStorage.getItem.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <SimpleThemeSelector />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-selector')).toBeInTheDocument()
    })

    expect(screen.getByText('Theme:')).toBeInTheDocument()
    expect(screen.getByText('☀️ Light')).toBeInTheDocument()
    expect(screen.getByText('🌙 Dark')).toBeInTheDocument()
  })

  it('should switch themes when button is clicked', async () => {
    const user = userEvent.setup()
    localStorage.getItem.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <SimpleThemeSelector />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-selector')).toBeInTheDocument()
    })

    const lightButton = screen.getByTestId('theme-light')
    await user.click(lightButton)

    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'light')
  })

  it('should highlight the current theme', async () => {
    localStorage.getItem.mockReturnValue('light')

    render(
      <ThemeProvider>
        <SimpleThemeSelector />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-selector')).toBeInTheDocument()
    })

    const lightButton = screen.getByTestId('theme-light')
    const darkButton = screen.getByTestId('theme-dark')

    expect(lightButton).toHaveClass('active')
    expect(darkButton).not.toHaveClass('active')
  })

  it('should have proper accessibility attributes', async () => {
    localStorage.getItem.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <SimpleThemeSelector />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-selector')).toBeInTheDocument()
    })

    const lightButton = screen.getByTestId('theme-light')
    const darkButton = screen.getByTestId('theme-dark')

    expect(lightButton).toHaveAttribute('aria-label', 'Switch to light theme')
    expect(darkButton).toHaveAttribute('aria-label', 'Switch to dark theme')
  })
})
