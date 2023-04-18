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
// import ic_close from "./assets/ic_close.png";
import ic_connect_metamask from "./assets/ic_connect_metamask.png";
import ic_connect_crescent from "./assets/ic_connect_crescent.png";
import {getCloseIcon} from "./helpers/GetIcon";

const connect2 = (props) => {
    const ic_close = getCloseIcon();
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

    let initView = "SelectEmail"
    const keystoreKey = localStorage.getItem(LOCAL_STORAGE_WALLET_KEYSTORE);
    if (keystoreKey || props.walletJson) {
        initView = "Login";
    }

    // initView = "Verification"
    setIsFromWeb(true);

    const root = ReactDOMClient.createRoot(container);

    const content = (
        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className={'select-platform'} onClick={e => e.stopPropagation()}>
                <div className={'select-platform-title-wrap'}>
                    <span className={'select-platform-title'}>{userLanguage === 'zh' ? '连接钱包' : 'Connect a Wallet'}</span>
                    <img src={ic_close} className={'select-platform-title-close'} onClick={() => {
                        props.onClose && props.onClose();
                    }}/>
                </div>
                <div className={'select-platform-item'} onClick={async () => {
                    if (typeof window.ethereum !== 'undefined') {
                        console.log('Metamask is installed!');
                        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const address = accounts[0];
                        console.log(address);
                    }
                }}>
                    <span className={'select-platform-item-title'}>MetaMask</span>
                    <img src={ic_connect_metamask} className={'select-platform-item-icon'}/>
                </div>
                <div className={'select-platform-item'} onClick={() => {
                    const content1 = (
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
                    root.render(content1);
                }}>
                    <span className={'select-platform-item-title'}>MetaMask</span>
                    <img src={ic_connect_crescent} className={'select-platform-item-icon'}/>
                </div>
            </div>
        </div>
    );

    root.render(content);

    const unmount = () => {
        root.unmount();
    };

    return unmount;
}

export default connect2;
