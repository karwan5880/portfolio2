'use client'

import Link from 'next/link'

export default function TestPage() {
  const ideas = [
    {
      id: 1,
      title: 'Terminal Hacker',
      description: 'Interactive command line portfolio with typing animations and Matrix effects',
      status: 'Ready to build',
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 2,
      title: 'Particle Universe',
      description: 'Physics-based particle system with mouse interactions and morphing shapes',
      status: 'Ready to build',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 3,
      title: 'Neural Network Brain',
      description: 'AI-themed brain visualization with synaptic connections and interactive neurons',
      status: 'Ready to build',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 4,
      title: 'Infinite Scroll Multiverse',
      description: 'Parallel dimensions with portal transitions and quantum effects',
      status: 'Ready to build',
      color: 'from-orange-500 to-red-600',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Design Concepts
          </h1>
          <p className="text-xl text-gray-400">Framer Motion Portfolio Experiments</p>
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/test/idea-${idea.id}`}>
              <div className="group relative cursor-pointer">
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${idea.color} opacity-20 rounded-2xl blur-xl group-hover:blur-2xl group-hover:opacity-30 transition-all duration-700`} />

                {/* Main card */}
                <div className="relative bg-slate-800/50 border border-white/10 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-500 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Idea {idea.id}
                    </h2>
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300">{idea.status}</span>
                  </div>

                  <h3 className="text-xl font-medium text-white mb-4">{idea.title}</h3>

                  <p className="text-gray-300 leading-relaxed mb-6">{idea.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Click to prototype →</div>
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <span className="text-white text-sm">▶</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to home */}
        <div className="text-center mt-12">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
