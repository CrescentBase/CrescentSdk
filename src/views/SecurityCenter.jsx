import React, {useContext, useState, useEffect} from "react";
import NavigateContext from "../contexts/NavigateContext";
import TextInput from "../widgets/TextInput";
import Button from "../widgets/Button";
// import ic_back_white from "../assets/ic_back_white.png"
import ic_warn from "../assets/ic_warn.png"
import ic_safe from "../assets/ic_safe.png"

import ConfigContext from "../contexts/ConfigContext";
import {getBackIcon, getBindSafeIcon, getBindWarnIcon, getUnbindIcon} from "../helpers/GetIcon";
import ic_login_google from "../assets/ic_login_google.png";
import ic_login_outlook from "../assets/ic_login_outlook.png";
import ic_login_yahoo from "../assets/ic_login_yahoo.png";
import ic_login_163 from "../assets/ic_login_163.png";
import ic_login_aol from "../assets/ic_login_aol.png";
import btn_loading from "../assets/btn_loading.json"
import {
    LOCAL_STORAGE_BIND_EMAIL,
    LOCAL_STORAGE_SEND_OP_SUCCESS,
    LOCAL_STORAGE_TG_USERID
} from "../helpers/StorageUtils";
import {RPCHOST} from "../helpers/Config";
import {handleFetch} from "../helpers/FatchUtils";
import {useTranslation} from "react-i18next";
import {entryPoints, getBindEmail, sendbindEmail, sendbindEmailByChainId, unBindEmail} from "../helpers/UserOp";
import Lottie from "react-lottie";

