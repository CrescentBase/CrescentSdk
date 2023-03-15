import React, {useContext, useEffect, useState} from "react";
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
import {LOCAL_STORAGE_ONGOING_INFO} from "../helpers/StorageUtils";
import {formatTimestamp, isSameDay} from "../helpers/DateUtils";
import {renderShortValue} from "../helpers/number";
export default (props)=>{
    const { t } = useTranslation();
    const { navigate } = useContext(NavigateContext);
    const { showTxHashCopied, showAddressCopied } = useContext(PopContext)
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const ongoingInfos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ONGOING_INFO)) || [];
        let tokens = ongoingInfos;
        if (ongoingInfos > 1) {
            tokens = ongoingInfos.sort((a, b) => a.txTime - b.txTime);
        }
        setTokens(tokens);
    }, [])

    const renderTime = (item) => {
        const timestamp = item.txTime;
        const date = new Date(timestamp);
        const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
        return (
            <span className={'ongoingtx-time-text'}>{formattedDate}</span>
        )
    }

    const renderNormalTx = (item) => {
        return (
            <div className={'ongoingtx-item-layout'}>
                <div className={'ongoingtx-item-row-layout'}>
                    <div className={'ongoingtx-item-icon-layout'}>
                        <img className={'ongoingtx-item-icon'} src={item.image}/>
                        <img className={'ongoingtx-item-chain-tag'} src={NetworkConfig[item.chainType].tag}/>
                    </div>
                    <div className={'ongoingtx-item-symbol-layout'}>
                        <span className={'ongoingtx-item-symbol'}>
                            {item.symbol}
                        </span>
                        <span className={'ongoingtx-item-to-address'} onClick={() => showAddressCopied(item.toAddress)}>
                            {t('to') + ' ' + item.toAddress?.substring(0, 4) + '...' + item.toAddress?.substring(item.toAddress?.length - 4)}
                        </span>
                    </div>

                    <div className={'flex-full'}/>
                    <span className={'ongoingtx-item-amount-reduce'}>
                        -{renderShortValue(item.txAmount)}
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
                    <span className={'ongoingtx-item-txhash-text'}>{item.txHash.substring(0, 4) + '...' + item.txHash.substring(item.txHash.length - 4)}</span>
                    <img className={'ongoingtx-item-copy-icon'} src={ic_copy} onClick={() => showTxHashCopied(item.txHash)}/>
                    <div className={'flex-full'}/>
                    <span className={'ongoingtx-item-txhash-text'}>
                        {formatTimestamp(item.txTime)}
                    </span>
                </div>
            </div>
        )
    }

    const renderTokens = () => {
        return (
            tokens.map((item, index) => {
                if (index === 0 || !isSameDay(tokens[index - 1].txTime, item.txTime)) {
                    return (
                        <div className={'flex-col'}>
                            {renderTime(item)}
                            {renderNormalTx(item)}
                        </div>
                    )
                }
                return renderNormalTx(item);
            })
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
                        {renderTokens(tokens)}
                        <span className={'ongoingtx-no-more-transactions'}>
                            {t('no_more_transactions')}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}
