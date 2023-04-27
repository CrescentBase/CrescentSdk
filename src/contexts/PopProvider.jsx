import React, { useState} from "react";
import PopContext from "./PopContext";
import ic_success_white from "../assets/ic_success_white.png";
import {useTranslation} from "react-i18next";
import {callToNativeMsg} from "../helpers/Utils";

export default (props) => {
    const { t } = useTranslation();
    const [copiedPop, setCopiedPop] = useState(false);
    const [copyType, setCopyType] = useState(0);


    const showAddressCopied = (text) => {
        try {
            callToNativeMsg("pasteboard;" + text);
            navigator.clipboard.writeText(text);
        } catch (err) {
        }
        setCopyType(1);
        setCopiedPop(true);
        setTimeout(() => {
            setCopiedPop(false);
        }, 2000);
    }

    const showTxHashCopied = (text) => {
        try {
            callToNativeMsg("pasteboard;" + text);
            navigator.clipboard.writeText(text);
        } catch (err) {
        }
        setCopyType(2);
        setCopiedPop(true);
        setTimeout(() => {
            setCopiedPop(false);
        }, 2000);
    }

    const showOnlyCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.csLog("successfully copied");
        }).catch(() => {
            console.csLog("something went wrong");
        });

        setCopyType(3);
        setCopiedPop(true);
        setTimeout(() => {
            setCopiedPop(false);
        }, 2000);
    }

    const renderCopiedPop = () => {
        return (
            <div className={'pop-provider-address-copied-layout'} style={copyType === 3 ? {backgroundColor: 'var(--system-color-2)'} : {}}>
                <img className={'pop-provider-address-copied-icon'} src={ic_success_white}/>
                <div className={'pop-provider-address-copied-text'}>
                    {copyType === 2 ? t('hash_copied_to_clipboard') : copyType === 3 ? t('copy_success') : t('address_copied')}
                </div>
            </div>
        );
    };

    return (
        <PopContext.Provider value={{ showAddressCopied, showTxHashCopied, showOnlyCopy }}>
            {props.children}
            {copiedPop && renderCopiedPop()}
        </PopContext.Provider>
    );
};
