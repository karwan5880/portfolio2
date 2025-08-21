'use client'

import { CornerLink } from '@/components/shared/CornerLink'

import DesktopCareerView from './DesktopCareerView'
import MobileCareerView from './MobileCareerView'
import { useGatekeeper } from '@/hooks/useGatekeeper'
import { useScreenSize } from '@/hooks/useScreenSize'

export default function CareerPage() {
  useGatekeeper('/career')
  const { isMobile, isLoading } = useScreenSize()

  // Show loading state to prevent hydration mismatch
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <>
      {isMobile ? <MobileCareerView /> : <DesktopCareerView />}
      <CornerLink href="/design/0/skills" position="bottom-left" label="Skills" aria-label="Return to skills" />
      <CornerLink href="/design/0/project" position="bottom-right" label="Project" aria-label="Go to project" />
    </>
  )
}
