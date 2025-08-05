import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Leong Kar Wan',
  description: 'M.Eng.Sc. | B.Comp.Sc. (Hons.) | Software Engineer | Python | C++ | React | Computer Vision | AI | Embedded System | Robotics',
  keywords: 'Software Engineer, Python, C++, React, Computer Vision, AI, Embedded Systems, Robotics, Machine Learning, Full Stack Developer',
  author: 'Leong Kar Wan',
  robots: 'index, follow',
  openGraph: {
    title: 'Leong Kar Wan - Software Engineer',
    description: 'M.Eng.Sc. | B.Comp.Sc. (Hons.) | Software Engineer | Python | C++ | React | Computer Vision | AI | Embedded System | Robotics',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Leong Kar Wan - Software Engineer',
    description: 'M.Eng.Sc. | B.Comp.Sc. (Hons.) | Software Engineer | Python | C++ | React | Computer Vision | AI | Embedded System | Robotics',
  },
}

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Leong Kar Wan',
    jobTitle: 'Software Engineer',
    description: 'M.Eng.Sc. | B.Comp.Sc. (Hons.) | Software Engineer specializing in Python, C++, React, Computer Vision, AI, Embedded Systems, and Robotics',
    knowsAbout: ['Python Programming', 'C++ Programming', 'React Development', 'Computer Vision', 'Artificial Intelligence', 'Embedded Systems', 'Robotics', 'Machine Learning', 'Full Stack Development'],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Universiti Tunku Abdul Rahman (UTAR)',
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Master of Engineering Science',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Bachelor of Computer Science (Honours)',
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
