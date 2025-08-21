import { Geist, Geist_Mono } from 'next/font/google'

import { ThemeProvider } from './contexts/ThemeContext'
import './globals.css'
import './styles/fullcalendar-theme.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Advanced Todo App',
  description: 'A comprehensive task management application with advanced features like filtering, sorting, pagination, and local storage persistence.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body> */}
    </html>
  )
}
