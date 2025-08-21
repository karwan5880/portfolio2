'use client'

import { useEffect, useRef, useState } from 'react'

export function StreamColumn({ initialData = [], speed = 100, direction = 'up', isEnding = false, className = '', renderItem }) {
  const [items, setItems] = useState([])
  const containerRef = useRef(null)
  const dataPoolRef = useRef([])
  const positions = useRef(new Map())
  const animationFrameId = useRef(null)
  const lastTimeRef = useRef(null)

  useEffect(() => {
    dataPoolRef.current = [...initialData]
    positions.current.clear()
    const initialPool = dataPoolRef.current.splice(0, 15)
    setItems(initialPool)
  }, [initialData])

  useEffect(() => {
    let currentPos = 0
    items.forEach((item) => {
      positions.current.set(item.id, currentPos)
      currentPos += 200 // Use a stable estimate for positioning
    })
  }, [items])

  useEffect(() => {
    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      document.querySelectorAll('.stream-item-managed').forEach((node) => {
        const id = node.id
        const oldPos = positions.current.get(id) || 0
        const newPos = direction === 'up' ? oldPos - speed * dt : oldPos + speed * dt
        positions.current.set(id, newPos)
        node.style.transform = `translateY(${newPos}px)`
      })
      animationFrameId.current = requestAnimationFrame(animate)
    }
    animationFrameId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId.current)
  }, [speed, direction])

  return (
    <div ref={containerRef} className={className}>
      {items.map((item) => renderItem(item))}
    </div>
  )
}
