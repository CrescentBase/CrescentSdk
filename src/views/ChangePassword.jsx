import React, {useContext, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import {ILocal } from '../locales/i18n'
import TextInput from "../widgets/TextInput";
import Button from "../widgets/Button";
import ic_back_white from "../assets/ic_back_white.png"
import {LOCAL_STORAGE_TEMP_PV, LOCAL_STORAGE_WALLET_KEYSTORE} from "../helpers/StorageUtils";
import {callToNativeMsg} from "../helpers/Utils";
import ConfigContext from "../contexts/ConfigContext";
import {ethers} from "ethers";

export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const { wallet, platform } = useContext(ConfigContext);
    const [comfirmPw, setComfirmPw] = useState("");
    const [isComfirmPwWrong, setIsComfirmPwWrong] = useState(false);
    const [password, setPassword] = useState("");
    const [isWrongPw, setIsWrongPw] = useState(false);
    const [password2, setPassword2] = useState("");
    const [isWrongPw2, setIsWrongPw2] = useState(false);
    const [hasConfirmed, setHasConfirmed] = useState(false);

    const confirm_your_password = ILocal('confirm_your_password');
    const change_password = ILocal('change_password');
    const confirm = ILocal('confirm');
    const confirm_your_password_desc = ILocal('confirm_your_password_desc');
    const enter_password_here = ILocal('enter_password_here');
    const confirm_your_password_input_wrong = ILocal('confirm_your_password_input_wrong');
    const new_password = ILocal('new_password');
    const six_digits_at_least = ILocal('six_digits_at_least');
    const enter_again_to_confirm = ILocal('enter_again_to_confirm');
    const password_not_match = ILocal('password_not_match');


    return (
        <div className={'changepw'}>
            <div className={'changepw-title-layout'} onClick={() => navigate("Setting")}>
                <img src={ic_back_white} className={'changepw-title-back-icon'}/>
                <div className={'changepw-title-text'}>{change_password}</div>
            </div>

            <div className={'changepw-title-line'}/>

            {hasConfirmed ? (
                <div className={'changepw-comfirm-base'}>
                    <TextInput
                       tip={new_password}
                       placeholder={enter_password_here}
                       type={'password'}
                       wrongText={six_digits_at_least}
                       showWrong={isWrongPw}
                       onTextChange={(text) => {
                           setPassword(text);
                           if (isWrongPw) {
                               setIsWrongPw(false);
                           }
                       }}
                    />

                    <TextInput style={{marginTop: 16}}
                       tip={confirm_your_password}
                       placeholder={enter_again_to_confirm}
                       type={'password'}
                       wrongText={password_not_match}
                       showWrong={isWrongPw2}
                       onTextChange={(text) => {
                           setPassword2(text);
                           if (isWrongPw2) {
                               setIsWrongPw2(false);
                           }
                       }}
                    />

                    <Button style={{marginTop: 24}} text={change_password} disable={password === '' || password2 === ''} onClick={() => {
                        if (password.length < 6) {
                            setIsWrongPw2(true);
                        } else if (password !== password2) {
                            setIsWrongPw2(true);
                        } else {
                            const options = {scrypt: {N: 256}};
                            wallet.encrypt(password, options).then((keystoreKey) => {
                                localStorage.setItem(LOCAL_STORAGE_WALLET_KEYSTORE, keystoreKey);
                            });
                            navigate("Setting")
                        }
                    }}/>
                </div>
            ) : (
                <div className={'changepw-comfirm-base'}>
                    <div className={'changepw-comfirm-pw'}>
                        {confirm_your_password}
                    </div>
                    <div className={'changepw-comfirm-pw-tip'}>
                        {confirm_your_password_desc}
                    </div>
                    <TextInput style={{marginTop: 16}}
                               tipHide={true}
                               placeholder={enter_password_here}
                               type={'password'}
                               wrongText={confirm_your_password_input_wrong}
                               showWrong={isComfirmPwWrong}
                               onTextChange={(text) => {
                                   setComfirmPw(text);
                               }}
                    />

                    <Button style={{marginTop: 24}} text={confirm} disable={comfirmPw === ''} onClick={async () => {
                        try {
                            const walletKeystore = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE);
                            await ethers.Wallet.fromEncryptedJson(walletKeystore, comfirmPw);
                            setHasConfirmed(true);
                        } catch (error) {
                            setIsComfirmPwWrong(true);
                        }
                    }}/>
                </div>
            )}
        </div>
    );
}

