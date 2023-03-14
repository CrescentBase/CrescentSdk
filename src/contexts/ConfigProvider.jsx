import ConfigContext from './ConfigContext'
import React, {useState} from 'react'
import {ChainType} from "../helpers/Config";
import {useTranslation} from "react-i18next";

export default (props)=>{
    const { t } = useTranslation();
    const [wallet, setWallet] = useState(null);

    const ChainDisplayNames = {
        [ChainType.All]: {
            displayName: t('all_network'),
        },
        [ChainType.Ethereum]: {
            displayName: t('eth_etwork'),
        },
        [ChainType.Polygon]: {
            displayName: t('polygon_network'),
        },
        [ChainType.Arbitrum]: {
            displayName:  t('arbitrum_network'),
        },
        [ChainType.Bsc]: {
            displayName: t('bsc_network'),
        },
    };

    return(
        <ConfigContext.Provider value={{...props.config, ChainDisplayNames, wallet, setWallet}}>
            { props.children }
        </ConfigContext.Provider>
    )


}

