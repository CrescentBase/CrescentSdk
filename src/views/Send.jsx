import React, {useContext, useState} from "react";
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
import {ChainType} from "../helpers/Config";
import {isValidAddress} from "../helpers/Utils";
import {animated, useSpring} from 'react-spring';
import ReactSlider from "../widgets/ReactSlider";

export default (props)=>{
    const MAX_SLIDER = 10;
    const { navigate } = useContext(NavigateContext);
    const [step, setStep] = useState(1);
    const [gasPageIndex, setGasPageIndex] = useState(0);
    const [addressCorrect, setAddressCorrect] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [balanceInput, setBalanceInput] = useState('');
    const [dollerInput, setDollerInput] = useState('');
    const [gasPrice, setGasPrice] = useState('');
    const [gasLimit, setGasLimit] = useState('');
    const [invalidAddressPop, setInvalidAddressPop] = useState(false);
    const [transactionErrorPop, setTransactionErrorPop] = useState(false);

    const asset = props.params.asset;
    const [gasSpeedSelected, setGasSpeedSelected] =  useState(asset.chainType === ChainType.Bsc ? 0 : MAX_SLIDER / 2)
    const middleSpeed = asset.chainType === ChainType.Bsc ? 0 : MAX_SLIDER / 2;

    const { t } = useTranslation();
    const chainName = 'Ethereum';

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
        setBalanceInput(text);
    }

    const handleDollerInput = (event) => {
        const text = event.target.value;
        setDollerInput(text);
    }

    const handleGasPriceInput = (event) => {
        const text = event.target.value;
        setGasPrice(text);
    }

    const handleGasLimitInput = (event) => {
        const text = event.target.value;
        setGasLimit(text);
    }


    const handleAddressChange = (event) => {
        const text = event.target.value;
        inputAddressChange(text);
    };

    const handleClipboardRead = async () => {
        try {
            const clipboardData = await navigator.clipboard.readText();
            inputAddressChange(clipboardData);
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
        }
    };

    const onSlidingChange = (value) => {
        // let gWei = this.calcGas(value);
        // if (this.state.suggestedGasFees?.isEIP1559) {
        //     gWei = gWei.add(this.state.suggestedGasFees?.estimatedBaseFee);
        // }
        // this.setState({ gasSpeedSelected: value, selectTotalGas: gWei, oldSelectTotalGas: gWei });
        setGasSpeedSelected(value);
    };

    const networkFeePage1 = () => {
        return (
            <div className={'send-step2-gas-layout'}>
                <div className={'send-step2-gwei-recommend-layout'}>
                    <span className={'send-step2-gwei-recommend-text'}>
                        25Gwei
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
                    0.00114 AVAX ≈ $0.10317
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
                                {t('gas_price')}
                            </span>
                            <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleGasPriceInput} value={gasPrice}/>
                        </div>
                        <div className={'send-line'}/>
                    </div>
                    <div style={{width: 20}}/>
                    <div className={'send-step2-gas-price-and-limit-item-layout'}>
                        <div className={'send-step2-gas-price-and-limit-item-row-layout'}>
                            <span className={'send-step2-gas-price-and-limit-item-row-tip'}>
                                {t('gas_limit')}
                            </span>
                            <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleGasLimitInput} value={gasLimit}/>
                        </div>
                        <div className={'send-line'}/>
                    </div>
                </div>
                <span className={'send-step2-gas-equal-dollor'}>
                    0.05 ETH ≈ $55
                </span>
            </div>
        )
    }

    const gasPage1Transform = useSpring({
        transform: gasPageIndex === 0 ? 'translateX(0%)' : 'translateX(-130%)',
        opacity: gasPageIndex === 0 ? 1 : 0,
        config: { duration: 300 },
    });

    const gasPage2Transform = useSpring({
        transform: gasPageIndex === 1 ? 'translateX(0%)' : 'translateX(130%)',
        opacity: gasPageIndex === 1 ? 1 : 0,
        config: { duration: 300 },
    });

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
                                {chainName}
                            </div>
                            <span className={'send-will-receive-tip'}>
                                {t('send_note', {
                                    fromToken: "GRT(ERC20)",//this.getFromToken(),
                                    network: "BSC",//getChainTypeName(asset.type),
                                    toToken: "GRT(BEP20)"//this.getToToken()
                                })}
                            </span>
                            <div className={'send-amount-layout'}>
                                <span className={'send-amount-text'}>
                                    {t('amount')}
                                </span>
                                <span className={'send-amount-available-text'}>
                                    {t('amount_available', { amount: 1000 })}
                                </span>
                            </div>
                            <div className={'send-input-token-layout'}>
                                <img className={'send-input-token-icon'} src={asset.symbol}/>
                                <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleBalanceInput} value={balanceInput}/>
                                <span className={'send-input-token-max'} onClick={() => {
                                    setBalanceInput(1000);
                                }}>
                                    {t('max')}
                                </span>
                            </div>
                            <div className={'send-line'}/>
                            <span className={'send-equal'}>≈</span>
                            <div className={'send-input-token-layout'}>
                                <img className={'send-input-token-icon'} src={ic_currency_usd}/>
                                <input className={'send-input'} placeholder={'0.00'} type={'number'} onChange={handleDollerInput} value={dollerInput}/>
                                <span className={'send-input-dollar-usd'}>
                                    USD
                                </span>
                            </div>
                            <div className={'send-line'}/>
                            <div className={'flex-width-full'}>
                                <Button text={t('next')} style={{marginTop: 36, marginLeft: 20, marginRight: 20}} onClick={() => {//disable={!addressInput || !dollerInput || !balanceInput}
                                    //setInvalidAddressPop(true);   //invalid Address
                                    setStep(2);
                                }}/>
                            </div>
                        </div>
                    ) : (
                        <div className={'send-content-step-layout'}>
                            <div className={'send-step2-to-layout'}>
                                <span className={'send-step2-to'}>
                                    {t('to')}
                                </span>
                                <span className={'send-step2-chain'}>
                                    {chainName}
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
                                    5000GRT
                                </span>
                            </div>
                            <div className={'send-step2-network-fee-layout'}>
                                <span className={'send-step2-network-fee-text'}>
                                    {t('network_fee')}
                                </span>
                                <img  className={'send-step2-network-fee-switch-icon'} src={gasPageIndex === 1? ic_gas_edit : ic_slider} onClick={() => setGasPageIndex(gasPageIndex === 0 ? 1 : 0)}/>
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
                                setTransactionErrorPop(true);
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
