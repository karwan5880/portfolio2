import styles from './SnowEffect.module.css'

export function SnowEffect() {
  // Create an array of 50 elements to map over for our flakes
  const flakes = [...Array(50)]

  return (
    <div className={styles.snowContainer} aria-hidden="true">
      {flakes.map((_, i) => (
        <div
          key={i}
          className={styles.flake}
          // We use inline styles here to give each flake a unique, random animation
          style={{
            '--size': `${Math.random() * 0.1 + 0.05}rem`,
            '--left-start': `${Math.random() * 100}vw`,
            '--left-end': `${Math.random() * 100}vw`,
            '--animation-delay': `-${Math.random() * 20}s`, // Negative delay starts them mid-animation
            '--animation-duration': `${Math.random() * 10 + 10}s`, // Duration between 10-20 seconds
          }}
        />
      ))}
    </div>
  )
}
