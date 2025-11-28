import { Scene } from './components/Scene';
import { UI } from './components/UI';
import './App.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Scene />
      <UI />
    </div>
  );
}

export default App;
