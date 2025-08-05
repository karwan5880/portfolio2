'use client'

import { motion } from 'framer-motion'

const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }} viewport={{ once: true }}>
    {children}
  </motion.div>
)

export const DesignFooter = () => {
  const designs = [
    {
      id: 'design-0',
      title: 'design-0',
      icon: '🔰',
      status: 'done',
      href: '/design-0',
    },
    {
      id: 'design-1',
      title: 'design-1',
      icon: '📜',
      status: 'current',
      href: '/design-1',
    },
    {
      id: 'design-2',
      title: 'design-2',
      icon: '🎆',
      status: 'experimental',
      href: '/design-2',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-600/20 text-green-400 border-green-600/30'
      case 'current':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
      case 'experimental':
        return 'bg-orange-600/20 text-orange-400 border-orange-600/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    }
  }

  return (
    <footer className="bg-gradient-to-b from-black to-slate-900 py-12 px-4 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Other Design Variations
            </h3>
            <p className="text-gray-400 text-sm">Explore different portfolio styles</p>
          </div>
        </AnimatedSection>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {designs.map((design, index) => (
            <AnimatedSection key={design.id} delay={index * 0.1}>
              <a href={design.href} target="_blank" rel="noopener noreferrer">
                <motion.div className="group relative bg-slate-800/50 border border-white/10 rounded-xl p-4 cursor-pointer overflow-hidden min-w-[200px]" whileHover={{ scale: 1.02, y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <motion.div className="text-2xl" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                      {design.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm group-hover:text-gray-200 transition-colors">{design.title}</h4>

                      {/* Status tag */}
                      <span className={`inline-block px-2 py-1 rounded-full text-xs border mt-1 ${getStatusColor(design.status)}`}>{design.status}</span>
                    </div>

                    {/* External link indicator */}
                    <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={{ x: 5 }} whileHover={{ x: 0 }}>
                      <span className="text-white/60 text-xs">↗</span>
                    </motion.div>
                  </div>
                </motion.div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* Footer info */}
        <AnimatedSection delay={0.3}>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-gray-500 text-xs mb-3">Built with Next.js, Framer Motion • {new Date().getFullYear()}</p>
            <div className="flex justify-center gap-4">
              <motion.a href="https://github.com/karwan5880/portfolio2" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {/* GitHub */}
              </motion.a>
              <motion.a href="https://linkedin.com/in/karwanleong" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {/* LinkedIn */}
              </motion.a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  )
}
