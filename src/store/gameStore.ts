import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type BrickType = '2x2' | '2x4' | '1x2' | '1x4' | '1x1';

export const BRICK_DIMENSIONS: Record<BrickType, { width: number; depth: number }> = {
  '1x1': { width: 1, depth: 1 },
  '1x2': { width: 1, depth: 2 },
  '1x4': { width: 1, depth: 4 },
  '2x2': { width: 2, depth: 2 },
  '2x4': { width: 2, depth: 4 },
};

export const BRICK_HEIGHT = 1.2;

export type BrickData = {
  id: string;
  type: BrickType;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

export type ToolType = 'move' | 'rotate';

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
      
      return {
        bricks: [
          ...state.bricks,
          { 
            id: newId, 
            type, 
            position: [x, 0.6, z], // Default spawn height
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
}));
