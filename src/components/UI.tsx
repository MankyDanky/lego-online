import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { BrickType } from '../store/gameStore';

const BRICK_TYPES: BrickType[] = [
  '1x1', '1x2', '1x3', '1x4', '1x6', '1x8',
  '2x2', '2x3', '2x4', '2x6', '2x8'
];

export const UI: React.FC = () => {
  const selectedColor = useGameStore((state) => state.selectedColor);
  const currentTool = useGameStore((state) => state.currentTool);
  const setColor = useGameStore((state) => state.setColor);
  const setTool = useGameStore((state) => state.setTool);
  const addBrick = useGameStore((state) => state.addBrick);
  const reset = useGameStore((state) => state.reset);
  const bricks = useGameStore((state) => state.bricks);
  const loadGame = useGameStore((state) => state.loadGame);

  const handleSave = () => {
    const json = JSON.stringify(bricks);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lego-build.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const loadedBricks = JSON.parse(content);
        if (Array.isArray(loadedBricks)) {
          loadGame(loadedBricks);
        } else {
          alert('Invalid save file format');
        }
      } catch (error) {
        console.error('Failed to load game', error);
        alert('Invalid save file');
      }
    };
    reader.readAsText(file);
  };

  const containerStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(4px)',
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    gap: '8px',
    pointerEvents: 'auto',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
    textAlign: 'center',
    width: '100%',
  };

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
      padding: '24px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Top Bar: Tools & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pointerEvents: 'none', // Container shouldn't block clicks
      }}>
        <div style={{
          ...containerStyle,
          flexDirection: 'column',
          gap: '8px',
        }}>
          <span style={titleStyle}>Tools</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setTool('move')}
              style={{
                ...buttonStyle,
                background: currentTool === 'move' ? '#2563eb' : '#f3f4f6',
                color: currentTool === 'move' ? 'white' : '#4b5563',
              }}
            >
              Move
            </button>
            <button
              onClick={() => setTool('rotate')}
              style={{
                ...buttonStyle,
                background: currentTool === 'rotate' ? '#2563eb' : '#f3f4f6',
                color: currentTool === 'rotate' ? 'white' : '#4b5563',
              }}
            >
              Rotate
            </button>
            <button
              onClick={() => setTool('delete')}
              style={{
                ...buttonStyle,
                background: currentTool === 'delete' ? '#ef4444' : '#f3f4f6',
                color: currentTool === 'delete' ? 'white' : '#4b5563',
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <div style={{ pointerEvents: 'auto' }}>
          <button
            onClick={reset}
            style={{
              ...buttonStyle,
              background: '#ef4444',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Bottom Left: Color Picker */}
      <div style={{
        ...containerStyle,
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '60px',
        alignItems: 'center'
      }}>
        <span style={titleStyle}>
          Color
        </span>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setColor(e.target.value)}
          style={{
            width: '40px',
            height: '40px',
            padding: '0',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: 'none',
          }}
        />
      </div>

      {/* Bottom Right: Save/Load */}
      <div style={{
        ...containerStyle,
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <span style={titleStyle}>Project</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSave}
            style={{
              ...buttonStyle,
              background: '#10b981',
              color: 'white',
            }}
          >
            Save
          </button>
          <label
            style={{
              ...buttonStyle,
              background: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Load
            <input
              type="file"
              accept=".json"
              onChange={handleLoad}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Bottom Center: Brick Selection */}
      <div style={{
        ...containerStyle,
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <span style={titleStyle}>Bricks</span>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          maxWidth: '30vw' 
        }}>
          {BRICK_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => addBrick(type)}
              style={{
                ...buttonStyle,
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #e5e7eb',
                minWidth: '60px',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

