import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './en.json';
import zh from './zh-cn.json';

export function ILocal(name) {
    const { t } = useTranslation();
    return t(name);
}

export function ChangeLanguage() {
    const { i18n } = useTranslation();
    // i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
    i18n.changeLanguage('zh')
    // i18n.changeLanguage('zh')
    console.log('==i18n.language = ', i18n.language);

}

export function GetLanguage() {
    const { i18n } = useTranslation();
    return i18n.language;
}

