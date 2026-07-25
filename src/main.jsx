import { Canvas } from '@react-three/fiber'
import ReactDom from 'react-dom/client'
import './index.css'
import Experience from './Experience/Experience.jsx'
import Crosshair from './Crosshair'

const root = ReactDom.createRoot(document.querySelector("#root"));

root.render(
    <>
        <Canvas
            camera={{
                position: [0, 0, 10],
                fov: 105,
                near: 0.1,
                far: 200,
            }}
        >
            <Experience />
        </Canvas>

        <Crosshair />

    </>
)