import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type BrickType = '2x2' | '2x4' | '1x2' | '1x4' | '1x1';

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
      return {
        bricks: [
          ...state.bricks,
          { 
            id: newId, 
            type, 
            position: [0, 0.6, 0], // Default spawn height
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
