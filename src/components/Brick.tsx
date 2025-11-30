import React from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import { Edges, TransformControls } from '@react-three/drei';
import { Group } from 'three';
import { type BrickType, BRICK_DIMENSIONS, BRICK_HEIGHT, type ToolType } from '../store/gameStore';

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
  tool?: ToolType;
  onDraggingChange?: (isDragging: boolean) => void;
  onTransformEnd?: (id: string, position: [number, number, number], rotation: [number, number, number]) => void;
  getStackHeight?: (id: string, type: BrickType, rotation: [number, number, number], x: number, z: number) => number;
};

export const Brick: React.FC<BrickProps> = ({ 
  id,
  type,
  position, 
  rotation,
  color, 
  onClick, 
  onPointerDown,
  onContextMenu,
  selected = false,
  tool = 'move',
  onDraggingChange,
  onTransformEnd,
  getStackHeight
}) => {
  const [hovered, setHover] = React.useState(false);
  const [group, setGroup] = React.useState<Group | null>(null);
  const { width, depth } = BRICK_DIMENSIONS[type];

  return (
    <>
      <group 
        ref={setGroup}
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
            emissive={
              tool === 'delete' && hovered 
                ? '#ff0000' 
                : selected 
                  ? '#444444' 
                  : hovered 
                    ? '#222222' 
                    : 'black'
            }
            emissiveIntensity={tool === 'delete' && hovered ? 0.5 : (selected || hovered ? 0.5 : 0)}
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
          showY={tool === 'rotate'}
          showX={tool === 'move'}
          showZ={tool === 'move'}
          translationSnap={null}
          rotationSnap={Math.PI / 2}
          onMouseDown={() => onDraggingChange?.(true)}
          onMouseUp={() => {
            onDraggingChange?.(false);
            if (onTransformEnd) {
              onTransformEnd(
                id,
                [group.position.x, group.position.y, group.position.z],
                [group.rotation.x, group.rotation.y, group.rotation.z]
              );
            }
          }}
          onObjectChange={() => {
            if (group) {
              const { width, depth } = BRICK_DIMENSIONS[type];
              const rotation = [group.rotation.x, group.rotation.y, group.rotation.z];
              
              // Determine effective dimensions based on rotation
              const rotY = Math.round((rotation[1] / (Math.PI / 2))) % 2;
              const isRotated = Math.abs(rotY) === 1;
              
              const effectiveWidth = isRotated ? depth : width;
              const effectiveDepth = isRotated ? width : depth;

              // Snap X and Z
              const snapX = effectiveWidth % 2 !== 0 
                ? Math.round(group.position.x - 0.5) + 0.5 
                : Math.round(group.position.x);

              const snapZ = effectiveDepth % 2 !== 0 
                ? Math.round(group.position.z - 0.5) + 0.5 
                : Math.round(group.position.z);

              group.position.setX(snapX);
              group.position.setZ(snapZ);

              if (getStackHeight) {
                const newY = getStackHeight(
                  id,
                  type,
                  rotation as [number, number, number],
                  snapX,
                  snapZ
                );
                group.position.setY(newY);
              }
            }
          }}
        />
      )}
    </>
  );
};





