'use client'

import { motion } from 'framer-motion'

const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }} viewport={{ once: true }}>
    {children}
  </motion.div>
)

export const DesignFooter = () => {
  const designs = [
    { title: 'All Designs', href: '/design' },
    { title: 'design-1', href: '/design/1' },
    { title: 'design-2', href: '/design/2' },
    { title: 'design-3', href: '/design/3' },
    { title: 'design-4', href: '/design/4' },
    { title: 'design-5', href: '/design/5' },
    { title: 'design-6', href: '/design/6' },
  ]

  return (
    <footer className="bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-xl text-white mb-8">Other Design Variations</h3>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {designs.map((design) => (
            <a
              key={design.title}
              href={design.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm underline"
            >
              {design.title}
            </a>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="https://github.com/karwan5880/portfolio2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/karwanleong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              LinkedIn
            </a>
          </div>
          <p className="text-gray-500 text-xs">Built with Next.js, Framer Motion • {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
