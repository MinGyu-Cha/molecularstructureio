import { useState } from 'react';
import MoleculeViewer from './components/MoleculeViewer';
import './App.css';

function App() {
  const [molecule, setMolecule] = useState('h2o');

  const MOLECULES = [
    { id: 'h2o', name: 'Water (H₂O)' },
    { id: 'ch4', name: 'Methane (CH₄)' },
    { id: 'co2', name: 'Carbon Dioxide (CO₂)' },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Molecule Shape Viewer</h1>
        <select 
          value={molecule} 
          onChange={(e) => setMolecule(e.target.value)}
          aria-label="Select a molecule"
        >
          {MOLECULES.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </header>
      <main className="App-main">
        <MoleculeViewer moleculeId={molecule} />
      </main>
    </div>
  );
}

export default App;
