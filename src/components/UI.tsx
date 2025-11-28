import React from 'react';
import { useGameStore } from '../store/gameStore';

const COLORS = [
  '#cc0000', // Red
  '#0055bf', // Blue
  '#237841', // Green
  '#f2cd37', // Yellow
  '#ffffff', // White
  '#05131d', // Black
  '#9ba19d', // Light Grey
];

export const UI: React.FC = () => {
  const selectedColor = useGameStore((state) => state.selectedColor);
  const setColor = useGameStore((state) => state.setColor);
  const reset = useGameStore((state) => state.reset);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        pointerEvents: 'auto',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '15px',
        borderRadius: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {COLORS.map((color) => (
            <div
              key={color}
              onClick={() => setColor(color)}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: color,
                borderRadius: '50%',
                cursor: 'pointer',
                border: selectedColor === color ? '3px solid #333' : '2px solid transparent',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          ))}
        </div>
        <div style={{ width: '1px', height: '30px', background: '#ccc', margin: '0 10px' }} />
        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Clear All
        </button>
      </div>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        pointerEvents: 'none'
      }}>
        <p style={{ margin: 0 }}>Click to place brick</p>
        <p style={{ margin: 0 }}>Alt + Click to remove brick</p>
        <p style={{ margin: 0 }}>Drag to rotate view</p>
      </div>
    </div>
  );
};
