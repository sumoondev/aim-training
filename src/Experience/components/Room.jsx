import { Grid } from '@react-three/drei'

export default function Room() {
    return (
        <group>
            <Grid
                position={[0, -5, 0]}
                args={[50, 50]}
                cellSize={1}
                cellThickness={1}
                cellColor="#6f6f6f"
                sectionSize={5}
                sectionThickness={1.5}
                sectionColor="#9d9d9d"
                fadeDistance={50}
            />

            <mesh position={[0, 0, -15]}>
                <planeGeometry args={[40, 20]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>

            <mesh position={[-20, 0, -5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#151515" />
            </mesh>

            <mesh position={[20, 0, -5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#151515" />
            </mesh>
        </group>
    );
}
