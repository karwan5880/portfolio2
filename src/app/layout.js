import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'

import { AudioControl } from '@/components/AudioControl'

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
  description: 'Leong Kar Wan Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {/* <AudioControl /> */}
      </body>
      {/* just for testing, script is running twice if set automatically inject on cloudflare.  */}
      {/* <Script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "487973c8e7764f4a8cbe0ec369cb5f54"}'
      /> */}
    </html>
  )
}
