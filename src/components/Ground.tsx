import React from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { BRICK_SIZE } from './Brick';

export const Ground: React.FC = () => {
  const addBrick = useGameStore((state) => state.addBrick);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Calculate grid position
    // We want to snap to a grid where 1 unit = 1 stud distance
    // The brick is 2x4. Center needs to be offset.
    
    const x = Math.round(e.point.x);
    const z = Math.round(e.point.z);
    
    // Snap to even/odd depending on size to align with studs?
    // Let's try simple rounding first.
    // Since brick width is 2, center is at 0, 2, 4... or 1, 3, 5?
    // If width is 2, it covers -1 to 1. Center is 0.
    // If I move it by 1, it covers 0 to 2. Center is 1.
    // So integer coordinates are fine for the center if we want 1-unit steps.
    
    // However, for the depth of 4. Center is 0. Covers -2 to 2.
    // If I move by 1, center is 1. Covers -1 to 3.
    // So integer coordinates work for 1-unit steps.
    
    // Y position: Ground is at 0. Brick height is 1.2.
    // Center of brick should be at 1.2 / 2 = 0.6.
    
    addBrick([x, BRICK_SIZE.height / 2, z]);
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow onClick={handleClick}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4a4a4a" />
      <gridHelper args={[100, 100, 0x888888, 0x444444]} rotation={[-Math.PI / 2, 0, 0]} />
    </mesh>
  );
};
