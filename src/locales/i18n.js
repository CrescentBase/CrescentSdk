import { useTranslation } from 'react-i18next';

///greeting: 'Hello, {{name}}!',
//const { t } = useTranslation();
//   return <div>{t('greeting', { name })}</div>;
export function ILocal(name) {
    const { t } = useTranslation();
    return t(name);
}


