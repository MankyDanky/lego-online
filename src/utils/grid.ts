import { type ThreeEvent } from '@react-three/fiber';
import { Vector3 } from 'three';

export const BRICK_SIZE = {
  width: 2,
  height: 1.2,
  depth: 4
};

export const checkCollision = (position: [number, number, number], bricks: { position: [number, number, number] }[]) => {
  const newBrickMin = {
    x: position[0] - BRICK_SIZE.width / 2 + 0.05,
    y: position[1] - BRICK_SIZE.height / 2 + 0.05,
    z: position[2] - BRICK_SIZE.depth / 2 + 0.05,
  };
  const newBrickMax = {
    x: position[0] + BRICK_SIZE.width / 2 - 0.05,
    y: position[1] + BRICK_SIZE.height / 2 - 0.05,
    z: position[2] + BRICK_SIZE.depth / 2 - 0.05,
  };

  return bricks.some((b) => {
    const bMin = {
      x: b.position[0] - BRICK_SIZE.width / 2,
      y: b.position[1] - BRICK_SIZE.height / 2,
      z: b.position[2] - BRICK_SIZE.depth / 2,
    };
    const bMax = {
      x: b.position[0] + BRICK_SIZE.width / 2,
      y: b.position[1] + BRICK_SIZE.height / 2,
      z: b.position[2] + BRICK_SIZE.depth / 2,
    };

    return (
      newBrickMin.x < bMax.x &&
      newBrickMax.x > bMin.x &&
      newBrickMin.y < bMax.y &&
      newBrickMax.y > bMin.y &&
      newBrickMin.z < bMax.z &&
      newBrickMax.z > bMin.z
    );
  });
};

export const snapToGrid = (position: Vector3): [number, number, number] => {
  const x = Math.round(position.x);
  const z = Math.round(position.z);
  const y = 0.6 + Math.round((position.y - 0.6) / 1.2) * 1.2;
  return [x, y, z];
};

export const calculateBrickPosition = (e: ThreeEvent<MouseEvent>): [number, number, number] | null => {
  if (!e.face) return null;

  const point = e.point;
  const normal = e.face.normal.clone();
  
  // Transform normal to world space
  normal.transformDirection(e.object.matrixWorld);
  
  // Add a small offset in the direction of the normal to ensure we snap to the "next" cell
  const targetPosition = point.clone().add(normal.multiplyScalar(0.1));
  
  return snapToGrid(targetPosition);
};
