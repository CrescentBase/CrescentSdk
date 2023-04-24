import React, { useState } from 'react';
import {ILocal} from "../locales/i18n";
// import ic_clear from "../assets/ic_clear.png";
import {getClearIcon} from "../helpers/GetIcon";


export default (props)=>{
    const ic_clear = getClearIcon();
    const [text, setText] = useState('');

    const handleTextChange = (event) => {
        setTextContent(event.target.value);
    };

    const setTextContent = (content) => {
        setText(content);
        props.onTextChange(content);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            props.onEnter && props.onEnter();
        }
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
                       onKeyDown={handleKeyDown}
                />
                {text !== '' && !props.disableDelete && (
                    <img className={'widget-textinput-edittext-clear'} src={ic_clear} onClick={() => {
                        setTextContent("");
                    }}/>
                )}
                {props.rightText && (
                    <span className={'widget-textinput-right-text'}
                          style={ {cursor: props.rightClickEnable ? 'pointer' : 'not-allowed', color: props.rightTextColor || ' var(--system-color-4)' }}
                        onClick={() => {
                            if (props.rightClickEnable) {
                                props.onRightTextClick && props.onRightTextClick();
                            }
                        }}>
                        {props.rightText}
                    </span>
                )}
            </div>
            <div className={'widget-textinput-line'}/>
            <div className={'widget-textinput-wrong-tip'}>{((text !== "" || props.ignoreText) && props.showWrong) && props.wrongText}&nbsp;</div>
        </div>
    );
}
