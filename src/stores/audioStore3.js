import { create } from 'zustand'

export const useAudioStore = create((set) => ({
  // The store now only holds the data, not the controls.
  analyser: null,
  bass: 0,
  treble: 0,

  // Action to let the AudioPlayer component register its analyser with the store.
  setAnalyser: (analyser) => set({ analyser }),

  // Action to let the AudioPlayer component update the frequency data on each frame.
  setFrequencyData: ({ bass, treble }) => set({ bass, treble }),
}))
