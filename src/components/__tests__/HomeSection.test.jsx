import { HomeSection } from '../HomeSection'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock the dynamic import for SentientBackground
vi.mock('@/components/SentientBackground', () => ({
  default: () => <div data-testid="sentient-background">Sentient Background</div>,
}))

// Mock the hooks
vi.mock('@/hooks/useGatekeeper', () => ({
  useGatekeeper: vi.fn(),
}))

vi.mock('@/hooks/useWindowSize', () => ({
  useWindowSize: () => ({ width: 1024 }),
}))

vi.mock('@/stores/audioStore', () => ({
  useAudioStore: () => vi.fn(),
}))

// Mock the components
vi.mock('@/components/DogEar', () => ({
  DogEar: ({ href, 'aria-label': ariaLabel }) => (
    <a href={href} aria-label={ariaLabel} data-testid="dog-ear">
      Dog Ear
    </a>
  ),
}))

vi.mock('@/components/GitHubIcon', () => ({
  GitHubIcon: () => <div data-testid="github-icon">GitHub</div>,
}))

vi.mock('@/components/ResumeIcon', () => ({
  ResumeIcon: () => <div data-testid="resume-icon">Resume</div>,
}))

vi.mock('@/components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}))

vi.mock('@/components/Section', () => ({
  Section: ({ title, children }) => (
    <div data-testid={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}))

vi.mock('@/components/Project', () => ({
  Project: ({ title, children }) => (
    <div data-testid="project">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}))

vi.mock('@/components/Skills', () => ({
  Skills: () => <div data-testid="skills">Skills Component</div>,
}))

describe('HomeSection', () => {
  it('renders all main sections', () => {
    render(<HomeSection />)

    // Check that all main sections are present
    expect(screen.getByTestId('sentient-background')).toBeInTheDocument()
    expect(screen.getByTestId('github-icon')).toBeInTheDocument()
    expect(screen.getByTestId('resume-icon')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()

    // Check sections
    expect(screen.getByTestId('section-summary')).toBeInTheDocument()
    expect(screen.getByTestId('section-education')).toBeInTheDocument()
    expect(screen.getByTestId('section-experience')).toBeInTheDocument()
    expect(screen.getByTestId('section-projects')).toBeInTheDocument()
    expect(screen.getByTestId('section-skills-&-tools')).toBeInTheDocument()
    expect(screen.getByTestId('section-languages')).toBeInTheDocument()

    // Check DogEar navigation
    expect(screen.getByTestId('dog-ear')).toBeInTheDocument()
  })

  it('contains expected content', () => {
    render(<HomeSection />)

    // Check for key content
    expect(screen.getByText(/Software engineer focused on AI/)).toBeInTheDocument()
    expect(screen.getByText(/Universiti Tunku Abdul Rahman/)).toBeInTheDocument()
    expect(screen.getByText(/Inventech/)).toBeInTheDocument()
    expect(screen.getByText(/English, Mandarin, Malay/)).toBeInTheDocument()
  })

  it('has proper navigation setup for multiverse', () => {
    render(<HomeSection />)

    const dogEar = screen.getByTestId('dog-ear')
    expect(dogEar).toHaveAttribute('href', '#timeline')
    expect(dogEar).toHaveAttribute('aria-label', 'View the timeline')
  })
})
