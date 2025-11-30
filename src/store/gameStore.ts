import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type BrickType = '1x1' | '1x2' | '1x3' | '1x4' | '1x6' | '1x8' | '2x2' | '2x3' | '2x4' | '2x6' | '2x8';

export const BRICK_DIMENSIONS: Record<BrickType, { width: number; depth: number }> = {
  '1x1': { width: 1, depth: 1 },
  '1x2': { width: 1, depth: 2 },
  '1x3': { width: 1, depth: 3 },
  '1x4': { width: 1, depth: 4 },
  '1x6': { width: 1, depth: 6 },
  '1x8': { width: 1, depth: 8 },
  '2x2': { width: 2, depth: 2 },
  '2x3': { width: 2, depth: 3 },
  '2x4': { width: 2, depth: 4 },
  '2x6': { width: 2, depth: 6 },
  '2x8': { width: 2, depth: 8 },
};

export const BRICK_HEIGHT = 1.2;

export type BrickData = {
  id: string;
  type: BrickType;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

export type ToolType = 'move' | 'rotate' | 'delete';

interface GameState {
  bricks: BrickData[];
  selectedBrickId: string | null;
  currentTool: ToolType;
  selectedColor: string;
  
  addBrick: (type: BrickType) => void;
  updateBrick: (id: string, data: Partial<BrickData>) => void;
  removeBrick: (id: string) => void;
  selectBrick: (id: string | null) => void;
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  reset: () => void;
  loadGame: (bricks: BrickData[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  bricks: [],
  selectedBrickId: null,
  currentTool: 'move',
  selectedColor: '#cc0000', // Default Lego Red
  
  addBrick: (type) =>
    set((state) => {
      const newId = uuidv4();
      const { width, depth } = BRICK_DIMENSIONS[type];
      // Snap logic: Odd dimensions -> 0.5, Even dimensions -> 0
      const x = width % 2 !== 0 ? 0.5 : 0;
      const z = depth % 2 !== 0 ? 0.5 : 0;
      
      // Calculate spawn height based on collisions
      let maxY = 0;
      const margin = 0.05;
      const minX = x - width / 2 + margin;
      const maxX = x + width / 2 - margin;
      const minZ = z - depth / 2 + margin;
      const maxZ = z + depth / 2 - margin;

      state.bricks.forEach((other) => {
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

      const spawnY = maxY + BRICK_HEIGHT / 2;

      return {
        bricks: [
          ...state.bricks,
          { 
            id: newId, 
            type, 
            position: [x, spawnY, z], 
            rotation: [0, 0, 0],
            color: state.selectedColor 
          },
        ],
        selectedBrickId: newId, // Auto-select new brick
        currentTool: 'move' // Auto-switch to move tool
      };
    }),
    
  updateBrick: (id, data) =>
    set((state) => ({
      bricks: state.bricks.map((brick) =>
        brick.id === id ? { ...brick, ...data } : brick
      ),
    })),
    
  removeBrick: (id) =>
    set((state) => ({
      bricks: state.bricks.filter((brick) => brick.id !== id),
      selectedBrickId: state.selectedBrickId === id ? null : state.selectedBrickId,
    })),
    
  selectBrick: (id) => set({ selectedBrickId: id }),
  
  setTool: (tool) => set({ currentTool: tool }),
  
  setColor: (color) => set({ selectedColor: color }),
  
  reset: () => set({ bricks: [], selectedBrickId: null }),

  loadGame: (bricks) => set({ bricks, selectedBrickId: null }),
}));
