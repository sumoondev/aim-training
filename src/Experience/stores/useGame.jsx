import { create } from 'zustand'

/**
 * Game Phase Constants
 */

export const PHASES = {
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended',
}

/**
 * Game state store.
 *
 * This lives outside the React tree entirely, which is why it works for
 * both Interface.jsx (rendered in the DOM) and Target.jsx (rendered inside
 * <Canvas>, which runs its own separate React reconciler). A DOM-tree
 * Context provider can't reach across that boundary — a Zustand store
 * isn't part of the tree in the first place, so there's no boundary to
 * cross.
 */
export const useGame = create((set) => ({
    phase: PHASES.READY,
    score: 0,
    hits: 0,
    misses: 0,

    setPhase: (phase) => set({ phase }),
    addScore: (amount = 100) => set((state) => ({ score: state.score + amount })),
    addHit: () => set((state) => ({ hits: state.hits + 1 })),
    addMiss: () => set((state) => ({ misses: state.misses + 1 })),
    reset: () => set({ phase: PHASES.READY, score: 0, hits: 0, misses: 0 }),
}))
