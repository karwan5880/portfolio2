// data/dev-history-data.js
export const devHistoryData = [
  {
    id: 'internship',
    year: '2018',
    title: 'Software Engineer Intern',
    description: 'First professional experience. Built front-end and back-end solutions with Angular and .NET Core.',
    position: { x: '20%', y: '10%' },
    connectsTo: [],
  },
  {
    id: 'fyp',
    year: '2019',
    title: 'Final Year Project',
    description: 'Completed a significant academic project, solidifying core development principles.',
    position: { x: '80%', y: '20%' },
    connectsTo: ['internship'],
  },
  {
    id: 'python',
    year: '2020-2021',
    title: 'Python Deep Dive',
    description: 'Focused on Python, building various tools and projects during the global pause.',
    position: { x: '30%', y: '35%' },
    connectsTo: ['fyp'],
  },
  {
    id: 'lpd',
    year: '2022-2023',
    title: "Master's Thesis: License Plate Detection",
    description:
      'A deep focus into computer vision and deep learning, applying Python skills to a major research project.',
    position: { x: '70%', y: '50%' },
    connectsTo: ['python'],
  },
  {
    id: 'pyqt',
    year: '2024',
    title: 'PyQt6/PySide6 Applications',
    description:
      'Designed and built GUI for Windows desktop applications, translating concepts into user-facing programs.',
    position: { x: '25%', y: '65%' },
    connectsTo: ['lpd'],
  },
  {
    id: 'exploration',
    year: '2025',
    title: 'Multi-Disciplinary Exploration',
    description:
      'Expanded skill set into low-level systems (WinRT, Drivers), mobile (Flutter), games (Godot), and AI (RL).',
    position: { x: '85%', y: '80%' },
    connectsTo: ['pyqt'],
  },
  {
    id: 'current',
    year: 'Present',
    title: 'Project: Xiaohongshu Clone',
    description: 'Currently building a full-stack social media clone using React and Django.',
    position: { x: '40%', y: '95%' },
    connectsTo: ['exploration'],
  },
]
