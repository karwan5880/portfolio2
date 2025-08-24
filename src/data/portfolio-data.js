import { FaPython, FaReact } from 'react-icons/fa'
import { SiCplusplus } from 'react-icons/si'

export const personalInfo = {
  name: 'Leong Kar Wan',
  tagline: '"To see is to believe"',
  thankYou: 'Thank you for visiting',
  github: 'https://github.com/karwan5880/portfolio2',
  linkedin: 'https://linkedin.com/in/karwanleong',
  youtube: 'https://youtube.com/@Lleongg5880',
  twitch: 'https://twitch.tv/lleongg5880',
  resume: '/resume.pdf',
  profileImageUrl: '/images/profile.png',
  aboutMe: `
  I'm from Kuala Lumpur, Malaysia. 
  I'm a software engineer/software developer. 
  I'm not a full-stack developer.
  I'm not a front-end developer.
  I'm not a back-end developer.
  I'm not an AI engineer.
  I'm not an embedded system engineer.
  But I do everything kinda. 
  I'm a junior dev and everything is new to me. 
  I build windows app, algorithms, solutions, also started building web app/solutions recently. 
  My main language is Python, a little C/C++, and recently learning React, Django.   
  `,
}

export const education = [
  {
    id: 'masters',
    degree: 'Master of Engineering Science',
    institution: 'Universiti Tunku Abdul Rahman (UTAR)',
    color: 'text-blue-300',
  },
  {
    id: 'bachelors',
    degree: 'Bachelor of Computer Science (Honours)',
    institution: 'Universiti Tunku Abdul Rahman (UTAR)',
    color: 'text-purple-300',
  },
]

export const skills = {
  core: ['Python', 'C/C++', 'React'],
  main: [
    {
      name: 'Python',
      icon: FaPython,
      description: 'Backend, scripting, and data solutions.',
    },
    {
      name: 'C/C++',
      icon: SiCplusplus,
      description: 'Performance-critical applications and systems.',
    },
    {
      name: 'React',
      icon: FaReact,
      description: 'Dynamic and responsive user interfaces.',
    },
  ],
  other: [
    'JavaScript',
    'TypeScript',
    'HTML',
    'CSS',
    'Node.js',
    'Django',
    'Flask',
    'Three.js',
    'WebGL',
    'OpenCV',
    'YOLO',
    'Computer Vision',
    'PyQt6',
    'PySide6',
    'Angular',
    '.NET Core',
    'SQL',
    'MongoDB',
    'Git',
    'Docker',
    'Linux',
    'Raspberry Pi',
    'IoT',
    'Bluetooth',
    'Flutter',
    'Next.js',
    'Tailwind CSS',
    'Framer Motion',
    'Godot',
    'Game Development',
    'Reinforcement Learning',
    'Deep Learning',
  ],
}

