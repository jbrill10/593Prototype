import React, { useRef, useState } from 'react';
import './App.css';

const Trackpad = ({ handleGesture }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPosition, setDragStartPosition] = useState({ x: null, y: null });
    const trackpadRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        updatePosition(e);
        const rect = trackpadRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDragStartPosition(({ x, y }));
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            updatePosition(e);
        }
    };

    const handleMouseUp = (event) => {
        if (!isDragging) {
            return;
        }
        if (event.detail === 2){
            return;
        }
        setIsDragging(false);
        interpretSwipe(dragStartPosition, position);
        setPosition({ x: null, y: null });
        setDragStartPosition({ x: null, y: null });
    };

    const interpretSwipe = (startPosition, currPosition) => {
        // console.log
        const xDifference = currPosition.x - startPosition.x;
        const yDifference = currPosition.y - startPosition.y;

        // handle single click
        if (Math.abs(xDifference) + Math.abs(yDifference) < 1) {
            console.log("CLICK GESTURE");
            handleGesture('click');
            return;
        }

        if (Math.abs(xDifference) > Math.abs(yDifference)) {
            // more horizontal movement so this is a left-right swipe
            if (xDifference > 0) {
                //right swipe
                handleGesture('swipe-right')
            } else {
                //left swipe
                handleGesture('swipe-left')
            }
            // handleGesture('')
        } else {
            // up-down swipe
            if (yDifference > 0) {
                // down swipe
                handleGesture('swipe-down');
            } else {
                // up swipe
                handleGesture('swipe-up');
            }
        }
    }

    const updatePosition = (e) => {
        const rect = trackpadRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({ x, y });
    };

    return (
        <div
            className="trackpad"
            ref={trackpadRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={() => handleGesture('double-click')}
        >
            <div
                className="cursor"
                style={{ top: `${position.y}px`, left: `${position.x}px` }}
            />
        </div>
    );
};

export default Trackpad;