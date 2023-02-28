import React, {useContext, useState} from "react";
import ic_back_white from "../assets/ic_back_white.png"
import NavigateContext from "../contexts/NavigateContext";
import Button from "../widgets/Button";
import PopContext from "../contexts/PopContext";
import {ChainType} from "../helpers/Config";
import {useTranslation} from "react-i18next";

export default (props)=>{
    const { t } = useTranslation();
    const { navigate } = useContext(NavigateContext);
    const { showAddressCopied } = useContext(PopContext)

    const address = props.address || '0x7b319aa22Ef7827896dDAbB3bd4b6b046C8170e5';
    const name = "GRT";
    const chainType = ChainType.Ethereum;

    const chanTypeMap = {
        [ChainType.Ethereum]: {
            name: t('eth_etwork')
        },
        [ChainType.Arbitrum]: {
            name: t('arbitrum_network')
        },
        [ChainType.Polygon]: {
            name: t('polygon_network')
        },
        [ChainType.Bsc]: {
            name: t('bsc_network')
        },
    }

    return (
        <div className={'receive'}>
            <div className={'receive-base'}>
                <div className={'receive-tilte-layout'} onClick={() => navigate('Asset')}>
                    <img className={'receive-title-back-icon'} src={ic_back_white} />
                    <span className={'receive-title-text'}>
                        {t('receive')}
                    </span>
                </div>

                <div className={'receive-tilte-line'}/>
                <div className={'receive-content-layout'}>
                    <span className={'receive-wallet-address-tip'}>
                        {t('my_wallet_address')}
                    </span>

                    <span className={'receive-address-text'}>
                        {address ? address.substring(0, 13) + '...' + address.substring(30) : ''}
                    </span>

                    <span className={'receive-only-send'}>
                        {t('only_send')}
                    </span>

                    <div className={'receive-chain'}>
                        {t('token_on_chain', {tokenName: name, chainName: chanTypeMap[chainType].name})}
                    </div>

                    <span className={'receive-to-this-address'}>
                        {t('to_this_address')}
                    </span>

                    <div className={'flex-width-full'}>
                        <Button text={t('copy_address')} style={{marginTop: 36, marginLeft: 20, marginRight: 20}} onClick={() => {
                            showAddressCopied(address);
                        }}/>
                    </div>

                </div>
            </div>
        </div>
    );
}

