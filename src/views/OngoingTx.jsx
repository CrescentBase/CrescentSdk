import React, {useContext} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ic_back_white from "../assets/ic_back_white.png";
import ic_attention from "../assets/ic_attention.png";
import ic_copy from "../assets/ic_copy.png";
import ic_success_green from "../assets/ic_success_green.png";
import {useTranslation} from "react-i18next";
import { ChainType, NetworkConfig } from "../helpers/Config";
import PopContext from "../contexts/PopContext";
import loading_ongoing from "../assets/loading_ongoing.json";
import Lottie from "react-lottie";
import ConfigContext from "../contexts/ConfigContext";
export default (props)=>{
    const { t } = useTranslation();
    const { navigate } = useContext(NavigateContext);
    const { showTxHashCopied, showAddressCopied } = useContext(PopContext)

    const token1 = {
        isTime: true,
        formatTime: 'Jan 25, 2023'
    }

    const token3 = {
        isTime: false,
        isGasItem: false,
        gasValue: 0.05,
        type: ChainType.Ethereum,
        logo: 'https://www.sohamkamani.com/favicon/favicon.ico',
        symbol: 'GRT',
        isApproval: false,
        fromAddress: '0x7b319aa22Ef7827896dDAbB3bd4b6b046C8170e5',
        toAddress: '0x7b319aa22Ef7827896dDAbB3bd4b6b046C8170e5',
        showAmount: true,
        formatAmount: '-165',
        incoming: false,
        formatTime: 'Jan 25, 2023',
        transactionHash: '0x00e1d18496ec01c44e2b08f438fb6c8c313e6d1d281e8fadd9085803903d1008',
        time: '3:00 PM',
        isFinish: true
    }

    const renderTime = (item) => (
        <span className={'ongoingtx-time-text'}>{item.formatTime}</span>
    );

    const renderNormalTx = (item) => {
        return (
            <div className={'ongoingtx-item-layout'}>
                <div className={'ongoingtx-item-row-layout'}>
                    <div className={'ongoingtx-item-icon-layout'}>
                        <img className={'ongoingtx-item-icon'} src={item.logo}/>
                        <img className={'ongoingtx-item-chain-tag'} src={NetworkConfig[item.type].tag}/>
                    </div>
                    <div className={'ongoingtx-item-symbol-layout'}>
                        <span className={'ongoingtx-item-symbol'}>
                            {item.symbol}
                        </span>
                        <span className={'ongoingtx-item-to-address'} onClick={() => showAddressCopied(item.toAddress)}>
                            {t('to') + ' ' + item.toAddress.substring(0, 4) + '...' + item.toAddress.substring(item.toAddress.length - 4)}
                        </span>
                    </div>

                    <div className={'flex-full'}/>
                    <span className={item.incoming ? 'ongoingtx-item-amount-add' : 'ongoingtx-item-amount-reduce'}>
                        {item.formatAmount}
                    </span>
                </div>
                <div className={'ongoingtx-item-row-layout'} style={{ marginTop: 16}}>
                    {item.isFinish ? (
                        <img className={'ongoingtx-item-txhash-icon'} src={ic_success_green}/>
                    ) : (
                        <Lottie options={{
                            isClickToPauseDisabled: false,
                            loop: true,
                            autoplay: true,
                            animationData: loading_ongoing,
                            rendererSettings: {
                                preserveAspectRatio: 'xMinYMin meet'
                            }
                        }}
                                height={16}
                                width={16}
                        />
                    )}
                    <span className={'ongoingtx-item-txhash-text'}>{item.transactionHash.substring(0, 4) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</span>
                    <img className={'ongoingtx-item-copy-icon'} src={ic_copy} onClick={() => showTxHashCopied(item.transactionHash)}/>
                    <div className={'flex-full'}/>
                    <span className={'ongoingtx-item-txhash-text'}>
                        {item.time}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className={'ongoingtx'}>
            <div className={'ongoingtx-base'}>
                <div className={'ongoingtx-tilte-layout'} onClick={() => navigate('Main')}>
                    <img className={'ongoingtx-title-back-icon'} src={ic_back_white} />
                    <span className={'ongoingtx-title-text'}>
                        {t('ongoing_tx')}
                    </span>
                </div>

                <div className={'ongoingtx-tilte-line'}/>
                <div className={'ongoingtx-content-layout'}>
                    <div className={'flex-col'}>
                        {renderTime(token1)}
                        {renderNormalTx(token3)}
                        <span className={'ongoingtx-no-more-transactions'}>
                            {t('no_more_transactions')}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}
