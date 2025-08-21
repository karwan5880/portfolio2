import { NavigationDots } from '../NavigationDots'
import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

describe('NavigationDots', () => {
  const mockSections = [
    { id: 'home', title: 'Home' },
    { id: 'about', title: 'About' },
    { id: 'contact', title: 'Contact' },
  ]

  test('renders navigation dots for each section', () => {
    render(<NavigationDots sections={mockSections} currentSection="home" onSectionClick={vi.fn()} />)

    // Check that navigation is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument()

    // Check that buttons are rendered for each section
    expect(screen.getByLabelText('Go to Home section')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to About section')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to Contact section')).toBeInTheDocument()
  })

  test('marks current section as active', () => {
    render(<NavigationDots sections={mockSections} currentSection="about" onSectionClick={vi.fn()} />)

    const aboutButton = screen.getByLabelText('Go to About section')
    expect(aboutButton).toHaveAttribute('aria-current', 'true')
  })

  test('returns null when no sections provided', () => {
    const { container } = render(<NavigationDots sections={[]} currentSection="" onSectionClick={vi.fn()} />)

    expect(container.firstChild).toBeNull()
  })
})
