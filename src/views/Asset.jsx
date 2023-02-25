import React, {useContext, useState} from "react";
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

    const { t } = useTranslation();

    const [showAddressPop, setShowAddressPop] = useState(false);

    const token = {
        logo: 'https://www.sohamkamani.com/favicon/favicon.ico',
        name: 'GRT',
        chainType: ChainType.Bsc,
        price: 12.33,
        priceChange: -15.5,
        balance: 57000.33652,
        networth: 125311253122328,
        address: 'fjslkdfjalkfjslksffjflasjflaksdjflfsdfsdfdsf'
    };
   // , t('polygon_network'), t('arbitrum_network'), t('bsc_network')
    const chanTypeMap = {
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

    const { navigate } = useContext(NavigateContext);
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
                            <img className={'asset-token-logo'} src={token.logo}/>
                            <div className={'asset-top-right-layout'}>
                                <div className={'asset-tokenname-and-price'}>
                                <span className={'asset-token-name'}>
                                    {token.name}
                                </span>
                                    <img className={'asset-address-copy-icon'} src={ic_address} onClick={() => setShowAddressPop(true)}/>
                                    <div className={'flex-full'}/>
                                    <span className={'asset-token-price'}>
                                    ${token.price}
                                </span>
                                </div>
                                <div className={'asset-chain-and-price-change'}>
                                    <div className={'asset-chain-name'} style={{borderColor: chanTypeMap[token.chainType].color, color: chanTypeMap[token.chainType].color}}>
                                        {chanTypeMap[token.chainType].name}
                                    </div>
                                    <div className={'flex-full'}/>
                                    <div className={'asset-price-change-text'} style={token.priceChange < 0 ? {color: 'var(--function-color-2)'} : {}}>
                                        <img className={'asset-price-change-icon'} src={token.priceChange < 0 ? ic_down : ic_up}/>
                                        15.5%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'flex-full'}/>
                        <span className={'asset-balance-tip'}>
                        {t('balance')}
                    </span>
                        <span className={'asset-balance'}>
                        {token.balance}
                    </span>
                        <div className={'flex-full'}/>
                        <span className={'asset-networth-tip'}>
                        {t('networth')}
                    </span>
                        <span className={'asset-networth'}>
                        {token.networth}
                    </span>

                        <div className={'flex-full'}/>
                        <div className={'flex-full'}/>
                        <div className={'asset-action-layout'}>
                            <div className={'asset-action-item-layout'}>
                                <img className={'asset-action-icon'} src={ic_send}/>
                                <span className={'asset-action-text'}>
                                {t('send')}
                            </span>
                            </div>
                            <div style={{width: 12}}></div>
                            <div className={'asset-action-item-layout'}>
                                <img className={'asset-action-icon'} src={ic_receive}/>
                                <span className={'asset-action-text'}>
                                {t('receive')}
                            </span>
                            </div>
                            <div style={{width: 12}}></div>
                            <div className={'asset-action-item-layout'} onClick={() => navigate('History')}>
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
                            {t('contract_address_colon')}
                        </div>
                        <div className={'asset-address-pop-address-detail-layout'} onClick={() => {
                            showAddressCopied();
                            setShowAddressPop(false);
                        }}>
                            <span className={'asset-address-pop-address-detail'}>
                                {token.address ? token.address.substring(0, 13) + '...' + token.address.substring(30) : ''}
                            </span>
                            <img className={'asset-address-pop-address-copy-icon'} src={ic_copy}/>
                        </div>
                    </div>
                )}
            </div>
        );
}
