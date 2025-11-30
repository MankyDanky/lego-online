import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { BrickType } from '../store/gameStore';

const BRICK_TYPES: BrickType[] = ['1x1', '1x2', '1x4', '2x2', '2x4'];

export const UI: React.FC = () => {
  const selectedColor = useGameStore((state) => state.selectedColor);
  const currentTool = useGameStore((state) => state.currentTool);
  const setColor = useGameStore((state) => state.setColor);
  const setTool = useGameStore((state) => state.setTool);
  const addBrick = useGameStore((state) => state.addBrick);
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
      justifyContent: 'space-between',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Top Bar: Tools & Actions */}
      <div style={{
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          gap: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setTool('move')}
            style={{
              padding: '8px 16px',
              background: currentTool === 'move' ? '#0055bf' : '#eee',
              color: currentTool === 'move' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Move
          </button>
          <button
            onClick={() => setTool('rotate')}
            style={{
              padding: '8px 16px',
              background: currentTool === 'rotate' ? '#0055bf' : '#eee',
              color: currentTool === 'rotate' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Rotate
          </button>
          <button
            onClick={() => setTool('delete')}
            style={{
              padding: '8px 16px',
              background: currentTool === 'delete' ? '#0055bf' : '#eee',
              color: currentTool === 'delete' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Delete
          </button>
        </div>

        <button
          onClick={reset}
          style={{
            pointerEvents: 'auto',
            padding: '8px 16px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          Clear All
        </button>
      </div>

      {/* Bottom Left: Color Picker */}
      <div style={{
        pointerEvents: 'auto',
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#333' }}>Color</span>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setColor(e.target.value)}
          style={{
            width: '40px',
            height: '40px',
            padding: '0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'none'
          }}
        />
      </div>

      {/* Bottom Center: Brick Selection */}
      <div style={{
        pointerEvents: 'auto',
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '15px',
        borderRadius: '10px',
        display: 'flex',
        gap: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {BRICK_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => addBrick(type)}
            style={{
              padding: '10px 20px',
              background: '#eee',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              minWidth: '60px'
            }}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

