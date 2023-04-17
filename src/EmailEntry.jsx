import React from "react";
import {createContainer, ensureDocument} from "./helpers/DocumentUtils";
import {getStyle} from "./helpers/StyleRenderer";
import ConfigProvider from "./contexts/ConfigProvider";
import * as ReactDOMClient from "react-dom/client";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh-cn.json";
import SelectEmail from "./views/SelectEmail";
import {LOCAL_STORAGE_LANGUAGE} from "./helpers/StorageUtils";
import CrescentView from "./views/CrescentView";
import NavigateProvider from "./contexts/NavigateProvider";

const EmailEntry = (props) => {
    const document = ensureDocument(props.document)
    const element = props.container || document.body;
    const style = getStyle(props.style);

    const container = createContainer(element, document, style);

    const language = localStorage.getItem(LOCAL_STORAGE_LANGUAGE);
    let userLanguage = navigator.language || navigator.userLanguage;
    if (userLanguage.indexOf('zh') !== -1) {
        userLanguage = 'zh';
    }

    if (!i18n.use(initReactI18next).isInitialized) {
        i18n.use(initReactI18next).init({
            lng: language || props.language || userLanguage || 'en', // 默认语言
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
    }

    const content = (
        <ConfigProvider config={props}>
            <div className="App">
                <div style={{width: props.width, height: props.height}}>
                    <div className={'content'} id={'crescent-content'}>
                        <div className={'content-inter'}>
                            <NavigateProvider>
                                <SelectEmail />
                            </NavigateProvider>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
    const root = ReactDOMClient.createRoot(container);
    root.render(content);

    const unmount = () => {
        root.unmount();
    };

    return unmount;
}

export default EmailEntry;
