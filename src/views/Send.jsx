import React, {useContext, useEffect, useState} from "react";
import ic_back_white from "../assets/ic_back_white.png"
import ic_clear from "../assets/ic_clear.png"
import ic_correct from "../assets/ic_correct.png"
import ic_gas_edit from "../assets/ic_gas_edit.png"
import ic_slider from "../assets/ic_slider.png"
import ic_gas_fire from "../assets/ic_gas_fire.png"
import ic_currency_usd from '../assets/ic_currency_usd.png'
import slider_dot from '../assets/slider_dot.png'
import NavigateContext from "../contexts/NavigateContext";
import {useTranslation} from "react-i18next";
import Button from "../widgets/Button";
import {ChainType, NetworkConfig, HOST} from "../helpers/Config";
import {isValidAddress} from "../helpers/Utils";
import {animated, useSpring} from 'react-spring';
import ReactSlider from "../widgets/ReactSlider";
import ConfigContext from "../contexts/ConfigContext";
import {ethers} from "ethers";
import {
    getTokenName,
    renderAmount,
    renderBalanceFiat,
    renderFullAmount,
    renderSplitAmount,
    renderShortValue,
    weiToGwei,
    formatNumberStr,
    isDecimalValue,
    apiEstimateModifiedToWEI,
    renderGwei
} from "../helpers/number";
import {getSuggestedGasEstimates, getEthGasFee, getFiatGasFee} from "../helpers/custom-gas";
import loadig_index from "../assets/loadig_index.json";
import Lottie from "react-lottie";
import {getRequestId, sendUserOperation} from "../helpers/UserOp";
import {LOCAL_STORAGE_ONGOING_INFO} from "../helpers/StorageUtils";

