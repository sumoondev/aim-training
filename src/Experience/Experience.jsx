import { OrbitControls, Point, PointerLockControls } from '@react-three/drei'
import { useControls } from 'leva'
import Room from './components/Room.jsx'

export default function Experience() {
    return (
        <>
            <color args={["#ffdec3"]} attach="background" />

            <PointerLockControls makeDefault selector="#start" />

            <ambientLight intensity= { 1.5 } />
            <directionalLight 
                position={ [ 0, 2, 10 ] } 
                intensity={ 10 } 
                color="#fffdef" 
            />

            <Room />
            
        </>
    )
}
