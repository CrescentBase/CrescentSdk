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
import {callToNativeMsg, isValidAddress, printToNative} from "../helpers/Utils";
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
import {getSuggestedGasEstimates, getEthGasFee, getFiatGasFee, getEthGasFeeBignumber} from "../helpers/custom-gas";
import loadig_index from "../assets/loadig_index.json";
import Lottie from "react-lottie";
import {containOwner, getNonce, getRequestId, METHOD_ID_TRANSFER, sendUserOperation} from "../helpers/UserOp";
import {
    LOCAL_STORAGE_ONGOING_INFO,
    LOCAL_STORAGE_PUBLIC_ADDRESS,
    LOCAL_STORAGE_SEND_OP_SUCCESS
} from "../helpers/StorageUtils";
import ic_token_default from "../assets/ic_token_default.png";
import BigNumber from "bignumber.js";

export default (props)=>{
    const MAX_SLIDER = 10;
    const { navigate, showOngoing } = useContext(NavigateContext);
    const { ChainDisplayNames, wallet } = useContext(ConfigContext);
    const [step, setStep] = useState(1);
    const [addressCorrect, setAddressCorrect] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [balanceInput, setBalanceInput] = useState('');
    const [dollerInput, setDollerInput] = useState('');
    const [invalidAddressPop, setInvalidAddressPop] = useState(false);
    const [transactionErrorPop, setTransactionErrorPop] = useState(false);
    const [transactionErrorText, setTransactionErrorText] = useState('');
    const tx = props.params.tx;
    const [asset, setAsset] = useState(props.params.asset || {...tx})

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

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (ready && selectGas) {
    //             reloadBasicEstimates();
    //         }
    //     }, 7000);
    //     return () => clearInterval(interval);
    // }, []);


    useEffect(() => {
        if (tx) {
            console.log('===tx = ', tx);
            fetchTxAsset(tx);
        }
    }, [tx])

    const getGweiText = () => {
        let baseText = 'Gwei';
        return `${renderGwei(selectTotalGas)} ${baseText}`;
    }

    const fetchBalanceInfo = async (asset) => {
        let assetAddress = asset.tokenAddress;
        if (!asset.nativeCurrency) {
            assetAddress = '0x0,' + assetAddress;
        }
        const sender = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        const url = HOST + `/api/v1//getBalanceInfo?address=${assetAddress}&chain_id=${NetworkConfig[asset.chainType].MainChainId}&account=${sender}`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            const data = json.data;
            console.log('====fetchBalanceInfo data = ', data);
            return data;
        } catch (error) {
            printToNative(error)
            console.error(error);
        }
    }

    const fetchNaitveAsset = async () => {
        const url = HOST + "/api/v1/getTokenInfo?address=0x0&chain_id=" + NetworkConfig[asset.chainType].MainChainId;
        try {
            const response = await fetch(url);
            const json = await response.json();
            const data = json.data;
            console.log('====data = ', data);
            return data;
        } catch (error) {
            printToNative(error)
            console.error(error);
        }
    }

    const fetchTxAsset = async (tx) => {
        let url = HOST + `/api/v1/getTokenInfo?address=${tx.tokenAddress}&chain_id=${tx.chainId}`;
        const nativeCurrency = tx.tokenAddress === "0x0";
        if (!nativeCurrency) {
            url = `https://relayer.gopocket.finance/api/v1/getTargetTokens?chain_id=${tx.chainId}&addresses=${tx.tokenAddress}`;
        }
        console.log('===url = ', url);
        try {
            //{
            //     "id": 121,
            //     "chain_id": 137,
            //     "address": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            //     "l1_address": null,
            //     "decimals": 6,
            //     "symbol": "WETH",
            //     "coin_id": null,
            //     "image": null,
            //     "price_usd": "1.008",
            //     "change_24h": "-0.7914437668354276",
            //     "price_time_stamp": "1678970124203",
            //     "security_info": null,
            //     "security_time_stamp": null
            // }
            const response = await fetch(url);
            const json = await response.json();
            const jsonData = json.data;
            console.log('====data = ', jsonData);
            let asset = {};
            if (nativeCurrency) {
                asset = { ...jsonData };
            } else {
                asset = { ...jsonData[0] };
            }

            asset.chainType = tx.chainType;
            asset.tokenAddress = tx.tokenAddress;
            asset.chainId = tx.chainId;

            asset.nativeCurrency = nativeCurrency;
            asset.image = asset.image || ic_token_default;
            asset.decimals = asset.decimals ? asset.decimals : 18;
            let addressInput = null;
            let balanceInput = null;
            if (tx.data) {
                let decodedData;
                if (tx.data.startsWith(METHOD_ID_TRANSFER)) {
                    const suffix = '0x' + tx.data.substring(METHOD_ID_TRANSFER.length);
                    console.log('==suffix = ', suffix);
                    decodedData = ethers.utils.defaultAbiCoder.decode(
                        ["address", "uint256"],
                        suffix
                    );
                }

                console.log('===decodedData = ', decodedData);
                if (decodedData) {
                    const to = decodedData[0];
                    const value = decodedData[1].toHexString();
                    console.log('===decodedData = ', value);
                    addressInput = to;
                    balanceInput = ethers.utils.formatUnits(value, asset.decimals);
                }
            } else {
                addressInput = tx.to;
                balanceInput = ethers.utils.formatUnits(tx.value, asset.decimals);
                console.log('===balanceInput = ', balanceInput, tx.value, asset.decimals);
            }
            setAddressInput(addressInput);
            setBalanceInput(balanceInput);
            setAsset(asset);
            setStep(2);
            const checkSuc = await checkBalanceWei(asset, balanceInput, false);
            if (checkSuc) {
                handleFetchBasicEstimates(asset, addressInput, balanceInput);
            }

        } catch (error) {
            printToNative(error)
            console.error(error);
        }
    }

    const handleFetchBasicEstimates = async (asset, addressInput, balanceInput) => {
        setReady(false);
        const sender = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
        const chainId = NetworkConfig[asset.chainType].MainChainId;
        const owner = await wallet.getAddress();
        const isOwner = await containOwner(sender, owner, chainId);
        console.log('===isOwner = ', isOwner);
        if (!isOwner) {
            setTransactionErrorText(t('create_not_success'));
            setTransactionErrorPop(true);
            // setReady(true);
            return;
        }
        const nativeAsset = await fetchNaitveAsset();
        setNativeAsset(nativeAsset);
        console.log('===addressInput = ', addressInput);
        console.log('===handleFetchBasicEstimates balanceInput = ', balanceInput);
        const value = balanceInput ? ethers.utils.parseUnits(balanceInput, asset.decimals).toHexString() : null;
        let suggestedGasFees = await getSuggestedGasEstimates(wallet, asset, tx, addressInput, value);
        if (suggestedGasFees.errorMessage) {
            const regex = `"message\\\\":\\\\"(.*?)\\\\"`
            const match = suggestedGasFees.errorMessage.match(regex);
            const errorMessage = match ? match[1] : suggestedGasFees.errorMessage;
            callToNativeMsg("crash;" + errorMessage)
            setTransactionErrorText(errorMessage);
            setTransactionErrorPop(true);
            return;
        }
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
        console.log('==addressInput = ', addressInput);
        const value = balanceInput ? ethers.utils.parseUnits(balanceInput, asset.decimals).toHexString() : null;
        let suggestedGasFeesInFunction = await getSuggestedGasEstimates(wallet, asset, tx, addressInput, value);
        if (suggestedGasFees.errorMessage) {
            setTransactionErrorText(suggestedGasFees.errorMessage);
            setTransactionErrorPop(true);
            return;
        }

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
        if (!text) {
            setDollerInput('');
        }
    }

    const handleDollerInput = (event) => {
        const text = event.target.value;
        changeDollerInput(text);
    }

    const changeDollerInput = (text) => {
        setDollerInput(text);
        if (asset.price && text > 0) {
            setBalanceInput(String(Number(text) / asset.price));
        }
        if (!text) {
            setBalanceInput('');
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
                    nativeAsset?.symbol+
                    ' ≈ ' +
                    getFiatGasFee(
                        selectTotalGas,
                        nativeAsset?.price_usd,
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
                    nativeAsset?.symbol +
                    ' ≈ ' +
                    getFiatGasFee(
                        customTotalGas,
                        nativeAsset?.price_usd,
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

    const checkBalanceWei = async (asset, balanceInput, readyValue = true) => {
        const balanceInfo = await fetchBalanceInfo(asset);
        if (!balanceInfo || balanceInfo.length === 0 || (!asset.nativeCurrency && balanceInfo.length === 1)) {
            setTransactionErrorText(t('insufficient_gas_token'));
            setTransactionErrorPop(true);
            setReady(readyValue);
            return;
        }

        let gasfeesBignumber;
        if (selectGas) {
            gasfeesBignumber = getEthGasFeeBignumber(selectTotalGas, suggestedGasFees?.gas, suggestedGasFees?.l1Fee)
        } else {
            gasfeesBignumber = getEthGasFeeBignumber(customTotalGas, ethers.BigNumber.from(customGasLimit || 0), suggestedGasFees?.l1Fee)
        }
        console.log('===gasfeesBignumber = ', gasfeesBignumber);
        const nativeBalanceWei = balanceInfo[0].tokenAddress === '0x0' ? ethers.BigNumber.from(balanceInfo[0].balances) : ethers.BigNumber.from(balanceInfo[1].balances)
        if (asset.nativeCurrency) {
            let tokeInputnWei = balanceInput ? ethers.utils.parseUnits(balanceInput, asset.decimals) : 0;
            console.log('====tokeInputnWei = ', tokeInputnWei.toString());
            const allWei = gasfeesBignumber.add(tokeInputnWei.toString());
            console.log('====allWei = ', allWei.toString());
            console.log('====nativeBalanceWei = ', nativeBalanceWei.toString());
            if (nativeBalanceWei.lt(allWei)) {
                setTransactionErrorText(t('insufficient_gas_token'));
                setTransactionErrorPop(true);
                setReady(readyValue);
                return false;
            }
        } else {
            if (nativeBalanceWei.lt(gasfeesBignumber)) {
                setTransactionErrorText(t('insufficient_gas_token'));
                setTransactionErrorPop(true);
                setReady(readyValue);
                return false;
            }
            if (balanceInput) {
                const tokenBalanceWei = balanceInfo[0].tokenAddress === '0x0' ? ethers.BigNumber.from(balanceInfo[1].balances) : ethers.BigNumber.from(balanceInfo[0].balances)
                let tokeInputnWei = ethers.utils.parseUnits(balanceInput, asset.decimals)
                if (tokenBalanceWei.lt(tokeInputnWei)) {
                    setTransactionErrorText(t('insufficient_gas_token'));
                    setTransactionErrorPop(true);
                    setReady(readyValue);
                    return false;
                }
            }
        }
        return true;
    }

    const sendTransaction = async () => {
        const checkSuc = await checkBalanceWei(asset, balanceInput);
        if (!checkSuc) {
            return;
        }
        const uo = suggestedGasFees.uo;
        let maxFeePerGas, maxPriorityFeePerGas;
        if (selectGas) {
            maxFeePerGas = selectTotalGas;
        } else {
            maxFeePerGas = customTotalGas;
        }
        console.log('===uo = ', uo);
        console.log('====maxFeePerGas = ', maxFeePerGas);
        console.log('====maxFeePerGas.toHexString() = ', maxFeePerGas.toHexString());
        uo.maxFeePerGas = maxFeePerGas.toHexString();
        if (suggestedGasFees.isEIP1559) {
            maxPriorityFeePerGas = maxFeePerGas.sub(suggestedGasFees.estimatedBaseFee);
            uo.maxPriorityFeePerGas = maxPriorityFeePerGas.toHexString();
        } else {
            uo.maxPriorityFeePerGas = uo.maxFeePerGas;
        }
        const chainId = NetworkConfig[asset.chainType].MainChainId;
        const account = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS)
        const nonce = await getNonce(account, chainId);
        console.log('====nonce = ', nonce);
        const bb = nonce.toHexString();
        console.log('===bb = ', bb);
        uo.nonce = bb;
        const txId = getRequestId(uo, chainId);

        const provider = new ethers.providers.JsonRpcProvider(`https://bundler-${chainId}.crescentbase.com/rpc`);
        // const provider = new ethers.providers.JsonRpcProvider("https://cloudflare-eth.com");
        const walletNew = wallet.connect(provider);//new ethers.Wallet(privateKey, provider);

        walletNew.signMessage(ethers.utils.arrayify(txId)).then(async signedTx => {
            try {
                uo.signature = signedTx;
                console.log('===sendTransaction = uo = ', uo);
                printToNative(uo.toString());
                const txHash = await sendUserOperation(provider, uo);
                callToNativeMsg("sendTx;" + txHash)
                console.log('===txHash = ', txHash);
                const ongoingAsset =  {
                    ...asset,
                    txHash,
                    txAmount: balanceInput,
                    txTime: new Date().getTime(),
                    toAddress: addressInput || tx?.to
                };
                const ongoingInfos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ONGOING_INFO)) || [];
                if (ongoingInfos) {
                    ongoingInfos.push(ongoingAsset);
                }
                localStorage.setItem(LOCAL_STORAGE_ONGOING_INFO, JSON.stringify(ongoingInfos));
                showOngoing(true);
                if (tx) {
                    navigate('Main');
                } else {
                    navigate('Asset', { asset });
                }
            } catch (error) {
                printToNative(error)
                console.log("===SendTransaction = ", error)
                const message = String(error.message);

                const regex = `"message\\\\":\\\\"(.*?)\\\\"`
                const match = message.match(regex);
                const errorMessage = match ? match[1] : null;
                if (errorMessage) {
                    setTransactionErrorText(errorMessage);
                }
                setTransactionErrorPop(true);
            }
            setReady(true);
        });
    }

    return (
        <div className={'send'}>
            <div className={'send-base'}>
                <div className={'send-tilte-layout'} onClick={() => {
                    if (tx) {
                        navigate('Main');
                    } else {
                        navigate('Asset', { asset });
                    }
                }}>
                    <img className={'send-title-back-icon'} src={ic_back_white} />
                    <span className={'send-title-text'}>
                        {t('send')}
                    </span>
                </div>

                <div className={'send-tilte-line'}/>
                <div className={'send-content-layout'}>
                    {!tx && step === 1 ? (
                        <div className={'send-content-step-layout'}>
                            <span className={'send-recipient-text'}>
                                {t('recipient')}
                            </span>
                            {addressCorrect ? (
                                <div className={'send-address-input-layout'}>
                                    <span className={'send-address-correct'}>
                                        {addressInput && addressInput.substring(0, 12) + '...' + addressInput.substring(addressInput.length-10)}
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
                                    {false && !addressInput && (
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
                                {false && (
                                    <span className={'send-input-token-max'} onClick={() => {
                                        changeBalanceInput(asset.fullAmount);
                                    }}>
                                    {t('max')}
                                </span>
                                )}
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
                                    handleFetchBasicEstimates(asset, addressInput, balanceInput);
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
                                 {addressInput && addressInput.substring(0, 15) + '...' + addressInput.substring(addressInput.length-15)}
                            </span>
                            <div className={'send-step2-amount-layout'}>
                                <span className={'send-step2-amount-text'}>
                                    {t('amount')}
                                </span>
                                <span className={'send-step2-amount-use-text '}>
                                    {balanceInput && `${balanceInput} ${asset.symbol}`}
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
                        {transactionErrorText || t('try_again')}
                    </span>
                    <Button text={t('ok')} style={{marginTop: 24, width: 205, height: 36, marginLeft: 0, marginRight: 0}} onClick={() => {
                        setTransactionErrorPop(false);
                    }}/>
                </div>
            )}
        </div>
    );
}
