import React from 'react';
import { type ThreeEvent } from '@react-three/fiber';

type GroundProps = {
  onPointerMove?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOut?: (e: ThreeEvent<MouseEvent>) => void;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
};

export const Ground: React.FC<GroundProps> = ({ onPointerMove, onPointerOut, onClick }) => {
  return (
    <>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow 
        onClick={onClick}
        onPointerMove={onPointerMove}
        onPointerOut={onPointerOut}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <gridHelper args={[100, 100, 0x888888, 0x444444]} position={[0, 0.01, 0]} />
    </>
  );
};

