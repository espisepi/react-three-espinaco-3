import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Environment, OrbitControls } from "@react-three/drei";
import { Airplane } from "../components/airplane/Airplane";

const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, -5], fov: 60 }}>
      {/* Controls */}
      <OrbitControls />

      {/* Iluminacion */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      {/* Cielo */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />

      {/* Objetos */}
      <Airplane />
    </Canvas>
  );
};

export default Scene;
