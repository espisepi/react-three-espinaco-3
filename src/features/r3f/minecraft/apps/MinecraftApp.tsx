import { Canvas } from "@react-three/fiber"
import { Sky, KeyboardControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { Ground } from "../components/Ground"
import { Player } from "../components/Player"
import { Cube, Cubes } from "../components/Cube"

// The original was made by Maksim Ivanow: https://www.youtube.com/watch?v=Lc2JvBXMesY&t=124s
// This demo needs pointer-lock, that works only if you open it in a new window
// Controls: WASD + left click

type ControlMap = {
  name: string;
  keys: string[];
};

export default function MinecraftApp(): JSX.Element {
  const controlsMap: ControlMap[] = [
    { name: "forward", keys: ["ArrowUp", "w", "W"] },
    { name: "backward", keys: ["ArrowDown", "s", "S"] },
    { name: "left", keys: ["ArrowLeft", "a", "A"] },
    { name: "right", keys: ["ArrowRight", "d", "D"] },
    { name: "jump", keys: ["Space"] },
  ];

  return (
    <KeyboardControls map={controlsMap}>
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        {/* @ts-ignore */}
        <ambientLight intensity={2.0} />
        {/* @ts-ignore */}
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Physics gravity={[0, -30, 0]}>
          <Ground />
          <Player />
          <Cube position={[0, 0.5, -10]} />
          <Cubes />
        </Physics>
        {/* <PointerLockControls /> */}
      </Canvas>
    </KeyboardControls>
  )
}
