import React from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { Brick, BRICK_SIZE } from './Brick';
import { Ground } from './Ground';

const SceneContent: React.FC = () => {
  const bricks = useGameStore((state) => state.bricks);
  const addBrick = useGameStore((state) => state.addBrick);
  const removeBrick = useGameStore((state) => state.removeBrick);

  const handleBrickClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    if (e.altKey) {
      removeBrick(id);
      return;
    }

    // Add a new brick on top of the clicked face
    // e.face.normal gives the normal vector of the clicked face in local space?
    // Actually usually it's world space or we can use the point.
    
    // Simple stacking logic:
    // If we click the top, add to Y.
    // We need to know which face was clicked.
    
    if (!e.face) return;

    const { x, y, z } = e.object.position;
    const normal = e.face.normal;
    
    // We need to account for the object's rotation if we add that later.
    // For now, rotation is 0.
    
    // Normal is likely in local space if the object is rotated? 
    // But here object is not rotated.
    
    // If normal.y > 0.5, it's the top face.
    // New position = old position + normal * brick_dimensions?
    // Not exactly, because bricks might have different sizes.
    // But here all bricks are same size.
    
    // If I click top (normal = [0, 1, 0]):
    // new Y = old Y + height
    
    // If I click side (normal = [1, 0, 0]):
    // new X = old X + width? No, width is 2.
    // If I click the side of a 2-wide brick, I want to place another 2-wide brick next to it.
    // So yes, shift by width.
    
    // However, we need to be careful about "snapping".
    // The click point `e.point` is more reliable for determining where to place if we want to support offset stacking.
    // But for simple stacking:
    
    const newPos: [number, number, number] = [
      x + normal.x * (Math.abs(normal.x) > 0.5 ? BRICK_SIZE.width : 0),
      y + normal.y * (Math.abs(normal.y) > 0.5 ? BRICK_SIZE.height : 0),
      z + normal.z * (Math.abs(normal.z) > 0.5 ? BRICK_SIZE.depth : 0),
    ];
    
    // Wait, if I click the side (normal x=1), I want to place it adjacent.
    // The center distance is exactly the width (2).
    // So yes, adding normal * dimension works for same-sized bricks.
    
    addBrick(newPos);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Sky sunPosition={[100, 20, 100]} />
      <Stars />
      
      <Ground />
      
      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          position={brick.position}
          color={brick.color}
          onClick={(e) => handleBrickClick(e, brick.id)}
        />
      ))}
      
      <gridHelper args={[100, 100]} position={[0, 0.01, 0]} />
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
