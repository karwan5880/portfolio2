'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { DogEar } from '@/components/shared/DogEar'
import { GitHubIcon } from '@/components/shared/GithubIcon'
import { Header } from '@/components/shared/Header'
import { Preloader } from '@/components/shared/Preloader'
import { Project } from '@/components/shared/Project'
import { ResumeIcon } from '@/components/shared/ResumeIcon'
import { Section } from '@/components/shared/Section'
import { Skills } from '@/components/shared/Skills'

import styles from './page.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useAudioStore } from '@/stores/audioStore'

const SentientBackground = dynamic(() => import('@/components/shared/SentientBackground'), {
  ssr: false,
})

const commonStyles = {
  ul: { paddingLeft: '20px', margin: 0, listStyleType: 'disc' },
  p: { margin: 0 },
  h3: { color: 'white', fontSize: '1em', fontWeight: '700', margin: '0 0 0.25rem 0' },
  subtext: { color: '#a0a0a0', fontSize: '0.9em' },
}

export default function Design0Page() {
  useGatekeeper('/')
  const armAudio = useAudioStore((state) => state.armAudio)
  const main = useRef(null)
  const resumeContainer = useRef(null)
  const { width } = useWindowSize()
  const isMobile = width < 768
  const [isBooting, setIsBooting] = useState(true)

  return (
    <div ref={main}>
      <SentientBackground />
      <div ref={resumeContainer}>
        <div className={styles.pageWrapper}>
          <div className={styles.documentContainer}>
            <GitHubIcon />
            <ResumeIcon />
            <Header />
            <Section title="Summary" isInteractive>
              <ul style={commonStyles.ul}>
                <li>Software engineer focused on AI, system programming, and full-stack development with 6+ years of hands-on experience.</li>
                <li>
                  Built diverse software solutions: windows drivers, C++ libraries, AI applications, system applications, and modern web applications.
                </li>
              </ul>
            </Section>
            <Section title="Education" isInteractive>
              <h3 style={commonStyles.h3}>Universiti Tunku Abdul Rahman (UTAR)</h3>
              <p style={commonStyles.p}>
                Master of Engineering Science | Dissertation: License Plate Detection Using Deep Learning Object Detection Models
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
                <li>Developed SQL queries to optimize data extraction efficiency, enabling real-time visualization of product metrics.</li>
              </ul>
            </Section>
            <Section title="Projects" isInteractive>
              <Project title="License Plate Detection Using Deep Learning Object Detection Models">
                <ul style={{ ...commonStyles.ul, marginBottom: '0.5rem', marginTop: 0 }}>
                  <li>Fine-tuned YOLOv4, EfficientDet, CenterNet, Faster R-CNN, and SSD models on the CCPD dataset.</li>
                  <li>Improved YOLOv4 accuracy by 13.32% on the CCPD dataset through custom convolution layers and optimized preprocessing.</li>
                </ul>
              </Project>
              <Project title="WinRT Windows Graphics Capture Library">
                <ul style={{ ...commonStyles.ul, marginTop: 0 }}>
                  <li>Developed high-performance screen capture tool using WinRT, compiled into a DLL and integrated with Python using ctypes.</li>
                </ul>
              </Project>
            </Section>
            <Section title="Skills & Tools" isInteractive>
              <Skills />
            </Section>
            <Section title="Languages" isInteractive>
              <p style={commonStyles.p}>English, Mandarin, Malay</p>
            </Section>
            <DogEar href="/design/0/timeline" position="bottom-right" aria-label="View the timeline" onNavigateStart={armAudio} />
          </div>
        </div>
      </div>
    </div>
  )
}
