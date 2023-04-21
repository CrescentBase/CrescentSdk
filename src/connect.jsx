import React from "react";
import {createContainer, ensureDocument} from "./helpers/DocumentUtils";
import {getStyle} from "./helpers/StyleRenderer";
import ConfigProvider from "./contexts/ConfigProvider";
import NavigateProvider from "./contexts/NavigateProvider";
import PopProvider from "./contexts/PopProvider";
import * as ReactDOMClient from "react-dom/client";
import CrescentView from "./views/CrescentView";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh-cn.json";
import {LOCAL_STORAGE_LANGUAGE, LOCAL_STORAGE_WALLET_KEYSTORE} from "./helpers/StorageUtils";
import {setIsFromWeb} from "./helpers/Utils";
import {setIsLight} from "./helpers/GetIcon";

const connect = (props) => {
    const document = ensureDocument(props.document)
    const element = props.container || document.body;
    const style = getStyle(props.style);

    const container = createContainer(element, document, style);

    const language = localStorage.getItem(LOCAL_STORAGE_LANGUAGE);

    const initData = window.Telegram?.WebApp?.initDataUnsafe;
    let userLanguage = 'en';
    if (initData) {
        const language_code = initData?.user?.language_code;
        if (language_code) {
            if (language_code.indexOf('zh') !== -1) {
                userLanguage = 'zh';
            }
        }
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

    let initView = "CreateLoading"
    // initView = "BindEmail";

    setIsFromWeb(true);
    setIsLight(props.isLight);

    const content = (
        <ConfigProvider config={{...props, platform: 3, isWeb: true }}>
            <div className="App" style={{ justifyContent: 'center' }}>
                <div style={{width: props.width || 400, height: props.height || 520}} onClick={e => e.stopPropagation()}>
                    <div className={'content'} id={'crescent-content'}>
                        <PopProvider>
                            <div className={'content-inter'}>
                                <NavigateProvider initView={initView}>
                                    <CrescentView id={'CrescentViewId'}/>
                                </NavigateProvider>
                            </div>
                        </PopProvider>
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

export default connect;
