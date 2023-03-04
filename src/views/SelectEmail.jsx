import React, {useContext} from "react";
import img_logo from '../assets/img_logo.png';
import ic_login_google from '../assets/ic_login_google.png';
import ic_login_outlook from '../assets/ic_login_outlook.png';
import {ILocal } from '../locales/i18n'
import ConfigContext from "../contexts/ConfigContext";
import {callToNativeMsg, isPcPlatform} from "../helpers/Utils";

export default (props)=>{

    const { platform } = useContext(ConfigContext);

    return (
        <div className={'select-email'}>
            <img className={'select-email-logo'} src={img_logo}/>
            <div className={'select-email-with-email'}>
                {ILocal('login_with')}
            </div>
            <div className={'select-email-email-layout'}>
                <div className={'select-email-email-layout-inter'}>
                    <div className={'select-email-email-wrap'} onClick={() => {
                        if (isPcPlatform(platform)) {
                            // navigate('CreateLoading')
                        } else {
                            callToNativeMsg('gmail', platform)
                        }
                    }}>

                        <img className={'select-email-email-logo'} src={ic_login_google} />
                        <div className={'select-email-email-name'}>
                            Google
                        </div>
                    </div>
                    <div className={'select-email-email-wrap'} onClick={() => callToNativeMsg('outlook', platform)}>
                        <img className={'select-email-email-logo'} src={ic_login_outlook} />
                        <div className={'select-email-email-name'}>
                            Outlook
                        </div>
                    </div>
                    <div className={'select-email-email-wrap-empty'} />
                    <div className={'select-email-email-wrap-empty'} />
                </div>
            </div>

            <div className={'select-email-powered-by'}>
                {ILocal('powered_by')}V1.0.0
            </div>
        </div>
    );
}
