import React, { useState } from 'react';

export default (props)=>{
    return (
        <div className={props.disable ? 'widget-btn-no-click' : 'widget-btn'} onClick={props.onClick} style={props.style}>{props.text}</div>
    );
}
