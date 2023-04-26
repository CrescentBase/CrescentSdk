import React, {useContext, useEffect, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ConfigContext from "../contexts/ConfigContext";
import {useTranslation} from "react-i18next";
import {
    LOCAL_STORAGE_BIND_EMAIL,
    LOCAL_STORAGE_EMAIL,
    LOCAL_STORAGE_ENTRY_POINTS,
    LOCAL_STORAGE_GET_OP_DATE,
    LOCAL_STORAGE_HAS_SEND_TEMP,
    LOCAL_STORAGE_HAS_SEND_TEMP_DATE,
    LOCAL_STORAGE_LANGUAGE,
    LOCAL_STORAGE_ONGOING_INFO,
    LOCAL_STORAGE_PAYSTER_OP,
    LOCAL_STORAGE_PUBLIC_ADDRESS,
    LOCAL_STORAGE_SEND_OP_SUCCESS,
    LOCAL_STORAGE_TEMP_PV,
    LOCAL_STORAGE_TG_FIRST_NAME,
    LOCAL_STORAGE_TG_LAST_NAME,
    LOCAL_STORAGE_TG_USERID,
    LOCAL_STORAGE_WALLET_KEYSTORE
} from "../helpers/StorageUtils";
import {getEncryToken, getSender} from "../helpers/UserOp";
import Lottie from "react-lottie";
import loadig_index from "../assets/loadig_index.json";
import {ethers} from "ethers";
import {encryptTGMsg} from "../helpers/EncryUtils";
import {rpcFetch} from "../helpers/FatchUtils";
import {RPCHOST} from "../helpers/Config";

export default (props)=>{
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { navigate } = useContext(NavigateContext);
    const { setWallet, navigateType } = useContext(ConfigContext);

    // const { removeLoading, emailAccount } = useContext(ConfigContext);
    const defaultUserData = {
        user: {
            id: 5783315738, //5783315738,
            first_name: 'c',
            last_name: 'yh'
        }
    };

    const goto = (page) => {
        // console.csLog('===goto===', page)
        navigate(page);
    }


    useEffect(() => {
        if (navigateType === 'delete') {
            deleteAccount();
        }
        // localStorage.setItem(LOCAL_STORAGE_WALLET_KEYSTORE, "{\"address\":\"0bf1462550515dfc38ebd18ff23dcef0f43176f3\",\"id\":\"32871fb4-fbe0-421e-a058-65d92c62ca9b\",\"version\":3,\"crypto\":{\"cipher\":\"aes-128-ctr\",\"cipherparams\":{\"iv\":\"4e8c4e85efb88b39a15a12f2f0142397\"},\"ciphertext\":\"d7587099d955f9feec7f67604dd8dd9a93260405d0a64e49aa8d15364411d787\",\"kdf\":\"scrypt\",\"kdfparams\":{\"salt\":\"00918130837488bb8da5c942351761a3f3b4caed922fb1e717dfe4a69460925e\",\"n\":256,\"dklen\":32,\"p\":1,\"r\":8},\"mac\":\"a76c63b1b48f07c553c39610d92f878d1bf57cde83cde75ebb2fb5f389e9384a\"}}");

        const initData = window.Telegram.WebApp.initDataUnsafe;
        if (!initData || !initData.user || !initData.user.id) {
            return;
        }

        const walletKeystore = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE);
        if (!walletKeystore) {
            deleteAccount();
        }


        const firstName = initData.user.first_name || '';
        const lastName = initData.user.last_name || '';
        localStorage.setItem(LOCAL_STORAGE_TG_FIRST_NAME, firstName);
        localStorage.setItem(LOCAL_STORAGE_TG_LAST_NAME, lastName);

        const sender = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
        console.csLog('===walletKeystore = ', walletKeystore);
        const uploadUserId = '@TG@' + initData.user.id;
        if (walletKeystore && sender && userId && userId === uploadUserId) {
            let encryKeystore;
            const json = JSON.parse(walletKeystore);
            encryKeystore = json[uploadUserId];
            const pp = sender.substring(0, 4) + sender.substring(sender.length - 2) + String(userId).substring(4, 6);
            ethers.Wallet.fromEncryptedJson(encryKeystore, pp).then((wallet) => {
                setWallet(wallet);
                if (navigateType === 'setting') {
                    goto("Setting");
                } else {
                    goto("Main");
                }
            }).catch((e) => {
                window.Telegram.WebApp.showAlert(String(e));
                console.csLog('===e1 == ', e);
            });
            return;
        }

        setLoading(true);
        async function loadData() {
            deleteOtherAccountInfo();
            if (walletKeystore) {
                const json = JSON.parse(walletKeystore);
                if (json[uploadUserId]) {
                    const encryKeystore = json[uploadUserId];
                    const sender = await getSender(uploadUserId);
                    if (!sender) {
                        return;
                    }
                    const pp = sender.substring(0, 4) + sender.substring(sender.length - 2) + String(uploadUserId).substring(4, 6);
                    ethers.Wallet.fromEncryptedJson(encryKeystore, pp).then((wallet) => {
                        localStorage.setItem(LOCAL_STORAGE_TG_USERID, uploadUserId);
                        localStorage.setItem(LOCAL_STORAGE_PUBLIC_ADDRESS, sender);
                        setWallet(wallet);
                        if (navigateType === 'setting') {
                            goto("Setting");
                        } else {
                            goto("Main");
                        }
                    })
                    return;
                }
            }

            // const userId = 5783315738;
            // const firstName = 'abck';
            // const lastName = '';

            const sender = await getSender(uploadUserId);
            if (!sender) {
                return;
            }

            const privateKey = ethers.Wallet.createRandom().privateKey;
            const wallet = new ethers.Wallet(privateKey);
            let publicAddress = await wallet.getAddress();
            publicAddress = publicAddress.toLowerCase(); // publicAddress|id|signature   //发送信息

            const result = await sendMessage(wallet, publicAddress, uploadUserId);
            if (!result) {
                return;
            }

            localStorage.setItem(LOCAL_STORAGE_TG_USERID, uploadUserId);
            localStorage.setItem(LOCAL_STORAGE_PUBLIC_ADDRESS, sender);
            setWallet(wallet);

            const pp = sender.substring(0, 4) + sender.substring(sender.length - 2) + String(uploadUserId).substring(4, 6);
            const options = {scrypt: {N: 256}};
            wallet.encrypt(pp, options).then((keystoreKey) => {
                const baseWallKeystore = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE) || '{}';
                const json = JSON.parse(baseWallKeystore);
                json[uploadUserId] = keystoreKey; //也许可以
                // console.csLog('===JSON.stringify(json) = ', JSON.stringify(json));
                localStorage.setItem(LOCAL_STORAGE_WALLET_KEYSTORE, JSON.stringify(json));
                goto("Main");
            }).catch((e) => {
                console.csLog('===e2 == ', e);
            });;
        }
        loadData();

    }, []);

    const deleteOtherAccountInfo = () => {
        localStorage.removeItem(LOCAL_STORAGE_TEMP_PV);
        localStorage.removeItem(LOCAL_STORAGE_ONGOING_INFO);
        localStorage.removeItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        localStorage.removeItem(LOCAL_STORAGE_EMAIL);
        localStorage.removeItem(LOCAL_STORAGE_GET_OP_DATE);
        localStorage.removeItem(LOCAL_STORAGE_SEND_OP_SUCCESS);
        localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP);
        localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE);
        localStorage.removeItem(LOCAL_STORAGE_TG_USERID);
        localStorage.removeItem(LOCAL_STORAGE_PAYSTER_OP);
        localStorage.removeItem(LOCAL_STORAGE_BIND_EMAIL);
    }

    const deleteAccount = () => {
        localStorage.removeItem(LOCAL_STORAGE_TEMP_PV);
        localStorage.removeItem(LOCAL_STORAGE_ONGOING_INFO);
        localStorage.removeItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        localStorage.removeItem(LOCAL_STORAGE_EMAIL);
        localStorage.removeItem(LOCAL_STORAGE_GET_OP_DATE);
        localStorage.removeItem(LOCAL_STORAGE_SEND_OP_SUCCESS);
        localStorage.removeItem(LOCAL_STORAGE_WALLET_KEYSTORE);
        localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP);
        localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE);
        localStorage.removeItem(LOCAL_STORAGE_TG_USERID);
        localStorage.removeItem(LOCAL_STORAGE_PAYSTER_OP);
        localStorage.removeItem(LOCAL_STORAGE_ENTRY_POINTS);
        localStorage.removeItem(LOCAL_STORAGE_LANGUAGE);
        localStorage.removeItem(LOCAL_STORAGE_BIND_EMAIL);
    }

    const sendMessage = async (wallet, publickKey, userId) => {
        const encryToken = await getEncryToken(userId);
        if (!encryToken) {
            return false;
        }
        const tokenKey = encryToken.key;
        const signContent = publickKey + '|' + userId;
        const signature = await wallet.signMessage(signContent);
        const data = signContent + '|' + signature;
        const body = encryptTGMsg(userId, tokenKey, data);
        const json = { "cid": userId, "msg": body};
        try {
            const result = await rpcFetch(RPCHOST + "/api/v2/submitChannel", json);
            console.csLog('====result = ', result);
            if (result.ret === 200 && result.data === true) {
                return true;
            }
        } catch (e) {
            console.csLog('===e = ', e);
        }
        return false;
    }

    return (
        <div className={'create-loading'} style={{marginTop: window.Telegram.WebApp.viewportStableHeight/2 - 70}}>
            {loading && (
                <Lottie options={{
                    loop: true,
                    autoplay: true,
                    animationData: loadig_index,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                        height={70}
                        width={70}
                />
            )}
        </div>
    );
}
