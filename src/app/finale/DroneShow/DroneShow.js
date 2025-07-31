'use client'

import { useAudioStore } from '../../../stores/audioStore.js'
import React, { useEffect, useState } from 'react'

import { DroneScene } from './Scene.js'

export function DroneShow() {
  // Add blinking cursor animation
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showText, setShowText] = useState(true)
  const [textOpacity, setTextOpacity] = useState(0)
  const [showFinaleText, setShowFinaleText] = useState(false)
  const [finaleTextOpacity, setFinaleTextOpacity] = useState(0)

  const [showHomeButton, setShowHomeButton] = useState(false)
  const [typingPhase, setTypingPhase] = useState('blackscreen') // 'blackscreen', 'waiting', 'idle', 'interactive', 'backspace', 'idle2', 'launching', 'hacking', 'typing', 'done'
  const [typedText, setTypedText] = useState('')
  const [interactiveText, setInteractiveText] = useState('')
  const [hackingText, setHackingText] = useState('')
  const [showTerminal, setShowTerminal] = useState(false)
  const [showGithubButton, setShowGithubButton] = useState(false)
  const [showLinkedinButton, setShowLinkedinButton] = useState(false)
  const [githubCentered, setGithubCentered] = useState(false)
  const [linkedinPositioned, setLinkedinPositioned] = useState(false)

  // Audio system integration
  const { startExperience, isInitialized, grantPermission } = useAudioStore()

  // GLOBAL SPEED CONTROL - Easy to adjust entire show timing
  const SHOW_SPEED_MULTIPLIER = 1.0 // 1.0 = normal speed, 2.0 = 2x faster, 0.5 = half speed

  const introTexts = ['Thank You']

  // Initialize audio system when component mounts - timed with drone flight
  useEffect(() => {
    // Grant permission immediately
    grantPermission()

    // Start music when drones begin flying (15 seconds adjusted for speed)
    const musicStartTime = (15 * 1000) / SHOW_SPEED_MULTIPLIER
    const audioTimer = setTimeout(() => {
      if (!isInitialized) {
        startExperience()
      }
    }, musicStartTime)

    return () => clearTimeout(audioTimer)
  }, [grantPermission, startExperience, isInitialized, SHOW_SPEED_MULTIPLIER])

  useEffect(() => {
    if (!showText) return

    // Handle text sequence - each text shows for longer duration with proper fade timing
    if (currentTextIndex >= 0 && currentTextIndex < introTexts.length) {
      // Add extra delay for the first text only
      const initialDelay = currentTextIndex === 0 ? 3000 : 1500

      const fadeInTimer = setTimeout(() => {
        setTextOpacity(1)
      }, initialDelay) // Start first text after 3 seconds, others after 1.5 seconds

      const fadeOutTimer = setTimeout(() => {
        setTextOpacity(0)
      }, initialDelay + 5000) // Show text for 5 seconds after fade-in (increased from 2.5s)

      const nextTimer = setTimeout(() => {
        if (currentTextIndex < introTexts.length - 1) {
          setCurrentTextIndex((prev) => prev + 1)
        } else {
          // All texts shown, hide overlay
          setShowText(false)
        }
      }, initialDelay + 7000) // Wait 2s after fade out before next text (increased total duration)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(nextTimer)
      }
    }
  }, [currentTextIndex, showText, introTexts.length])

  // Handle finale text with new fast typing system
  useEffect(() => {
    let allTimeouts = []

    // Show black screen after 160 seconds
    const blackScreenTimer = setTimeout(
      () => {
        setShowFinaleText(true)
        setTypingPhase('blackscreen')
        setFinaleTextOpacity(1)

        // Phase 1: Black screen for 10 seconds
        const waitingTimer = setTimeout(() => {
          setTypingPhase('waiting')
        }, 10000)
        allTimeouts.push(waitingTimer)

        // Phase 2: Show idle blinking cursor for 5s
        const idleTimer = setTimeout(() => {
          setTypingPhase('idle')
        }, 15000)
        allTimeouts.push(idleTimer)

        // Phase 3: Start terminal launch directly after idle cursor
        const terminalLaunchTimer = setTimeout(() => {
          startTerminalLaunch()
        }, 20000)
        allTimeouts.push(terminalLaunchTimer)

        const startTerminalLaunch = () => {
          setTypingPhase('launching')

          // Choose a random terminal launch command
          const launchCommands = ['sudo terminal.run --stealth', 'sudo start terminal --admin', 'sudo command prompt activate --elevated', 'sudo ./Downloads/browser_terminal.exe', 'sudo exec /usr/bin/terminal --root', 'sudo gnome-terminal --launch --privileged']

          const selectedCommand = launchCommands[Math.floor(Math.random() * launchCommands.length)]
          let charIndex = 0

          const typeLaunchCommand = () => {
            if (charIndex < selectedCommand.length) {
              setInteractiveText(selectedCommand.substring(0, charIndex + 1))
              charIndex++

              const delay = 60 + Math.random() * 30
              const timer = setTimeout(typeLaunchCommand, delay)
              allTimeouts.push(timer)
            } else {
              // Pause, then "launch" terminal and start hacking sequence
              const launchPauseTimer = setTimeout(() => {
                setInteractiveText('')
                setShowTerminal(true)
                setTypingPhase('hacking')
                startHackingSequence()
              }, 1500)
              allTimeouts.push(launchPauseTimer)
            }
          }

          typeLaunchCommand()
        }

        const startHackingSequence = () => {
          // Define commands and their responses separately
          const hackingSequence = [
            { type: 'system', text: 'Last login: Tue May 1995 23 02:58:08 on ttys000' },
            { type: 'prompt', text: '恬@Hk-MacBook-Pro ~ % ' },
            { type: 'command', text: 'ssh portfolio@karwan-portfolio.dev' },
            { type: 'response', text: 'Enter private key: ' },
            { type: 'password', text: '••••••••••••••••••••' },
            { type: 'response', text: 'Access denied.' },
            { type: 'prompt', text: '恬@Hk-MacBook-Pro ~ % ' },
            { type: 'command', text: 'ssh portfolio@karwan-portfolio.dev -i ~/.ssh/id_rsa' },
            { type: 'response', text: 'Enter passphrase: ' },
            { type: 'password', text: '••••••••••' },
            { type: 'response', text: 'Access denied.' },
            { type: 'prompt', text: '恬@Hk-MacBook-Pro ~ % ' },
            { type: 'command', text: 'ssh portfolio@karwan-portfolio.dev --force-auth' },
            { type: 'response', text: 'Enter password: ' },
            { type: 'password', text: '••••••••••••••' },
            { type: 'response', text: 'Access granted. Welcome to Portfolio Terminal.' },
            { type: 'response', text: '' },
            { type: 'prompt', text: 'portfolio@server:~$ ' },
            { type: 'command', text: 'whoami' },
            { type: 'response', text: 'root' },
            { type: 'prompt', text: 'portfolio@server:~$ ' },
            { type: 'command', text: 'pwd' },
            { type: 'response', text: '/home/portfolio' },
            { type: 'prompt', text: 'portfolio@server:~$ ' },
            { type: 'command', text: 'cd /var/www/portfolio' },
            { type: 'prompt', text: 'portfolio@server:/var/www/portfolio$ ' },
            { type: 'command', text: 'ls -la' },
            { type: 'response', text: 'drwxr-xr-x  8 root root  4096 Dec 31 23:59 .' },
            { type: 'response', text: 'drwxr-xr-x  3 root root  4096 Dec 31 23:58 ..' },
            { type: 'response', text: '-rw-r--r--  1 root root   220 Dec 31 23:59 .bashrc' },
            { type: 'response', text: 'drwxr-xr-x  2 root root  4096 Dec 31 23:59 components' },
            { type: 'response', text: '-rw-r--r--  1 root root   1024 Dec 31 23:59 create_buttons.js' },
            { type: 'prompt', text: 'portfolio@server:/var/www/portfolio$ ' },
            { type: 'command', text: 'echo "Initializing portfolio showcase..."' },
            { type: 'response', text: 'Initializing portfolio showcase...' },
            { type: 'prompt', text: 'portfolio@server:/var/www/portfolio$ ' },
            { type: 'command', text: 'node create_buttons.js' },
            { type: 'response', text: 'Creating GitHub button...' },
            { type: 'response', text: 'Creating LinkedIn button...' },
            { type: 'response', text: 'Portfolio buttons initialized successfully!' },
          ]

          let sequenceIndex = 0
          let charIndex = 0
          let allHackingText = []

          const processNextItem = () => {
            if (sequenceIndex < hackingSequence.length) {
              const currentItem = hackingSequence[sequenceIndex]

              if (currentItem.type === 'command') {
                // Type commands character by character
                if (charIndex < currentItem.text.length) {
                  const partial = currentItem.text.substring(0, charIndex + 1)
                  const updated = [...allHackingText]
                  updated[sequenceIndex] = (sequenceIndex > 0 && hackingSequence[sequenceIndex - 1].type === 'prompt' ? hackingSequence[sequenceIndex - 1].text : '') + partial

                  setHackingText(updated.join('\\n'))
                  charIndex++

                  const delay = 60 + Math.random() * 40
                  const timer = setTimeout(processNextItem, delay)
                  allTimeouts.push(timer)
                } else {
                  // Command finished typing, move to next item
                  allHackingText.push((sequenceIndex > 0 && hackingSequence[sequenceIndex - 1].type === 'prompt' ? hackingSequence[sequenceIndex - 1].text : '') + currentItem.text)
                  sequenceIndex++
                  charIndex = 0

                  const timer = setTimeout(processNextItem, 200)
                  allTimeouts.push(timer)
                }
              } else if (currentItem.type === 'password') {
                // Type passwords character by character (user input)
                if (charIndex < currentItem.text.length) {
                  const partial = currentItem.text.substring(0, charIndex + 1)
                  const updated = [...allHackingText]
                  // Combine with previous response line (like "Enter password: ")
                  const prevLine = sequenceIndex > 0 ? allHackingText[allHackingText.length - 1] : ''
                  updated[updated.length - 1] = prevLine + partial

                  setHackingText(updated.join('\\n'))
                  charIndex++

                  const delay = 150 + Math.random() * 100 // Slower typing for passwords
                  const timer = setTimeout(processNextItem, delay)
                  allTimeouts.push(timer)
                } else {
                  // Password finished typing, move to next item
                  sequenceIndex++
                  charIndex = 0

                  const timer = setTimeout(processNextItem, 500)
                  allTimeouts.push(timer)
                }
              } else {
                // For system messages, prompts, and responses - show instantly
                allHackingText.push(currentItem.text)
                setHackingText(allHackingText.join('\\n'))
                sequenceIndex++

                // Add appropriate delays
                let delay = 100
                if (currentItem.text.includes('Access denied')) delay = 800 // Reduced from 2000
                if (currentItem.text.includes('Access granted')) delay = 1200 // Reduced from 3000
                if (currentItem.text === '') delay = 300
                if (currentItem.type === 'system') delay = 500
                if (currentItem.type === 'prompt') delay = 50

                if (sequenceIndex === hackingSequence.length) {
                  // Hacking complete, start main typing sequence
                  const finalTimer = setTimeout(() => {
                    setTypingPhase('typing')
                    startFastTypingSequence()
                  }, 2000)
                  allTimeouts.push(finalTimer)
                } else {
                  const timer = setTimeout(processNextItem, delay)
                  allTimeouts.push(timer)
                }
              }
            }
          }

          processNextItem()
        }

        const startFastTypingSequence = () => {
          // GitHub button typing
          const startGithubTyping = () => {
            const githubCommands = ['const github = "https://github.com/karwan5880/portfolio2"', 'document.body.appendChild(createButton(github))', 'github.style.margin = "0 auto"', 'github.style.textAlign = "center"']

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

                  const delay = 20 + Math.random() * 10
                  const timer = setTimeout(typeChar, delay)
                  allTimeouts.push(timer)
                } else {
                  commands.push(currentCommand)
                  commandIndex++
                  charIndex = 0

                  if (commandIndex === 2) {
                    // Show GitHub button after first 2 lines
                    const showButtonTimer = setTimeout(() => {
                      setShowGithubButton(true)
                      // Pause for 1 second to let user observe the button
                      const observePause = setTimeout(() => {
                        const pause = 30 + Math.random() * 20
                        const pauseTimer = setTimeout(typeChar, pause)
                        allTimeouts.push(pauseTimer)
                      }, 1000)
                      allTimeouts.push(observePause)
                    }, 200)
                    allTimeouts.push(showButtonTimer)
                  } else if (commandIndex === githubCommands.length) {
                    // Reposition button and clear after all lines
                    const repositionTimer = setTimeout(() => {
                      setGithubCentered(true)
                      const clearTimer = setTimeout(() => typeClear(commands, startLinkedinTyping), 600)
                      allTimeouts.push(clearTimer)
                    }, 200)
                    allTimeouts.push(repositionTimer)
                  } else {
                    const pause = 30 + Math.random() * 20
                    const pauseTimer = setTimeout(typeChar, pause)
                    allTimeouts.push(pauseTimer)
                  }
                }
              }
            }

            typeChar()
          }

          const startLinkedinTyping = () => {
            const linkedinCommands = ['const linkedin = "https://linkedin.com/in/karwanleong"', 'document.body.appendChild(createButton(linkedin))', 'linkedin.style.marginLeft = "16px"', 'linkedin.style.display = "inline-block"']

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

                  const delay = 20 + Math.random() * 10
                  const timer = setTimeout(typeChar, delay)
                  allTimeouts.push(timer)
                } else {
                  commands.push(currentCommand)
                  commandIndex++
                  charIndex = 0

                  if (commandIndex === 2) {
                    // Show LinkedIn button after first 2 lines
                    const showButtonTimer = setTimeout(() => {
                      setShowLinkedinButton(true)
                      // Pause for 1 second to let user observe the button
                      const observePause = setTimeout(() => {
                        const pause = 30 + Math.random() * 20
                        const pauseTimer = setTimeout(typeChar, pause)
                        allTimeouts.push(pauseTimer)
                      }, 1000)
                      allTimeouts.push(observePause)
                    }, 200)
                    allTimeouts.push(showButtonTimer)
                  } else if (commandIndex === linkedinCommands.length) {
                    // Reposition button and final clear after all lines
                    const repositionTimer = setTimeout(() => {
                      setLinkedinPositioned(true)
                      const clearTimer = setTimeout(
                        () =>
                          typeClear(commands, () => {
                            setTypingPhase('done')
                            // Show home button after everything is done
                            const homeTimer = setTimeout(() => setShowHomeButton(true), 1000)
                            allTimeouts.push(homeTimer)
                          }),
                        600
                      )
                      allTimeouts.push(clearTimer)
                    }, 200)
                    allTimeouts.push(repositionTimer)
                  } else {
                    const pause = 30 + Math.random() * 20
                    const pauseTimer = setTimeout(typeChar, pause)
                    allTimeouts.push(pauseTimer)
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
                const timer = setTimeout(typeClearChar, delay)
                allTimeouts.push(timer)
              } else {
                // Clear screen after typing clear
                const clearScreenTimer = setTimeout(() => {
                  setTypedText('')
                  const callbackTimer = setTimeout(callback, 400)
                  allTimeouts.push(callbackTimer)
                }, 200)
                allTimeouts.push(clearScreenTimer)
              }
            }

            typeClearChar()
          }

          startGithubTyping()
        }
      },
      (160 * 1000) / SHOW_SPEED_MULTIPLIER
    )

    return () => {
      clearTimeout(blackScreenTimer)
      allTimeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [SHOW_SPEED_MULTIPLIER])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Drone show canvas - always visible */}
      <DroneScene speedMultiplier={SHOW_SPEED_MULTIPLIER} />

      {/* Music control overlay - subtle and unobtrusive */}
      <MusicControl />

      {/* Home button - bottom left - only show after animations complete */}
      {showHomeButton && <HomeButton />}

      {/* Cinematic text overlay - centered */}
      {showText && currentTextIndex >= 0 && currentTextIndex < introTexts.length && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              textAlign: 'center',
              padding: '0 60px',
              opacity: textOpacity,
              transition: 'opacity 1.5s ease-in-out',
            }}
          >
            <p
              style={{
                fontSize: '36px',
                lineHeight: '1.4',
                margin: 0,
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: '300',
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)',
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            >
              {introTexts[currentTextIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Finale typing animation */}
      {showFinaleText && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: typingPhase === 'done' || showGithubButton || showLinkedinButton ? 'auto' : 'none',
            zIndex: 20,
          }}
        >
          <div
            style={{
              opacity: finaleTextOpacity,
              transition: 'opacity 2s ease-in-out',
              fontFamily: 'Monaco, "SF Mono", Consolas, "Roboto Mono", monospace',
              fontSize: '12px',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.3px',
              minHeight: '80px',
              width: '100%',
              maxWidth: '600px',
            }}
          >
            <TypingContent phase={typingPhase} typedText={typedText} showGithubButton={showGithubButton} showLinkedinButton={showLinkedinButton} githubCentered={githubCentered} linkedinPositioned={linkedinPositioned} interactiveText={interactiveText} hackingText={hackingText} showTerminal={showTerminal} />
          </div>
        </div>
      )}
    </div>
  )
}

