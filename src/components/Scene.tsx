import React, { useRef } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { Brick } from './Brick';
import { Ground } from './Ground';

const SceneContent: React.FC = () => {
  const bricks = useGameStore((state) => state.bricks);
  const selectedBrickId = useGameStore((state) => state.selectedBrickId);
  const currentTool = useGameStore((state) => state.currentTool);
  const selectBrick = useGameStore((state) => state.selectBrick);
  const updateBrick = useGameStore((state) => state.updateBrick);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitRef = useRef<any>(null);

  const handleBrickClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    selectBrick(id);
  };

  const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectBrick(null);
  };

  const handleTransformChange = (id: string, position: [number, number, number], rotation: [number, number, number]) => {
    updateBrick(id, { position, rotation });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Sky sunPosition={[100, 20, 100]} />
      <Stars />
      
      <Ground onClick={handleGroundClick} />
      
      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          id={brick.id}
          type={brick.type}
          position={brick.position}
          rotation={brick.rotation}
          color={brick.color}
          selected={selectedBrickId === brick.id}
          tool={currentTool}
          onClick={(e) => handleBrickClick(e, brick.id)}
          onTransformChange={handleTransformChange}
          onDraggingChange={(isDragging) => {
            if (orbitRef.current) {
              orbitRef.current.enabled = !isDragging;
            }
          }}
        />
      ))}
      
      <gridHelper args={[100, 100]} position={[0, 0.01, 0]} />
      <OrbitControls ref={orbitRef} makeDefault />
    </>
  );
};

export const Scene: React.FC = () => {
  return (
    <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
      <SceneContent />
    </Canvas>
  );
};
