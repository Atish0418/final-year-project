import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

type NodePointProps = {
  position: [number, number, number];
  label: string;
  accent?: string;
  active?: boolean;
  onClick?: () => void;
  onHover?: (state: boolean) => void;
};

const NodePoint = ({ position, label, accent = "#7CF0FF", active, onClick, onHover }: NodePointProps) => {
  const meshRef = useRef<Mesh>(null);
  const pulse = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t + pulse) * 0.08;
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover?.(false);
        }}
      >
        <sphereGeometry args={[active ? 0.18 : 0.16, 32, 32]} />
        <meshStandardMaterial
          color={active ? accent : "#a5b4fc"}
          emissive={active ? accent : "#3b82f6"}
          emissiveIntensity={active ? 1.6 : 1.0}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      <Html position={[0, 0.35, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2 py-1 rounded-md bg-white/90 text-[11px] leading-tight text-gray-900 border border-gray-200 backdrop-blur whitespace-nowrap shadow-sm font-medium"
        >
          {label}
        </motion.div>
      </Html>
    </group>
  );
};

export default memo(NodePoint);
