import React, { useRef } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { useGameStore, BRICK_DIMENSIONS, BRICK_HEIGHT, type BrickType } from '../store/gameStore';
import { Brick } from './Brick';
import { Ground } from './Ground';

const SceneContent: React.FC = () => {
  const bricks = useGameStore((state) => state.bricks);
  const selectedBrickId = useGameStore((state) => state.selectedBrickId);
  const currentTool = useGameStore((state) => state.currentTool);
  const selectBrick = useGameStore((state) => state.selectBrick);
  const updateBrick = useGameStore((state) => state.updateBrick);
  const removeBrick = useGameStore((state) => state.removeBrick);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitRef = useRef<any>(null);

  const handleBrickClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    if (currentTool === 'delete') {
      removeBrick(id);
    } else {
      selectBrick(id);
    }
  };

  const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectBrick(null);
  };

  const getStackHeight = (id: string, type: BrickType, rotation: [number, number, number], x: number, z: number): number => {
    const { width, depth } = BRICK_DIMENSIONS[type];
    
    // Determine effective dimensions based on rotation
    const rotY = Math.round((rotation[1] / (Math.PI / 2))) % 2;
    const isRotated = Math.abs(rotY) === 1;
    
    const effectiveWidth = isRotated ? depth : width;
    const effectiveDepth = isRotated ? width : depth;

    // Calculate Y (Stacking)
    let maxY = 0;
    
    // Check collision with all other bricks
    const margin = 0.05;
    const minX = x - effectiveWidth / 2 + margin;
    const maxX = x + effectiveWidth / 2 - margin;
    const minZ = z - effectiveDepth / 2 + margin;
    const maxZ = z + effectiveDepth / 2 - margin;

    bricks.forEach(other => {
      if (other.id === id) return;

      const { width: ow, depth: od } = BRICK_DIMENSIONS[other.type];
      const oRotY = Math.round((other.rotation[1] / (Math.PI / 2))) % 2;
      const oIsRotated = Math.abs(oRotY) === 1;
      const oEffWidth = oIsRotated ? od : ow;
      const oEffDepth = oIsRotated ? ow : od;

      const oMinX = other.position[0] - oEffWidth / 2;
      const oMaxX = other.position[0] + oEffWidth / 2;
      const oMinZ = other.position[2] - oEffDepth / 2;
      const oMaxZ = other.position[2] + oEffDepth / 2;

      // AABB Collision Check
      if (minX < oMaxX && maxX > oMinX && minZ < oMaxZ && maxZ > oMinZ) {
        const topY = other.position[1] + BRICK_HEIGHT / 2;
        if (topY > maxY) {
          maxY = topY;
        }
      }
    });

    return maxY + BRICK_HEIGHT / 2;
  };

  const handleTransformEnd = (id: string, position: [number, number, number], rotation: [number, number, number]) => {
    const brick = bricks.find(b => b.id === id);
    if (!brick) return;

    const { width, depth } = BRICK_DIMENSIONS[brick.type];
    
    // Determine effective dimensions based on rotation
    const rotY = Math.round((rotation[1] / (Math.PI / 2))) % 2;
    const isRotated = Math.abs(rotY) === 1;
    
    const effectiveWidth = isRotated ? depth : width;
    const effectiveDepth = isRotated ? width : depth;

    // Snap X and Z based on dimensions
    // If dimension is Odd, center should be at X.5
    // If dimension is Even, center should be at X.0
    const snapX = effectiveWidth % 2 !== 0 
      ? Math.round(position[0] - 0.5) + 0.5 
      : Math.round(position[0]);

    const snapZ = effectiveDepth % 2 !== 0 
      ? Math.round(position[2] - 0.5) + 0.5 
      : Math.round(position[2]);

    // Recalculate Y based on new position and rotation
    const newY = getStackHeight(id, brick.type, rotation, snapX, snapZ);

    updateBrick(id, { position: [snapX, newY, snapZ], rotation });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Sky sunPosition={[100, 20, 100]} />
      
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
          onDraggingChange={(isDragging) => {
            if (orbitRef.current) {
              orbitRef.current.enabled = !isDragging;
            }
          }}
          getStackHeight={getStackHeight}
          onTransformEnd={handleTransformEnd}
        />
      ))}
      
      <gridHelper args={[100, 100]} position={[0, 0.01, 0]} />
      <OrbitControls ref={orbitRef} makeDefault maxDistance={50} />
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
