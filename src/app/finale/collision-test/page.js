'use client'

import { CollisionAnalyzer } from '../DroneShow/CollisionAnalyzer'
import { useEffect, useState } from 'react'

export default function CollisionTestPage() {
  const [results, setResults] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setResults([])

    // Run analysis in a setTimeout to allow UI to update
    setTimeout(() => {
      const analyzer = new CollisionAnalyzer(1024, 15.0) // 1024 drones, 15 unit safety radius
      const analysisResults = analyzer.analyzeAllFormations()
      setResults(analysisResults)
      setIsAnalyzing(false)
    }, 100)
  }

  useEffect(() => {
    // Auto-run analysis on page load
    runAnalysis()
  }, [])

  const getSafetyStatus = (conflicts) => {
    if (conflicts === 0) return { text: '✅ SAFE', color: '#4CAF50' }
    if (conflicts < 10) return { text: '⚠️ LOW RISK', color: '#FF9800' }
    if (conflicts < 100) return { text: '🔶 MEDIUM RISK', color: '#FF5722' }
    return { text: '🔴 HIGH RISK', color: '#F44336' }
  }

  const getRiskLevel = (conflicts) => {
    if (conflicts === 0) return 0
    if (conflicts < 10) return 1
    if (conflicts < 100) return 2
    return 3
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        padding: '20px',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              margin: '0 0 10px 0',
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🚁 Drone Formation Collision Analysis
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: 0 }}>Analyzing transitions from dome formation to target formations</p>
        </div>

        {/* Controls */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              backgroundColor: isAnalyzing ? '#555' : '#00f5ff',
              color: isAnalyzing ? '#aaa' : '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {isAnalyzing ? '🔄 Analyzing...' : '🔍 Run Collision Analysis'}
          </button>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'rgba(0, 245, 255, 0.1)',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid rgba(0, 245, 255, 0.3)',
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>🔄 Running collision analysis...</div>
            <div style={{ opacity: 0.7 }}>Checking 1024 drones across 5 formations with 15-unit safety radius</div>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>📊 Analysis Summary</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '15px',
              }}
            >
              {results.map((result, index) => {
                const safety = getSafetyStatus(result.totalConflicts)
                const riskLevel = getRiskLevel(result.totalConflicts)

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedResult(result)}
                    style={{
                      padding: '20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: `2px solid ${safety.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: selectedResult === result ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{result.formationName}</h3>
                      <span style={{ color: safety.color, fontWeight: 'bold' }}>{safety.text}</span>
                    </div>

                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      <div>
                        🔥 Conflicts: <strong>{result.totalConflicts}</strong>
                      </div>
                      <div>
                        👥 Drone pairs: <strong>{result.uniquePairs}</strong>
                      </div>
                      <div>
                        📏 Min distance: <strong>{result.minDistance}u</strong>
                      </div>
                      <div>
                        ⏱️ Analysis: <strong>{result.analysisTime}</strong>
                      </div>
                    </div>

                    {/* Risk indicator bar */}
                    <div
                      style={{
                        marginTop: '10px',
                        height: '4px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, (riskLevel / 3) * 100)}%`,
                          backgroundColor: safety.color,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Detailed Results */}
        {selectedResult && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>🔍 Detailed Analysis: {selectedResult.formationName}</h2>

            <div
              style={{
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Total Conflicts</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedResult.totalConflicts}</div>
                </div>
                <div>
                  <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Unique Drone Pairs</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedResult.uniquePairs}</div>
                </div>
                <div>
                  <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Minimum Distance</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedResult.minDistance} units</div>
                </div>
                <div>
                  <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Max Simultaneous</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedResult.maxConflictsAtTime}</div>
                </div>
              </div>

              {selectedResult.conflicts.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '15px' }}>Sample Conflicts:</h4>
                  <div
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      padding: '15px',
                      borderRadius: '8px',
                    }}
                  >
                    {selectedResult.conflicts.map((conflict, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: '10px',
                          padding: '8px',
                          backgroundColor: 'rgba(255,0,0,0.1)',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                        }}
                      >
                        <div>
                          <strong>Conflict #{i + 1}:</strong> Drones {conflict.droneA} & {conflict.droneB}
                        </div>
                        <div style={{ opacity: 0.8 }}>
                          Time: {conflict.time}s | Distance: {conflict.distance} units
                        </div>
                        <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                          A: ({conflict.positionA.x.toFixed(1)}, {conflict.positionA.y.toFixed(1)}, {conflict.positionA.z.toFixed(1)}) | B: ({conflict.positionB.x.toFixed(1)}, {conflict.positionB.y.toFixed(1)}, {conflict.positionB.z.toFixed(1)})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            opacity: 0.6,
            fontSize: '0.9rem',
            marginTop: '40px',
          }}
        >
          Safety radius: 15 units | Transition duration: 10 seconds | Time step: 0.1 seconds
        </div>
      </div>
    </div>
  )
}
