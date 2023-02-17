import {createContainer, ensureDocument} from "./helpers/DocumentUtils";
import {getStyle} from "./helpers/StyleRenderer";
import ConfigProvider from "./contexts/ConfigProvider";
import NavigateProvider from "./contexts/NavigateProvider";
import * as ReactDOMClient from "react-dom/client";
import React from "react";
import CrescentView from "./views/CrescentView";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh-cn.json";


const CrescentEntry = (props) => {
    const document = ensureDocument(props.document)
    const element = props.container || document.body;
    const style = getStyle(props.style);

    const container = createContainer(element, document, style);

    const connectAccount = (account) => {
        console.log('account = ', account);
    }

    i18n.use(initReactI18next).init({
        lng: props.language || 'en', // 默认语言
        fallbackLng: 'en', // 备选语言
        debug: true, // 开启 debug 模式
        resources: {
            en: {
                translation: en
            },
            zh: {
                translation: zh
            }
        }
    });

    const content = (
        <ConfigProvider config={props}>
            <NavigateProvider initView={'SetPassword'}>
                <CrescentView />
            </NavigateProvider>
        </ConfigProvider>
    );
    const root = ReactDOMClient.createRoot(container);
    root.render(content);

    const unmount = () => {
        root.unmount();
    };

    return unmount;
}

export default CrescentEntry;
