import { SectionWrapper } from '../SectionWrapper'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

describe('SectionWrapper', () => {
  const mockProps = {
    id: 'test-section',
    title: 'Test Section',
    onVisibilityChange: vi.fn(),
    onRegister: vi.fn(),
  }

  it('renders section with correct attributes', () => {
    render(
      <SectionWrapper {...mockProps}>
        <div>Test Content</div>
      </SectionWrapper>
    )

    const section = screen.getByRole('region')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('id', 'test-section')
    expect(section).toHaveAttribute('aria-label', 'Test Section')
    expect(section).toHaveAttribute('data-section', 'test-section')
  })

  it('renders children content', () => {
    render(
      <SectionWrapper {...mockProps}>
        <div>Test Content</div>
      </SectionWrapper>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('calls onRegister with section element', () => {
    const onRegister = vi.fn()

    render(
      <SectionWrapper {...mockProps} onRegister={onRegister}>
        <div>Test Content</div>
      </SectionWrapper>
    )

    expect(onRegister).toHaveBeenCalledWith('test-section', expect.any(HTMLElement))
  })

  it('sets up IntersectionObserver', () => {
    render(
      <SectionWrapper {...mockProps}>
        <div>Test Content</div>
      </SectionWrapper>
    )

    expect(mockIntersectionObserver).toHaveBeenCalled()
  })
})
