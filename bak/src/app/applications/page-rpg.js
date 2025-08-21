'use client'

import { useEffect, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { applications } from '@/data/applications2'
import { useGatekeeper } from '@/hooks/useGatekeeper'

// Filter and clean the applications data
const cleanApplications = applications.filter((app) => app.name && app.name.trim() !== '')

// Calculate player stats
const totalApplications = cleanApplications.length
const interviewCount = cleanApplications.filter((app) => app.status === 'interviewed').length
const appliedCount = cleanApplications.filter((app) => app.status === 'applied').length

// XP calculation: 10 XP per application, 50 bonus XP per interview
const totalXP = totalApplications * 10 + interviewCount * 50
const playerLevel = Math.floor(totalXP / 100) + 1

// Battle log entries with RPG flavor
const getBattleLogEntry = (app, index) => {
  const isInterview = app.status === 'interviewed'
  const isBoss = ['Google', 'Meta', 'Apple', 'Amazon', 'Netflix', 'Microsoft', 'Nvidia', 'Tesla', 'OpenAI'].includes(app.name)

  if (isInterview && isBoss) {
    return {
      type: 'boss-battle',
      message: `⚔️ BOSS BATTLE: Challenged ${app.name}! Gained interview access!`,
      xp: 60,
      status: 'legendary',
    }
  } else if (isInterview) {
    return {
      type: 'elite-battle',
      message: `🛡️ Elite Battle: Engaged ${app.name} in combat! Interview unlocked!`,
      xp: 50,
      status: 'epic',
    }
  } else if (isBoss) {
    return {
      type: 'boss-attempt',
      message: `🎯 Attempted raid on ${app.name}... Awaiting response from the guild masters.`,
      xp: 15,
      status: 'rare',
    }
  } else {
    return {
      type: 'standard-battle',
      message: `⚡ Cast application spell on ${app.name}. Spell is in effect...`,
      xp: 10,
      status: 'common',
    }
  }
}

// Achievement system
const achievements = [
  { name: 'First Blood', condition: totalApplications >= 1, icon: '🎯', description: 'Sent your first application' },
  { name: 'Interview Warrior', condition: interviewCount >= 1, icon: '⚔️', description: 'Unlocked your first interview' },
  { name: 'Tech Giant Challenger', condition: cleanApplications.some((app) => ['Google', 'Meta', 'Apple', 'Amazon'].includes(app.name)), icon: '🏰', description: 'Challenged a tech giant' },
  { name: 'Persistent Hunter', condition: totalApplications >= 50, icon: '🏹', description: 'Sent 50+ applications' },
  { name: 'Elite Interviewer', condition: interviewCount >= 5, icon: '👑', description: 'Secured 5+ interviews' },
  { name: 'Global Warrior', condition: cleanApplications.some((app) => app.name.includes('華') || app.name.includes('股份')), icon: '🌏', description: 'Applied across continents' },
]

const unlockedAchievements = achievements.filter((achievement) => achievement.condition)

export default function BattleLogPage() {
  useGatekeeper('/applications')
  const [visibleEntries, setVisibleEntries] = useState(10)
  const [animationIndex, setAnimationIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationIndex((prev) => (prev + 1) % cleanApplications.length)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const loadMoreEntries = () => {
    setVisibleEntries((prev) => Math.min(prev + 20, cleanApplications.length))
  }

  return (
    <div className={styles.battleLogWrapper}>
      {/* Player Stats Panel */}
      <div className={styles.playerStats}>
        <div className={styles.playerInfo}>
          <h2 className={styles.playerName}>Job Hunter Kiro</h2>
          <div className={styles.levelBadge}>Level {playerLevel}</div>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{totalXP}</span>
            <span className={styles.statLabel}>Total XP</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{totalApplications}</span>
            <span className={styles.statLabel}>Battles Fought</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{interviewCount}</span>
            <span className={styles.statLabel}>Boss Battles</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{Math.round((interviewCount / totalApplications) * 100)}%</span>
            <span className={styles.statLabel}>Success Rate</span>
          </div>
        </div>
      </div>

      {/* Achievements Panel */}
      <div className={styles.achievementsPanel}>
        <h3 className={styles.achievementsTitle}>🏆 Achievements Unlocked</h3>
        <div className={styles.achievementsList}>
          {unlockedAchievements.map((achievement, index) => (
            <div key={index} className={styles.achievement}>
              <span className={styles.achievementIcon}>{achievement.icon}</span>
              <div className={styles.achievementInfo}>
                <span className={styles.achievementName}>{achievement.name}</span>
                <span className={styles.achievementDesc}>{achievement.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Log */}
      <div className={styles.battleLogContainer}>
        <h1 className={styles.battleLogTitle}>⚔️ BATTLE LOG: JOB HUNT CAMPAIGN</h1>
        <div className={styles.battleLogScroll}>
          {cleanApplications.slice(0, visibleEntries).map((app, index) => {
            const battleEntry = getBattleLogEntry(app, index)
            const isAnimating = index === animationIndex

            return (
              <div key={index} className={`${styles.battleEntry} ${styles[battleEntry.status]} ${isAnimating ? styles.highlight : ''}`}>
                <div className={styles.battleTimestamp}>[{String(index + 1).padStart(3, '0')}]</div>
                <div className={styles.battleMessage}>{battleEntry.message}</div>
                <div className={styles.battleXP}>+{battleEntry.xp} XP</div>
              </div>
            )
          })}

          {visibleEntries < cleanApplications.length && (
            <button className={styles.loadMoreButton} onClick={loadMoreEntries}>
              📜 Load More Battle Entries ({cleanApplications.length - visibleEntries} remaining)
            </button>
          )}
        </div>
      </div>

      {/* Status Effects */}
      <div className={styles.statusEffects}>
        <div className={styles.statusEffect}>
          <span className={styles.statusIcon}>🔮</span>
          <span className={styles.statusText}>Persistent Job Seeker</span>
        </div>
        <div className={styles.statusEffect}>
          <span className={styles.statusIcon}>⚡</span>
          <span className={styles.statusText}>Application Spells Active</span>
        </div>
        <div className={styles.statusEffect}>
          <span className={styles.statusIcon}>🛡️</span>
          <span className={styles.statusText}>Interview Ready</span>
        </div>
      </div>

      <CornerLink href="/job-hunt" position="bottom-left" label="Job Hunt" aria-label="Return to job-hunt" />
      <CornerLink href="/location" position="bottom-right" label="World" aria-label="Go to location" />
    </div>
  )
}
