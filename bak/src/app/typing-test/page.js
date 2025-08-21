'use client'

import React, { useEffect, useState } from 'react'

export default function TypingTestPage() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '60px', color: '#00ff88', fontSize: '28px' }}>⚡ Interactive Code-to-UI Animation ⚡</h1>
        <TypingAnimation />
        <div style={{ marginTop: '60px', color: '#888', fontSize: '14px' }}>
          <p>Watch buttons appear as they're being "coded" in real-time!</p>
        </div>
      </div>
    </div>
  )
}

function TypingAnimation() {
  const [phase, setPhase] = useState('waiting')
  const [typedText, setTypedText] = useState('')
  const [showGithubButton, setShowGithubButton] = useState(false)
  const [showLinkedinButton, setShowLinkedinButton] = useState(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .idle-cursor {
        animation: blink 1.2s infinite;
        color: #00ff88;
      }
      .typing-cursor {
        animation: none;
        opacity: 1;
        color: #00ff88;
      }
      .fade-in-button {
        animation: fadeIn 0.8s ease-out forwards;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    let timeouts = []

    // Start with idle cursor
    timeouts.push(
      setTimeout(() => {
        setPhase('idle')
      }, 1500)
    )

    // Begin typing sequence
    timeouts.push(
      setTimeout(() => {
        setPhase('typing')
        startGithubTyping()
      }, 3000)
    )

    const startGithubTyping = () => {
      const githubCommands = ['const githubBtn = document.createElement("button")', 'githubBtn.innerHTML = "GitHub ↗"', 'githubBtn.style.cssText = `', '  color: #00ff88; padding: 8px 16px;', '  background: rgba(0,255,136,0.1);', '  border: 1px solid rgba(0,255,136,0.3);', '  border-radius: 6px; transition: all 0.3s;`', 'document.body.appendChild(githubBtn)']

      let commandIndex = 0
      let charIndex = 0
      let commands = []

      const typeChar = () => {
        if (commandIndex < githubCommands.length) {
          const currentCommand = githubCommands[commandIndex]

          if (charIndex < currentCommand.length) {
            const partial = currentCommand.substring(0, charIndex + 1)
            const updated = [...commands]
            updated[commandIndex] = partial

            setTypedText(updated.join('\\n'))
            charIndex++

            const delay = 8 + Math.random() * 8
            timeouts.push(setTimeout(typeChar, delay))
          } else {
            commands.push(currentCommand)
            commandIndex++
            charIndex = 0

            if (commandIndex === githubCommands.length) {
              // Show GitHub button and type clear
              setTimeout(() => {
                setShowGithubButton(true)
                setTimeout(() => typeClear(commands, startLinkedinTyping), 600)
              }, 200)
            } else {
              const pause = 30 + Math.random() * 20
              timeouts.push(setTimeout(typeChar, pause))
            }
          }
        }
      }

      typeChar()
    }

    const startLinkedinTyping = () => {
      const linkedinCommands = ['const linkedinBtn = document.createElement("button")', 'linkedinBtn.innerHTML = "LinkedIn ↗"', 'linkedinBtn.style.cssText = `', '  color: #0088ff; padding: 8px 16px;', '  background: rgba(0,136,255,0.1);', '  border: 1px solid rgba(0,136,255,0.3);', '  border-radius: 6px; margin-left: 16px;', '  transition: all 0.3s ease;`', 'document.body.appendChild(linkedinBtn)']

      let commandIndex = 0
      let charIndex = 0
      let commands = []

      const typeChar = () => {
        if (commandIndex < linkedinCommands.length) {
          const currentCommand = linkedinCommands[commandIndex]

          if (charIndex < currentCommand.length) {
            const partial = currentCommand.substring(0, charIndex + 1)
            const updated = [...commands]
            updated[commandIndex] = partial

            setTypedText(updated.join('\\n'))
            charIndex++

            const delay = 8 + Math.random() * 8
            timeouts.push(setTimeout(typeChar, delay))
          } else {
            commands.push(currentCommand)
            commandIndex++
            charIndex = 0

            if (commandIndex === linkedinCommands.length) {
              // Show LinkedIn button and final clear
              setTimeout(() => {
                setShowLinkedinButton(true)
                setTimeout(() => typeClear(commands, () => setPhase('done')), 600)
              }, 200)
            } else {
              const pause = 30 + Math.random() * 20
              timeouts.push(setTimeout(typeChar, pause))
            }
          }
        }
      }

      typeChar()
    }

    const typeClear = (currentCommands, callback) => {
      const clearCommand = 'clear'
      let clearIndex = 0
      const codeText = currentCommands.join('\\n')

      const typeClearChar = () => {
        if (clearIndex < clearCommand.length) {
          const partial = clearCommand.substring(0, clearIndex + 1)
          setTypedText(codeText + '\\n' + partial)
          clearIndex++

          const delay = 100 + Math.random() * 50
          timeouts.push(setTimeout(typeClearChar, delay))
        } else {
          // Clear screen after typing clear
          setTimeout(() => {
            setTypedText('')
            setTimeout(callback, 400)
          }, 200)
        }
      }

      typeClearChar()
    }

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const renderContent = () => {
    switch (phase) {
      case 'waiting':
        return (
          <div>
            <span className="idle-cursor">|</span>
          </div>
        )

      case 'idle':
        return (
          <div>
            <span className="idle-cursor">|</span>
          </div>
        )

      case 'typing':
        const lines = typedText.split('\\n')
        return (
          <div>
            {lines.map((line, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                <span
                  style={{
                    color: line === 'clear' ? '#ffa657' : '#c9d1d9',
                    fontWeight: line === 'clear' ? 'bold' : 'normal',
                  }}
                >
                  {line}
                </span>
                {index === lines.length - 1 && (
                  <span className="typing-cursor" style={{ marginLeft: '2px' }}>
                    |
                  </span>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              {showGithubButton && (
                <a
                  href="https://github.com/karwan5880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fade-in-button"
                  style={{
                    color: '#00ff88',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: 'rgba(0, 255, 136, 0.1)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                  }}
                >
                  GitHub ↗
                </a>
              )}

              {showLinkedinButton && (
                <a
                  href="https://www.linkedin.com/in/karwanleong/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fade-in-button"
                  style={{
                    color: '#0088ff',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: 'rgba(0, 136, 255, 0.1)',
                    border: '1px solid rgba(0, 136, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                  }}
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        )

      case 'done':
        return (
          <div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <a
                href="https://github.com/karwan5880"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00ff88',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                }}
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/in/karwanleong/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0088ff',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'rgba(0, 136, 255, 0.1)',
                  border: '1px solid rgba(0, 136, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                }}
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        fontFamily: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#c9d1d9',
        textAlign: 'left',
      }}
    >
      {renderContent()}
    </div>
  )
}
