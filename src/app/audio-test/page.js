'use client'

import { useRef, useState } from 'react'

export default function AudioTestPage() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [targetTime, setTargetTime] = useState(30)
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `${timestamp}: ${message}`])
    console.log(message)
  }

  const loadAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    addLog('Loading audio...')
    audio.src = '/sound/nezuko_short.mp3'

    return new Promise((resolve, reject) => {
      const onCanPlay = () => {
        audio.removeEventListener('canplaythrough', onCanPlay)
        audio.removeEventListener('error', onError)
        addLog(`Audio loaded! Duration: ${audio.duration?.toFixed(1)}s`)
        setDuration(audio.duration || 0)
        resolve()
      }

      const onError = (e) => {
        audio.removeEventListener('canplaythrough', onCanPlay)
        audio.removeEventListener('error', onError)
        addLog(`Audio load error: ${e.message}`)
        reject(e)
      }

      audio.addEventListener('canplaythrough', onCanPlay)
      audio.addEventListener('error', onError)
      audio.load()
    })
  }

  const playFromStart = async () => {
    try {
      const audio = audioRef.current
      if (!audio) return

      await loadAudio()

      addLog('Playing from start (0s)')
      audio.currentTime = 0
      addLog(`Set currentTime to: ${audio.currentTime}s`)

      await audio.play()
      setIsPlaying(true)
      addLog('Playback started successfully')
    } catch (e) {
      addLog(`Error playing from start: ${e.message}`)
    }
  }

  const playFromTimestamp = async () => {
    try {
      const audio = audioRef.current
      if (!audio) return

      await loadAudio()

      addLog(`Playing from ${targetTime}s`)
      audio.currentTime = targetTime
      addLog(`Set currentTime to: ${audio.currentTime}s`)

      await audio.play()
      setIsPlaying(true)
      addLog(`Playback started at ${audio.currentTime}s`)
    } catch (e) {
      addLog(`Error playing from timestamp: ${e.message}`)
    }
  }

  const pauseAudio = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      setIsPlaying(false)
      addLog(`Paused at ${audio.currentTime.toFixed(1)}s`)
    }
  }

  const stopAudio = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
      addLog('Stopped audio')
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  // Update current time display
  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
    addLog('Audio ended')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Audio Timestamp Test</h1>

      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnd} style={{ display: 'none' }} />

      <div style={{ marginBottom: '20px' }}>
        <h3>Audio Info</h3>
        <p>Current Time: {currentTime.toFixed(1)}s</p>
        <p>Duration: {duration.toFixed(1)}s</p>
        <p>Playing: {isPlaying ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Controls</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button onClick={playFromStart} style={buttonStyle}>
            Play from Start (0s)
          </button>
          <button onClick={playFromTimestamp} style={buttonStyle}>
            Play from {targetTime}s
          </button>
          <button onClick={pauseAudio} style={buttonStyle}>
            Pause
          </button>
          <button onClick={stopAudio} style={buttonStyle}>
            Stop
          </button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Target Time:
            <input type="number" value={targetTime} onChange={(e) => setTargetTime(Number(e.target.value))} min="0" max="300" step="1" style={{ marginLeft: '10px', padding: '5px' }} />
            seconds
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Quick Tests</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[10, 20, 30, 45, 60].map((time) => (
            <button
              key={time}
              onClick={() => {
                setTargetTime(time)
                setTimeout(() => playFromTimestamp(), 100)
              }}
              style={buttonStyle}
            >
              Jump to {time}s
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Debug Logs</h3>
        <button onClick={clearLogs} style={{ ...buttonStyle, marginBottom: '10px' }}>
          Clear Logs
        </button>
        <div
          style={{
            background: '#000',
            color: '#0f0',
            padding: '10px',
            height: '300px',
            overflowY: 'scroll',
            fontSize: '12px',
            border: '1px solid #333',
          }}
        >
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          ← Back to Home
        </a>
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: '10px 15px',
  background: '#0066cc',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
}
