import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'

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
 * Game State Context
 */

const GameStateContext = createContext(null)

export function useGameState() {
    return useContext(GameStateContext)
}

/**
 * Timer Hook
 */

function useTimer(duration, phase, onTimeUp) {
    const [timeLeft, setTimeLeft] = useState(duration)
    const callbackRef = useRef(onTimeUp)
    callbackRef.current = onTimeUp

    useEffect(() => {
        if (phase !== PHASES.PLAYING || timeLeft <= 0) return

        const id = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    callbackRef.current()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(id)
    }, [phase, timeLeft])

    const reset = useCallback(() => setTimeLeft(duration), [duration])
    return { timeLeft, reset }
}

/**
 * HUD Elements
 */

function Timer({ timeLeft }) {
    const secs = timeLeft % 60
    return (
        <div className="hud-timer">
            {Math.floor(timeLeft / 60)}:{String(secs).padStart(2, '0')}
        </div>
    )
}

function ScoreDisplay({ score }) {
    return <div className="hud-score">{score}</div>
}

/**
 * Ready Screen
 */

function ReadyScreen() {
    return (
        <div className="phase-screen">
            <h1 className="game-title">AIM TRAINER</h1>
            <p className="game-subtitle">Click targets as fast as you can</p>
            {/*
                id="start" is REQUIRED — PointerLockControls uses selector="#start"
                to know which element triggers the pointer lock on click.
            */}
            <div id="start" className="start-btn">
                START
            </div>
            <p className="controls-hint">ESC to pause · R to restart</p>
        </div>
    )
}

/**
 * Paused Screen
 */

function PausedScreen({ onResume, onRestart }) {
    return (
        <div className="phase-screen paused-overlay">
            <h2 className="phase-title">PAUSED</h2>
            <div className="btn-group">
                <button className="btn btn-primary" onClick={onResume}>
                    RESUME
                </button>
                <button className="btn btn-secondary" onClick={onRestart}>
                    RESTART
                </button>
            </div>
        </div>
    )
}

/**
 * Ended Screen
 */

function EndedScreen({ score, hits, misses, accuracy, onRestart }) {
    return (
        <div className="phase-screen ended-overlay">
            <h2 className="phase-title">TIME'S UP</h2>
            <div className="stats-grid">
                <StatCard value={score} label="SCORE" />
                <StatCard value={hits} label="HITS" />
                <StatCard value={misses} label="MISSES" />
                <StatCard value={`${accuracy}%`} label="ACCURACY" />
            </div>
            <div className="btn-group">
                <button className="btn btn-primary" onClick={onRestart}>
                    PLAY AGAIN
                </button>
            </div>
        </div>
    )
}

function StatCard({ value, label }) {
    return (
        <div className="stat-card">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    )
}

/**
 * Main Interface Component
 */

const ROUND_DURATION = 30 // seconds — adjust to change round length

export default function Interface() {
    const [phase, setPhase] = useState(PHASES.READY)
    const [score, setScore] = useState(0)
    const [hits, setHits] = useState(0)
    const [misses, setMisses] = useState(0)

    const endGame = useCallback(() => {
        setPhase(PHASES.ENDED)
        document.exitPointerLock()
    }, [])

    const { timeLeft, reset: resetTimer } = useTimer(ROUND_DURATION, phase, endGame)

    useEffect(() => {
        const onChange = () => {
            const locked = !!document.pointerLockElement
            if (locked && phase === PHASES.READY) {
                setPhase(PHASES.PLAYING)
            } else if (!locked && phase === PHASES.PLAYING) {
                setPhase(PHASES.PAUSED)
            }
        }
        document.addEventListener('pointerlockchange', onChange)
        return () => document.removeEventListener('pointerlockchange', onChange)
    }, [phase])

    // Keyboard shortcuts
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'r' || e.key === 'R') {
                if (phase !== PHASES.READY) handleRestart()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [phase])

    // Actions
    const handleResume = useCallback(() => {
        document.querySelector('canvas')?.requestPointerLock()
    }, [])

    const handleRestart = useCallback(() => {
        document.exitPointerLock()
        setScore(0)
        setHits(0)
        setMisses(0)
        resetTimer()
        setPhase(PHASES.READY)
    }, [resetTimer])

    // Derived stats
    const total = hits + misses
    const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0

    const ctx = { phase, score, hits, misses, timeLeft, setScore, setHits, setMisses }

    return (
        <GameStateContext.Provider value={ctx}>
            <div className="interface">
                {phase === PHASES.READY && <ReadyScreen />}

                {phase === PHASES.PLAYING && (
                    <>
                        <Timer timeLeft={timeLeft} />
                        <ScoreDisplay score={score} />
                    </>
                )}

                {phase === PHASES.PAUSED && (
                    <PausedScreen onResume={handleResume} onRestart={handleRestart} />
                )}

                {phase === PHASES.ENDED && (
                    <EndedScreen
                        score={score}
                        hits={hits}
                        misses={misses}
                        accuracy={accuracy}
                        onRestart={handleRestart}
                    />
                )}
            </div>
        </GameStateContext.Provider>
    )
}