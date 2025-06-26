import styles from './Skills.module.css'

const skillsData = {
  Languages: ['Python', 'C/C++', 'Javascript', 'HTML/CSS', 'Typescript', 'Dart'],
  'Frameworks/Tools': [
    'FastAPI',
    'PyQt6',
    'PySide6',
    'Git',
    'OpenCV',
    'Numpy',
    'Boost',
    'YOLO',
    'Tensorflow',
    'Pytorch',
    'ROS',
    'React.js',
    'Next.js',
    'TailwindCSS',
    'Flutter',
    'Django',
    'Docker',
    'Godot',
  ],
  'Systems & Platforms': ['Windows', 'Ubuntu', 'Arch Linux', 'Raspberry Pi', 'VMware'],
  'Dev Tools': ['Git', 'Github', 'Vim', 'SQL', 'MongoDB', 'PostgreSQL'],
}

const SkillCategory = ({ title, skills }) => (
  <div className={styles.skillRow}>
    <h4 className={styles.categoryTitle}>{title}</h4>
    <div className={styles.skillsList}>{skills.join(' • ')}</div>
  </div>
)

export function Skills() {
  return (
    <div className={styles.skillsContainer}>
      {Object.entries(skillsData).map(([category, skills]) => (
        <SkillCategory key={category} title={category} skills={skills} />
      ))}
    </div>
  )
}
