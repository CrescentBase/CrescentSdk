import React from "react";
import {useTranslation} from "react-i18next";
import loadig_index from "../assets/loadig_index.json";
import Lottie from "react-lottie";

export default (props)=>{
    const { t } = useTranslation();

    return (
        <div className={'create-loading'}>
            <Lottie style={{marginTop: 17}} options={{
                loop: true,
                autoplay: true,
                animationData: loadig_index,
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                }
            }}
                    height={48}
                    width={48}
            />
            <span className={'create-loading-text'}>
                {t('loading')}
            </span>
        </div>
    );
}
