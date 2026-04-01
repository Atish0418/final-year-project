import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type CameraRigProps = {
  target: [number, number, number];
};

const CameraRig = ({ target }: CameraRigProps) => {
  const targetVec = useRef(new THREE.Vector3(...target));

  useFrame(({ camera }) => {
    camera.position.lerp(new THREE.Vector3(4, 3, 6), 0.05);
    camera.lookAt(targetVec.current);
  });

  return null;
};

export default CameraRig;
