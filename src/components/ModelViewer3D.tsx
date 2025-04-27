
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface ModelViewer3DProps {
  modelUrl?: string;
}

const DefaultModel: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"#33c3f0"} />
    </mesh>
  );
};

const ModelViewer3D: React.FC<ModelViewer3DProps> = ({ modelUrl }) => {
  return (
    <div className="w-full h-96 bg-black/30 rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <DefaultModel />
          <OrbitControls enableZoom={true} />
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer3D;