export const timeline = [
  // {
  //   year: '2018',
  //   title: 'First Job, Internship',
  //   description: 'My first real job building websites with Angular and .NET',
  //   status: 'Beginning',
  // },
  // {
  //   year: '2019',
  //   title: 'Final Year Project',
  //   description: 'Big school project that taught me how to code properly',
  //   status: "Bachelor's Degree",
  // },
  // {
  //   year: '2020',
  //   title: 'Python and Computer Vision',
  //   description: 'Learning Python and C++ by building Computer Vision applications',
  //   status: 'Covid-19',
  // },
  // {
  //   year: '2022',
  //   title: "Master's Research",
  //   description: 'Using object detection models to detect license plates in images',
  //   status: "Master's Degree",
  // },
  // {
  //   year: '2024.01',
  //   title: 'Desktop Application Design',
  //   description: 'Making desktop apps for Windows',
  //   status: 'Freelance',
  // },
  // {
  //   year: '2024.08',
  //   title: 'Leetcode Practice',
  //   description: 'Practicing coding problems and learning new programming languages',
  //   status: 'Job Hunt',
  // },
  // {
  //   year: '2025.02',
  //   title: 'WinRT, KMDF, Flutter, Godot, Next.js',
  //   description: 'Building new projects and learning new languages/framework',
  //   status: 'Recent',
  // },
  // {
  //   year: '2025.06',
  //   title: 'Full Stack App Practice',
  //   description: 'Building a social media app with React and Django',
  //   status: 'Recent',
  // },
  // {
  //   year: '2025.08',
  //   title: 'Learning More React, Started YouTube/Twitch',
  //   description: 'Started making videos and explore streaming on platforms',
  //   status: 'Present',
  // },
  //
  {
    year: '2025.08',
    title: 'Learning More React / Django / YouTube',
    description: 'Recording my everyday life doing some new projects',
    status: 'Present',
  },
  {
    year: '2025.06',
    title: 'Xiao Hong Shu Clone',
    description: 'Building a social media app with React and Django',
    status: 'Recent',
  },
  {
    year: '2025.02',
    title: 'WinRT, KMDF, Flutter, Godot, Next.js',
    description: 'Explore low level driver development, C++ library, game engine, simple landing page',
    status: '-',
  },
  {
    year: '2024.08',
    title: 'Leetcode, Job Search',
    description: 'Practice solving leetcode questions, started job hunting',
    status: 'Python / C/C++ / Javascript / SQL',
  },
  {
    year: '2024.01',
    title: 'Desktop Windows UI Design',
    description: 'Making windows desktop apps',
    status: 'PySide6',
  },
  {
    year: '2022',
    title: "Master's Research",
    description: 'Using object detection models to detect license plates in images. Learn how to carry out my works systematically everyday',
    status: 'License Plate Detection Using Object Detection Models',
  },
  {
    year: '2020',
    title: 'Python and Computer Vision',
    description: 'Learning Python and C++ by building Computer Vision applications',
    status: '-',
  },
  {
    year: '2019',
    title: 'Final Year Project',
    description: 'Finished my FYP (quiz application using Angular & MySql)',
    status: '-',
  },
  {
    year: '2018',
    title: 'First Job, Internship',
    description: 'Assist in building websites with Angular and .NET ',
    status: '(Inventech, Puchong, Malaysia)',
  },
]

