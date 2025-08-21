'use client'

import { memo, useCallback, useEffect, useState } from 'react'

import styles from './PerformanceMonitor.module.css'
import { usePerformanceMonitor } from '@/utils/performanceOptimizations'

const PerformanceMetric = memo(({ label, value, unit = '', status = 'normal', threshold }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return '#00ff9d'
      case 'warning':
        return '#ffd60a'
      case 'poor':
        return '#ff6b35'
      default:
        return '#4a9eff'
    }
  }

  const getStatusFromValue = () => {
    if (!threshold) return status

    if (value <= threshold.good) return 'good'
    if (value <= threshold.warning) return 'warning'
    return 'poor'
  }

  const actualStatus = threshold ? getStatusFromValue() : status

  return (
    <div className={styles.metric}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue} style={{ color: getStatusColor() }}>
        {typeof value === 'number' ? value.toFixed(1) : value}
        {unit}
      </div>
      <div className={styles.metricStatus} style={{ backgroundColor: getStatusColor() }} />
    </div>
  )
})

PerformanceMetric.displayName = 'PerformanceMetric'

const PerformanceChart = memo(({ data, maxPoints = 50, height = 60 }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    setChartData((prev) => {
      const newData = [...prev, data].slice(-maxPoints)
      return newData
    })
  }, [data, maxPoints])

  const createPath = () => {
    if (chartData.length < 2) return ''

    const width = 200
    const stepX = width / (maxPoints - 1)
    const maxValue = Math.max(...chartData, 60) // Ensure minimum scale
    const minValue = Math.min(...chartData, 0)
    const range = maxValue - minValue || 1

    const points = chartData.map((value, index) => {
      const x = index * stepX
      const y = height - ((value - minValue) / range) * height
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }

  return (
    <div className={styles.chart}>
      <svg width="200" height={height} viewBox={`0 0 200 ${height}`}>
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ff9d" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ff9d" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g className={styles.gridLines}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line key={ratio} x1="0" y1={height * ratio} x2="200" y2={height * ratio} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          ))}
        </g>

        {/* Chart line */}
        {chartData.length > 1 && <path d={createPath()} fill="none" stroke="#00ff9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Fill area */}
        {chartData.length > 1 && <path d={`${createPath()} L 200,${height} L 0,${height} Z`} fill="url(#chartGradient)" />}
      </svg>
    </div>
  )
})

PerformanceChart.displayName = 'PerformanceChart'

export const PerformanceMonitor = memo(({ isVisible = false, position = 'bottom-right', compact = false, showCharts = true }) => {
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [history, setHistory] = useState({
    frameRate: [],
    scrollPerformance: [],
    memoryUsage: [],
  })

  const { metrics, isMonitoring, startMonitoring, stopMonitoring, isPerformancePoor } = usePerformanceMonitor({
    autoStart: true,
    onMetricChange: (metric, value) => {
      // Update history for charts
      if (['frameRate', 'scrollPerformance', 'memoryUsage'].includes(metric)) {
        setHistory((prev) => ({
          ...prev,
          [metric]: [...prev[metric], value].slice(-50),
        }))
      }
    },
  })

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const toggleMonitoring = useCallback(() => {
    if (isMonitoring) {
      stopMonitoring()
    } else {
      startMonitoring()
    }
  }, [isMonitoring, startMonitoring, stopMonitoring])

  if (!isVisible) return null

  const positionClass = styles[position.replace('-', '')]

  return (
    <div className={`${styles.performanceMonitor} ${positionClass} ${isExpanded ? styles.expanded : styles.compact}`}>
      <div className={styles.header} onClick={toggleExpanded}>
        <div className={styles.title}>
          Performance Monitor
          <div className={`${styles.statusIndicator} ${isPerformancePoor ? styles.poor : styles.good}`} />
        </div>
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={(e) => {
              e.stopPropagation()
              toggleMonitoring()
            }}
            title={isMonitoring ? 'Stop monitoring' : 'Start monitoring'}
          >
            {isMonitoring ? '⏸️' : '▶️'}
          </button>
          <button className={styles.expandButton} onClick={toggleExpanded} title={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.metricsGrid}>
            <PerformanceMetric
              label="Frame Rate"
              value={metrics.frameRate}
              unit=" fps"
              threshold={{
                good: 45,
                warning: 30,
              }}
            />

            <PerformanceMetric
              label="Scroll Perf"
              value={metrics.scrollPerformance}
              unit=" ms"
              threshold={{
                good: 16,
                warning: 32,
              }}
            />

            <PerformanceMetric
              label="Animation"
              value={metrics.animationPerformance}
              unit=" ms"
              threshold={{
                good: 16,
                warning: 32,
              }}
            />

            <PerformanceMetric
              label="Theme Switch"
              value={metrics.themeSwitch}
              unit=" ms"
              threshold={{
                good: 50,
                warning: 100,
              }}
            />

            <PerformanceMetric
              label="Memory"
              value={metrics.memoryUsage}
              unit=" MB"
              threshold={{
                good: 50,
                warning: 100,
              }}
            />
          </div>

          {showCharts && (
            <div className={styles.charts}>
              <div className={styles.chartContainer}>
                <div className={styles.chartLabel}>Frame Rate (fps)</div>
                <PerformanceChart data={metrics.frameRate} />
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.chartLabel}>Scroll Performance (ms)</div>
                <PerformanceChart data={metrics.scrollPerformance} />
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.chartLabel}>Memory Usage (MB)</div>
                <PerformanceChart data={metrics.memoryUsage} />
              </div>
            </div>
          )}

          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span>Status:</span>
              <span className={isPerformancePoor ? styles.poor : styles.good}>{isPerformancePoor ? 'Poor Performance' : 'Good Performance'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Monitoring:</span>
              <span className={isMonitoring ? styles.active : styles.inactive}>{isMonitoring ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

PerformanceMonitor.displayName = 'PerformanceMonitor'

// Development-only performance overlay
export const DevPerformanceOverlay = memo(() => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development mode
    const isDev = process.env.NODE_ENV === 'development'
    setIsVisible(isDev)

    // Toggle with keyboard shortcut (Ctrl+Shift+P)
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible((prev) => !prev)
      }
    }

    if (isDev) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!isVisible) return null

  return <PerformanceMonitor isVisible={true} position="bottom-right" compact={false} showCharts={true} />
})
