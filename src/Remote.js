import React from 'react';
import './Remote.css';

const Remote = ({ onDirectionPress, onOKPress }) => {
  return (
    <div className="remote">
      <button onClick={() => onDirectionPress('up')}>▲</button>
      <div className="direction-row">
        <button onClick={() => onDirectionPress('left')}>◀</button>
        <button onClick={onOKPress}>OK</button>
        <button onClick={() => onDirectionPress('right')}>▶</button>
      </div>
      <button onClick={() => onDirectionPress('down')}>▼</button>
    </div>
  );
};

export default Remote;
