import { Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";

const Particles = () => {
  const positions = useMemo(() => {
    const points = [];
    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 8;
      points.push(x, y, z);
    }
    return new Float32Array(points);
  }, []);

  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#7cf0ff" size={0.02} sizeAttenuation depthWrite={false} />
    </Points>
  );
};

export default Particles;
