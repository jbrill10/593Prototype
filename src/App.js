import React, { useState } from 'react';
import Remote from './Remote';
import VirtualKeyboard from './VirtualKeyboard';
import './App.css';

const keyboardLayout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['Space', 'Delete']
];

const App = () => {
  const [inputText, setInputText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);

  const handleDirectionPress = (direction) => {
    if (direction === 'up' && selectedRow > 0) setSelectedRow(selectedRow - 1);
    if (direction === 'down' && selectedRow < keyboardLayout.length - 1) setSelectedRow(selectedRow + 1);
    if (direction === 'left' && selectedCol > 0) setSelectedCol(selectedCol - 1);
    if (direction === 'right' && selectedCol < keyboardLayout[selectedRow].length - 1) setSelectedCol(selectedCol + 1);
  };

  const handleOKPress = () => {
    const key = keyboardLayout[selectedRow][selectedCol];
    if (key === 'Delete') {
      setInputText(inputText.slice(0, -1));
    } else if (key === 'Space') {
      setInputText(inputText + ' ');
    } else {
      setInputText(inputText + key);
    }
  };

  return (
    <div className="app">
      <h1>TV Remote Prototype</h1>
      <VirtualKeyboard 
        text={inputText} 
        selectedRow={selectedRow} 
        selectedCol={selectedCol} 
        layout={keyboardLayout} 
      />
      <Remote 
        onDirectionPress={handleDirectionPress} 
        onOKPress={handleOKPress} 
      />
    </div>
  );
};

export default App;
