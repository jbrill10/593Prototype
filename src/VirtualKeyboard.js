import React from 'react';
import './VirtualKeyboard.css';

const VirtualKeyboard = ({ text, selectedRow, selectedCol, layout }) => {
  return (
    <div className="virtual-keyboard">
      <div className="text-display">{text}</div>
      <div className="keyboard-layout">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key, colIndex) => (
              
              <span 
                key={colIndex} 
                className={key !== 'Space' ? 
                `keyboard-key ${rowIndex === selectedRow && colIndex === selectedCol ? 'selected' : ''}` : 
                `keyboard-key keyboard-space ${rowIndex === selectedRow && colIndex === selectedCol ? 'selected' : ''}`
              }
              >
                {key}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
