'use client'

import { useAudioStore } from '../../../stores/audioStore.js'
import React, { useEffect, useState } from 'react'

import { DroneScene } from './Scene.js'

export function DroneShow() {
  // Add animations and disable scrolling
  React.useEffect(() => {
    // Disable scrolling on body
    document.body.style.overflow = 'hidden'

    const style = document.createElement('style')
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      @keyframes pulse {
        0% { opacity: 0.4; }
        100% { opacity: 0.7; }
      }
      @keyframes buttonExplode {
        0% { 
          transform: scale(1); 
          opacity: 1; 
        }
        50% { 
          transform: scale(1.3); 
          opacity: 0.8;
          filter: brightness(2) blur(2px);
        }
        100% { 
          transform: scale(0); 
          opacity: 0;
          filter: brightness(5) blur(10px);
        }
      }
      @keyframes shockwave {
        0% { 
          transform: scale(0); 
          opacity: 1; 
        }
        100% { 
          transform: scale(20); 
          opacity: 0; 
        }
      }
      @keyframes particle {
        0% { 
          transform: translate(0, 0) scale(1); 
          opacity: 1; 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0); 
          opacity: 0; 
        }
      }
      @keyframes screenFlash {
        0% { opacity: 0; }
        5% { opacity: 0.3; }
        15% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes droneSwarm {
        0% { 
          transform: translate(0, 0) scale(0.5); 
          opacity: 0; 
        }
        10% { 
          opacity: 1; 
          transform: translate(0, 0) scale(1); 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.3); 
          opacity: 0; 
        }
      }
      @keyframes linkPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      @keyframes radiateGlow {
        0% { 
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.8;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0.4;
        }
        100% { 
          transform: translate(-50%, -50%) scale(1.3);
          opacity: 0.1;
        }
      }
      @keyframes textDissolve {
        0% { 
          opacity: 1; 
        }
        100% { 
          opacity: 0; 
        }
      }
      @keyframes thanosParticle {
        0% { 
          transform: translate(0, 0) scale(1) rotate(0deg); 
          opacity: 1; 
        }
        20% {
          opacity: 0.8;
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.1) rotate(var(--rotation)); 
          opacity: 0; 
        }
      }
      @keyframes pulse {
        0% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.02); }
        100% { opacity: 0.6; transform: scale(1); }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  // Removed intro text state - no longer needed
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

  // Experience entry state
  const [showEntryOverlay, setShowEntryOverlay] = useState(true)
  const [experienceStarted, setExperienceStarted] = useState(false)
  const [isExploding, setIsExploding] = useState(false)
  const [showExplosionParticles, setShowExplosionParticles] = useState(false)
  const [showTextParticles, setShowTextParticles] = useState(false)

  // Audio system integration
  const { startExperience, isInitialized, grantPermission, startPlayback } = useAudioStore()

  // GLOBAL SPEED CONTROL - Easy to adjust entire show timing
  const SHOW_SPEED_MULTIPLIER = 1.0 // 1.0 = normal speed, 2.0 = 2x faster, 0.5 = half speed

  const introTexts = [] // Removed - Thank You is now in the entry overlay

  // Handle experience entry - drone show starts immediately, overlay fades naturally
  const handleBeginExperience = async () => {
    // Stage 1: Start drone swarm and drone show immediately
    setIsExploding(true)
    setShowExplosionParticles(true)

    // Start drone show immediately in background
    setExperienceStarted(true)

    // Grant permission and initialize audio immediately (critical for iOS)
    await grantPermission()
    startExperience()

    // Stage 2: Start text fade sooner so drone show is visible during fade
    setTimeout(() => {
      setShowTextParticles(true) // This triggers the text fade (2s duration)
    }, 4000) // Start text fade sooner

    // Stage 3: Hide overlay after text fade completes
    setTimeout(() => {
      setShowEntryOverlay(false)
    }, 6500) // Wait for text fade to fully complete (4s + 2s fade + 0.5s buffer)

    // Note: Audio will be started manually by user interaction (iOS Safari requirement)
    // The MusicControl component will show a prompt after 15 seconds if needed
  }

  // Removed intro text useEffect - Thank You is now handled in entry overlay

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
      {/* Drone show canvas - starts after user begins experience */}
      {experienceStarted && <DroneScene speedMultiplier={SHOW_SPEED_MULTIPLIER} />}

      {/* Music control overlay - subtle and unobtrusive */}
      {experienceStarted && <MusicControl />}

      {/* Centered iOS Music Prompt for better iPad visibility */}
      {experienceStarted && <CenteredMusicPrompt />}

      {/* Cinematic Entry Overlay */}
      {showEntryOverlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: showTextParticles ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(10, 10, 10, 0.2) 100%)' : 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)',
            zIndex: 100,
            backdropFilter: showTextParticles ? 'blur(5px)' : 'blur(20px)',
            transition: 'all 1s ease-out',
          }}
        >
          {/* "Thank You" Text with Fade In */}
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {/* Hover Background Circle - Radiating Light Effect */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '1000px',
                height: '1000px',
                background: 'radial-gradient(circle at center, rgba(0, 255, 157, 0.15) 0%, rgba(0, 255, 157, 0.08) 30%, rgba(0, 255, 157, 0.02) 60%, transparent 100%)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 0,
                zIndex: -1,
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease',
              }}
              className="hover-glow"
            />

            <span
              onClick={handleBeginExperience}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '300',
                color: '#ffffff',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                position: 'relative',
                zIndex: 10,
                animation: showTextParticles ? 'textDissolve 2s ease-out forwards' : 'fadeInUp 4s ease-out 1s both',
                transition: isExploding ? 'none' : 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isExploding && !showTextParticles) {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                  // Start the radiating glow animation
                  const glow = e.target.parentElement.querySelector('.hover-glow')
                  if (glow) {
                    glow.style.opacity = '1'
                    glow.style.animation = 'radiateGlow 2s ease-out infinite'
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!isExploding && !showTextParticles) {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  // Stop the radiating glow animation
                  const glow = e.target.parentElement.querySelector('.hover-glow')
                  if (glow) {
                    glow.style.opacity = '0'
                    glow.style.animation = 'none'
                    glow.style.transform = 'translate(-50%, -50%) scale(0)'
                  }
                }
              }}
            >
              Thank You
            </span>

            {/* Thanos-Style Text Particle Dissolve Effect - COMMENTED OUT FOR TESTING */}
            {/* {showTextParticles && (
              <>
                {Array.from({ length: 120 }, (_, i) => {
                  // Create rectangular particles that simulate text pixels breaking apart
                  const baseX = (i % 12) * 8 - 48 // Arrange in rough text shape
                  const baseY = Math.floor(i / 12) * 6 - 30

                  // Add randomness to simulate natural breakup
                  const randomX = baseX + (Math.random() - 0.5) * 20
                  const randomY = baseY + (Math.random() - 0.5) * 20

                  // Drift direction - mostly up and to the sides with some randomness
                  const driftX = (Math.random() - 0.5) * 150 + randomX * 2
                  const driftY = -50 - Math.random() * 100 + randomY * 1.5 // Upward drift

                  const width = 2 + Math.random() * 4
                  const height = 2 + Math.random() * 4
                  const delay = Math.random() * 0.8
                  const duration = 2 + Math.random() * 2
                  const rotation = (Math.random() - 0.5) * 360

                  // Vary particle colors to match text gradient
                  const colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0']
                  const color = colors[Math.floor(Math.random() * colors.length)]

                  return (
                    <div
                      key={`thanos-${i}`}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: `${width}px`,
                        height: `${height}px`,
                        background: color,
                        transform: `translate(${randomX}px, ${randomY}px)`,
                        animation: `thanosParticle ${duration}s ease-out ${delay}s forwards`,
                        '--dx': `${driftX}px`,
                        '--dy': `${driftY}px`,
                        '--rotation': `${rotation}deg`,
                        zIndex: 9,
                        opacity: 0.8 + Math.random() * 0.2,
                      }}
                    />
                  )
                })}
              </>
            )} */}

            {/* Drone Swarm Effect - Massive drone army */}
            {showExplosionParticles && (
              <>
                {Array.from({ length: 300 }, (_, i) => {
                  // Create multiple layers of drones at different distances and speeds
                  const layer = Math.floor(i / 75) // 4 layers of 75 drones each
                  const baseDistance = 150 + layer * 200 // More elegant shorter distances
                  const angle = Math.random() * 360 * (Math.PI / 180) // Random angles
                  const distance = baseDistance + Math.random() * 300 // Shorter, more elegant flight
                  const dx = Math.cos(angle) * distance
                  const dy = Math.sin(angle) * distance
                  const size = 2 + Math.random() * 5 // Slightly larger particles
                  const animationDuration = 3 + Math.random() * 4 // Longer flight times
                  const delay = Math.random() * 0.8 // More staggered timing

                  // Drone colors - mix of tech colors and lights
                  const droneColors = ['#00ff9d', '#4a9eff', '#ff6b35', '#ffd60a', '#9d4edd', '#ffffff', '#00d4aa', '#ff8c42', '#6bb6ff', '#b084cc']
                  const color = droneColors[Math.floor(Math.random() * droneColors.length)]

                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: `${size}px`,
                        height: `${size}px`,
                        background: `radial-gradient(circle, ${color} 0%, ${color}80 50%, transparent 100%)`,
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `droneSwarm ${animationDuration}s ease-out ${delay}s forwards`,
                        '--dx': `${dx}px`,
                        '--dy': `${dy}px`,
                        zIndex: 8,
                        boxShadow: `0 0 ${size * 2}px ${color}40`,
                      }}
                    />
                  )
                })}
              </>
            )}

            {/* Screen Flash Effect - Fades back to black */}
            {isExploding && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at center, rgba(0, 255, 157, 0.1) 0%, transparent 60%)',
                  animation: 'screenFlash 3s ease-out forwards',
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Home button - bottom left - only show after animations complete */}
      {experienceStarted && showHomeButton && <HomeButton />}

      {/* Removed cinematic text overlay - Thank You is now in entry overlay */}

      {/* Finale typing animation */}
      {experienceStarted && showFinaleText && (
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

// Centered music prompt for iPad visibility
function CenteredMusicPrompt() {
  const { isPlaying, isInitialized, hasPermission, startPlayback } = useAudioStore()
  const [showCenteredPrompt, setShowCenteredPrompt] = React.useState(false)

  React.useEffect(() => {
    if (isInitialized && hasPermission) {
      // Show centered prompt after 15 seconds if music hasn't started
      const timer = setTimeout(() => {
        if (!isPlaying) {
          setShowCenteredPrompt(true)
        }
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [isInitialized, hasPermission, isPlaying])

  const handleStartMusic = async () => {
    await startPlayback()
    setShowCenteredPrompt(false)
  }

  if (!showCenteredPrompt || isPlaying) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid rgba(0, 255, 157, 0.6)',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        backdropFilter: 'blur(15px)',
        animation: 'pulse 2s ease-in-out infinite',
        boxShadow: '0 0 30px rgba(0, 255, 157, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={handleStartMusic}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(0, 255, 157, 0.2)'
        e.target.style.transform = 'translate(-50%, -50%) scale(1.1)'
        e.target.style.boxShadow = '0 0 40px rgba(0, 255, 157, 0.6)'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(0, 0, 0, 0.8)'
        e.target.style.transform = 'translate(-50%, -50%) scale(1)'
        e.target.style.boxShadow = '0 0 30px rgba(0, 255, 157, 0.4)'
      }}
    >
      <div style={{ fontSize: '32px', color: '#00ff9d' }}>🔊</div>
    </div>
  )
}

// Enhanced music control component with volume
function MusicControl() {
  const { isPlaying, togglePlayback, isInitialized, setVolume, getVolume, startPlayback, hasPermission } = useAudioStore()
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false)
  const [currentVolume, setCurrentVolume] = React.useState(0.4)
  const [showPlayPrompt, setShowPlayPrompt] = React.useState(false)

  React.useEffect(() => {
    if (isInitialized) {
      setCurrentVolume(getVolume())

      // Don't show corner prompt - let the centered prompt handle it
      // This prevents duplicate prompts
    }
  }, [isInitialized, getVolume])

  if (!isInitialized) return null

  const handleMusicToggle = async () => {
    console.log('Music toggle clicked - isPlaying:', isPlaying)

    if (!isPlaying) {
      // Use startPlayback for both first time and resume
      await startPlayback()
      setShowPlayPrompt(false)
    } else {
      // Pause the music
      togglePlayback()
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setCurrentVolume(newVolume)
    setVolume(newVolume)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
        right: 'max(20px, env(safe-area-inset-right, 20px))',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        // Ensure visibility on all devices
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
      }}
    >
      {/* Volume Slider */}
      {showVolumeSlider && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '25px',
            padding: '15px 20px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '150px',
          }}
        >
          <span style={{ color: 'white', fontSize: '14px' }}>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={currentVolume}
            onChange={handleVolumeChange}
            style={{
              flex: 1,
              height: '4px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <span style={{ color: 'white', fontSize: '12px', minWidth: '30px' }}>{Math.round(currentVolume * 100)}%</span>
        </div>
      )}

      {/* Corner prompt removed - using centered prompt only to avoid duplicates */}

      {/* Control Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          opacity: 0.7,
          transition: 'opacity 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        {/* Volume Toggle Button */}
        <button
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            color: 'white',
            fontSize: '16px',
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
          title="Volume Control"
        >
          🎵
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={handleMusicToggle}
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
