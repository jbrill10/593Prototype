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

    setButtonClickCount(buttonClickCount + 1);
  };

  const handleOKPress = () => {
    const key = keyboardLayout[selectedRow][selectedCol];
    if (key === 'Delete') {
      setInputText(inputText.slice(0, -1));
    } else if (key === 'Space') {
      console.log("SPACE");
      console.log("|", inputText, "|");
      setInputText(inputText + ' ');
    } else if (key == 'Submit') {
      console.log("SUBMIT");
      handleSubmit();
    } else {
      setInputText(inputText + key);
    }
    setButtonClickCount(buttonClickCount + 1); 
  };

  const handleGesture = (gesture) => {
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
    setGestureCount(buttonClickCount + 1);
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
    console.log(inputText);
    alert(`Search Query Submitted: ${inputText} \nTotal buttons pressed: ${buttonClickCount} \nTotal gestures: ${gestureCount} \nTotal actions: ${buttonClickCount + gestureCount}`);
    setButtonClickCount(0);
    setGestureCount(0);
    setInputText('');
  }

  const swipeDoubleClick = () => {
    handleSubmit();
  };
  
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
      <img src={gestures} height="1000" width="1000" style={{'border':0}}/>
      {/* <Trackpad handleGesture={handleGesture}/> */}
    </div>
  );
};

// const Trackpad = ({ handleGesture }) => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStartPosition, setDragStartPosition] = useState({x: null, y: null});
//   const trackpadRef = useRef(null);

//   const handleMouseDown = (e) => {
//     setIsDragging(true);
//     updatePosition(e);
//     const rect = trackpadRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setDragStartPosition(({ x, y }));
//   };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       updatePosition(e);
//     }
//   };

//   const handleMouseUp = () => {
//     if (!isDragging) {
//       return;
//     }
//     setIsDragging(false);
//     interpretSwipe(dragStartPosition, position);
//     setPosition({x: null, y: null});
//     setDragStartPosition({x: null, y: null});
//   };

//   const interpretSwipe = (startPosition, currPosition) => {
//     // console.log
//     const xDifference = currPosition.x - startPosition.x;
//     const yDifference = currPosition.y - startPosition.y;

//     // handle single click
//     if (Math.abs(xDifference) + Math.abs(yDifference) < 1){
//       console.log("CLICK");
//       handleGesture('click');
//       return;
//     }

//     if (Math.abs(xDifference) > Math.abs(yDifference)){
//       console.log("HORIZONTASL");
//       // more horizontal movement so this is a left-right swipe
//       if(xDifference > 0){
//         //right swipe
//         console.log("RIGHT");
//         handleGesture('swipe-right')
//       } else {
//         //left swipe
//         console.log("LEFT");
//         handleGesture('swipe-left')
//       }
//       // handleGesture('')
//     } else {
//       console.log("NIOT HORIZNOATION");
//       // up-down swipe
//       if (yDifference > 0){
//         // down swipe
//         console.log("DOWN");
//         handleGesture('swipe-down');
//       } else {
//         console.log("UP");
//         // up swipe
//         handleGesture('swipe-up');
//       }
//     }
//   }

//   const updatePosition = (e) => {
//     const rect = trackpadRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setPosition({ x, y });
//   };

//   return (
//     <div
//       className="trackpad"
//       ref={trackpadRef}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//       onDoubleClick={() => handleGesture('double-click')}
//     >
//       <div
//         className="cursor"
//         style={{ top: `${position.y}px`, left: `${position.x}px` }}
//       />
//     </div>
//   );
// };

export default App;
