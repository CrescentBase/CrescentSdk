import React, { useState} from "react";
import PopContext from "./PopContext";
import ic_success_white from "../assets/ic_success_white.png";
import {useTranslation} from "react-i18next";

export default (props) => {
    const { t } = useTranslation();
    const [addressCopied, setAddressCopied] = useState(false);

    const showAddressCopied = () => {
        setAddressCopied(true);
        setTimeout(() => {
            setAddressCopied(false);
        }, 2000);
    }


    const renderAddressCopied = () => {
        return (
            <div className={'pop-provider-address-copied-layout'}>
                <img className={'pop-provider-address-copied-icon'} src={ic_success_white}/>
                <div className={'pop-provider-address-copied-text'}>
                    {t('address_copied')}
                </div>
            </div>
        );
    }

    return (
        <PopContext.Provider value={{ showAddressCopied }}>
            {props.children}
            {addressCopied && renderAddressCopied()}
        </PopContext.Provider>
    );
};
