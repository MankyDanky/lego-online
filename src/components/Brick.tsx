import React from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import { Edges, TransformControls } from '@react-three/drei';
import { Group } from 'three';
import { type BrickType, type ToolType } from '../store/gameStore';

type BrickProps = {
  id: string;
  type: BrickType;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (e: ThreeEvent<MouseEvent>) => void;
  selected?: boolean;
  tool?: ToolType;
  onTransformChange?: (id: string, position: [number, number, number], rotation: [number, number, number]) => void;
  onDraggingChange?: (isDragging: boolean) => void;
};

const BRICK_DIMENSIONS: Record<BrickType, { width: number; depth: number }> = {
  '1x1': { width: 1, depth: 1 },
  '1x2': { width: 1, depth: 2 },
  '1x4': { width: 1, depth: 4 },
  '2x2': { width: 2, depth: 2 },
  '2x4': { width: 2, depth: 4 },
};

const BRICK_HEIGHT = 1.2;

export const Brick: React.FC<BrickProps> = ({ 
  id,
  type,
  position, 
  rotation,
  color, 
  onClick, 
  onContextMenu,
  selected = false,
  tool = 'move',
  onTransformChange,
  onDraggingChange
}) => {
  const [hovered, setHover] = React.useState(false);
  const [group, setGroup] = React.useState<Group | null>(null);
  const { width, depth } = BRICK_DIMENSIONS[type];

  const handleTransformChange = () => {
    if (group && onTransformChange) {
      const { position, rotation } = group;
      onTransformChange(
        id,
        [position.x, position.y, position.z],
        [rotation.x, rotation.y, rotation.z]
      );
    }
  };

  return (
    <>
      <group 
        ref={setGroup} 
        position={position} 
        rotation={rotation}
        onClick={onClick}
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
              <meshStandardMaterial color={color} />
            </mesh>
          ))
        )}
      </group>

      {selected && group && (
        <TransformControls
          object={group}
          mode={tool === 'move' ? 'translate' : 'rotate'}
          onMouseDown={() => onDraggingChange?.(true)}
          onMouseUp={() => {
            onDraggingChange?.(false);
            handleTransformChange();
          }}
          translationSnap={null}
          rotationSnap={null}
        />
      )}
    </>
  );
};





