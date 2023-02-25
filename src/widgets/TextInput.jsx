import React, { useState } from 'react';
import {ILocal} from "../locales/i18n";
import ic_clear from "../assets/ic_clear.png";

export default (props)=>{
    const [text, setText] = useState('');

    const handleTextChange = (event) => {
        setTextContent(event.target.value);
    };

    const setTextContent = (content) => {
        setText(content);
        props.onTextChange(content);
    }

    return (
        <div className={'widget-textinput-base-layout'} style={props.style}>
            {!props.tipHide && (
                <div className={'widget-textinput-tip'}>{props.tip}</div>
            )}

            <div className={'widget-textinput-edit-layout'}>
                <input className={'widget-textinput-edittext'}
                       type={props.type || "password"}
                       placeholder={props.placeholder}
                       value={text}
                       onChange={handleTextChange}
                />
                {text !== '' && (
                    <img className={'widget-textinput-edittext-clear'} src={ic_clear} onClick={() => {
                        setTextContent("");
                    }}/>
                )}
            </div>
            <div className={'widget-textinput-line'}/>
            <div className={'widget-textinput-wrong-tip'}>{(text !== "" && props.showWrong) && props.wrongText}&nbsp;</div>
        </div>
    );
}
