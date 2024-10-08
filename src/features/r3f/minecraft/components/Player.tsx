import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RigidBody, useRapier, RigidBodyApi } from "@react-three/rapier"
import Axe from "./Axe"

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()

interface PlayerProps {
  lerp?: (a: number, b: number, t: number) => number
}

export function Player({ lerp = THREE.MathUtils.lerp }: PlayerProps): JSX.Element {
  const axe = useRef<THREE.Group>(null)
  const ref = useRef<RigidBodyApi>(null)
  const rapier = useRapier()
  const [, get] = useKeyboardControls()

  useFrame((state) => {
    const { forward, backward, left, right, jump } = get()
    const velocity = ref.current!.linvel()
    
    // update camera
    // @ts-ignore
    state.camera.position.set(...ref.current!.translation())
    
    // update axe
    if (axe.current) {
      axe.current.children[0].rotation.x = lerp(
        axe.current.children[0].rotation.x,
        Math.sin((velocity.length() > 1 ? state.clock.elapsedTime * 10 : 0)) / 6,
        0.1
      )
      axe.current.rotation.copy(state.camera.rotation)
      axe.current.position.copy(state.camera.position).add(state.camera.getWorldDirection(rotation).multiplyScalar(1))
    }

    // movement
    frontVector.set(0, 0, backward - forward)
    sideVector.set(left - right, 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
    ref.current!.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })

    // jumping
    const world = rapier.world.raw()
    // @ts-ignore
    const ray = world.castRay(new RAPIER.Ray(ref.current!.translation(), { x: 0, y: -1, z: 0 }))
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
    if (jump && grounded) ref.current!.setLinvel({ x: 0, y: 7.5, z: 0 })
  })

  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 10, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
      <group ref={axe} onPointerMissed={() => (axe.current!.children[0].rotation.x = -0.5)}>
        <Axe position={[0.3, -0.35, 0.5]} />
      </group>
    </>
  )
}
