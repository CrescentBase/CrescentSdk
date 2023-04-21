import React, {useContext, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
// import ic_set_language_solid from "../assets/ic_set_language_solid.png"
// import ic_set_safe_solid from "../assets/ic_set_safe_solid.png"
// import ic_back_white from "../assets/ic_back_white.png"
import {getBackIcon, getLanguageIcon, getSafeIcon, getSettingEnterIcon, getSettingSwitchIcon} from "../helpers/GetIcon";
// import ic_setting_enter from "../assets/ic_setting_enter.png"
// import ic_setting_switch from "../assets/ic_setting_switch.png"
import { useTranslation } from 'react-i18next';
import {LOCAL_STORAGE_LANGUAGE} from "../helpers/StorageUtils";
import ConfigContext from "../contexts/ConfigContext";

export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const ic_back_white = getBackIcon();
    const ic_set_language_solid = getLanguageIcon();
    const ic_set_safe_solid = getSafeIcon();
    const ic_setting_enter = getSettingEnterIcon();
    const ic_setting_switch = getSettingSwitchIcon();
    const { isWeb } = useContext(ConfigContext);
    const { t, i18n } = useTranslation();

    return (
        <div className={'setting'} style={isWeb ? { paddingLeft: 25, paddingRight: 25} : {}}>
            <div className={'setting-title-layout'} onClick={() => navigate("Main")}>
                <img src={ic_back_white} className={'setting-title-back-icon'}/>
                <div className={'setting-title-text'}>{t('settings')}</div>
            </div>

            <div className={'setting-title-line'} style={isWeb ? { paddingLeft: -25, paddingRight: -25} : {}}/>
            <div className={'setting-content-layout'}>
                <div className={'setting-item-wrap'} onClick={() => navigate("BindEmail")}>
                    <img className={'setting-item-icon'} src={ic_set_safe_solid}/>
                    <div className={'setting-item-name'}>
                        {t('bind_with_email')}
                    </div>
                    <div className={'flex-full'}/>
                    <img className={'setting-item-arrow'} src={ic_setting_enter}/>
                </div>

                <div className={'setting-line'} />

                <div className={'setting-item-wrap'} onClick={() => {
                    const nextLng = i18n.language == 'en' ? 'zh' : 'en';
                    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, nextLng);
                    i18n.changeLanguage(nextLng);

                }}>
                    <img className={'setting-item-icon'} src={ic_set_language_solid}/>
                    <div className={'setting-item-name'}>
                        {t('language')}
                    </div>
                    <div className={'flex-full'}/>
                    <div className={'setting-item-state'}>
                        {t('current_lng')}
                    </div>
                    <img className={'setting-item-arrow'} src={ic_setting_switch}/>
                </div>
            </div>

        </div>
    );
}

