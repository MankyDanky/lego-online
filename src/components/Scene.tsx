import React, { useRef, useState } from 'react';
import { Canvas, type ThreeEvent, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import { useGameStore, BRICK_DIMENSIONS, BRICK_HEIGHT, type BrickType } from '../store/gameStore';
import { Brick } from './Brick';
import { Ground } from './Ground';
import * as THREE from 'three';

const SceneContent: React.FC = () => {
  const bricks = useGameStore((state) => state.bricks);
  const selectedBrickId = useGameStore((state) => state.selectedBrickId);
  const currentTool = useGameStore((state) => state.currentTool);
  const selectBrick = useGameStore((state) => state.selectBrick);
  const updateBrick = useGameStore((state) => state.updateBrick);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitRef = useRef<any>(null);
  const [draggedBrickId, setDraggedBrickId] = useState<string | null>(null);
  const { raycaster, pointer, camera } = useThree();

  const handleBrickClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    
    if (currentTool === 'rotate') {
      const brick = bricks.find(b => b.id === id);
      if (brick) {
        const newRotation: [number, number, number] = [
          brick.rotation[0],
          brick.rotation[1] + Math.PI / 2,
          brick.rotation[2]
        ];
        // Re-calculate position after rotation to ensure correct stacking
        const newPos = calculatePosition(brick.position[0], brick.position[2], brick.type, newRotation, id);
        updateBrick(id, { rotation: newRotation, position: newPos });
      }
    } else {
      selectBrick(id);
    }
  };

  const handleBrickPointerDown = (e: ThreeEvent<MouseEvent>, id: string) => {
    if (currentTool === 'move') {
      e.stopPropagation();
      selectBrick(id);
      setDraggedBrickId(id);
      if (orbitRef.current) orbitRef.current.enabled = false;
    }
  };

  const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectBrick(null);
  };

  const calculatePosition = (x: number, z: number, type: BrickType, rotation: [number, number, number], excludeId: string): [number, number, number] => {
    const { width, depth } = BRICK_DIMENSIONS[type];
    
    // Determine effective dimensions based on rotation
    // Rotation is around Y axis. If rotated 90 deg (PI/2), width and depth swap.
    // We normalize rotation to 0, 90, 180, 270.
    const rotY = Math.round((rotation[1] / (Math.PI / 2))) % 2;
    const isRotated = Math.abs(rotY) === 1;
    
    const effectiveWidth = isRotated ? depth : width;
    const effectiveDepth = isRotated ? width : depth;

    // Snap logic
    // If dimension is Odd (1, 3), center should be at Integer.
    // If dimension is Even (2, 4), center should be at X.5.
    const snapX = effectiveWidth % 2 === 0 
      ? Math.round(x - 0.5) + 0.5 
      : Math.round(x);
      
    const snapZ = effectiveDepth % 2 === 0 
      ? Math.round(z - 0.5) + 0.5 
      : Math.round(z);

    // Calculate Y (Stacking)
    let maxY = 0;
    
    // Check collision with all other bricks
    // We use a slightly smaller bounding box for collision to avoid edge cases
    const margin = 0.05;
    const minX = snapX - effectiveWidth / 2 + margin;
    const maxX = snapX + effectiveWidth / 2 - margin;
    const minZ = snapZ - effectiveDepth / 2 + margin;
    const maxZ = snapZ + effectiveDepth / 2 - margin;

    bricks.forEach(other => {
      if (other.id === excludeId) return;

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
        // Overlap detected
        const topY = other.position[1] + BRICK_HEIGHT; // Assuming all bricks have same height for now
        if (topY > maxY) {
          maxY = topY;
        }
      }
    });

    // Default spawn height is 0.6 (half height) if on ground (maxY=0)
    // If on top of another brick, it's maxY + 0.6
    // Wait, position is center of brick.
    // Ground is at 0. Brick height 1.2. Center at 0.6.
    // If stacking on brick at y=0.6 (top at 1.2), new center is 1.2 + 0.6 = 1.8.
    
    return [snapX, maxY + BRICK_HEIGHT / 2, snapZ];
  };

  const handlePointerMove = () => {
    if (draggedBrickId && currentTool === 'move') {
      // Raycast to infinite plane at y=0
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, target);

      if (target) {
        const brick = bricks.find(b => b.id === draggedBrickId);
        if (brick) {
          const newPos = calculatePosition(target.x, target.z, brick.type, brick.rotation, draggedBrickId);
          updateBrick(draggedBrickId, { position: newPos });
        }
      }
    }
  };

  const handlePointerUp = () => {
    if (draggedBrickId) {
      setDraggedBrickId(null);
      if (orbitRef.current) orbitRef.current.enabled = true;
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Sky sunPosition={[100, 20, 100]} />
      <Stars />
      
      {/* Invisible plane for raycasting across the whole scene */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        visible={false}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[1000, 1000]} />
      </mesh>

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
          isDragging={draggedBrickId === brick.id}
          onClick={(e) => handleBrickClick(e, brick.id)}
          onPointerDown={(e) => handleBrickPointerDown(e, brick.id)}
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
