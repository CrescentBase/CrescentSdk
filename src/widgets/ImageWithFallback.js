import React from "react";

function ImageWithFallback(props) {
    return (
        <img src={props.src} className={props.className} onError={(e) => { e.target.onerror = null; e.target.src = props.defaultSrc; }} />
    );
}

export default ImageWithFallback;
