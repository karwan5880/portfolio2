import styles from './ThunderEffect.module.css'

export function ThunderEffect() {
  return (
    <div className={styles.thunderContainer} aria-hidden="true">
      <div className={styles.flash}></div>
    </div>
  )
}
