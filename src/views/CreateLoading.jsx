import React, {useContext, useEffect} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ConfigContext from "../contexts/ConfigContext";
import {callToNativeMsg} from "../helpers/Utils";
import {useTranslation} from "react-i18next";
import {LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_PUBLIC_ADDRESS} from "../helpers/StorageUtils";
import {getSender} from "../helpers/UserOp";

export default (props)=>{
    const { t } = useTranslation();

    const { navigate } = useContext(NavigateContext);
    const { removeLoading, emailAccount } = useContext(ConfigContext);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_EMAIL, emailAccount);
        const preDate = new Date().getTime();
        getSender(emailAccount).then(sender => {
            if (!sender) {
                callToNativeMsg("error;create");
                return;
            }
            localStorage.setItem(LOCAL_STORAGE_PUBLIC_ADDRESS, sender);
            const nextDate = new Date().getTime();
            const disDate = 2000 - (nextDate - preDate);
            const delay = Math.max(disDate, 0)
            setTimeout(() => {
                navigate('SetPassword');
                removeLoading && removeLoading();
                callToNativeMsg("back = " + emailAccount);
            }, delay);
        })
        // let sender = await getSender(emailAccount);
        // if (!sender) {
        //     sender = await getSender(emailAccount);
        // }
        // if (!sender) {
        //     callToNativeMsg("error;create");
        // }
        // console.log('===sender = ', sender);

    }, []);

    return (
        <div className={'create-loading'}>
        </div>
    );
}
