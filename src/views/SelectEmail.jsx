import React, {useContext, useEffect, useState, useRef} from "react";
// import img_logo from '../assets/img_logo.png';
import ic_login_google from '../assets/ic_login_google.png';
import ic_login_outlook from '../assets/ic_login_outlook.png';
import ic_login_163 from '../assets/ic_login_163.png';
import ic_login_yahoo from '../assets/ic_login_yahoo.png';
import ic_login_aol from '../assets/ic_login_aol.png';
import {ILocal } from '../locales/i18n'
import ConfigContext from "../contexts/ConfigContext";
import {callToNativeMsg} from "../helpers/Utils";
import {ethers} from "ethers";
import {
    LOCAL_STORAGE_BIND_EMAIL,
    LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_ENTRY_POINTS,
    LOCAL_STORAGE_GET_OP_DATE,
    LOCAL_STORAGE_HAS_SEND_TEMP,
    LOCAL_STORAGE_HAS_SEND_TEMP_DATE, LOCAL_STORAGE_LANGUAGE,
    LOCAL_STORAGE_ONGOING_INFO,
    LOCAL_STORAGE_PAYSTER_OP,
    LOCAL_STORAGE_PUBLIC_ADDRESS,
    LOCAL_STORAGE_SEND_OP_SUCCESS,
    LOCAL_STORAGE_TEMP_PV,
    LOCAL_STORAGE_TG_FIRST_NAME,
    LOCAL_STORAGE_TG_LAST_NAME,
    LOCAL_STORAGE_TG_USERID, LOCAL_STORAGE_USER_INFO,
    LOCAL_STORAGE_WALLET_KEYSTORE
} from "../helpers/StorageUtils";
import loadig_index from "../assets/loadig_index.json";
import Lottie from "react-lottie";
import NavigateContext from "../contexts/NavigateContext";
import {getLogoIcon} from "../helpers/GetIcon";
import { GoogleOAuthProvider, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import {rpcFetch, timeoutFetch} from "../helpers/FatchUtils";
import {getEncryToken, getSender} from "../helpers/UserOp";
import {encryptTGMsg} from "../helpers/EncryUtils";
import {RPCHOST} from "../helpers/Config";

export default (props)=>{
    const img_logo = getLogoIcon();
    const { platform, isWeb, onConnectSuccess, setWallet, navigateType } = useContext(ConfigContext);
    const { navigate } = useContext(NavigateContext);
    const [loading, setLoading] = useState(false);
    const [updateUI, setUpdateUI] = useState(false);
    const goRef = useRef(null);

    // useEffect(() => {
    //     const privateKey = ethers.Wallet.createRandom().privateKey;
    //     const wallet = new ethers.Wallet(privateKey);
    //     wallet.getAddress().then((address) => {
    //         setAddress(address.toLowerCase());
    //     });
    //     localStorage.setItem(LOCAL_STORAGE_TEMP_PV, privateKey);
    //     localStorage.removeItem(LOCAL_STORAGE_ONGOING_INFO);
    //     localStorage.removeItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
    //     localStorage.removeItem(LOCAL_STORAGE_EMAIL);
    //     localStorage.removeItem(LOCAL_STORAGE_GET_OP_DATE);
    //     localStorage.removeItem(LOCAL_STORAGE_SEND_OP_SUCCESS);
    //     localStorage.removeItem(LOCAL_STORAGE_WALLET_KEYSTORE);
    //     localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP);
    //     localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE);
    //     localStorage.removeItem(LOCAL_STORAGE_PAYSTER_OP);
    // }, [])

    const responseGoogle = (response) => {
        // console.log('responseGoogle', response);
        if (response.access_token) {
            const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`;
            timeoutFetch(url).then(result => {
                // console.log(result);
                const userInfo = {given_name: result.given_name, family_name: result.family_name, userId: result.sub}
                localStorage.setItem(LOCAL_STORAGE_USER_INFO, JSON.stringify(userInfo));
                // console.log('====goRef.current = ', goRef.current);
                if (goRef.current !== true) {
                    goRef.current = true;
                    connect(userInfo);
                }


                //{
                //     "sub": "",
                //     "name": "",
                //     "given_name": "",
                //     "family_name": "",
                //     "picture": "",
                //     "email": "",
                //     "email_verified": ,
                //     "locale": "zh-CN"
                // }
            });
        }

        //
    }

    const loginGoogle = useGoogleLogin({
        onSuccess: responseGoogle,
        scope: 'https://www.googleapis.com/auth/admin.directory.customer.readonly'
    });


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

    const deleteAccount = (deleteUserInfo = false) => {
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
        if (deleteUserInfo) {
            localStorage.removeItem(LOCAL_STORAGE_USER_INFO);
        }
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
        // console.log('====json = ', json);
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

    const goto = (page) => {
        navigate(page);
        const address = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        if (isWeb) {
            onConnectSuccess && onConnectSuccess({address});
        }
    }

    const checkOrEnter = () => {
        const userInfoStr = localStorage.getItem(LOCAL_STORAGE_USER_INFO);
        // console.log('====checkOrEnter = ', userInfoStr);
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            connect(userInfo);
        } else {
            setUpdateUI(true);
            deleteAccount(true);
        }
    }

    useEffect(() => {
        checkOrEnter();
    }, []);

    const connect = (userInfo) => {
        // const initData = window.Telegram.WebApp.initDataUnsafe;
        // if (!initData || !initData.user || !initData.user.id) {
        //     return;
        // }

        // {
        //     "sub": "100691389078138592850",
        //     "name": "kaixin chen",
        //     "given_name": "kaixin",
        //     "family_name": "chen",
        //     "picture": "https://lh3.googleusercontent.com/a/AGNmyxarQzPVsp5Nt6uK-0sTlVvrc9v7-yesoIYdtRw1=s96-c",
        //     "email": "kaixinchen2022@gmail.com",
        //     "email_verified": true,
        //     "locale": "zh-CN"
        // }

        const walletKeystore = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE);
        if (!walletKeystore) {
            deleteAccount();
        }

        const firstName = userInfo.given_name;
        const lastName = userInfo.family_name;
        localStorage.setItem(LOCAL_STORAGE_TG_FIRST_NAME, firstName);
        localStorage.setItem(LOCAL_STORAGE_TG_LAST_NAME, lastName);

        const sender = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
        console.csLog('===walletKeystore = ', walletKeystore);
        const uploadUserId = '@google@' + userInfo.userId;
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
                // window.Telegram.WebApp.showAlert(String(e));
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
            });
        }
        loadData();
    }

    return (
        <div className={'select-email'} style={!updateUI ? {display: 'none'} : {}}>
            <img className={'select-email-logo'} style={isWeb ? { marginTop: 60 } : {}} src={img_logo}/>
            <div className={'select-email-with-email'} style={isWeb ? { marginTop: 48, marginBottom: 16 } : {}}>
                {ILocal('login')}
            </div>

            {loading ? (
                <div className={'select-email-email-lottie-layout'}>
                    <Lottie style={{marginTop: 17}} options={{
                        loop: true,
                        autoplay: true,
                        animationData: loadig_index,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                            height={48}
                            width={48}
                    />
                </div>
            ) :  (
                <div className={'flex-width-full flex-full flex-col'}>
                    <div className={'select-email-email-layout-inter'} style={{ paddingLeft: 47, paddingRight: 47 }}>
                        <div className={'select-email-email-wrap-web'}>
                            <div className={'select-email-email-wrap'} onClick={() => {
                                loginGoogle()
                            }}>
                                <img className={'select-email-email-logo'} src={ic_login_google} />
                            </div>
                            <div className={'select-email-email-name'}>
                                Google
                            </div>
                        </div>

                        <div className={'select-email-email-wrap-empty'} />
                        <div className={'select-email-email-wrap-empty'} />
                    </div>

                    <div style={{flex: 100000}}/>
                </div>
            )}


            <div className={'select-email-powered-by'}>
                {ILocal('powered_by')}V1.0.0
            </div>
        </div>
    );
}
