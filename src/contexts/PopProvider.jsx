import React, { useState} from "react";
import PopContext from "./PopContext";
import ic_success_white from "../assets/ic_success_white.png";
import {useTranslation} from "react-i18next";

export default (props) => {
    const { t } = useTranslation();
    const [copiedPop, setCopiedPop] = useState(false);
    const [isTxHash, setIsTxHash] = useState(false);

    const showAddressCopied = (text) => {
        try {
            navigator.clipboard.writeText(text);
        } catch (err) {
        }
        setIsTxHash(false);
        setCopiedPop(true);
        setTimeout(() => {
            setCopiedPop(false);
        }, 2000);
    }

    const showTxHashCopied = (text) => {
        try {
            navigator.clipboard.writeText(text);
        } catch (err) {
        }
        setIsTxHash(true);
        setCopiedPop(true);
        setTimeout(() => {
            setCopiedPop(false);
        }, 2000);
    }

    const renderCopiedPop = () => {
        return (
            <div className={'pop-provider-address-copied-layout'}>
                <img className={'pop-provider-address-copied-icon'} src={ic_success_white}/>
                <div className={'pop-provider-address-copied-text'}>
                    {isTxHash ? t('hash_copied_to_clipboard') : t('address_copied')}
                </div>
            </div>
        );
    }

    return (
        <PopContext.Provider value={{ showAddressCopied, showTxHashCopied }}>
            {props.children}
            {copiedPop && renderCopiedPop()}
        </PopContext.Provider>
    );
};
