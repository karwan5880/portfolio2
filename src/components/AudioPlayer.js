import { PositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { useAudioStore } from '@/stores/audioStore'

export function AudioPlayer({ url, play }) {
  const sound = useRef()
  const { setAnalyser, setFrequencyData } = useAudioStore()
  const [isLoaded, setIsLoaded] = useState(false)

  // Create the analyser once
  const analyser = useMemo(() => {
    if (sound.current) {
      return new THREE.AudioAnalyser(sound.current, 64) // 64 frequency bins
    }
    return null
  }, [sound.current])

  // When the analyser is created, register it with the global store
  useEffect(() => {
    if (analyser) {
      setAnalyser(analyser)
    }
  }, [analyser, setAnalyser])

  useFrame(() => {
    // On every frame, get the frequency data and update the store
    if (analyser) {
      const data = analyser.getFrequencyData()
      const bass = (data[0] + data[1] + data[2]) / 3 / 255
      const treble = (data[10] + data[11] + data[12]) / 3 / 255
      setFrequencyData({ bass, treble })
    }
  })
  if (!play) {
    return null
  }
  return (
    // The Audio component from drei handles loading and playback!
    // <Audio ref={sound} url={url} loop={false} autoplay={play} volume={0.3} />

    <PositionalAudio
      ref={sound}
      url={url}
      loop={false}
      // The `onLoad` prop helps us reliably create the analyser.
      onLoad={() => setIsLoaded(true)}
      distance={1} // Required prop, but doesn't matter for global audio
    />
  )
}
