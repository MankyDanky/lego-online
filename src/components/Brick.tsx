import React from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { type BrickType, BRICK_DIMENSIONS, BRICK_HEIGHT } from '../store/gameStore';

type BrickProps = {
  id: string;
  type: BrickType;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerDown?: (e: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (e: ThreeEvent<MouseEvent>) => void;
  selected?: boolean;
  isDragging?: boolean;
};

export const Brick: React.FC<BrickProps> = ({ 
  type,
  position, 
  rotation,
  color, 
  onClick, 
  onPointerDown,
  onContextMenu,
  selected = false,
  isDragging = false
}) => {
  const [hovered, setHover] = React.useState(false);
  const { width, depth } = BRICK_DIMENSIONS[type];

  return (
    <group 
      position={position} 
      rotation={rotation}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onContextMenu={onContextMenu}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={(e) => { 
        e.stopPropagation(); 
        setHover(false); 
      }}
    >
      {/* Main Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, BRICK_HEIGHT, depth]} />
        <meshStandardMaterial 
          color={color} 
          emissive={selected ? '#444444' : (hovered ? '#222222' : 'black')}
          emissiveIntensity={selected || hovered ? 0.5 : 0}
          transparent={isDragging}
          opacity={isDragging ? 0.5 : 1}
        />
        <Edges color="black" threshold={15} opacity={0.2} transparent />
      </mesh>

      {/* Studs */}
      {Array.from({ length: width }).map((_, x) =>
        Array.from({ length: depth }).map((_, z) => (
          <mesh
            key={`${x}-${z}`}
            position={[
              x * 1 - (width / 2) + 0.5,
              BRICK_HEIGHT / 2 + 0.1,
              z * 1 - (depth / 2) + 0.5
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
            <meshStandardMaterial 
              color={color} 
              transparent={isDragging}
              opacity={isDragging ? 0.5 : 1}
            />
          </mesh>
        ))
      )}
    </group>
  );
};





