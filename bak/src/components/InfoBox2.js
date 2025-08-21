import styles from './InfoBox.module.css'

const InfoBox = ({ selectedSection, onClose }) => {
  if (!selectedSection) return null

  const content = {
    about: {
      title: 'About Me',
      body: "I'm a creative developer with a passion for building immersive and beautiful web experiences. I specialize in React, Next.js, and bringing ideas to life with Three.js. This planet is a small showcase of what's possible!",
    },
    projects: {
      title: 'My Projects',
      body: (
        <ul className={styles.projectList}>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Project One - E-commerce Site
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Project Two - Data Visualization App
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Project Three - Interactive Blog
            </a>
          </li>
        </ul>
      ),
    },
    contact: {
      title: 'Get In Touch',
      body: "I'm currently available for freelance work and open to new opportunities. Feel free to reach out via email at yourname@example.com or connect with me on LinkedIn.",
    },
  }

  const selectedContent = content[selectedSection.toLowerCase()]

  return (
    <div className={`${styles.infoBox} ${selectedSection ? styles.visible : ''}`}>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
      <h2>{selectedContent.title}</h2>
      <div>{selectedContent.body}</div>
    </div>
  )
}

export default InfoBox