export default (props) => {
    const { t } = useTranslation();
    const {navigate} = useContext(NavigateContext);
    const ic_back_white = getBackIcon();
    const { wallet, paymasterUrl, isWeb } = useContext(ConfigContext);
    const [page, setPage] = useState(1);
    const [emailBrand, setEmailBrand] = useState('');
    const [isCounting, setIsCounting] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [emailError, setEmailError] = useState(null);
    const [emailCodeError, setEmailCodeError] = useState(null);
    const [inputEmail, setInputEmail] = useState('');
    const [inputEmailCode, setInputEmailCode] = useState('');
    const [unbindPop, setUnbindPop] = useState(false);
    const [hasBindEmail, setHasBindEmail] = useState(null);
    const [bindSuccess, setBindSuccess] = useState(false);
    const [beginBind, setBeginBind] = useState(false);
//http://127.0.0.1:5260/index.html
    useEffect(() => {
        const bindEmail = localStorage.getItem(LOCAL_STORAGE_BIND_EMAIL);
        console.csLog('===LOCAL_STORAGE_BIND_EMAIL = ', bindEmail);
        if (bindEmail) {
            const json = JSON.parse(bindEmail);
            if (json.type === 'Binding') {
                setBindSuccess(false);
            } else {
                setBindSuccess(true);
            }
            setHasBindEmail(json.email);
            setPage(2);
        }
        // sendbindEmail(paymasterUrl, wallet, '0x' + 'c8bde157a17b55f78a1c28956ba107bab9ea0235ee63331cd16609fa470e3774');
    }, [])

    const handleGetBindInfo = async () => {
        const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
        const result = await getBindEmail(userId);
        console.csLog('====handleGetBindInfo = ', result);
        if (result) {
            const type = result.type;
            if (type === 'NoBind') {
                localStorage.removeItem(LOCAL_STORAGE_BIND_EMAIL);
            } else if (type === 'Binding') {
                localStorage.setItem(LOCAL_STORAGE_BIND_EMAIL, JSON.stringify(result));
                const email = result.email;
                const hmua = result.hmua;
                const unbind = result.UnBind;
            } else {
                localStorage.setItem(LOCAL_STORAGE_BIND_EMAIL, JSON.stringify(result));
                setBindSuccess(true);
                setHasBindEmail(result.email);
                return true;
            }
            console.csLog('===getBindEmail = ', result);
        }
        return false;
    }

    useEffect(() => {
        console.csLog("====useEffect hasBindEmail update = ", hasBindEmail, bindSuccess);
        if (!bindSuccess && hasBindEmail) {
            const interval = setInterval( () => {
                if (bindSuccess) {
                    clearInterval(interval);
                    return;
                }
                console.csLog("====useEffect recyle hasBindEmail = ", hasBindEmail, bindSuccess);
                handleGetBindInfo().then((result) => {
                    if (result) {
                        clearInterval(interval);
                    }
                });
            }, 30 * 1000);
            handleGetBindInfo().then((result) => {
                if (result) {
                    clearInterval(interval);
                }
            });
            return () => clearInterval(interval);
        }
    }, [hasBindEmail, bindSuccess])

    const chooseWeb = (emailBrand) => {
        removeError();
        setEmailBrand(emailBrand);
        initCountdown();
        setPage(4);
    }

    useEffect(() => {
        let timer;
        if (isCounting) {
            timer = setInterval(() => {
                setCountdown(countdown => countdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCounting]);

    const initCountdown = () => {
        setIsCounting(false);
        setCountdown(60);
    }

    const removeError = () => {
        setEmailCodeError('');
        setEmailError('');
    }

    useEffect(() => {
        if (countdown === 0) {
            initCountdown();
        }
    }, [countdown]);

    const handleSendVerificationCode = () => {
        setEmailCodeError('');
        setEmailError('');
        setIsCounting(true);
        sendEmailCode().then((json) => {
            console.csLog('====handleCountdownClick = ', json);
            if (!json) {
                initCountdown();
                setEmailCodeError(t('network_error'));
                return;
            }
            if (json.ret !== 200 && json.errmsg) {
                setEmailError(json.errmsg);
                initCountdown();
                return;
            }
            const data = json.data;
            if (data) {
                if (!data.result) {
                    initCountdown();
                    const type = data.type;
                    if (type === 'ERR_EXIT_EMAIL') {
                        setEmailError(t('email_has_been_bound'));
                        return;
                    }
                    if (type === 'ERR_EXIT_CODE') {
                        setEmailCodeError(t('request_verification_frequently'));
                        return;
                    }
                    if (type === 'ERR_NETWORK') {
                        setEmailCodeError(t('network_error'));
                        return;
                    }
                }
            }
        })
    };

    const handleBindEmail = () => {
        setBeginBind(true);
        removeError();
        bindEmail().then(async (json) => {
            console.csLog('====handleBindEmail = ', json);
            if (!json) {
                setEmailError(t('network_error'));
            } else if (json.ret !== 200 && json.errmsg) {
                setEmailError(json.errmsg);
            } else {
                const data = json.data;
                console.csLog('===handleBindEmail = ', data);
                if (data) {
                    const email = inputEmail.trim() + emailBrand;
                    if (data.type === "Bound") {
                        setBindSuccess(true);
                        setHasBindEmail(email);
                        setPage(2);
                    } else {
                        if (data.result) {
                            const hmua = data.hmua;
                            await sendbindEmail(paymasterUrl, wallet, hmua);
                            setBindSuccess(false);
                            setHasBindEmail(email);
                            setPage(2);
                        } else {
                            const type = data.type;
                            if (type === 'ERR_CODE') {
                                setEmailCodeError(t('wrong_verification_code'));
                            } else {
                                setEmailError(t('email_has_been_bound'));
                            }
                        }
                    }
                }
            }
            setBeginBind(false);
        })
    }

    const sendEmailCode = async () => {
        const email = inputEmail.trim() + emailBrand;
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { errmsg: t('invalid_email_address') }
            }
        }
        const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
        const url = RPCHOST + `/api/v2/sendCode?channel_id=${userId}&email=${email}`;
        console.csLog('===url = ', url);
        try {
            const json = await handleFetch(url);
            console.csLog('===sendEmailCode json = ', json);
            return json;
        } catch (error) {
            console.csLog("==sendEmailCode error = ", error);
        }
        return null;
    }

    const bindEmail = async () => {
        const email = inputEmail.trim() + emailBrand;
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { errmsg: t('invalid_email_address') }
            }
        }

        const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
        const url = RPCHOST + `/api/v2/bindEmail?channel_id=${userId}&email=${email}&code=${inputEmailCode.trim()}`;
        try {
            const json = await handleFetch(url);
            console.csLog('===bindEmail data = ', json);
            return json;
        } catch (error) {
            console.csLog("==bindEmail error= ", error);
        }
        // t('wrong_verification_code')
        return null;
    }

    const handleUnbindEmail = () => {
        const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
        unBindEmail(userId)
        localStorage.removeItem(LOCAL_STORAGE_BIND_EMAIL);
        setBindSuccess(true);
        setHasBindEmail(null);
        setInputEmail(null);
        setPage(1);
    }

    return (
        <div className={'security-center'} style={isWeb ? {paddingLeft: 25, paddingRight: 25} : {}}>
            <div className={'security-center-title-layout'} onClick={() => {
                if (page === 1 || page === 2) {
                    navigate("Setting")
                } else if (page === 3) {
                    setPage(hasBindEmail ? 2 : 1);
                } else {
                    setPage(3);
                }
            }}>
                <img src={ic_back_white} className={'security-center-title-back-icon'}/>
                <div className={'security-center-title-text'}>
                    {(page === 1 || page === 2) ? t('security_center') : !hasBindEmail ? t('bind_email') : t('change_email')}
                </div>
            </div>

            <div className={'security-center-title-line'} style={isWeb ? {paddingLeft: -25, paddingRight: -25} : {}}/>
            {page == 1 ? (
                <div className={'security-center-base'}>
                    <img src={getBindWarnIcon()} className={'security-center-page1-level-logo'}/>
                    <div className={'security-center-page1-level-wrap'}>
                        <span className={'security-center-page1-level-text'}>
                            {t('security_level')}
                        </span>
                        <img src={ic_warn} className={'security-center-page1-level-text-icon'}/>
                    </div>
                    <span className={'security-center-page1-level-state'}>
                        {t('email_address_not_bound')}
                    </span>
                    <span className={'security-center-page1-level-state-desc'}>
                        {t('if_tg_delete_warn')}
                    </span>
                    <Button style={{marginTop: 30}} text={t('bind_email')} disable={false} onClick={() => {
                        setPage(3);
                    }}/>
                </div>
            ) : page == 2 ? (
                <div className={'security-center-base'}>
                    <img src={getBindSafeIcon()} className={'security-center-page1-level-logo'}/>
                    <div className={'security-center-page1-level-wrap'}>
                        <span className={'security-center-page1-level-text'}>
                            {t('security_level')}
                        </span>
                        <img src={ic_safe} className={'security-center-page1-level-text-icon'}/>
                    </div>
                    <span className={'security-center-page2-level-state'}>
                        {t('security_safe_desc_1')}
                        <span className={'security-center-page1-crescentwallet'} onClick={() => {
                            window.open('https://www.crescentbase.com', "_blank");
                        }}>
                            {t('crescentWallet')}
                        </span>
                        {t('security_safe_desc_2')}
                    </span>
                    <span className={'security-center-page2-email-text'}>
                        {t('email')}
                    </span>

                    <div className={'security-center-page2-email-wrap'}>
                        <span className={'security-center-page2-email-content'}>
                            {hasBindEmail}
                        </span>
                        {bindSuccess && (
                            <img src={getUnbindIcon()} className={'security-center-page2-email-unbind-icon'}
                                 onClick={() => {
                                     setUnbindPop(true);
                                 }}
                            />
                        )}
                    </div>

                    <div className={'security-center-page2-unbind-line'}/>
                    {!bindSuccess ? (
                        <div className={'security-center-page2-unbind-btn'} style={{cursor: 'not-allowed'}}>
                            {t('email_binding')}
                        </div>
                    ) : (
                        <div className={'security-center-page2-unbind-btn'} onClick={() => {
                            setPage(3);
                        }}>
                            {t('change_email')}
                        </div>
                    )}
                </div>
            ) : page === 3 ? (
                <div className={'security-center-base'}>
                    <div className={'flex-width-full flex-full flex-col'}>
                        <div className={'select-email-email-layout-inter'} style={{marginTop: 30, paddingLeft: 20, paddingRight: 20}}>
                            <div className={'select-email-email-wrap-web'}>
                                <div className={'select-email-email-wrap'} onClick={() => chooseWeb('@gmail.com')}>
                                    <img className={'select-email-email-logo'} src={ic_login_google}/>
                                </div>
                                <div className={'select-email-email-name'}>
                                    Google
                                </div>
                            </div>

                            <div className={'select-email-email-wrap-web'}>
                                <div className={'select-email-email-wrap'} onClick={() => chooseWeb('@outlook.com')}>
                                    <img className={'select-email-email-logo'} src={ic_login_outlook}/>
                                </div>
                                <div className={'select-email-email-name'}>
                                    Outlook
                                </div>
                            </div>

                            <div className={'select-email-email-wrap-web'}>
                                <div className={'select-email-email-wrap'} onClick={() => chooseWeb('@yahoo.com')}>
                                    <img className={'select-email-email-logo'} src={ic_login_yahoo}/>
                                </div>
                                <div className={'select-email-email-name'}>
                                    Yahoo
                                </div>
                            </div>
                        </div>

                        <div className={'select-email-email-layout-inter'}
                             style={{marginTop: 16, paddingLeft: 20, paddingRight: 20}}>
                            <div className={'select-email-email-wrap-web'}>
                                <div className={'select-email-email-wrap'} onClick={() => chooseWeb('@163.com')}>
                                    <img className={'select-email-email-logo'} src={ic_login_163}/>
                                </div>
                                <div className={'select-email-email-name'}>
                                    163
                                </div>
                            </div>

                            <div className={'select-email-email-wrap-web'}>
                                <div className={'select-email-email-wrap'} onClick={() => chooseWeb('@aol.com')}>
                                    <img className={'select-email-email-logo'} src={ic_login_aol}/>
                                </div>
                                <div className={'select-email-email-name'}>
                                    Aol
                                </div>
                            </div>

                            <div className={'select-email-email-wrap-empty'}/>
                        </div>
                    </div>
                    <div style={{flex: 100000}}/>
                    <span className={'security-center-page3-desc'}>
                        {t('only_email_provider')}
                    </span>
                </div>
            ) : (
                <div className={'security-center-base '}>
                    <TextInput
                        disableDelete={true}
                        style={{marginTop: 20}}
                        tip={t('email')}
                        placeholder={t('enter_your_email')}
                        type={'text'}
                        wrongText={emailError}
                        rightText={emailBrand}
                        showWrong={!!emailError}
                        onTextChange={(text) => {
                            setInputEmail(text);
                            if (!emailError) {
                                setEmailError('');
                            }
                        }}
                    />

                    <TextInput
                        style={{marginTop: 16}}
                        disableDelete={true}
                        tip={t('verification_code')}
                        placeholder={t('enter_verification_code')}
                        type={'text'}
                        ignoreText={true}
                        wrongText={emailCodeError}
                        showWrong={!!emailCodeError}
                        rightText={isCounting ? String(countdown) + 's' : t('send_verification_code')}
                        rightClickEnable={!isCounting}
                        onRightTextClick={handleSendVerificationCode}
                        rightTextColor={isCounting ? 'var(--medium-color-3)' : undefined}
                        onTextChange={(text) => {
                           setInputEmailCode(text);
                           if (!emailCodeError) {
                               setEmailCodeError('');
                           }
                       }}
                    />
                    {beginBind ? (
                        <div className={'widget-btn'} style={{marginTop: 24, cursor: 'not-allowed'}}>
                            <Lottie options={{
                                loop: true,
                                autoplay: true,
                                animationData: btn_loading,
                                rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                }
                            }}
                                    height={24}
                                    width={24}
                            />
                        </div>

                    ) : (
                        <Button style={{marginTop: 24}} text={t("bind_email")}
                                disable={inputEmail === '' || inputEmailCode === ''} onClick={handleBindEmail}/>
                    )}
                </div>
            )}
            {unbindPop && (
                <div className={'security-center-pop-layout-wrap'} onClick={() => {
                    setUnbindPop(false);
                }}>
                    <div className={'security-center-pop-layout'} onClick={e => e.stopPropagation()}>
                        <span className={'security-center-pop-title'}>
                            {t('unbind_your_email')}
                        </span>
                        <div className={'security-center-pop-desc'}>
                            {t('unbind_email_warn_desc')}
                        </div>
                        <div className={'security-center-pop-btn-wrap'}>
                            <div className={'security-center-pop-cancel-btn'} onClick={() => {
                                setUnbindPop(false);
                            }}>
                                {t('cancel')}
                            </div>
                            <div className={'security-center-pop-confirm-btn'} onClick={() => {
                                setUnbindPop(false);
                                handleUnbindEmail();
                            }}>
                                {t('ok')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

