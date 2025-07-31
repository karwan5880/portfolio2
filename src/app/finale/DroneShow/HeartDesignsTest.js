import React from 'react'

// Test component to display 10 different heart designs
export function HeartDesignsTest() {
  const heartDesigns = [
    {
      id: 1,
      name: 'Classic Small',
      description: 'Simple, clean, compact design',
      pattern: ['  ██  ██  ', '████████', '████████', ' ██████ ', '  ████  ', '   ██   ', '    █   '],
      color: '#ff1744',
      fontSize: '16px',
    },
    {
      id: 2,
      name: 'Rounded Cute',
      description: 'Soft curves, very cute appearance',
      pattern: [' ████  ████ ', '██████████', '██████████', '██████████', ' ████████ ', '  ██████  ', '   ████   ', '    ██    ', '     █    '],
      color: '#e91e63',
      fontSize: '18px',
    },
    {
      id: 3,
      name: 'Square Bold',
      description: 'Bold, square proportions, strong presence',
      pattern: ['  ████    ████  ', '████████████████', '████████████████', '████████████████', '████████████████', ' ██████████████ ', '  ████████████  ', '   ██████████   ', '    ████████    ', '     ██████     ', '      ████      ', '       ██       '],
      color: '#f44336',
      fontSize: '20px',
    },
    {
      id: 4,
      name: 'Detailed Fine',
      description: 'Fine details, elegant proportions',
      pattern: ['   ██    ██   ', ' ██████████████ ', '███████████████', '███████████████', '███████████████', ' █████████████ ', '  ███████████  ', '   █████████   ', '    ███████    ', '     █████     ', '      ███      ', '       █       '],
      color: '#ff5722',
      fontSize: '14px',
    },
    {
      id: 5,
      name: 'Chunky Pixel',
      description: 'Chunky pixels, retro game style',
      pattern: [' ████  ████ ', '████████████', '████████████', '████████████', ' ██████████ ', '  ████████  ', '   ██████   ', '    ████    ', '     ██     '],
      color: '#d32f2f',
      fontSize: '22px',
    },
    {
      id: 6,
      name: 'Tall Elegant',
      description: 'Taller proportions, elegant flow',
      pattern: ['  ████  ████  ', '██████████████', '██████████████', '██████████████', '██████████████', ' ████████████ ', '  ██████████  ', '   ████████   ', '    ██████    ', '     ████     ', '      ██      ', '       █      '],
      color: '#c2185b',
      fontSize: '16px',
    },
    {
      id: 7,
      name: 'Wide Spread',
      description: 'Wide spread, dramatic presence',
      pattern: ['   ████      ████   ', ' ████████████████ ', '███████████████████', '███████████████████', ' █████████████████ ', '  ███████████████  ', '   █████████████   ', '    ███████████    ', '     █████████     ', '      ███████      ', '       █████       ', '        ███        ', '         █         '],
      color: '#ad1457',
      fontSize: '18px',
    },
    {
      id: 8,
      name: 'Minimalist',
      description: 'Minimal, clean, modern',
      pattern: [' ██  ██ ', '████████', '████████', ' ██████ ', '  ████  ', '   ██   '],
      color: '#880e4f',
      fontSize: '20px',
    },
    {
      id: 9,
      name: 'Giant Impact',
      description: 'Maximum impact, giant size',
      pattern: ['    ████    ████    ', '  ████████████████  ', '████████████████████', '████████████████████', '████████████████████', ' ██████████████████ ', '  ████████████████  ', '   ██████████████   ', '    ████████████    ', '     ██████████     ', '      ████████      ', '       ██████       ', '        ████        ', '         ██         '],
      color: '#b71c1c',
      fontSize: '24px',
    },
    {
      id: 10,
      name: 'Artistic Flow',
      description: 'Artistic flow, balanced proportions',
      pattern: ['  ████   ████  ', '████████████████', '████████████████', '████████████████', '████████████████', ' ██████████████ ', '  ████████████  ', '   ██████████   ', '    ████████    ', '     ██████     ', '      ████      ', '       ██       ', '        █       '],
      color: '#ff6b9d',
      fontSize: '16px',
    },
  ]

  return (
    <div
      style={{
        background: '#000',
        color: 'white',
        padding: '20px',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#ff1744',
          marginBottom: '40px',
          fontSize: '32px',
        }}
      >
        ❤️ Heart Designs Test - Choose Your Favorite ❤️
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {heartDesigns.map((design) => (
          <div
            key={design.id}
            style={{
              border: '2px solid #333',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              background: '#111',
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: '#ff6b9d',
                fontSize: '18px',
              }}
            >
              Design {design.id}: {design.name}
            </h3>

            <div
              style={{
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: design.fontSize,
                lineHeight: design.fontSize,
                color: design.color,
                textShadow: `0 0 15px ${design.color}`,
                filter: `drop-shadow(0 0 10px ${design.color})`,
                margin: '20px 0',
                whiteSpace: 'pre-line',
              }}
            >
              {design.pattern.map((row, index) => (
                <div key={index} style={{ whiteSpace: 'pre' }}>
                  {row}
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: '14px',
                color: '#aaa',
                marginTop: '10px',
              }}
            >
              {design.description}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          color: '#666',
        }}
      >
        <p>Choose your favorite design and let me know the number!</p>
        <p>Each design has different proportions, sizes, and visual impact.</p>
      </div>
    </div>
  )
}

export default HeartDesignsTest
