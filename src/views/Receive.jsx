import React, {useContext} from "react";
import ic_back_white from "../assets/ic_back_white.png"
import NavigateContext from "../contexts/NavigateContext";
import Button from "../widgets/Button";
import PopContext from "../contexts/PopContext";
import {ChainType, NetworkConfig} from "../helpers/Config";
import {useTranslation} from "react-i18next";
import {getTokenName} from "../helpers/number";
import ConfigContext from "../contexts/ConfigContext";

export default (props)=>{
    const { t } = useTranslation();
    const { navigate } = useContext(NavigateContext);
    const { showAddressCopied } = useContext(PopContext)
    const { isWeb } = useContext(ConfigContext)
    const asset = props.params.asset;

    const getAddrStr = () => {
        const chainType = asset.chainType ? asset.chainType : ChainType.Ethereum;
        if (asset.nativeCurrency) {
            return '';
        }
        const addr = getTokenName(chainType)
        return '(' + addr + ')';
    };

    return (
        <div className={'receive'}>
            <div className={'receive-base'}>
                <div className={'receive-tilte-layout'} style={isWeb ? { paddingLeft: 25 } : {}} onClick={() => navigate('Asset', { asset })}>
                    <img className={'receive-title-back-icon'} src={ic_back_white} />
                    <span className={'receive-title-text'}>
                        {t('receive')}
                    </span>
                </div>

                <div className={'receive-tilte-line'}/>
                <div className={'receive-content-layout'}>
                    <span className={'receive-wallet-address-tip'} style={isWeb ? {marginTop: 106} : {}}>
                        {t('my_wallet_address')}
                    </span>

                    <span className={'receive-address-text'}>
                        {asset.account.substring(0, 13) + '...' + asset.account.substring(30)}
                    </span>

                    <span className={'receive-only-send'}>
                        {t('only_send')}
                    </span>

                    <div className={'receive-chain'}>
                        {t('token_on_net', {symbol: asset.symbol, chain: NetworkConfig[asset.chainType].Name.toUpperCase(), addr: getAddrStr()})}
                    </div>

                    <span className={'receive-to-this-address'}>
                        {t('to_this_address')}
                    </span>

                    <div className={'flex-width-full'}>
                        <Button text={t('copy_address')} style={{marginTop: 36, marginLeft: 20, marginRight: 20}} onClick={() => {
                            showAddressCopied(asset.account);
                        }}/>
                    </div>

                </div>
            </div>
        </div>
    );
}

