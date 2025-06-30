import Link from 'next/link'

import { DogEar } from '@/components/DogEar'

import styles from './dossier.module.css'

export default function Dossier() {
  return (
    <div className={styles.dossierWrapper}>
      <div className={styles.dossierPaper}>
        <h1 className={styles.header}>LOG_1995-2025.TXT</h1>
        <pre className={styles.timeline}>
          {`
1995: System Genesis (Born)
2012: Initializing Protocols (SPM)
2013: Caching... (Foundation)
2014: Core Learning Module Initialized (Degree)
2018: First API Call (Internship)
2019: Module "Undergraduate" returned exit code 0 (Completed)
2019: Loading Module "Postgraduate"...
2020: Global System Interrupt (COVID-19 Pause)
2021: System Idle... (COVID-19 Pause)
2022: Resuming Module "Postgraduate"...
2023: Finishing Module "Postgraduate"...
2024.01: Module "Postgraduate" returned exit code 0 (Graduated)
2024.01: Process "Technopreneur" initiated...
2024.08: Process "Technopreneur" returned exit code 1 (Failed)
2024.08: Executing script "job_hunt_abroad_HK_TW.sh"...
   -> Applications: 500+
   -> Interviews: <10
   -> Offers: 0
   -> Script failed.
2025.03: Executing script "job_hunt_local_MY_0.sh"... (Running)
   `}
        </pre>
        <div className={styles.blinkingCursor}></div>
        {/* <Link href="/dossier/applications" className={styles.dogEar} aria-label="Go to application list"></Link> */}
        {/* <Link href="/dossier/dev-history" className={styles.dogEar} aria-label="Go to dev history"></Link> */}
        {/* <DogEar href="/dossier/dev-history" aria-label="Go to dev history" /> */}
        {/* <DogEar href="/dev-history" position="bottom-right" aria-label="View dev history" /> */}
        <DogEar href="/job-hunt" position="bottom-right" aria-label="View job-hunt" />
      </div>
      {/* <DogEar direction="previous" aria-label="Go to previous page" /> */}
      <DogEar href="/" position="bottom-left" aria-label="Return to main page" />
    </div>
  )
}

//    -> Applications: 50+
//    -> Interviews: <5
//    -> Offers: 0
//    -> Script failed.
// 2025.04: Executing script "job_hunt_local_MY_0.sh"... (Running)
//    -> Applications: 100+
//    -> Interviews: <10
//    -> Offers: 0
//    -> Script failed.
// 2025.05: Executing script "job_hunt_local_MY_1.sh"... (Running)
//    -> Applications: 100+
//    -> Interviews: <10
//    -> Offers: 0
//    -> Script failed.
// 2025.06: Executing script "job_hunt_local_MY_2.sh"... (Running)
//    -> Applications: 100+
//    -> Interviews: <10
//    -> Offers: 0
//    -> Script failed.
// 2025.07: Executing script "job_hunt_local_MY_3.sh"... (Running)
