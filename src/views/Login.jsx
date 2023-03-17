import React, {useContext, useEffect, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import img_logo from '../assets/img_logo.png';
import Button from "../widgets/Button";
import TextInput from "../widgets/TextInput";
import {ethers} from "ethers";
import ConfigContext from "../contexts/ConfigContext";
import {
    LOCAL_STORAGE_EMAIL,
    LOCAL_STORAGE_PUBLIC_ADDRESS,
    LOCAL_STORAGE_WALLET_KEYSTORE
} from "../helpers/StorageUtils";
import {AllChainTypes, NetworkConfig} from "../helpers/Config";
import {useTranslation} from "react-i18next";
import {getSender} from "../helpers/UserOp";
import {callToNativeMsg} from "../helpers/Utils";

export default (props)=>{
    const { t } = useTranslation();
    const { navigate } = useContext(NavigateContext);
    const { setWallet, tx, emailAccount, walletJson } = useContext(ConfigContext);
    const [password, setPassword] = useState("");
    const [isWrongPw, setIsWrongPw] = useState(false);
    const [errorText, setErrorText] = useState('');

    return (
        <div className={'login'}>
            <img className={'login-logo'} src={img_logo}/>

            <TextInput style={{marginTop: 32}}
               tip={t('password')}
               placeholder={t('password')}
               type={'password'}
               wrongText={errorText || t('wrong_password')}
               showWrong={isWrongPw}
               onTextChange={(text) => {
                   setPassword(text);
                   if (isWrongPw) {
                       setIsWrongPw(false);
                   }
               }}
            />
            <Button style={{marginTop: 24}} text={t('login')} disable={password === ''} onClick={async () => {
                if (password.length < 6) {
                    setIsWrongPw(true);
                } else {

                    if (emailAccount) {
                        const storageEmail = localStorage.getItem(LOCAL_STORAGE_EMAIL);
                        if (storageEmail !== emailAccount) {
                            localStorage.setItem(LOCAL_STORAGE_EMAIL, emailAccount);
                            const sender = await getSender(emailAccount);
                            localStorage.setItem(LOCAL_STORAGE_PUBLIC_ADDRESS, sender);
                        }
                    }

                    let walletKeystore = walletJson;
                    if (walletJson) {
                        localStorage.setItem(LOCAL_STORAGE_WALLET_KEYSTORE, walletJson);
                    } else {
                        walletKeystore = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE);
                    }
                    try {
                        if (tx) {
                            AllChainTypes.forEach((chainType) => {
                                if (NetworkConfig[chainType].MainChainId === String(tx.chainId)) {
                                    tx.chainType = chainType;
                                }
                            });
                            let errorText;
                            if (!tx.chainType) {
                                errorText = t('paramter_incorrectly', {paramter: 'chainId'});
                            } else if (!tx.to) {
                                errorText = t('paramter_incorrectly', {paramter: 'to'});
                            } else if (!tx.value && !tx.data) {
                                errorText = t('paramter_incorrectly', {paramter: 'value or data'});
                            }
                            if (errorText) {
                                console.log('====errorText = ', errorText);
                                setErrorText(errorText)
                                setIsWrongPw(true);
                            } else {
                                if (tx.data) {
                                    tx.tokenAddress = tx.to;
                                } else {
                                    tx.tokenAddress = "0x0";
                                }
                                let wallet = await ethers.Wallet.fromEncryptedJson(walletKeystore, password);
                                setWallet(wallet);
                                navigate('Send', { tx })
                            }
                        } else {
                            let wallet = await ethers.Wallet.fromEncryptedJson(walletKeystore, password);
                            setWallet(wallet);
                            navigate("Main");
                        }
                    } catch (e) {
                        console.log('===e = ', e);
                        setIsWrongPw(true);
                    }
                }
            }}/>
        </div>
    );
}
