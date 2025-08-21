// stores/useStore.js
import { create } from 'zustand'

export const useStore = create((set) => ({
  // The ID of the currently selected node, or null if none
  selectedNode: null,
  launchProgress: 0, // 0 = not launched, 1 = fully launched
  isShutdown: false, // <-- NEW: false = running, true = shutdown initiated
  triggerShutdown: () => set({ isShutdown: true }),
  setLaunchProgress: (progress) => set({ launchProgress: progress }),

  // 'flight', 'unraveling', 'singularity', 'dive', 'void'
  universeState: 'flight',
  selectedNode: null,

  actions: {
    beginEndgame: () => set({ universeState: 'endgame' }),
    reset: () => set({ universeState: 'flight', selectedNode: null }),
  },

  //   actions: {
  //     beginUnraveling: () => set({ universeState: 'unraveling' }),
  //     formSingularity: () => set({ universeState: 'singularity' }),
  //     dive: () => set({ universeState: 'dive' }),
  //     enterVoid: () => set({ universeState: 'void' }),
  //     reset: () => set({ universeState: 'flight', selectedNode: null }),
  //   },
  // Actions to update the state
  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),
  clearSelectedNode: () => set({ selectedNode: null }),
}))
