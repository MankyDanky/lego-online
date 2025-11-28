import React from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import { Edges } from '@react-three/drei';

type BrickProps = {
  position: [number, number, number];
  color: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (e: ThreeEvent<MouseEvent>) => void;
};

export const BRICK_SIZE = {
  width: 2,
  height: 1.2,
  depth: 4
};

export const Brick: React.FC<BrickProps> = ({ position, color, onClick, onContextMenu }) => {
  const [hovered, setHover] = React.useState(false);

  return (
    <group position={position}>
      {/* Main Body */}
      <mesh
        onClick={onClick}
        onContextMenu={onContextMenu}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[BRICK_SIZE.width, BRICK_SIZE.height, BRICK_SIZE.depth]} />
        <meshStandardMaterial color={color} emissive={hovered ? 'white' : 'black'} emissiveIntensity={hovered ? 0.2 : 0} />
        <Edges color="black" threshold={15} opacity={0.2} transparent />
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
            castShadow
          >
            <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))
      )}
    </group>
  );
};
