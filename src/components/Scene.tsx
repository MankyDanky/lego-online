import React, { useState } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { Brick } from './Brick';
import { Ground } from './Ground';
import { calculateBrickPosition, checkCollision } from '../utils/grid';

const SceneContent: React.FC = () => {
  const bricks = useGameStore((state) => state.bricks);
  const addBrick = useGameStore((state) => state.addBrick);
  const removeBrick = useGameStore((state) => state.removeBrick);
  const selectedColor = useGameStore((state) => state.selectedColor);
  
  const [previewPos, setPreviewPos] = useState<[number, number, number] | null>(null);
  const [isPlacementValid, setIsPlacementValid] = useState(true);

  const handlePointerMove = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const pos = calculateBrickPosition(e);
    if (pos) {
      const collision = checkCollision(pos, bricks);
      setIsPlacementValid(!collision);
      setPreviewPos(pos);
    } else {
      setPreviewPos(null);
    }
  };

  const handlePointerOut = () => {
    setPreviewPos(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.altKey) return;

    const pos = calculateBrickPosition(e);
    if (pos && !checkCollision(pos, bricks)) {
      addBrick(pos);
    }
  };

  const handleBrickClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    if (e.altKey) {
      removeBrick(id);
      setPreviewPos(null);
      return;
    }
    
    const pos = calculateBrickPosition(e);
    if (pos && !checkCollision(pos, bricks)) {
      addBrick(pos);
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Sky sunPosition={[100, 20, 100]} />
      <Stars />
      
      <Ground 
        onPointerMove={handlePointerMove} 
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      
      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          position={brick.position}
          color={brick.color}
          onClick={(e) => handleBrickClick(e, brick.id)}
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
        />
      ))}

      {previewPos && (
        <Brick
          position={previewPos}
          color={isPlacementValid ? selectedColor : '#ff0000'}
          transparent
          opacity={0.5}
        />
      )}
      
      <OrbitControls makeDefault />
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
