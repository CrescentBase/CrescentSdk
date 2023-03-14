import React, {useContext, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import img_logo from '../assets/img_logo.png';
import {ILocal } from '../locales/i18n'
import Button from "../widgets/Button";
import TextInput from "../widgets/TextInput";
import {ethers} from "ethers";
import ConfigContext from "../contexts/ConfigContext";
import {LOCAL_STORAGE_WALLET_KEYSTORE} from "../helpers/StorageUtils";

export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const { setWallet } = useContext(ConfigContext);
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
            <Button style={{marginTop: 24}} text={ILocal('login')} disable={password === ''} onClick={async () => {
                if (password.length < 6) {
                    setIsWrongPw(true);
                } else {


                    const walletKeystore = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE);
                    try {
                        let wallet = await ethers.Wallet.fromEncryptedJson(walletKeystore, password);
                        setWallet(wallet);
                        //0x0C1620C75447208E5EfF987Ab20Fb52Aa3Fcf348
                        //0x04aaacbe95e3cddc7e6dad42a6bf8c291f1fbec92890b4b40874aa1cac17bc9ccc03ae38d5114f21b79b1935be15361cd2f2257ce2f33523269b863410d6f2fede
                        navigate("Main");
                    } catch (e) {
                        console.log('===e = ', e);
                        setIsWrongPw(true);
                    }
                }
            }}/>
        </div>
    );
}
