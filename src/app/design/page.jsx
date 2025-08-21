'use client'

import Link from 'next/link'

export default function DesignIndexPage() {
  const designs = [
    { id: 1, title: 'Design 1', description: 'Original design variation' },
    { id: 2, title: 'Design 2', description: 'Alternative layout approach' },
    { id: 3, title: 'Design 3', description: 'Modern minimalist style' },
    { id: 4, title: 'Design 4', description: 'Creative experimental design' },
    { id: 5, title: 'Design 5', description: 'Professional corporate look' },
    { id: 6, title: 'Design 6', description: 'Enhanced modular portfolio (New!)' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Design Variations
          </h1>
          <p className="text-gray-400 text-lg">Explore different design approaches for the portfolio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Link key={design.id} href={`/design/${design.id}`} className="group block">
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 h-full transition-all duration-300 hover:bg-slate-800/70 hover:border-white/20 hover:scale-105">
                <div className="text-center">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
                  <h3 className="text-xl font-light text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {design.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{design.description}</p>
                  {design.id === 6 && (
                    <div className="mt-3">
                      <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-300">New</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
