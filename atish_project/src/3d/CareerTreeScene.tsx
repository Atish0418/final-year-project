import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Line, Html } from "@react-three/drei";
import NodePoint from "./components/NodePoint";
import Particles from "./components/Particles";
import { streams } from "../data/streams";
import { Timer, PCFShadowMap } from "three";

type CareerTreeSceneProps = {
  onSelect: (streamId: string | null) => void;
  selected: string | null;
  simpleMode?: boolean;
  autoRotate?: boolean;
};

const rootPosition: [number, number, number] = [0, 0, 0];

const CareerTreeScene = ({ onSelect, selected, simpleMode, autoRotate }: CareerTreeSceneProps) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const streamNodes = useMemo(() => {
    const radius = 3.6;
    return streams.map((stream, index) => {
      const angle = (index / streams.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.4 * Math.sin(angle * 1.2);
      return { id: stream.id, label: stream.title, position: [x, y, z] as [number, number, number] };
    });
  }, []);

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 bg-white">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [6, 4, 8], fov: 55 }}
        onCreated={(state) => {
          // Use modern Timer to silence THREE.Clock deprecation warning from r3f defaults.
          // @ts-expect-error override default clock type
          state.clock = new Timer();
          state.gl.shadowMap.enabled = true;
          state.gl.shadowMap.type = PCFShadowMap;
          // Suppress noisy driver shader warnings (e.g. X4122 precision sums) that appear even when shaders are valid.
          // Three exposes a debug flag for this; keep it to false so real compile errors still surface via thrown exceptions.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (state.gl as any).debug.checkShaderErrors = false;
        }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="px-4 py-2 rounded-lg bg-white text-gray-900 shadow border border-gray-200 text-sm">
                Loading 3D scene...
              </div>
            </Html>
          }
        >
          <color attach="background" args={["#f8fafc"]} />
          {!simpleMode && <Environment preset="city" />}
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 6, 5]} intensity={1.2} castShadow />

          {!simpleMode && <Particles />}

          {/* Root node */}
          <NodePoint
            position={rootPosition}
            label="After 12th"
            accent="#7cf0ff"
            active={!selected}
            onClick={() => onSelect(null)}
          />

          {/* Stream nodes + lines */}
          {streamNodes.map((node) => (
            <group key={node.id}>
              <Line
                points={[rootPosition, node.position]}
                color="#94a3b8"
                lineWidth={1}
                dashed={false}
                transparent
                opacity={0.5}
              />
              <NodePoint
                position={node.position}
                label={node.label}
                accent="#a855f7"
                active={selected === node.id}
                onClick={() => onSelect(node.id)}
                onHover={(state) => setHovered(state ? node.id : null)}
              />
            </group>
          ))}
        </Suspense>
        <OrbitControls
          enableDamping
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          target={rootPosition}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />
      {hovered && (
        <div className="pointer-events-none absolute top-3 right-3 text-xs px-2 py-1 rounded bg-white text-gray-900 border border-gray-200 shadow-sm">
          Click to view {hovered}
        </div>
      )}
    </div>
  );
};

export default CareerTreeScene;
