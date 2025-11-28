import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { checkCollision } from '../utils/grid';

export type BrickData = {
  id: string;
  position: [number, number, number];
  color: string;
};

interface GameState {
  bricks: BrickData[];
  selectedColor: string;
  addBrick: (position: [number, number, number]) => void;
  removeBrick: (id: string) => void;
  setColor: (color: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  bricks: [],
  selectedColor: '#cc0000', // Default Lego Red
  addBrick: (position) =>
    set((state) => {
      if (checkCollision(position, state.bricks)) {
        return state;
      }
      
      return {
        bricks: [
          ...state.bricks,
          { id: uuidv4(), position, color: state.selectedColor },
        ],
      };
    }),
  removeBrick: (id) =>
    set((state) => ({
      bricks: state.bricks.filter((brick) => brick.id !== id),
    })),
  setColor: (color) => set({ selectedColor: color }),
  reset: () => set({ bricks: [] }),
}));