// Simple music control component
function MusicControl() {
  const { isPlaying, togglePlayback, isInitialized } = useAudioStore()

  if (!isInitialized) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 30,
        opacity: 0.7,
        transition: 'opacity 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.opacity = '1')}
      onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
    >
      <button
        onClick={togglePlayback}
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)'
          e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.6)'
          e.target.style.transform = 'scale(1)'
        }}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
    </div>
  )
}

// New fast typing content component with clear commands
function TypingContent({ phase, typedText, showGithubButton, showLinkedinButton, githubCentered, linkedinPositioned, interactiveText, hackingText, showTerminal }) {
  const terminalContentRef = React.useRef(null)

  // Auto-scroll terminal to bottom when new content is added
  React.useEffect(() => {
    if (terminalContentRef.current && hackingText) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight
    }
  }, [hackingText])

  React.useEffect(() => {
    // CSS for realistic cursor and fade-in animation
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
        color: #ffffff;
      }
      .typing-cursor {
        animation: none;
        opacity: 1;
        color: #ffffff;
      }
      .fade-in-button {
        animation: fadeIn 0.8s ease-out forwards;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // Handle blackscreen phase
  if (phase === 'blackscreen') {
    return <div style={{ width: '100%', height: '200px', background: 'transparent' }} />
  }

  // Create a stable layout that prevents button snapping
  return (
    <div
      style={{
        width: '100%',
        maxWidth: phase === 'hacking' && showTerminal ? '1000px' : '600px',
        margin: '0 auto',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Typing area - fixed height to prevent layout shifts */}
      <div
        style={{
          minHeight: '120px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: phase === 'waiting' || phase === 'idle' || phase === 'idle2' || phase === 'launching' ? 'center' : 'flex-start',
          alignItems: phase === 'waiting' || phase === 'idle' || phase === 'idle2' || phase === 'launching' ? 'center' : 'flex-start',
        }}
      >
        {/* Cursor and interactive phases */}
        {(phase === 'waiting' || phase === 'idle' || phase === 'idle2') && (
          <span
            className={phase === 'waiting' ? '' : 'idle-cursor'}
            style={{
              opacity: phase === 'waiting' ? 0 : 1,
            }}
          >
            |
          </span>
        )}

        {/* Terminal launch phase */}
        {phase === 'launching' && (
          <div
            style={{
              fontFamily: 'Monaco, "SF Mono", Consolas, "Roboto Mono", monospace',
              fontSize: '16px',
              color: phase === 'launching' ? '#00ff88' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span>{interactiveText}</span>
            <span className="typing-cursor" style={{ marginLeft: '2px' }}>
              |
            </span>
          </div>
        )}

        {phase === 'typing' && (
          <div
            style={{
              textAlign: 'left',
              fontFamily: 'Monaco, "SF Mono", Consolas, "Roboto Mono", monospace',
              width: '100%',
              maxWidth: '500px',
            }}
          >
            {typedText.split('\\n').map((line, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                <span
                  style={{
                    color: line === 'clear' ? '#ffa657' : '#aaaaaa',
                    opacity: line === 'clear' ? 1 : 0.7,
                    fontWeight: line === 'clear' ? 'bold' : 'normal',
                  }}
                >
                  {line}
                </span>
                {index === typedText.split('\\n').length - 1 && (
                  <span className="typing-cursor" style={{ marginLeft: '2px' }}>
                    |
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Terminal window for hacking sequence */}
        {phase === 'hacking' && showTerminal && (
          <div
            style={{
              width: '95%',
              maxWidth: '900px',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
              margin: '20px auto',
              fontFamily: 'Monaco, "SF Mono", Consolas, "Roboto Mono", monospace',
            }}
          >
            {/* Terminal header */}
            <div
              style={{
                background: '#21262d',
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                borderBottom: '1px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27ca3f' }} />
              <span
                style={{
                  marginLeft: '16px',
                  fontSize: '12px',
                  color: '#8b949e',
                  fontFamily: 'Monaco, "SF Mono", Consolas, "Roboto Mono", monospace',
                }}
              >
                Terminal — 恬@Hk-MacBook-Pro
              </span>
            </div>

            {/* Terminal content */}
            <div
              ref={terminalContentRef}
              style={{
                padding: '16px',
                fontSize: '12px',
                lineHeight: '1.4',
                color: '#c9d1d9',
                maxHeight: '400px',
                overflowY: 'auto',
                minHeight: '200px',
              }}
            >
              {hackingText && (
                <div>
                  {hackingText.split('\\n').map((line, index) => (
                    <div key={index} style={{ marginBottom: '2px' }}>
                      <span
                        style={{
                          color: line.includes('Access denied') ? '#ff6b6b' : line.includes('Access granted') ? '#51cf66' : line.includes('••••') ? '#ffd43b' : line.includes('Last login') ? '#8b949e' : line.includes('恬@Hk-MacBook-Pro') ? '#74c0fc' : line.includes('portfolio@server') ? '#74c0fc' : line.includes('root') && !line.includes('drwx') ? '#ff8cc8' : line.includes('ssh') || line.includes('whoami') || line.includes('pwd') || line.includes('ls -la') || line.includes('echo') || line.includes('node') || line.includes('cd ') ? '#a78bfa' : line.includes('Enter') ? '#fbbf24' : line.includes('drwx') || line.includes('-rw-') ? '#34d399' : line.includes('/var/www/portfolio') || line.includes('/home/portfolio') || line.includes('Initializing') || line.includes('Creating') || line.includes('initialized successfully') ? '#60a5fa' : '#c9d1d9',
                        }}
                      >
                        {line}
                      </span>
                      {index === hackingText.split('\\n').length - 1 && line !== '' && (
                        <span className="typing-cursor" style={{ marginLeft: '2px', color: '#51cf66' }}>
                          |
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Buttons area - fixed position to prevent snapping */}
      <div
        style={{
          display: 'flex',
          gap: '80px',
          marginTop: '20px',
          justifyContent: githubCentered ? 'center' : 'flex-start',
          alignItems: 'center',
          minHeight: '40px',
          width: '100%',
          transition: 'all 0.5s ease',
        }}
      >
        {showGithubButton && (
          <a
            href="https://github.com/karwan5880/portfolio2"
            target="_blank"
            rel="noopener noreferrer"
            className="fade-in-button"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '18px',
              transition: 'all 0.5s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none'
            }}
          >
            [GitHub]
          </a>
        )}

        {showLinkedinButton && (
          <a
            href="https://www.linkedin.com/in/karwanleong/"
            target="_blank"
            rel="noopener noreferrer"
            className="fade-in-button"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '18px',
              transition: 'all 0.5s ease',
              marginLeft: linkedinPositioned ? '16px' : '0',
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none'
            }}
          >
            [LinkedIn]
          </a>
        )}
      </div>
    </div>
  )
}

// Home button component
function HomeButton() {
  const handleHomeClick = () => {
    window.location.href = '/'
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        zIndex: 30,
        opacity: 0.7,
        transition: 'opacity 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.opacity = '1')}
      onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
    >
      <button
        onClick={handleHomeClick}
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)'
          e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.6)'
          e.target.style.transform = 'scale(1)'
        }}
        title="Go to Home"
      >
        🏠
      </button>
    </div>
  )
}
