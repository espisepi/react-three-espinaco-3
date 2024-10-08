import { useCallback, useRef, useState } from "react"
import { useTexture } from "@react-three/drei"
import { RapierRigidBody, RigidBody } from "@react-three/rapier"
import create from "zustand"
import dirt from "../assets/dirt.jpg"
import { MeshProps, ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"

// This is a naive implementation and wouldn't allow for more than a few thousand boxes.
// In order to make this scale this has to be one instanced mesh, then it could easily be
// hundreds of thousands.

interface CubeStoreState {
  cubes: [number, number, number][]
  addCube: (x: number, y: number, z: number) => void
}

const useCubeStore = create<CubeStoreState>((set) => ({
  cubes: [],
  addCube: (x: number, y: number, z: number) => set((state) => ({ cubes: [...state.cubes, [x, y, z]] })),
}))

export const Cubes: React.FC = () => {
  const cubes = useCubeStore((state) => state.cubes)
  return (
    <>
      {cubes.map((coords, index) => (
        <Cube key={index} position={coords} />
      ))}
    </>
  )
}

interface CubeProps extends MeshProps {
  position: [number, number, number]
}

export const Cube: React.FC<CubeProps> = (props) => {
  const ref = useRef<RapierRigidBody>(null)
  const [hover, setHover] = useState<number | null>(null)
  const addCube = useCubeStore((state) => state.addCube)
  const texture = useTexture(dirt) as THREE.Texture

  const onMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHover(Math.floor(e.faceIndex! / 2))
  }, [])

  const onOut = useCallback(() => setHover(null), [])

  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (ref.current) {
      const { x, y, z } = ref.current.translation()
      const dir = [
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1],
      ]
      // @ts-ignore
      addCube(...dir[Math.floor(e.faceIndex! / 2)])
    }
  }, [addCube])

  return (
    <RigidBody {...props} type="fixed" colliders="cuboid" ref={ref}>
      <mesh receiveShadow castShadow onPointerMove={onMove} onPointerOut={onOut} onClick={onClick}>
        {[...Array(6)].map((_, index) => (
          <meshStandardMaterial
            attach={`material-${index}`}
            key={index}
            map={texture}
            color={hover === index ? "hotpink" : "white"}
          />
        ))}
        <boxGeometry />
      </mesh>
    </RigidBody>
  )
}
