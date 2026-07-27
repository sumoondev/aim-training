import { useState, useEffect, useRef } from 'react'
import { useGame, PHASES } from '../stores/useGame.jsx'

/**
 * Generate a random position within the visible play area
 */
function randomPosition() {
    return [
        (Math.random() - 0.5) * 30, // x: -15 to 15
        Math.random() * 8 - 2,       // y: -2 to 6
        -12 + Math.random() * -6     // z: -18 to -12 (away from camera)
    ]
}

/**
 * Individual clickable target sphere
 */
function TargetSphere({ position, onHit }) {
    const [hovered, setHovered] = useState(false)

    return (
        <mesh
            position={position}
            onClick={onHit}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
                color={hovered ? '#ff4444' : '#ff6b6b'}
                emissive={hovered ? '#ff0000' : '#cc0000'}
                emissiveIntensity={0.5}
                roughness={0.3}
                metalness={0.1}
            />
        </mesh>
    )
}

/**
 * Target manager — spawns and manages clickable targets during gameplay
 */
export default function Target() {
    const phase = useGame((state) => state.phase)
    const addScore = useGame((state) => state.addScore)
    const addHit = useGame((state) => state.addHit)
    const addMiss = useGame((state) => state.addMiss)
    const [targetPosition, setTargetPosition] = useState(randomPosition())
    const isPlayingRef = useRef(false)

    // Track whether we're in PLAYING phase
    useEffect(() => {
        isPlayingRef.current = phase === PHASES.PLAYING
        
        // Reset target position when entering PLAYING phase
        if (phase === PHASES.PLAYING) {
            setTargetPosition(randomPosition())
        }
    }, [phase])

    const handleHit = (e) => {
        e.stopPropagation()
        
        // Only count hits during PLAYING phase
        if (!isPlayingRef.current) return

        addScore(100)
        addHit()
        setTargetPosition(randomPosition())
    }

    const handleMiss = () => {
        // Only count misses during PLAYING phase
        if (!isPlayingRef.current) return

        addMiss()
    }

    // Only render target during PLAYING phase
    if (phase !== PHASES.PLAYING) return null

    return (
        <group onClick={handleMiss}>
            {/* Invisible backdrop to catch miss clicks */}
            <mesh position={[0, 0, -15]} visible={false}>
                <planeGeometry args={[100, 100]} />
            </mesh>

            <TargetSphere position={targetPosition} onHit={handleHit} />
        </group>
    )
}