export default (props)=>{
    const MAX_SLIDER = 10;
    const { navigate, showOngoing } = useContext(NavigateContext);
    const { ChainDisplayNames } = useContext(ConfigContext);
    const [step, setStep] = useState(1);
    const [addressCorrect, setAddressCorrect] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [balanceInput, setBalanceInput] = useState('');
    const [dollerInput, setDollerInput] = useState('');
    const [invalidAddressPop, setInvalidAddressPop] = useState(false);
    const [transactionErrorPop, setTransactionErrorPop] = useState(false);
    const asset = props.params.asset;
    const tx = props.params.tx;
    const [gasSpeedSelected, setGasSpeedSelected] =  useState(asset.chainType === ChainType.Bsc ? 0 : MAX_SLIDER / 2)
    const middleSpeed = asset.chainType === ChainType.Bsc ? 0 : MAX_SLIDER / 2;
    const [suggestedGasFees, setSuggestedGasFees] = useState(null);
    const [customGasPrice, setCustomGasPrice] = useState(null);
    const [customTotalGas, setCustomTotalGas] = useState(null);
    const [customGasLimit, setCustomGasLimit] = useState(null);
    const [selectTotalGas, setSelectTotalGas] = useState(null);
    const [oldSelectTotalGas, setOldSelectTotalGas] = useState(null);
    const [limitGas, setLimitGas] = useState(null);
    const [ready, setReady] = useState(false);
    const [selectGas, setSelectGas] = useState(true);
    const [reloadGas, setReloadGas] = useState(false);
    const [nativeAsset, setNativeAsset] = useState(null);

    const { t } = useTranslation();

    useEffect(() => {
        const interval = setInterval(() => {
            if (ready && selectGas) {
                reloadBasicEstimates();
            }
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const getGweiText = () => {
        let baseText = 'Gwei';
        // if (asset.chainType === ChainType.Avax) {
        //     baseText = 'nAVAX';
        // }
        return `${renderGwei(selectTotalGas)} ${baseText}`;
    }

    const fetchNaitveAsset = async () => {
        const url = HOST + "/api/v1/getTokenInfo?address=0x0&chain_id=" + NetworkConfig[asset.chainType].MainChainId;
        try {
            const response = await fetch(url);
            const json = await response.json();
            const data = json.data;
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchBasicEstimates = async () => {
        setReady(false);
        const nativeAsset = await fetchNaitveAsset();
        setNativeAsset(nativeAsset);
        const value = ethers.utils.parseUnits(balanceInput, asset.decimals);
        let suggestedGasFees = await getSuggestedGasEstimates(asset, tx, addressInput, value.toHexString());
        suggestedGasFees = fixGas(suggestedGasFees);
        setSuggestedGasFees(suggestedGasFees);
        const customGasPrice = renderShortValue(
            weiToGwei(
                asset.chainType === ChainType.Bsc ? suggestedGasFees.safeLowGwei : suggestedGasFees.averageGwei
            ).toString(),
            5
        );
        setCustomGasPrice(customGasPrice);
        setCustomTotalGas(suggestedGasFees.gasPrice);
        setCustomGasLimit(suggestedGasFees.gas?.toString());
        setReady(true);
        updateGes(suggestedGasFees);
    };

    const reloadBasicEstimates = async () => {
        setReloadGas(true);
        const value = ethers.utils.parseUnits(balanceInput, asset.decimals);
        let suggestedGasFeesInFunction = await getSuggestedGasEstimates(asset, tx, addressInput, value.toHexString());
        setReloadGas(false);
        if (!selectGas) {
            return;
        }
        if (suggestedGasFeesInFunction?.isEIP1559 !== suggestedGasFees?.isEIP1559) {
            return;
        }
        suggestedGasFeesInFunction = fixGas(suggestedGasFeesInFunction);
        if (
            (suggestedGasFeesInFunction.isEIP1559 &&
                !suggestedGasFeesInFunction.estimatedBaseFee.eq(suggestedGasFees.estimatedBaseFee)) ||
            !suggestedGasFees.safeLowGwei.eq(suggestedGasFeesInFunction.safeLowGwei) ||
            !suggestedGasFees.averageGwei.eq(suggestedGasFeesInFunction.averageGwei) ||
            !suggestedGasFees.fastGwei.eq(suggestedGasFeesInFunction.fastGwei)
        ) {
            // this.startAnimation();
            let gasSpeedSelected = asset.chainType === ChainType.Bsc ? 0 : MAX_SLIDER / 2;
            if (gasSpeedSelected !== gasSpeedSelected && !isMissGas(suggestedGasFeesInFunction)) {
                gasSpeedSelected = loadGasSpeedSelected(suggestedGasFeesInFunction);
            }
            setTimeout(() => {
                setSuggestedGasFees(suggestedGasFees);
                setGasSpeedSelected(gasSpeedSelected);
                const customGasPrice = renderShortValue(
                    weiToGwei(
                        asset.chainType === ChainType.Bsc ? suggestedGasFees.safeLowGwei : suggestedGasFees.averageGwei
                    ).toString(),
                    5
                );
                setCustomGasPrice(customGasPrice);
                setCustomTotalGas(suggestedGasFees.gasPrice)
                updateGes(suggestedGasFees);
            }, 600);
        }
    };

    const loadGasSpeedSelected = suggestedGasFees => {
        let selectTotalGas = oldSelectTotalGas;
        if (suggestedGasFees.isEIP1559) {
            selectTotalGas = selectTotalGas.sub(suggestedGasFees.estimatedBaseFee);
        }
        const baseGwei = suggestedGasFees.fastGwei.sub(suggestedGasFees.safeLowGwei).div(10);
        const gasSpeedSelected = selectTotalGas
            .sub(suggestedGasFees.safeLowGwei)
            .div(baseGwei)
            .toNumber();
        return Math.round(gasSpeedSelected);
    };

    // const startReloadGas = () => {
    //     if (!this.isUnmount && this.state.selectGas) {
    //         this.reloadTimeout = setTimeout(() => this.reloadBasicEstimates(), 7000);
    //     }
    // };

    const isMissGas = suggestedGasFees => {
        const selectTotalGas = oldSelectTotalGas;
        let maxGas = suggestedGasFees.fastGwei;
        if (suggestedGasFees.isEIP1559) {
            maxGas = maxGas.add(suggestedGasFees.estimatedBaseFee);
        }
        if (selectTotalGas.gt(maxGas)) {
            return true;
        }
        let minGas = suggestedGasFees.safeLowGwei;
        if (suggestedGasFees.isEIP1559) {
            minGas = minGas.add(suggestedGasFees.estimatedBaseFee);
        }
        if (selectTotalGas.lt(minGas)) {
            return true;
        }
        return false;
    };

    const updateGes = (suggestedGasFees, isReload = false) => {
        const gwei = calcGas(suggestedGasFees, gasSpeedSelected);
        suggestedGasFees?.isEIP1559
            ? onGasChange(suggestedGasFees, null, gwei, null, isReload)
            : onGasChange(suggestedGasFees, gwei, null, null, isReload);
    };

    const onGasChange = (suggestedGasFees, gasPriceBNWei, maxPriorityFeePerGasBN, gas, isReload = false) => {
        let limitGas = suggestedGasFees.gas?.toString();
        if (gas) {
            limitGas = gas;
        }
        let maxFeePerGasBN;
        if (maxPriorityFeePerGasBN) {
            maxFeePerGasBN = maxPriorityFeePerGasBN.add(suggestedGasFees?.estimatedBaseFee);
        }
        if (maxFeePerGasBN) {
            gasPriceBNWei = maxFeePerGasBN;
        }
        if (selectGas) {
            if (!isReload) {
                setOldSelectTotalGas(gasPriceBNWei);
            }
            setSelectTotalGas(gasPriceBNWei);
        } else {
            setCustomTotalGas(gasPriceBNWei);
        }
        setLimitGas(limitGas);
        // this.props.onChange &&
        // this.props.onChange(
        //     gasPriceBNWei,
        //     maxPriorityFeePerGasBN,
        //     maxFeePerGasBN,
        //     this.state.suggestedGasFees?.estimatedBaseFee,
        //     limitGas
        // );
    };

    const calcGas = (suggestedGasFees, gasSpeedSelected) => {
        const gasFees = suggestedGasFees;
        if (!gasFees) {
            return ethers.BigNumber.from(0);
        }
        let gwei;
        const average = MAX_SLIDER / 2;
        if (gasSpeedSelected === average) {
            gwei = gasFees.averageGwei;
        } else if (gasSpeedSelected < average) {
            gwei = gasFees.averageGwei
                .sub(gasFees.safeLowGwei)
                .mul(gasSpeedSelected).div(average)
                .add(gasFees.safeLowGwei);
        } else {
            gwei = gasFees.fastGwei
                .sub(gasFees.averageGwei)
                .mul((gasSpeedSelected - average)).div(average)
                .add(gasFees.averageGwei);
        }
        return gwei;
    };

    const inputAddressChange = (text) => {
        setAddressInput(text);
        if (isValidAddress(text)) {
            !addressCorrect && setAddressCorrect(true);
        } else {
            addressCorrect && setAddressCorrect(false);
        }
    }

    const handleBalanceInput = (event) => {
        const text = event.target.value;
        changeBalanceInput(text);
    }

    const changeBalanceInput = (text) => {
        setBalanceInput(text);
        if (asset.price && text > 0) {
            setDollerInput(Number(text) * asset.price);
        }
    }

    const handleDollerInput = (event) => {
        const text = event.target.value;
        changeDollerInput(text);
    }

    const changeDollerInput = (text) => {
        setDollerInput(text);
        if (asset.price && text > 0) {
            setBalanceInput(Number(text) / asset.price);
        }
    }

    const handleGasPriceInput = (event) => {
        const text = event.target.value;
        onCustomGasPriceChange(text);
    }

    const handleGasLimitInput = (event) => {
        const text = event.target.value;
        onCustomGasLimitChange(text);
    }

    const handleAddressChange = (event) => {
        const text = event.target.value;
        inputAddressChange(text);
    };

    const onCustomChange = () => {
        const nextSelectGas = !selectGas;
        setSelectGas(nextSelectGas)
        setTimeout(() => {
            if (nextSelectGas) {
                updateGes(suggestedGasFees);
                reloadBasicEstimates();
            } else {
                onCustomChangeGas(customGasPrice, customGasLimit);
            }
        }, 1000);

    };

    const onCustomChangeGas = (gasPrice, gasLimit) => {
        if (!gasLimit) {
            gasLimit = '0';
        }

        gasPrice = isDecimalValue(gasPrice) ? formatNumberStr(gasPrice) : '0';

        const gasPriceBN = apiEstimateModifiedToWEI(renderShortValue(gasPrice, 9));

        const gasLimitBN = gasLimit && ethers.BigNumber.from(gasLimit);

        suggestedGasFees?.isEIP1559
            ? onGasChange(suggestedGasFees, null, gasPriceBN, gasLimitBN)
            : onGasChange(suggestedGasFees, gasPriceBN, null, gasLimitBN);
    };

    const onCustomGasPriceChange = value => {
        setCustomGasPrice(value);
        onCustomChangeGas(value, customGasLimit);
    };

    const onCustomGasLimitChange = value => {
        if (value && !isDecimalValue(value)) {
            return;
        }
        if (value) {
            value = formatNumberStr(value);
        }
        setCustomGasLimit(value);
        onCustomChangeGas(customGasPrice, value);
    };

    const readClipboardText = async() => {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (err) {
            console.error('Failed to read clipboard contents:', err);
            // Provide a fallback method for reading the clipboard contents
            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.focus();
            document.execCommand('paste');
            const text = textarea.value;
            document.body.removeChild(textarea);
            return text;
        }
    }

    const handleClipboardRead = async () => {
        try {
            const clipboardData = await readClipboardText();
            inputAddressChange(clipboardData);
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
        }
    };

    const onSlidingChange = (value) => {
        let gWei = calcGas(suggestedGasFees, value);
        if (suggestedGasFees?.isEIP1559) {
            gWei = gWei.add(suggestedGasFees?.estimatedBaseFee);
        }
        setGasSpeedSelected(value);
        setSelectTotalGas(gWei);
        setOldSelectTotalGas(gWei);
        // let gWei = this.calcGas(value);
        // if (this.state.suggestedGasFees?.isEIP1559) {
        //     gWei = gWei.add(this.state.suggestedGasFees?.estimatedBaseFee);
        // }
        // this.setState({ gasSpeedSelected: value, selectTotalGas: gWei, oldSelectTotalGas: gWei });

    };

    const networkFeePage1 = () => {
        return (
            <div className={'send-step2-gas-layout'}>
                <div className={'send-step2-gwei-recommend-layout'}>
                    <span className={'send-step2-gwei-recommend-text'}>
                        {getGweiText()}
                    </span>
                    <img  className={'send-step2-gwei-fire-icon'} src={ic_gas_fire}/>
                    <span className={'send-step2-gwei-recommend-text'}>
                        {gasSpeedSelected > middleSpeed
                            ? t('fast')
                            : gasSpeedSelected === middleSpeed
                            ? t('recommend')
                            : t('safe_low')}
                    </span>
                </div>

                <span className={'send-step2-gwei-equal-dollor'}>
                    {renderSplitAmount(
                        getEthGasFee(selectTotalGas, suggestedGasFees?.gas, suggestedGasFees?.l1Fee)
                    ) +
                    ' ' +
                    nativeAsset.symbol +
                    ' ≈ ' +
                    getFiatGasFee(
                        selectTotalGas,
                        nativeAsset.price_usd,
                        "USD",
                        suggestedGasFees?.gas,
                        suggestedGasFees?.l1Fee
                    )}
                </span>

                <ReactSlider
                    min={0}
                    max={10}
                    step={1}
                    className="send-slider-horizontal"
                    thumbClassName="send-slider-thumb"
                    trackClassName="send-slider-track"
                    renderThumb={(props, state) => <img {...props} src={slider_dot}></img>}
                    value={gasSpeedSelected}
                    onChange={onSlidingChange}
                />
            </div>
        )
    }

    const networkFeePage2 = () => {
        return (
            <div className={'send-step2-gas-layout'}>
                <div className={'send-step2-gas-price-and-limit-layout'}>
                    <div className={'send-step2-gas-price-and-limit-item-layout'}>
                        <div className={'send-step2-gas-price-and-limit-item-row-layout'}>
                            <span className={'send-step2-gas-price-and-limit-item-row-tip'}>
                                {suggestedGasFees?.isEIP1559 ? t('tip') : t('gas_price')}
                            </span>
                            <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleGasPriceInput} value={customGasPrice}/>
                        </div>
                        <div className={'send-line'}/>
                    </div>
                    <div style={{width: 20}}/>
                    <div className={'send-step2-gas-price-and-limit-item-layout'}>
                        <div className={'send-step2-gas-price-and-limit-item-row-layout'}>
                            <span className={'send-step2-gas-price-and-limit-item-row-tip'}>
                                {t('gas_limit')}
                            </span>
                            <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleGasLimitInput} value={customGasLimit}/>
                        </div>
                        <div className={'send-line'}/>
                    </div>
                </div>
                <span className={'send-step2-gas-equal-dollor'}>
                    {renderSplitAmount(
                        getEthGasFee(customTotalGas, ethers.BigNumber.from(customGasLimit || 0), suggestedGasFees?.l1Fee)
                    ) +
                    ' ' +
                    nativeAsset.symbol +
                    ' ≈ ' +
                    getFiatGasFee(
                        customTotalGas,
                        nativeAsset.price_usd,
                        "USD",
                        ethers.BigNumber.from(customGasLimit || 0),
                        suggestedGasFees?.l1Fee
                    )}
                </span>
            </div>
        )
    }

    const gasPage1Transform = useSpring({
        transform: selectGas ? 'translateX(0%)' : 'translateX(-130%)',
        opacity: selectGas ? 1 : 0,
        config: { duration: 300 },
    });

    const gasPage2Transform = useSpring({
        transform: !selectGas ? 'translateX(0%)' : 'translateX(130%)',
        opacity: !selectGas ? 1 : 0,
        config: { duration: 300 },
    });
    const getFromToken = () => {
        if (asset.nativeCurrency) {
            return asset.symbol;
        }
        const addr = getTokenName(asset.chainType);
        return asset.symbol + '(' + addr + ')';
    };

    const getToToken = () => {
        if (asset.nativeCurrency) {
            if (asset.chainType === ChainType.Ethereum) {
                if (asset.chainType === ChainType.Polygon) {
                    return 'WETH';
                }
            }
            return asset.symbol;
        }

        const addr = getTokenName(asset.chainType);
        return asset.symbol + '(' + addr + ')';
    };

    const fixGas = suggestedGasFees => {
        if (suggestedGasFees.fastGwei.lte(suggestedGasFees.averageGwei)) {
            suggestedGasFees.fastGwei = suggestedGasFees.averageGwei.mul(3).div(2);
        }
        if (asset.chainType === ChainType.Bsc) {
            suggestedGasFees.safeLowGwei = suggestedGasFees.averageGwei;
            suggestedGasFees.averageGwei = suggestedGasFees.fastGwei.add(suggestedGasFees.safeLowGwei).div(2);
        } else if (suggestedGasFees.safeLowGwei.gte(suggestedGasFees.averageGwei)) {
            suggestedGasFees.safeLowGwei = suggestedGasFees.averageGwei.div(2);
        }

        return suggestedGasFees;
    };

    const sendTransaction = () => {
        const uo = suggestedGasFees.uo;
        let maxFeePerGas, maxPriorityFeePerGas;
        if (selectGas) {
            maxFeePerGas = selectTotalGas;
        } else {
            maxFeePerGas = customTotalGas;
        }
        if (suggestedGasFees.isEIP1559) {
            maxPriorityFeePerGas = maxFeePerGas.sub(suggestedGasFees.estimatedBaseFee);
            uo.maxPriorityFeePerGas = maxPriorityFeePerGas.toHexString();
        }
        uo.maxFeePerGas = maxFeePerGas.toHexString();
        const chainId = NetworkConfig[asset.chainType].MainChainId;
        const txId = getRequestId(uo, chainId);
        const privateKey = '0x81beea7a31489439120267006588dc4f8c58b7b20f4ddcc0711d37989fe0ed72';
        const provider = new ethers.providers.JsonRpcProvider("https://wallet.crescentbase.com/api/v1/rpc/" + chainId);
        // const provider = new ethers.providers.JsonRpcProvider("https://cloudflare-eth.com");
        const wallet = new ethers.Wallet(privateKey, provider);

        wallet.signMessage(txId).then(async signedTx => {
            try {
                uo.signature = signedTx;
                const txHash = await sendUserOperation(provider, uo);
                const ongoingAsset =  {
                    ...asset,
                    txHash,
                    txAmount: balanceInput,
                    txTime: new Date().getTime()
                };
                const ongoingInfos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ONGOING_INFO)) || {};
                if (ongoingInfos) {
                    ongoingInfos.push(ongoingAsset);
                }
                localStorage.setItem(LOCAL_STORAGE_ONGOING_INFO, JSON.stringify(ongoingInfos));
                showOngoing(true);
            } catch (error) {
                console.log('===error sendUserOperation = ', error);
                setTransactionErrorPop(true);
            }
            setReady(true);
        });
    }

    return (
        <div className={'send'}>
            <div className={'send-base'}>
                <div className={'send-tilte-layout'} onClick={() => navigate('Asset', { asset })}>
                    <img className={'send-title-back-icon'} src={ic_back_white} />
                    <span className={'send-title-text'}>
                        {t('send')}
                    </span>
                </div>

                <div className={'send-tilte-line'}/>
                <div className={'send-content-layout'}>
                    {step === 1 ? (
                        <div className={'send-content-step-layout'}>
                            <span className={'send-recipient-text'}>
                                {t('recipient')}
                            </span>
                            {addressCorrect ? (
                                <div className={'send-address-input-layout'}>
                                    <span className={'send-address-correct'}>
                                        {addressInput.substring(0, 12) + '...' + addressInput.substring(addressInput.length-10)}
                                    </span>
                                    <img className={'send-input-address-correct-icon'} src={ic_correct}/>
                                    <div className={"flex-full"}/>
                                    <img className={'send-input-address-clear-icon'} src={ic_clear} onClick={() => {inputAddressChange('')}}/>
                                </div>
                            ) : (
                                <div className={'send-address-input-layout'}>
                                    <input className={'send-input'} placeholder={t('address')} value={addressInput}
                                           onChange={handleAddressChange}/>
                                    {!!addressInput && (
                                        <img className={'send-input-address-clear-icon'} src={ic_clear} onClick={() => {inputAddressChange('')}}/>
                                    )}
                                    {!addressInput && (
                                        <span className={'send-input-address-paste'} onClick={() => handleClipboardRead()}>
                                        {t('paste')}
                                    </span>
                                    )}
                                </div>
                            )}

                            <div className={'send-line'} />

                            <span className={'send-to-network'}>
                                {t('to_network')}
                            </span>
                            <div className={'send-chain'}>
                                {ChainDisplayNames[asset.chainType].displayName}
                            </div>
                            <span className={'send-will-receive-tip'}>
                                {t('send_note', {
                                    fromToken: getFromToken(),
                                    network: ChainDisplayNames[asset.chainType].displayName,
                                    toToken: getToToken()
                                })}
                            </span>
                            <div className={'send-amount-layout'}>
                                <span className={'send-amount-text'}>
                                    {t('amount')}
                                </span>
                                <span className={'send-amount-available-text'}>
                                    {t('amount_available', { amount: `${asset.amount} ${asset.symbol}` })}
                                </span>
                            </div>
                            <div className={'send-input-token-layout'}>
                                <img className={'send-input-token-icon'} src={asset.image}/>
                                <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleBalanceInput} value={balanceInput}/>
                                <span className={'send-input-token-max'} onClick={() => {
                                    changeBalanceInput(asset.fullAmount);
                                }}>
                                    {t('max')}
                                </span>
                            </div>
                            <div className={'send-line'}/>
                            <span className={'send-equal'}>≈</span>
                            <div className={'send-input-token-layout'}>
                                <img className={'send-input-token-icon'} src={ic_currency_usd}/>
                                <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleDollerInput} value={dollerInput} disabled={!asset.price}/>
                                <span className={'send-input-dollar-usd'}>
                                    USD
                                </span>
                            </div>
                            <div className={'send-line'}/>
                            <div className={'flex-width-full'}>
                                <Button text={t('next')} disable={!addressCorrect || balanceInput > asset.fullAmount || balanceInput <= 0} style={{marginTop: 36, marginLeft: 20, marginRight: 20}} onClick={() => {//
                                    //setInvalidAddressPop(true);
                                    setStep(2);
                                    handleFetchBasicEstimates();
                                }}/>
                            </div>
                        </div>
                    ) : !ready ? (
                        <div className={'send-load-wrap'}>
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
                        </div>
                    ) : (
                        <div className={'send-content-step-layout'}>
                            <div className={'send-step2-to-layout'}>
                                <span className={'send-step2-to'}>
                                    {t('to')}
                                </span>
                                <span className={'send-step2-chain'}>
                                    {ChainDisplayNames[asset.chainType].displayName}
                                </span>
                            </div>
                            <span className={'send-step2-address-text'}>
                                 {addressInput.substring(0, 15) + '...' + addressInput.substring(addressInput.length-15)}
                            </span>
                            <div className={'send-step2-amount-layout'}>
                                <span className={'send-step2-amount-text'}>
                                    {t('amount')}
                                </span>
                                <span className={'send-step2-amount-use-text '}>
                                    {`${balanceInput} ${asset.symbol}`}
                                </span>
                            </div>
                            <div className={'send-step2-network-fee-layout'}>
                                <span className={'send-step2-network-fee-text'}>
                                    {t('network_fee')}
                                </span>
                                <img  className={'send-step2-network-fee-switch-icon'} src={!selectGas? ic_gas_edit : ic_slider} onClick={() => onCustomChange()}/>
                            </div>
                            <div className={'send-step2-gas-layout'} style={{position: 'relative'}}>
                                <animated.div style={{ position: 'absolute', left: 0,  right: 0, ...gasPage1Transform}}>
                                    {networkFeePage1()}
                                </animated.div>
                                <animated.div style={{ position: 'absolute', left: 0,  right: 0, ...gasPage2Transform}}>
                                    {networkFeePage2()}
                                </animated.div>
                            </div>

                            <Button text={t('confirm')} style={{marginLeft: 0, marginRight: 0}} onClick={() => {//disable={!addressInput || !dollerInput || !balanceInput}
                                // setTransactionErrorPop(true);
                                setReady(false);
                                sendTransaction();
                            }}/>
                        </div>
                    )}
                </div>
            </div>
            {invalidAddressPop && (
                <div className={'send-pop-layout'}>
                    <span className={'send-pop-title'}>
                        {t('invalid_address')}
                    </span>
                    <Button text={t('ok')} style={{marginTop: 24, width: 205, height: 36, marginLeft: 0, marginRight: 0}} onClick={() => {
                        setInvalidAddressPop(false);
                    }}/>
                </div>
            )}

            {transactionErrorPop && (
                <div className={'send-pop-layout'}>
                    <span className={'send-pop-title'}>
                        {t('transaction_error')}
                    </span>
                    <span className={'send-pop-title-desc'}>
                        {t('not_enough_gas')}
                    </span>
                    <Button text={t('ok')} style={{marginTop: 24, width: 205, height: 36, marginLeft: 0, marginRight: 0}} onClick={() => {
                        setTransactionErrorPop(false);
                    }}/>
                </div>
            )}
        </div>
    );
}
