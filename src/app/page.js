'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { DogEar } from '@/components/DogEar'
import { Header } from '@/components/Header'
import { Preloader } from '@/components/Preloader'
import { Project } from '@/components/Project'
import { Section } from '@/components/Section'
import { Skills } from '@/components/Skills'

import styles from './Page.module.css'
import { useWindowSize } from '@/hooks/useWindowSize'

const SentientBackground = dynamic(() => import('@/components/SentientBackground'), {
  ssr: false,
})

const commonStyles = {
  ul: { paddingLeft: '20px', margin: 0, listStyleType: 'disc' },
  p: { margin: 0 },
  h3: { color: 'white', fontSize: '1em', fontWeight: '700', margin: '0 0 0.25rem 0' },
  subtext: { color: '#a0a0a0', fontSize: '0.9em' },
}

export default function Home() {
  const main = useRef(null)
  const resumeContainer = useRef(null)
  const { width } = useWindowSize()
  const isMobile = width < 768
  const [isBooting, setIsBooting] = useState(true) // Start in "booting" state

  // This logic is for the main page content after the loader is gone
  useEffect(() => {
    // Prevent this from running while the preloader is active
    if (isBooting) return

    // ... any GSAP or other animations for your main page can go here ...
  }, [isBooting]) // Re-run when booting is finished

  // If we are booting, only render the preloader
  if (isBooting) {
    return <Preloader onBootComplete={() => setIsBooting(false)} />
  }

  return (
    <div ref={main}>
      <SentientBackground />
      {/* {!isMobile && <SentientBackground />} */}
      <div ref={resumeContainer}>
        <div className={styles.pageWrapper}>
          <div className={styles.documentContainer}>
            <Header />
            <Section title="Summary" isInteractive>
              <ul style={commonStyles.ul}>
                <li>
                  Developing software solutions since 2018, starting with web technologies (2018-2019) and advancing to
                  Python/C++ development (2020-2024).
                </li>
                <li>
                  Developed diverse projects including a new Windows driver, Python library, Godot game, Flutter app,
                  and Next.js landing page.
                </li>
                <li>Continuously expanding expertise through self-study in AI, LLM, and reinforcement learning.</li>
              </ul>
            </Section>
            <Section title="Education" isInteractive>
              <h3 style={commonStyles.h3}>Universiti Tunku Abdul Rahman (UTAR)</h3>
              <p style={commonStyles.p}>
                Master of Engineering Science | Dissertation: License Plate Detection Using Deep Learning Object
                Detection Models
              </p>
              <p style={commonStyles.p}>Bachelor of Computer Science (Honours)</p>
            </Section>
            <Section title="Experience" isInteractive>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={commonStyles.h3} className={styles.jobTitle}>
                  <span className={styles.companyName}>Inventech</span>
                  <span className={styles.roleName}>Software Engineer Intern</span>
                </h3>
                <span style={commonStyles.subtext}>Oct 2018 – Dec 2018</span>
              </div>
              <ul style={commonStyles.ul}>
                <li>Designed and implemented front-end and back-end solutions using Angular and .Net Core.</li>
                <li>
                  Developed SQL queries to optimize data extraction efficiency, enabling real-time visualization of
                  product metrics.
                </li>
              </ul>
            </Section>
            <Section title="Projects" isInteractive>
              <Project title="License Plate Detection Using Deep Learning Object Detection Models">
                <ul style={{ ...commonStyles.ul, marginBottom: '0.5rem', marginTop: 0 }}>
                  <li>Fine-tuned YOLOv4, EfficientDet, CenterNet, Faster R-CNN, and SSD models on the CCPD dataset.</li>
                  <li>
                    Improved YOLOv4 accuracy by 13.32% on the CCPD dataset through custom convolution layers and
                    optimized preprocessing.
                  </li>
                </ul>
              </Project>
              <Project title="WinRT Windows Graphics Capture Library">
                <ul style={{ ...commonStyles.ul, marginTop: 0 }}>
                  <li>
                    Developed high-performance screen capture tool using WinRT, compiled into a DLL and integrated with
                    Python using ctypes.
                  </li>
                </ul>
              </Project>
            </Section>
            <Section title="Skills & Tools" isInteractive>
              <Skills />
            </Section>
            <Section title="Languages" isInteractive>
              <p style={commonStyles.p}>English, Mandarin, Malay</p>
            </Section>
            {/* <Link href="/dossier" onClick={playSound} className={styles.dogEar} aria-label="Go to next page"></Link> */}
            {/* <DogEar href="/dossier" aria-label="Go to next page" /> */}
            <DogEar href="/dossier" position="bottom-right" aria-label="View the dossier" />
          </div>
        </div>
      </div>
    </div>
  )
}
