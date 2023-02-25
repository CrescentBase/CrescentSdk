import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './en.json';
import zh from './zh-cn.json';

///greeting: 'Hello, {{name}}!',
//const { t } = useTranslation();
//   return <div>{t('greeting', { name })}</div>;
export function ILocal(name) {
    const { t } = useTranslation();
    return t(name);
}


