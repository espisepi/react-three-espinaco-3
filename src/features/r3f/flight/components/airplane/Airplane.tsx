import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
// @ts-ignore
import airplaneUrl from "../../assets/airplane.glb";

export interface AirplaneProps extends GroupProps {
  url?: string;
}

export const Airplane: React.FC<AirplaneProps> = ({ url = airplaneUrl }) => {
  const gltfResult = useGLTF(url);
  const { nodes, material, scene } = gltfResult;
  console.log({nodes,material,scene})

  return (
    <>
      {/* <Box material-color="red" /> */}
      <primitive object={scene} />
    </>
  );
};
