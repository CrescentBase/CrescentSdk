import React, {useContext, useEffect} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ConfigContext from "../contexts/ConfigContext";
import {callToNativeMsg} from "../helpers/Utils";
import {useTranslation} from "react-i18next";

export default (props)=>{
    const { t } = useTranslation();

    const { navigate } = useContext(NavigateContext);
    const { removeLoading, emailAccount } = useContext(ConfigContext);

    useEffect(() => {
        setTimeout(() => {
            navigate('SetPassword');
            removeLoading();
            callToNativeMsg("back = " + emailAccount);
        }, 2000);
    }, []);

    return (
        <div className={'create-loading'}>
        </div>
    );
}
