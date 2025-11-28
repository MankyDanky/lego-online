import React from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { BRICK_SIZE } from '../utils/grid';

type BrickProps = {
  position: [number, number, number];
  color: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerMove?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOut?: (e: ThreeEvent<MouseEvent>) => void;
  transparent?: boolean;
  opacity?: number;
};

export const Brick: React.FC<BrickProps> = ({ 
  position, 
  color, 
  onClick, 
  onContextMenu, 
  onPointerMove,
  onPointerOut,
  transparent = false,
  opacity = 1
}) => {
  const [hovered, setHover] = React.useState(false);

  return (
    <group position={position}>
      {/* Main Body */}
      <mesh
        onClick={onClick}
        onContextMenu={onContextMenu}
        onPointerMove={onPointerMove}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => { 
          e.stopPropagation(); 
          setHover(false); 
          onPointerOut?.(e);
        }}
        castShadow={!transparent}
        receiveShadow={!transparent}
      >
        <boxGeometry args={[BRICK_SIZE.width, BRICK_SIZE.height, BRICK_SIZE.depth]} />
        <meshStandardMaterial 
          color={hovered && !transparent ? '#ffaaaa' : color} 
          emissive={hovered && !transparent ? 'white' : 'black'} 
          emissiveIntensity={hovered && !transparent ? 0.2 : 0}
          transparent={transparent}
          opacity={opacity}
        />
        <Edges color="black" threshold={15} opacity={transparent ? 0.1 : 0.2} transparent />
      </mesh>

      {/* Studs */}
      {Array.from({ length: 2 }).map((_, x) =>
        Array.from({ length: 4 }).map((_, z) => (
          <mesh
            key={`${x}-${z}`}
            position={[
              x * 1 - 0.5, // Distribute across width
              BRICK_SIZE.height / 2 + 0.1, // On top
              z * 1 - 1.5  // Distribute across depth
            ]}
            castShadow={!transparent}
          >
            <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
            <meshStandardMaterial 
              color={color} 
              transparent={transparent}
              opacity={opacity}
            />
          </mesh>
        ))
      )}
    </group>
  );
};

