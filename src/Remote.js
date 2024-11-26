import React from 'react';
import './Remote.css';
import Trackpad from './Trackpad';

const Remote = ({ onDirectionPress, onOKPress, handleGesture }) => {
  return (
    <div className="remote">
      <button className="dpad" onClick={() => onDirectionPress('up')}>▲</button>
      <div className="direction-row">
        <button className="dpad" onClick={() => onDirectionPress('left')}>◀</button>
        <button className="dpad" onClick={onOKPress}>OK</button>
        <button className="dpad" onClick={() => onDirectionPress('right')}>▶</button>
      </div>
      <button className="dpad" onClick={() => onDirectionPress('down')}>▼</button>
      <Trackpad className="trackpad" handleGesture={handleGesture}/>
    </div>
  );
};

export default Remote;
