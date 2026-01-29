import React from 'react';

const MoleculeViewer = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <title>Stylized Molecule</title>
        {/* Bonds */}
        <line x1="50" y1="50" x2="30" y2="40" stroke="black" strokeWidth="1" />
        <line x1="50" y1="50" x2="60" y2="30" stroke="black" strokeWidth="1" />
        <line x1="50" y1="50" x2="70" y2="60" stroke="black" strokeWidth="1" />
        <line x1="30" y1="40" x2="15" y2="55" stroke="black" strokeWidth="1" />
        <line x1="70" y1="60" x2="60" y2="80" stroke="black" strokeWidth="1" />
        <line x1="70" y1="60" x2="90" y2="55" stroke="black" strokeWidth="1" />
        
        {/* Atoms */}
        <circle cx="50" cy="50" r="5" fill="red" />
        <circle cx="30" cy="40" r="4" fill="blue" />
        <circle cx="60" cy="30" r="4" fill="blue" />
        <circle cx="70" cy="60" r="5" fill="red" />
        <circle cx="15" cy="55" r="4" fill="green" />
        <circle cx="60" cy="80" r="4" fill="green" />
        <circle cx="90" cy="55" r="4" fill="blue" />
      </svg>
    </div>
  );
};

export default MoleculeViewer;
