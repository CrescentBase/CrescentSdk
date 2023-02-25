import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const SwipeView = ({ rowRenderer, actionBtn, btnWidth }) => {
    const [swipeDistance, setSwipeDistance] = React.useState(0);
    let startX = 0;
    let startY = 0;
    let deltaX = 0;

    const handleTouchStart = (event) => {
        deltaX = 0;
        setSwipeDistance(0);
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        event.target.addEventListener('touchmove', handleTouchMove);
        event.target.addEventListener('touchend', handleTouchEnd);

    };

    const handleTouchMove = (event) => {
        const touch = event.touches[0];
        deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < -btnWidth && Math.abs(deltaY) < 10) {
                deltaX = -btnWidth;
            } else if (deltaX > 0){
                deltaX = 0;
            }
            setSwipeDistance(deltaX);
        } else {
            deltaX = 0;
        }
    };

    const handleTouchEnd = (event) => {
        event.target.removeEventListener('touchmove', handleTouchMove);
        event.target.removeEventListener('touchend', handleTouchEnd);
        if (deltaX < -30) {
            setSwipeDistance(-btnWidth);
        } else {
            setSwipeDistance(0);
        }
    };

    const animatedProps = useSpring({
        transform: 'translateX(' + swipeDistance +'px)',
        config: { duration: 300 },
    });

    return (
        <div style={{position: 'relative', width: '100%'}}>
            <div style={{position: 'absolute', right: 0, width: btnWidth}} onClick={() => {
                setSwipeDistance(0);
            }}>
                {actionBtn}
            </div>
            <animated.div onTouchStart={handleTouchStart} style={{...animatedProps}}>
                {rowRenderer}
            </animated.div>
        </div>
    );
}

export default SwipeView;