export const projects = [
  {
    title: 'Todo App (Simplified)',
    description: 'Lightweight, high-performance todo app with beautiful UI and smooth animations',
    technologies: ['React', 'Drag & Drop', 'Calendar', 'Local Storage'],
    status: 'Live Demo',
    category: 'Optimized App',
    color: 'from-emerald-600 to-teal-500',
    link: '/todo-simplified',
    imageUrl: '/images/todosimplified.png',
    category: 'recent',
  },
  {
    title: 'Todo App (Full)',
    description: 'Advanced todo app with calendar, drag & drop, themes, and complex features',
    technologies: ['React', 'FullCalendar', 'DnD Kit', 'Multiple Hooks', 'Complex State'],
    status: 'Live Demo',
    category: 'Full Stack App',
    color: 'from-emerald-600 to-teal-500',
    link: '/todo',
    imageUrl: '/images/todo.png',
    category: 'recent',
  },
  {
    title: 'Drone Show Simulator',
    description: 'Drones that dance in the sky with lights and music',
    technologies: ['React Three Fiber', 'Choreography', 'Light Systems', 'GLSL', 'Shaders'],
    status: 'Live Demo',
    category: 'React Three GLSL',
    color: 'from-emerald-600 to-teal-500',
    link: '/finale',
    imageUrl: '/images/drone.png',
    category: 'recent',
  },
  {
    title: 'Earth Model',
    description: '3D Earth model you can spin around and explore with real data',
    technologies: ['Three.js', 'WebGL', 'JavaScript', 'Real-time APIs'],
    status: 'Live Demo',
    category: 'React 3D',
    color: 'from-emerald-600 to-teal-500',
    link: '/location',
    imageUrl: '/images/earth.png',
    category: 'recent',
  },
  {
    title: 'KMDF Windows Filter Driver',
    description: 'Kernel-mode filter driver for Windows system security',
    technologies: ['C++', 'KMDF', 'Windows Kernel', 'Driver Development', 'System Programming'],
    status: 'Complete',
    category: 'System Programming',
    color: 'from-indigo-600 to-purple-500',
    link: null,
    imageUrl: '/images/kmdf.png',
    category: 'older',
  },
  {
    title: 'WinRT Screen Capturing Library',
    description: 'High-performance screen capture library for Windows using modern WinRT APIs',
    technologies: ['C++', 'WinRT', 'Windows API', 'Screen Capture', '.001'],
    status: 'Complete',
    category: 'Windows Development',
    color: 'from-indigo-600 to-purple-500',
    link: null,
    imageUrl: '/images/winrt.png',
    category: 'older',
  },
  {
    title: 'Qt Windows GUI Application',
    description: 'Modern desktop application with native Windows integration and sleek UI',
    technologies: ['Python', 'Qt6', 'PySide6', 'Windows API', 'Desktop Development'],
    status: 'Complete',
    category: 'Desktop Application',
    color: 'from-indigo-600 to-purple-500',
    link: null,
    imageUrl: '/images/pyside6.png',
    category: 'older',
  },
  {
    title: 'License Plate Detection',
    description: 'AI system that can find and read license plates in photos',
    technologies: ['OpenCV', 'YOLOv4', 'Darknet', 'EfficientDet', 'CenterNet', 'Faster R-CNN', 'SSD', 'Python', 'Deep Learning'],
    status: 'Complete',
    category: 'AI Research',
    color: 'from-indigo-600 to-purple-500',
    link: null,
    imageUrl: '/images/licenseplate.png',
    category: 'older',
  },
  {
    title: 'Raspberry Pi 4 Bluetooth Hub',
    description: 'Small computer that helps devices talk to each other wirelessly',
    technologies: ['Raspberry Pi 4', 'Bluetooth 5.0', 'Python', 'Bus'],
    status: 'Experimental',
    category: 'Embedded IoT',
    color: 'from-indigo-600 to-purple-500',
    link: null,
    imageUrl: '/images/rasppi4.jpg',
    category: 'older',
  },
]

export const careerPaths = [
  {
    id: 'fullstack',
    title: 'Software Engineer',
    description: 'Building windows apps, solutions, algorithms, web & designs',
    technologies: ['Python', 'C/C++', 'React', 'Django'],
    color: 'from-green-500 to-teal-400',
    icon: '',
    // icon: '💻',
    tag: 'Present',
    statusTag: 'current',
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Create robust, useful AI algorithms to solve real world problems',
    technologies: ['Machine Learning', 'Neural Networks', 'PyTorch', 'TensorFlow'],
    color: 'from-purple-500 to-pink-400',
    icon: '',
    // icon: '🧠',
    tag: 'Alternative Choice',
    statusTag: 'interest',
  },
  {
    id: 'embedded',
    title: 'Embedded Systems Engineer',
    description: 'Because I love C/C++',
    technologies: ['C/C++', 'RTOS', 'Microcontrollers', 'IoT'],
    color: 'from-orange-500 to-red-400',
    icon: '',
    // icon: '⚙️',
    tag: 'Alternative Choice',
    statusTag: 'interest',
  },
  {
    id: 'ai-robotics',
    title: 'PhD & AI Robotics',
    description: 'Because PhD is a dream and robotics is the future',
    technologies: ['Deep Learning', 'Computer Vision', 'Robotics', 'Research'],
    color: 'from-blue-500 to-cyan-400',
    icon: '',
    // icon: '🤖',
    tag: 'Future',
    statusTag: 'future',
  },
]
