import { createContext } from 'react'

/**
 * React context for sharing global game state.
 *
 * Provides access to:
 * - Game loading state
 * - Resource paths
 * - Player coin count
 * - State updater functions
 */
export const GameContext = createContext()
