import ConfigContext from './ConfigContext'
import React, {useState} from 'react'
import ic_eth_tag from "../assets/ic_eth_tag.png";
import ic_polygon_tag from "../assets/ic_polygon_tag.png";
import ic_bsc_tag from "../assets/ic_bsc_tag.png";
import ic_arb_tag from "../assets/ic_arb_tag.png";
import {ChainType} from "../helpers/Config";
import {useTranslation} from "react-i18next";
import img_card_all from "../assets/img_card_all";
import img_card_eth from "../assets/img_card_eth";
import img_card_polygon from "../assets/img_card_polygon";
import img_card_arb from "../assets/img_card_arb";
import img_card_bsc from "../assets/img_card_bsc";
import ic_card_all from "../assets/ic_card_all.png";
import ic_card_eth from "../assets/ic_card_eth.png";
import ic_card_polygon from "../assets/ic_card_polygon.png";
import ic_card_arb from "../assets/ic_card_arb.png";
import ic_card_bsc from "../assets/ic_card_bsc.png";
import ic_card_all_alpha from "../assets/ic_card_all_alpha.png";
import ic_card_eth_alpha from "../assets/ic_card_eth_alpha.png";
import ic_card_polygon_alpha from "../assets/ic_card_polygon_alpha.png";
import ic_card_arb_alpha from "../assets/ic_card_arb_alpha.png";
import ic_card_bsc_alpha from "../assets/ic_card_bsc_alpha.png";

export default (props)=>{
    const { t } = useTranslation();
    
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
        <ConfigContext.Provider value={{...props.config, ChainDisplayNames}}>
            { props.children }
        </ConfigContext.Provider>
    )


}

