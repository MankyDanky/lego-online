# Lego Online

A 3D brick building application built with React, Three.js, and TypeScript.

## Previews
![Heart in Lego](/previews/heart.png)

## Features

- **3D Building Environment**: Place and manipulate bricks in a 3D space.
- **Brick Variety**: Support for multiple brick sizes including 1x1, 1x2, 1x3, 1x4, 1x6, 1x8, 2x2, 2x3, 2x4, 2x6, and 2x8.
- **Tools**:
  - **Move**: Position bricks precisely on the grid.
  - **Rotate**: Rotate bricks 90 degrees.
  - **Delete**: Remove unwanted bricks.
- **Smart Stacking**: Bricks automatically snap to the grid and stack on top of each other.
- **Color Customization**: Choose any color for your bricks using the color picker.
- **Save & Load**: Save your creations to a JSON file and load them back later to continue building.
- **Orbit Controls**: Rotate, zoom (limited), and pan around your creation.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **3D Library**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Styling**: Inline styles with a glassmorphism aesthetic.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MankyDanky/lego-online.git
   cd lego-online
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Controls

- **Left Click**: Select a brick or place a new brick (if one is selected/spawned).
- **Right Click / Drag**: Rotate the camera.
- **Scroll**: Zoom in/out (clamped to keep you in the scene).
- **UI Controls**:
  - Select a brick type from the bottom bar to spawn it.
  - Use the top-left tools to Move, Rotate, or Delete bricks.
  - Change the color using the bottom-left color picker.
  - Save or Load your project using the bottom-right buttons.

## License

MIT
