import { OrbitControls, Point, PointerLockControls } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from 'three'
import Room from "./Room";

export default function Experience() {
    return (
        <>
            <color args={["#ffdec3"]} attach="background" />

            <PointerLockControls makeDefault />

            <ambientLight intensity= { 1.5 } />
            <directionalLight 
                position={ [ 0, 2, 10 ] } 
                intensity={ 10 } 
                color="#fffdef" 
            />

            <mesh>
                <boxGeometry />
                <meshNormalMaterial />
            </mesh>

            <Room />
            
        </>
    )
}
