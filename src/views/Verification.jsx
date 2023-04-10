import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "../widgets/Button";
import img_email from "../assets/img_email"
import ic_question from "../assets/ic_question.png"
import loadig_index from "../assets/loadig_index.json";
import Lottie from "react-lottie";
import ic_back_white from "../assets/ic_back_white.png";
import ic_copy from "../assets/ic_copy.png";
import NavigateContext from "../contexts/NavigateContext";
import {RPCHOST} from "../helpers/Config";
import {handleFetch} from "../helpers/FatchUtils";
import {LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_PUBLIC_ADDRESS} from "../helpers/StorageUtils";
import PopContext from "../contexts/PopContext";

export default (props)=>{
    const { showOnlyCopy } = useContext(PopContext);
    const { navigate } = useContext(NavigateContext);
    const sendEmail = props.params?.sendEmail;
    const publicKey = props.params?.publicKey;
    const emailBrand = props.params?.emailBrand;
    const isHandSend = (emailBrand === '163' || emailBrand === 'aol') ? true : false;
    const [page, setPage] = useState(isHandSend ? 3 : 1);
    const [popVisible, setPopVisible] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const interval = setInterval(async () => {
            if (document.hidden || page != 2) {
                return;
            }
            const url = RPCHOST + "/api/v2/getEmailInfo?publicKey=" + publicKey;
            try {
                const json = await handleFetch(url);
                const data = json.data;
                if (data) {
                    clearInterval(interval);
                    const email = data.email;
                    const sender = data.sender;
                    localStorage.setItem(LOCAL_STORAGE_EMAIL, email);
                    localStorage.setItem(LOCAL_STORAGE_PUBLIC_ADDRESS, sender);
                    navigate('SetPassword');
                }
            } catch (error) {
            }
        }, 3*1000);
        return () => clearInterval(interval);
    }, [page]);

    return (
        <div className={'verification'} onClick={() => {
            if (popVisible) {
                setPopVisible(false);
            }
        }}>
            {page === 1 ? (
                <div className={'verification-page'}>
                    <div className={'verification-title-layout'}>
                        <span className={'verification-title-text'}>
                            {t('login_or_register')}
                        </span>
                        <img className={'verification-info-icon'} src={ic_question} onClick={() => setPopVisible(true)}/>
                    </div>
                    <span className={'verification-need-verify-desc'}>
                        {t('verification_need_verify_desc')}
                    </span>
                    <img className={'verification-email-img'} src={img_email}/>
                    <div className={'flex-full'}></div>
                    <span className={'verification-click-auto-generated '}>
                        {t('verification_click_auto_generated')}
                    </span>
                    <Button style={{marginTop: 10}} text={t('verification_send_email_to_verify')} onClick={async () => {
                        let link = '';
                        if (emailBrand === 'gmail') {
                            link = `https://mail.google.com/mail?view=cm&tf=0&to=${sendEmail}&su=Crescent&body=PK:${publicKey}`
                        } else if (emailBrand === 'outlook') {
                            link = `https://outlook.live.com/default.aspx?rru=compose&subject=Crescent&body=PK:${publicKey}&to=${sendEmail}#page=Compose`;
                        } else {
                            link = `https://login.yahoo.com/?.src=ym&lang=&done=https%3A%2F%2Fcompose.mail.yahoo.com%2F%3Fto%3DCrescentweb3%2540gmail.com%26subj%3DCrescent%26body%3DPK:${publicKey}`;
                        }
                        window.open(link, "_blank");
                        setPage(2);
                    }} />
                </div>
            ) : page === 2 ? (
                <div className={'verification-page2'}>
                    <Lottie options={{
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
                    <span className={'verification-page2-email-receiving'}>
                        {t('verification_email_receiving')}
                    </span>
                    <div className={'verification-page2-send-fail-desc'}>
                        {t('verification_send_fail_dec_1')}<span className={'verification-page2-send'} onClick={() => setPage(3)}>{t('verification_send_fail_dec_2')}</span>{t('verification_send_fail_dec_3')}
                    </div>
                </div>
            ) :  (
                <div className={'verification-page'}>
                    {!isHandSend && <img className={'verification-page3-back-icon'} src={ic_back_white} onClick={() => setPage(2)}/>}
                    {isHandSend ? (
                        <div className={'verification-title-layout'}>
                            <span className={'verification-title-text'}>
                                {t('login_or_register')}
                            </span>
                            <img className={'verification-info-icon'} src={ic_question} onClick={() => setPopVisible(true)}/>
                        </div>
                    ) : (
                        <span className={'verification-page3-verification-text'}>
                            {t('verification')}
                        </span>
                    )}
                    <span className={'verification-page3-verification-desc'} styles={isHandSend ? { marginTop: 0 } : {}}>
                        {t(isHandSend ? 'verification_haven_not_logged_in' : 'verification_send_email_desc')}
                    </span>
                    <div className={'verification-page3-content-layout'}>
                        <span className={'verification-page3-send-to-text'}>
                            {t('verification_send_to')}
                        </span>
                        <div className={'verification-page3-send-to-email-wrapper'}>
                            <span className={'verification-page3-send-to-email'}>
                                {sendEmail}
                            </span>
                            <img className={'verification-page3-send-to-email-copy-icon'} src={ic_copy} onClick={() => {
                                showOnlyCopy(sendEmail);
                            }}/>
                        </div>
                        <div className={'verification-page3-line'} />
                        <span className={'verification-page3-body-text'}>
                            {t('verification_body')}
                        </span>
                        <div className={'verification-page3-pk-wrapper'}>
                            <span className={'verification-page3-pk'}>
                                {'PK:' +  publicKey.substring(0, 18) + '...' + publicKey.substring(publicKey.length - 18)}
                            </span>
                            <img className={'verification-page3-pk-copy-icon'} src={ic_copy} onClick={() => {
                                showOnlyCopy('PK:' + publicKey);
                            }}/>
                        </div>
                        <div className={'verification-page3-line'} />
                        <span className={'verification-page3-subject-no-required'}>{t('verification_subject-not-required')}</span>
                        <img className={'verification-page3-email-img'} src={img_email}/>
                    </div>
                    <div className={'flex-full'}></div>
                    <Button style={{marginTop: 24}} text={t('verification_i_have_sent')} onClick={async () => {
                        setPage(2);
                    }} />
                </div>
            )}
            {popVisible && (
                <div className={'verification-pop-layout'} onClick={() => {}}>
                    <span className={'verification-pop-title'}>
                        {t('verification_pop_title')}
                    </span>
                    <span className={'verification-pop-desc'}>
                        {t('verification_pop_desc')}
                    </span>
                </div>
            )}
        </div>
    );
}

