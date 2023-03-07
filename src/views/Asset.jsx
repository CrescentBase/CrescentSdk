import React, {useContext, useEffect, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ic_back_white from "../assets/ic_back_white.png"
import ic_address from "../assets/ic_address.png"
import ic_up from "../assets/ic_up.png"
import ic_down from "../assets/ic_down.png"
import ic_send from "../assets/ic_send.png"
import ic_receive from "../assets/ic_receive.png"
import ic_history from "../assets/ic_history.png"
import ic_copy from "../assets/ic_copy.png"

import {ChainType} from "../helpers/Config";
import {useTranslation} from "react-i18next";
import PopContext from "../contexts/PopContext";

export default (props)=>{
    const { showAddressCopied } = useContext(PopContext)
    const { navigate } = useContext(NavigateContext);
    const asset = props.params.asset;
    const { t } = useTranslation();
    const [showAddressPop, setShowAddressPop] = useState(false);

    const chainTypeMap = {
        [ChainType.Ethereum]: {
            color: '#627EEA',
            name: t('eth_etwork')
        },
        [ChainType.Arbitrum]: {
            color: '#23A1F0',
            name: t('arbitrum_network')
        },
        [ChainType.Polygon]: {
            color: '#8247E5',
            name: t('polygon_network')
        },
        [ChainType.Bsc]: {
            color: '#FEBF27',
            name: t('bsc_network')
        },
    }

    return (
        <div className={'asset'}>
            <div className={'asset-base'} onClick={() => {
                if (showAddressPop) {
                    setShowAddressPop(false);
                }
            }}>
                <img className={'asset-title-back-icon'} src={ic_back_white} onClick={() => navigate('Main')}/>
                <div className={'asset-tilte-line'}/>
                <div className={'asset-content-layout'}>
                    <div className={'asset-top-layout'}>
                        <img className={'asset-token-logo'} src={asset.image}/>
                        <div className={'asset-top-right-layout'}>
                            <div className={'asset-tokenname-and-price'}>
                            <span className={'asset-token-name'}>
                                {asset.symbol}
                            </span>
                                {!asset.nativeCurrency && <img className={'asset-address-copy-icon'} src={ic_address} onClick={() => setShowAddressPop(true)}/>}
                                <div className={'flex-full'}/>
                                <span className={'asset-token-price'}>
                                {asset.price}
                            </span>
                            </div>
                            <div className={'asset-chain-and-price-change'}>
                                <div className={'asset-chain-name'} style={{borderColor: chainTypeMap[asset.chainType].color, color: chainTypeMap[asset.chainType].color}}>
                                    {chainTypeMap[asset.chainType].name}
                                </div>
                                <div className={'flex-full'}/>
                                <div className={'asset-price-change-text'} style={asset.change24h < 0 ? {color: 'var(--function-color-2)'} : {}}>
                                    <img className={'asset-price-change-icon'} src={asset.change24h < 0 ? ic_down : ic_up}/>
                                    {asset.change24h}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'flex-full'}/>
                    <span className={'asset-balance-tip'}>
                        {t('balance')}
                    </span>
                        <span className={'asset-balance'}>
                        {asset.amount}
                    </span>
                        <div className={'flex-full'}/>
                        <span className={'asset-networth-tip'}>
                        {t('networth')}
                    </span>
                        <span className={'asset-networth'}>
                        {asset.balanceFiatUsd}
                    </span>

                    <div className={'flex-full'}/>
                    <div className={'flex-full'}/>
                    <div className={'asset-action-layout'}>
                        <div className={'asset-action-item-layout'}  onClick={() => navigate('Send', { asset})}>
                            <img className={'asset-action-icon'} src={ic_send}/>
                            <span className={'asset-action-text'}>
                            {t('send')}
                        </span>
                        </div>
                        <div style={{width: 12}}></div>
                        <div className={'asset-action-item-layout'} onClick={() => navigate('Receive', { asset})}>
                            <img className={'asset-action-icon'} src={ic_receive}/>
                            <span className={'asset-action-text'}>
                            {t('receive')}
                        </span>
                        </div>
                        <div style={{width: 12}}></div>
                        <div className={'asset-action-item-layout'} onClick={() => navigate('History', { asset, fromAsset: true})}>
                            <img className={'asset-action-icon'} src={ic_history}/>
                            <span className={'asset-action-text'}>
                            {t('tx_history')}
                        </span>
                        </div>
                    </div>
                </div>
            </div>

            {showAddressPop && (
                <div className={'asset-address-pop-layout'}>
                    <div className={'asset-address-pop-contract'}>
                        {t('contract_address')}
                    </div>
                    <div className={'asset-address-pop-address-detail-layout'} onClick={() => {
                        showAddressCopied(asset.tokenAddress);
                        setShowAddressPop(false);
                    }}>
                        <span className={'asset-address-pop-address-detail'}>
                            {asset.tokenAddress ? asset.tokenAddress.substring(0, 13) + '...' + asset.tokenAddress.substring(30) : ''}
                        </span>
                        <img className={'asset-address-pop-address-copy-icon'} src={ic_copy}/>
                    </div>
                </div>
            )}
        </div>
    );
}
