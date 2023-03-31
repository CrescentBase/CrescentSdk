import React, {useContext, useEffect, useState} from "react";
import img_logo from '../assets/img_logo.png';
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
    LOCAL_STORAGE_EMAIL,
    LOCAL_STORAGE_GET_OP_DATE, LOCAL_STORAGE_HAS_SEND_TEMP, LOCAL_STORAGE_HAS_SEND_TEMP_DATE,
    LOCAL_STORAGE_ONGOING_INFO, LOCAL_STORAGE_PAYSTER_OP,
    LOCAL_STORAGE_PUBLIC_ADDRESS, LOCAL_STORAGE_SEND_OP_SUCCESS,
    LOCAL_STORAGE_TEMP_PV, LOCAL_STORAGE_WALLET_KEYSTORE
} from "../helpers/StorageUtils";
import loadig_index from "../assets/loadig_index.json";
import Lottie from "react-lottie";
import NavigateContext from "../contexts/NavigateContext";

export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const { platform, isWeb } = useContext(ConfigContext);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const privateKey = ethers.Wallet.createRandom().privateKey;
        const wallet = new ethers.Wallet(privateKey);
        wallet.getAddress().then((address) => {
            setAddress(address.toLowerCase());
        });
        localStorage.setItem(LOCAL_STORAGE_TEMP_PV, privateKey);
        localStorage.removeItem(LOCAL_STORAGE_ONGOING_INFO);
        localStorage.removeItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        localStorage.removeItem(LOCAL_STORAGE_EMAIL);
        localStorage.removeItem(LOCAL_STORAGE_GET_OP_DATE);
        localStorage.removeItem(LOCAL_STORAGE_SEND_OP_SUCCESS);
        localStorage.removeItem(LOCAL_STORAGE_WALLET_KEYSTORE);
        localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP);
        localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE);
        localStorage.removeItem(LOCAL_STORAGE_PAYSTER_OP);
    }, [])

    const choose = (email) => {
        if (address) {
            callToNativeMsg(email + ';' + address, platform)
        }
        setLoading(true);
    }

    const chooseWeb = (emailBrand) => {
        if (address) {
            const sendEmail = emailBrand === 'gmail' ? 'crescentweb3@zohomail.cn' : 'crescentweb3@gmail.com';
            const publicKey = address;
            navigate('Verification', { sendEmail, publicKey, emailBrand });
        }
    }

    return (
        <div className={'select-email'}>
            <img className={'select-email-logo'} style={isWeb ? { marginTop: 60 } : {}} src={img_logo}/>
            <div className={'select-email-with-email'} style={isWeb ? { marginTop: 48, marginBottom: 16 } : {}}>
                {ILocal('login_with')}
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
            ) : isWeb ? (
                <div className={'flex-width-full flex-full'}>
                    <div className={'select-email-email-layout-inter'} style={isWeb ? { paddingLeft: 47, paddingRight: 47 } : {}}>
                        <div className={'select-email-email-wrap'} onClick={() => chooseWeb('gmail')}>
                            <img className={'select-email-email-logo'} src={ic_login_google} />
                            <div className={'select-email-email-name'}>
                                Google
                            </div>
                        </div>
                        <div className={'select-email-email-wrap'} onClick={() => chooseWeb('outlook')}>
                            <img className={'select-email-email-logo'} src={ic_login_outlook} />
                            <div className={'select-email-email-name'}>
                                Outlook
                            </div>
                        </div>
                        <div className={'select-email-email-wrap'} onClick={() => chooseWeb('yahoo')}>
                            <img className={'select-email-email-logo'} src={ic_login_yahoo} />
                            <div className={'select-email-email-name'}>
                                Yahoo
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={'select-email-email-layout'}>
                    <div className={'select-email-email-layout-inter'}>
                        <div className={'select-email-email-wrap'} onClick={() => choose('gmail')}>

                            <img className={'select-email-email-logo'} src={ic_login_google} />
                            <div className={'select-email-email-name'}>
                                Google
                            </div>
                        </div>
                        <div className={'select-email-email-wrap'} onClick={() => choose('outlook')}>
                            <img className={'select-email-email-logo'} src={ic_login_outlook} />
                            <div className={'select-email-email-name'}>
                                Outlook
                            </div>
                        </div>
                        <div className={'select-email-email-wrap'} onClick={() => choose('yahoo')}>
                            <img className={'select-email-email-logo'} src={ic_login_yahoo} />
                            <div className={'select-email-email-name'}>
                                Yahoo
                            </div>
                        </div>
                        <div className={'select-email-email-wrap'} onClick={() => choose('mail163')}>
                            <img className={'select-email-email-logo'} src={ic_login_163} />
                            <div className={'select-email-email-name'}>
                                163
                            </div>
                        </div>
                    </div>

                    <div className={'select-email-email-layout-inter'}>
                        <div className={'select-email-email-wrap'} onClick={() => choose('aol')}>
                            <img className={'select-email-email-logo'} src={ic_login_aol} />
                            <div className={'select-email-email-name'}>
                                Aol
                            </div>
                        </div>
                        <div className={'select-email-email-wrap-empty'} />
                        <div className={'select-email-email-wrap-empty'} />
                        <div className={'select-email-email-wrap-empty'} />
                    </div>
                </div>
            )}


            <div className={'select-email-powered-by'}>
                {ILocal('powered_by')}V1.0.0
            </div>
        </div>
    );
}
