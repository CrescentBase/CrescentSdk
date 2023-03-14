import React, {useEffect, useState} from 'react';
import { useSpring, animated } from 'react-spring';

const SwipeView = (props) => {
    const [swipeDistance, setSwipeDistance] = useState(0);
    let startX = 0;
    let startY = 0;
    let deltaX = 0;

    useEffect(() => {
        if (props.swipeKey !== props.id && swipeDistance != 0) {
            setSwipeDistance(0);
        }
    }, [props.swipeKey]);

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
            if (deltaX < -props.btnWidth && Math.abs(deltaY) < 10) {
                deltaX = -props.btnWidth;
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
            setSwipeDistance(-props.btnWidth);
            props.swipe(props.id);
        } else {
            setSwipeDistance(0);
        }
    };

    const animatedProps = useSpring({
        transform: 'translateX(' + swipeDistance +'px)',
        config: { duration: 150 },
    });

    return (
        <div style={{position: 'relative', width: '100%'}}>
            <div style={{position: 'absolute', right: 0, width: props.btnWidth}} onClick={() => {
                setSwipeDistance(0);
                props.onClickAction();
            }}>
                {props.actionBtn}
            </div>
            <animated.div onTouchStart={handleTouchStart} style={{...animatedProps}} onClick={() => {
                if (props.swipeKey === props.id) {
                    setSwipeDistance(0);
                    props.swipe('');
                } else {
                    props.onClickItem();
                }
            }}>
                {props.rowRenderer}
            </animated.div>
        </div>
    );
}

export default SwipeView;
