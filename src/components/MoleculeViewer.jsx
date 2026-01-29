import React from 'react';

const MoleculeViewer = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ffffff'
    }}>
      <svg width="300" height="300" viewBox="0 0 82.051 85.079" xmlns="http://www.w3.org/2000/svg">
        <title>Caffeine Molecule</title>
        <path d="M 41.026,0 L 41.026,11.344" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,0 L 29.682,5.672" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,0 L 52.37,5.672" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,34.032 L 29.682,28.36 L 29.682,17.016 L 41.026,11.344 L 52.37,17.016 L 52.37,28.36 L 41.026,34.032 Z" fill="none" stroke="#000000" strokeWidth="2"/>
        <path d="M 52.37,28.36 L 63.714,34.032" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 63.714,34.032 L 63.714,45.376" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 63.714,45.376 L 52.37,51.048" fill="none" stroke="#000000" strokeWidth="2"/>
        <path d="M 52.37,51.048 L 41.026,45.376" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,45.376 L 41.026,34.032" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 29.682,28.36 L 18.338,34.032" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,45.376 L 29.682,51.048" fill="none" stroke="#000000" strokeWidth="2"/>
        <path d="M 29.682,51.048 L 29.682,62.392" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 29.682,62.392 L 41.026,68.064" fill="none" stroke="#000000" strokeWidth="2"/>
        <path d="M 41.026,68.064 L 52.37,62.392" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 52.37,62.392 L 52.37,51.048" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 29.682,51.048 L 18.338,56.72" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,68.064 L 41.026,79.408" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,79.408 L 35.354,85.079" fill="none" stroke="#000000" strokeWidth="1"/>
        <path d="M 41.026,79.408 L 46.698,85.079" fill="none" stroke="#000000" strokeWidth="1"/>
        <text x="64.214" y="56.424" fill="#000000" fontSize="10" fontFamily="sans-serif">N</text>
        <text x="18.838" y="45.376" fill="#000000" fontSize="10" fontFamily="sans-serif">O</text>
        <text x="9.338" y="68.064" fill="#000000" fontSize="10" fontFamily="sans-serif">O</text>
        <text x="52.87" y="73.408" fill="#000000" fontSize="10" fontFamily="sans-serif">N</text>
        <text x="18.838" y="28.36" fill="#000000" fontSize="10" fontFamily="sans-serif">N</text>
      </svg>
    </div>
  );
};

export default MoleculeViewer;
