import React, {useContext, useEffect, useState} from "react";
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

const CrescentEntry = (props) => {
    const document = ensureDocument(props.document)
    const element = props.container || document.body;
    const style = getStyle(props.style);

    const container = createContainer(element, document, style);

    const connectAccount = (account) => {
        console.log('account = ', account);
    }

    const language = localStorage.getItem('language');

    if (!i18n.use(initReactI18next).isInitialized) {
        i18n.use(initReactI18next).init({
            lng: language || props.language || 'en', // 默认语言
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
                        <PopProvider>
                            <div className={'content-inter'}>
                                <NavigateProvider initView={props.initView || 'Login'}>
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

export default CrescentEntry;
