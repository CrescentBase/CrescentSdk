import React, {useContext, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import {ILocal } from '../locales/i18n'
import TextInput from "../widgets/TextInput";
import Button from "../widgets/Button";

export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const [password, setPassword] = useState("");
    const [isWrongPw, setIsWrongPw] = useState(false);
    const [password2, setPassword2] = useState("");
    const [isWrongPw2, setIsWrongPw2] = useState(false);

    return (
        <div className={'setpw'}>
            <div className={'setpw-password'}>
                {ILocal('set_your_password')}
            </div>
            <div className={'setpw-password-desc'}>
                {ILocal('set_your_password_desc')}
            </div>
            <TextInput style={{marginTop: 16}}
               tip={ILocal('new_password')}
               placeholder={ILocal('enter_password_here')}
               type={'password'}
               wrongText={ILocal('six_digits_at_least')}
               showWrong={isWrongPw}
               onTextChange={(text) => {
                   setPassword(text);
                   if (isWrongPw) {
                       setIsWrongPw(false);
                   }
               }}
            />

            <TextInput style={{marginTop: 16}}
               tip={ILocal('confirm_your_password')}
               placeholder={ILocal('enter_again_to_confirm')}
               type={'password'}
               wrongText={ILocal('password_not_match')}
               showWrong={isWrongPw2}
               onTextChange={(text) => {
                   setPassword2(text);
                   if (isWrongPw2) {
                       setIsWrongPw2(false);
                   }
               }}
            />

            <Button style={{marginTop: 24}} text={ILocal('next')} disable={password === '' || password2 === ''} onClick={() => {
                setIsWrongPw2(true);
            }}/>
        </div>
    );
}
