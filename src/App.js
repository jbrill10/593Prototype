import React, { useRef, useState } from 'react';
import Remote from './Remote';
import VirtualKeyboard from './VirtualKeyboard';
import './App.css';
import gestures from './gestures.png'

const keyboardLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Delete'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', 'Submit'],
  ['Space']
];

const App = () => {
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const [gestureCount, setGestureCount] = useState(0);
  const [inputText, setInputText] = useState('');
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [prevGesture, setPrevGesture] = useState([null, null, null]);  // e.g. ("swipeLeft", "prevChar" if down, prevCol if swipeLeft/swipeRight)

  const handleDirectionPress = (direction) => {
    if (direction === 'up' && selectedRow > 0) {
      const targetRow = selectedRow - 1;
      setSelectedRow(targetRow);
      setSelectedCol(Math.min(selectedCol, keyboardLayout[targetRow].length - 1));
    }
    if (direction === 'down' && selectedRow < keyboardLayout.length - 1) {
      const targetRow = selectedRow + 1;
      setSelectedRow(targetRow);
      setSelectedCol(Math.min(selectedCol, keyboardLayout[targetRow].length - 1));
    }
    if (direction === 'left' && selectedCol > 0) setSelectedCol(selectedCol - 1);
    if (direction === 'right' && selectedCol < keyboardLayout[selectedRow].length - 1) setSelectedCol(selectedCol + 1);
    console.log("BUTTON CLICK DIRECTION: ", buttonClickCount);
    setButtonClickCount((prevClicks) => prevClicks + 1);
  };

  const handleOKPress = () => {
    const key = keyboardLayout[selectedRow][selectedCol];
    if (key === 'Delete') {
      setInputText(inputText.slice(0, -1));
      setButtonClickCount((prevClicks) => prevClicks + 1);
    } else if (key === 'Space') {
      setInputText(inputText + ' ');
      setButtonClickCount((prevClicks) => prevClicks + 1);
    } else if (key === 'Submit') {
      setButtonClickCount((prevClicks) => prevClicks + 1);
      handleSubmit();
    } else {
      setInputText(inputText + key);
      setButtonClickCount((prevClicks) => prevClicks + 1);
    }
  };

  const handleGesture = (gesture) => {
    if (gesture) {
      setGestureCount((prevCount) => prevCount + 1);
      console.log("GESTURE: ", gesture, " COUNT: ", gestureCount);
      
      switch (gesture) {
        case 'swipe-left':
          swipeLeft();
          break;
        case 'swipe-right':
          swipeRight();
          break;
        case 'swipe-up':
          swipeUp();
          break;
        case 'swipe-down':
          swipeDown();
          break;
        case 'click':
          swipeClick();
          break;
        case 'double-click':
          swipeDoubleClick();
          break;
      }
    }
  };

  const swipeLeft = () => {
    setPrevGesture(["swipeLeft", null, selectedCol]);
    const targetCol = 0;
    setSelectedCol(targetCol);
  };

  const swipeRight = () => {
    setPrevGesture(["swipeRight", null, selectedCol]);
    console.log(prevGesture);
    const targetCol = keyboardLayout[selectedRow].length - 1;
    setSelectedCol(targetCol);
  };

  const swipeUp = () => {
    // undo gesture
    console.log(prevGesture);
    if (prevGesture[0] == null) return;
    if (prevGesture[0] == "swipeLeft") {
      setSelectedCol(prevGesture[2]);
    } else if (prevGesture[0] == "swipeRight") {
      setSelectedCol(prevGesture[2]);
    } else if (prevGesture[0] == "swipeDown") {
      setInputText((inputText) => inputText + prevGesture[1]);
    } else if (prevGesture[0] == "swipeUp") {
      // do nothing
    } else {
      console.log("Unknown gesture: %s", prevGesture[0]);
    }
    setPrevGesture(["swipeUp", null, null]);
  };

  const swipeDown = () => {
    // backspace
    if (inputText == ''){
      return;
    }
    setPrevGesture(["swipeDown", inputText[inputText.length - 1], null]);
    setInputText((inputText) => inputText.slice(0, -1));
  };
  
  const swipeClick = () => {
    setPrevGesture(["swipeClick", null, null]);
    setInputText((inputText) => inputText + ' ');
  };

  const handleSubmit = () => {
    alert(`Search Query Submitted: ${inputText} \nTotal buttons pressed: ${buttonClickCount} \nTotal gestures: ${gestureCount} \nTotal actions: ${buttonClickCount + gestureCount}`);
    reset();
  }

  const swipeDoubleClick = () => {
    handleSubmit();
  };

  const reset = () => {
    setButtonClickCount(() => 0);
    setGestureCount(() => 0);
    setInputText(() => '');
    setPrevGesture(() => [null, null, null]);
  }

  const startTask2 = () => {
    reset();
    setInputText('JQMES BOND');
  }
  
  return (
    <div className="app">
      <h1 style={{ textAlign: 'center' }}>TV Remote Prototype</h1>
      <VirtualKeyboard
        text={inputText}
        selectedRow={selectedRow}
        selectedCol={selectedCol}
        layout={keyboardLayout}
      />
      
      <Remote
        onDirectionPress={handleDirectionPress}
        onOKPress={handleOKPress}
        handleGesture={handleGesture}
      />
      <img src={gestures} height="264" width="920"/>
      <div style={{textAlign:'center'}}>
        <button onClick={startTask2} style={{width:200, height:100}}>Start Task 2</button>
      </div>
      {/* <Trackpad handleGesture={handleGesture}/> */}
    </div>
  );
};

export default App;
