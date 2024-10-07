import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier"
import grass from "../../../../assets/grass.jpg"
// import { MeshProps } from "@react-three/fiber"

export function Ground(props: RigidBodyProps): JSX.Element {
  const texture = useTexture(grass) as THREE.Texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  
  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial map={texture} map-repeat={[240, 240]} color="green" />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  )
}
