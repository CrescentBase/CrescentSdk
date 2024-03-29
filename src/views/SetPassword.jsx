import React, {useContext, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import {ILocal } from '../locales/i18n'
import TextInput from "../widgets/TextInput";
import Button from "../widgets/Button";
import {ethers} from "ethers";
import {callToNativeMsg} from "../helpers/Utils";
import ConfigContext from "../contexts/ConfigContext";
import {
    LOCAL_STORAGE_EMAIL,
    LOCAL_STORAGE_PUBLIC_ADDRESS,
    LOCAL_STORAGE_TEMP_PV,
    LOCAL_STORAGE_WALLET_KEYSTORE
} from "../helpers/StorageUtils";

export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const { isWeb, onConnectSuccess } = useContext(ConfigContext);
    const { platform, setWallet } = useContext(ConfigContext);
    const [password, setPassword] = useState("");
    const [isWrongPw, setIsWrongPw] = useState(false);
    const [password2, setPassword2] = useState("");
    const [isWrongPw2, setIsWrongPw2] = useState(false);

    return (
        <div className={'setpw'} style={isWeb ? { paddingLeft: 25, paddingRight: 25 } : {}} >
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
                if (password.length < 6) {
                    setIsWrongPw(true);
                } else if (password !== password2) {
                    setIsWrongPw2(true);
                } else {
                    const privateKey = localStorage.getItem(LOCAL_STORAGE_TEMP_PV);
                    const wallet = new ethers.Wallet(privateKey);
                    setWallet(wallet);
                    const options = {scrypt: {N: 256}};
                    wallet.encrypt(password, options).then((keystoreKey) => {
                        localStorage.setItem(LOCAL_STORAGE_WALLET_KEYSTORE, keystoreKey);
                        localStorage.removeItem(LOCAL_STORAGE_TEMP_PV)

                        navigate("Main");
                        const storageEmail = localStorage.getItem(LOCAL_STORAGE_EMAIL);
                        const publicAddress = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
                        const json = {
                            email: storageEmail,
                            address: publicAddress,
                            // walletEncrypted: walletKeystore
                        }
                        if (isWeb) {
                            onConnectSuccess && onConnectSuccess(json);
                        } else {
                            callToNativeMsg( "userInfo;" + JSON.stringify(json), platform);
                        }
                        callToNativeMsg("walletKeystore;" + keystoreKey, platform)
                    });
                }
            }}/>
        </div>
    );
}
