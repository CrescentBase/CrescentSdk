import React, {useContext, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import img_logo from '../assets/img_logo.png';
import {ILocal } from '../locales/i18n'
import Button from "../widgets/Button";
import TextInput from "../widgets/TextInput";

export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const [password, setPassword] = useState("");
    const [isWrongPw, setIsWrongPw] = useState(false);

    return (
        <div className={'login'}>
            <img className={'login-logo'} src={img_logo}/>

            <TextInput style={{marginTop: 32}}
               tip={ILocal('password')}
               placeholder={ILocal('password')}
               type={'password'}
               wrongText={ILocal('wrong_password')}
               showWrong={isWrongPw}
               onTextChange={(text) => {
                   setPassword(text);
                   if (isWrongPw) {
                       setIsWrongPw(false);
                   }
               }}
            />
            <Button style={{marginTop: 24}} text={ILocal('login')} disable={password === ''} onClick={() => {
                setIsWrongPw(true);
            }}/>
        </div>
    );
}
