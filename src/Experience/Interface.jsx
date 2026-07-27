import { useState, useEffect, useCallback, useRef } from 'react'
import { useGame, PHASES } from './stores/useGame.jsx'

export { PHASES }

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

function ReadyScreen({ onStart }) {
    return (
        <div className="phase-screen">
            <h1 className="game-title">AIM TRAINER</h1>
            <p className="game-subtitle">Click targets as fast as you can</p>
            {/*
                We request pointer lock directly here rather than relying on
                drei's PointerLockControls `selector` prop, because drei binds
                its click handler ONCE on mount to whatever `#start` element
                exists at that time. After a PAUSED → RESTART cycle React
                unmounts and remounts a fresh `#start` div, leaving drei's
                click listener attached to a stale, detached element.
            */}
            <div id="start" className="start-btn" onClick={onStart}>
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
    const phase = useGame((state) => state.phase)
    const score = useGame((state) => state.score)
    const hits = useGame((state) => state.hits)
    const misses = useGame((state) => state.misses)
    const setPhase = useGame((state) => state.setPhase)
    const resetGame = useGame((state) => state.reset)

    // Don't call exitPointerLock here — doing so synchronously fires
    // pointerlockchange, whose listener would race with this setState and
    // overwrite ENDED with PAUSED. The ENDED screen's PLAY AGAIN button
    // calls handleRestart, which is the one place that releases the lock.
    const endGame = useCallback(() => {
        setPhase(PHASES.ENDED)
    }, [setPhase])

    const { timeLeft, reset: resetTimer } = useTimer(ROUND_DURATION, phase, endGame)

    // Use a ref to track phase for the event listener to avoid stale closures
    const phaseRef = useRef(phase)
    useEffect(() => {
        phaseRef.current = phase
    }, [phase])

    useEffect(() => {
        const onChange = () => {
            const locked = !!document.pointerLockElement
            const currentPhase = phaseRef.current

            if (locked && (currentPhase === PHASES.READY || currentPhase === PHASES.PAUSED)) {
                setPhase(PHASES.PLAYING)
            } else if (!locked && currentPhase === PHASES.PLAYING) {
                setPhase(PHASES.PAUSED)
            }
        }
        document.addEventListener('pointerlockchange', onChange)
        return () => document.removeEventListener('pointerlockchange', onChange)
    }, [setPhase])

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
    // Request pointer lock directly on the canvas. Used by both the START
    // and RESUME buttons; doing this from React (rather than relying on
    // drei's selector-bound click listener) means a fresh `#start` element
    // after PAUSED → RESTART still works.
    const requestLock = useCallback(() => {
        if (!document.pointerLockElement) document.querySelector('canvas')?.requestPointerLock()
    }, [])

    const handleRestart = useCallback(() => {
        if (document.pointerLockElement) document.exitPointerLock()
        resetTimer()
        resetGame()
    }, [resetTimer, resetGame])

    // Derived stats
    const total = hits + misses
    const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0

    return (
        <div className="interface">
            {phase === PHASES.READY && <ReadyScreen onStart={requestLock} />}

            {phase === PHASES.PLAYING && (
                <>
                    <Timer timeLeft={timeLeft} />
                    <ScoreDisplay score={score} />
                </>
            )}

            {phase === PHASES.PAUSED && (
                <PausedScreen onResume={requestLock} onRestart={handleRestart} />
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
    )
}