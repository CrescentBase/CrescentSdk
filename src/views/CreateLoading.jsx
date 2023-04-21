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

    useEffect(() => {
        if (navigateType === 'delete') {
            deleteAccount();
        }
        const initData = window.Telegram.WebApp.initDataUnsafe;
        if (initData && initData.user && initData.user.id) {
            const firstName = initData.user.first_name || '';
            const lastName = initData.user.last_name || '';
            localStorage.setItem(LOCAL_STORAGE_TG_FIRST_NAME, firstName);
            localStorage.setItem(LOCAL_STORAGE_TG_LAST_NAME, lastName);
        }

        const walletKeystore = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE);
        const sender = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        const useId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
        console.csLog('====walletKeystore = ', walletKeystore);

        if (walletKeystore && sender && useId) {
            const pp = sender.substring(0, 4) + sender.substring(sender.length - 2) + String(useId).substring(4, 6);
            ethers.Wallet.fromEncryptedJson(walletKeystore, pp).then((wallet) => {
                setWallet(wallet);
                if (navigateType === 'setting') {
                    navigate("BindEmail");
                } else {
                    navigate("Main");
                }
            })
            return;
        }
        setLoading(true);
        async function loadData() {
            const initData = window.Telegram.WebApp.initDataUnsafe;
            if (!initData || !initData.user || !initData.user.id) {
                return;
            }
            const userId = initData.user.id

            // const userId = 5783315738;
            // const firstName = 'abck';
            // const lastName = '';

            const uploadUserId = '@TG@' + userId;
            const sender = await getSender(uploadUserId);
            if (!sender) {
                return;
            }

            const privateKey = ethers.Wallet.createRandom().privateKey;
            const wallet = new ethers.Wallet(privateKey);
            let publicAddress = await wallet.getAddress();
            console.csLog('====publicAddress = ', publicAddress);
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
                localStorage.setItem(LOCAL_STORAGE_WALLET_KEYSTORE, keystoreKey);
                navigate("Main");
            });
        }
        loadData();

    }, []);

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
