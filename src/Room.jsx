import * as THREE from 'three'

export default function Room() {
    const wallGeometry = new THREE.BoxGeometry(1, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: "#4a4e41" });

    return (
        <>
            <mesh
                geometry={wallGeometry}
                material={wallMaterial}
                position={[0, 0, -2]}
                scale={[19, 10, 0.4]}
            />

            <mesh
                geometry={wallGeometry}
                material={wallMaterial}
                position={[0, -5, 8]}
                rotation-x={Math.PI * 0.5}
                scale={[19, 20, 0.4]}
            />

            <mesh
                geometry={wallGeometry}
                material={wallMaterial}
                position={[0, 5, 8]}
                rotation-x={Math.PI * 0.5}
                scale={[19, 20, 0.4]}
            />

            <mesh
                geometry={wallGeometry}
                material={wallMaterial}
                position={[-9.5, 0, 8]}
                rotation-y={Math.PI * 0.5}
                scale={[19, 10, 0.4]}
            />

            <mesh
                geometry={wallGeometry}
                material={wallMaterial}
                position={[9.5, 0, 8]}
                rotation-y={Math.PI * 0.5}
                scale={[19, 10, 0.4]}
            />
        </>
    );
}
