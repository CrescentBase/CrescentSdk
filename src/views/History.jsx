import React, {useContext} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ic_back_white from "../assets/ic_back_white.png";
import img_fire from "../assets/img_fire.png";
import ic_attention from "../assets/ic_attention.png";
import ic_copy from "../assets/ic_copy.png";
import ic_gas_fire from "../assets/ic_gas_fire.png";
import img_empty_box from "../assets/img_empty_box";
import {useTranslation} from "react-i18next";
import { ChainType, NetworkConfig } from "../helpers/Config";
import PopContext from "../contexts/PopContext";
export default (props)=>{
    const { t } = useTranslation();
    const { navigate } = useContext(NavigateContext);
    const { showTxHashCopied } = useContext(PopContext)

    const isEmpty = false;
    const asset = props.params.asset;

    const token1 = {
        isTime: true,
        formatTime: 'Jan 25, 2023'
    }

    const token2 = {
        isTime: false,
        isGasItem: true,
        gasValue: 0.05,
        type: ChainType.Ethereum,
        logo: 'https://www.sohamkamani.com/favicon/favicon.ico',
        symbol: 'ETH',
        isApproval: false,
        fromAddress: '0x7b319aa22Ef7827896dDAbB3bd4b6b046C8170e5',
        toAddress: '0x7b319aa22Ef7827896dDAbB3bd4b6b046C8170e5',
        showAmount: true,
        formatAmount: '-165',
        incoming: true,
        formatTime: 'Jan 25, 2023',
        transactionHash: '0x00e1d18496ec01c44e2b08f438fb6c8c313e6d1d281e8fadd9085803903d1008',
        time: '3:00 PM'
    }

    const token3 = {
        isTime: false,
        isGasItem: false,
        gasValue: 0.05,
        type: ChainType.Ethereum,
        logo: 'https://www.sohamkamani.com/favicon/favicon.ico',
        symbol: 'ETH',
        isApproval: false,
        fromAddress: '0x7b319aa22Ef7827896dDAbB3bd4b6b046C8170e5',
        toAddress: '0x7b319aa22Ef7827896dDAbB3bd4b6b046C8170e5',
        showAmount: true,
        formatAmount: '+165',
        incoming: true,
        formatTime: 'Jan 25, 2023',
        transactionHash: '0x00e1d18496ec01c44e2b08f438fb6c8c313e6d1d281e8fadd9085803903d1008',
        time: '3:00 PM'
    }

    // let showAmount = !isApproval && (symbol || decimalValue !== '0');
    // const incoming = isETHClaim || toAddress === selectedAddress;
    // const formatAmount = !incoming ? '-' + decimalValue : '+' + decimalValue;

    const renderEmptyBox = () => {
        return (
            <div className={'history-no-transaction-layout'}>
                <img className={'history-no-transaction-icon'} src={img_empty_box}/>
                <span className={'history-no-transaction-text'}>
                    {t('no_transaction_history')}
                </span>
            </div>
        )
    }

    const renderTime = (item) => (
        <span className={'history-time-text'}>{item.formatTime}</span>
    );

    const renderGasFee = (item) => {
        return (
            <div className={'hirtory-item-layout'}>
                <div className={'history-item-row-layout'}>
                    <div className={'history-item-icon-layout'}>
                        <img className={'history-item-icon'} src={img_fire}/>
                        <img className={'history-item-chain-tag'} src={NetworkConfig[item.type].tag}/>
                    </div>
                    <div className={'history-item-symbol-layout'}>
                        <span className={'history-item-symbol'}>
                            {t('gas_fee')}
                        </span>
                    </div>

                    <div className={'flex-full'}/>
                    <span className={'history-item-amount-reduce'}>
                        -{item.gasValue + " " + NetworkConfig[item.type].ticker}
                    </span>
                </div>
                <div className={'history-item-row-layout'} style={{ marginTop: 16 }}>
                    <img className={'history-item-txhash-icon'} src={ic_attention}/>
                    <span className={'history-item-txhash-text'}>
                        {item.transactionHash.substring(0, 4) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}
                    </span>
                    <img className={'history-item-copy-icon'} src={ic_copy} onClick={() => showTxHashCopied(item.transactionHash)}/>
                    <div className={'flex-full'}/>
                    <span className={'history-item-txhash-text'}>
                        {item.time}
                    </span>
                </div>
            </div>
        )
    }

    const renderNormalTx = (item) => {
        return (
            <div className={'hirtory-item-layout'}>
                <div className={'history-item-row-layout'}>
                    <div className={'history-item-icon-layout'}>
                        <img className={'history-item-icon'} src={item.logo}/>
                        <img className={'history-item-chain-tag'} src={NetworkConfig[item.type].tag}/>
                    </div>
                    <div className={'history-item-symbol-layout'}>
                        <span className={'history-item-symbol'}>
                            {item.symbol}
                        </span>
                        <span className={'history-item-from-address'}>
                            {t('from') + ' ' + item.fromAddress.substring(0, 4) + '...' + item.fromAddress.substring(item.fromAddress.length - 4)}
                        </span>
                    </div>

                    <div className={'flex-full'}/>
                    <span className={item.incoming ? 'history-item-amount-add' : 'history-item-amount-reduce'}>
                        {item.formatAmount}
                    </span>
                </div>
                <div className={'history-item-row-layout'} style={{ marginTop: 16 }}>
                    <img className={'history-item-txhash-icon'} src={ic_attention}/>
                    <span className={'history-item-txhash-text'}>{item.transactionHash.substring(0, 4) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</span>
                    <img className={'history-item-copy-icon'} src={ic_copy} onClick={() => showTxHashCopied(item.transactionHash)}/>
                    <div className={'flex-full'}/>
                </div>
                <div className={'history-item-row-layout'} style={{ marginTop: 8 }}>
                    <img className={'history-item-txhash-icon'} src={ic_gas_fire}/>
                    <span className={'history-item-txhash-text'}>
                        -{item.gasValue + " " + NetworkConfig[item.type].ticker}
                    </span>
                    <div className={'flex-full'}/>
                    <span className={'history-item-txhash-text'}>
                        {item.time}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className={'history'}>
            <div className={'history-base'}>
                <div className={'history-tilte-layout'} onClick={() => {
                    if (props.params.fromAsset) {
                        navigate('Asset', { asset: asset })
                    } else {
                        navigate('Main')
                    }
                }}>
                    <img className={'history-title-back-icon'} src={ic_back_white} />
                    <span className={'history-title-text'}>
                        {t('transaction_history')}
                    </span>
                </div>

                <div className={'history-tilte-line'}/>
                <div className={'history-content-layout'}>
                    <div className={'flex-col'}>
                        {renderTime(token1)}
                        {renderGasFee(token2)}
                        {renderNormalTx(token3)}
                        <span className={'history-no-more-transactions'}>
                            {t('no_more_transactions')}
                        </span>
                    </div>
                </div>
            </div>
            {isEmpty && renderEmptyBox()}
        </div>
    );
}
