import React, {useContext, useEffect, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import PopContext from "../contexts/PopContext";
import { useSpring, animated } from 'react-spring';

import ic_copy from '../assets/ic_copy.png';
import ic_setting from '../assets/ic_setting.png'
import img_card_all from "../assets/img_card_all"
import img_card_arb from "../assets/img_card_arb"
import img_card_polygon from "../assets/img_card_polygon"
import img_card_bsc from "../assets/img_card_bsc"
import img_card_eth from "../assets/img_card_eth"
import ic_history_black from '../assets/ic_history_black.png'
import ic_card_all from '../assets/ic_card_all.png'
import ic_card_all_alpha from '../assets/ic_card_all_alpha.png'
import ic_card_eth from '../assets/ic_card_eth.png'
import ic_card_eth_alpha from '../assets/ic_card_eth_alpha.png'
import ic_card_polygon from '../assets/ic_card_polygon.png'
import ic_card_polygon_alpha from '../assets/ic_card_polygon_alpha.png'
import ic_card_arb from '../assets/ic_card_arb.png'
import ic_card_arb_alpha from '../assets/ic_card_arb_alpha.png'
import ic_card_bsc from '../assets/ic_card_bsc.png'
import ic_card_bsc_alpha from '../assets/ic_card_bsc_alpha.png'
import ic_card_more_alpha from '../assets/ic_card_more_alpha.png'
import ic_search from '../assets/ic_search.png'
import ic_buy from '../assets/ic_buy.png'
import ic_eth_tag from '../assets/ic_eth_tag.png'
import ic_hide from '../assets/ic_hide.png'
import ic_hide_disable from '../assets/ic_hide_disable.png'
import ic_add from '../assets/ic_add.png'
import ic_back_white from '../assets/ic_back_white.png'
import ic_clear from "../assets/ic_clear.png";
import img_empty_search from "../assets/img_empty_search.png"
import Lottie from 'react-lottie'
import loadig_index from '../assets/loadig_index.json'
import loading_ongoing from '../assets/loading_ongoing.json'
import loading_ongoing_success from '../assets/loading_ongoing_success.json'
import ic_success_white from "../assets/ic_success_white.png"
import ic_close from "../assets/ic_close.png"
import img_transak from "../assets/img_transak.png"

import {useTranslation} from "react-i18next";
import {ChainType} from "../helpers/Config";
import SwipeView from "../widgets/SwipeView";
import Button from "../widgets/Button";

export default (props)=>{
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [cardHeight, setCardHeight] = useState(0);
    const [currentChainType, setCurrentChainType] = useState(ChainType.All);
    const [searchText, setSearchText] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [showWalletCreated, setShowWalletCreated] = useState(false);
    const [showTransak, setShowTransak] = useState(false);
    const [transationLoading, setTransationLoading] = useState(false);
    const [transationStyle, setTransationStyle] = useSpring(() => ({ width: 0 }));

    const chainTypes = [ChainType.All, ChainType.Ethereum, ChainType.Polygon, ChainType.Arbitrum, ChainType.Bsc];
    const chainCards = [img_card_all, img_card_eth, img_card_polygon, img_card_arb, img_card_bsc];
    const chainIcons = [ic_card_all, ic_card_eth, ic_card_polygon, ic_card_arb, ic_card_bsc];
    const chainIconAlphas = [ic_card_all_alpha, ic_card_eth_alpha, ic_card_polygon_alpha, ic_card_arb_alpha, ic_card_bsc_alpha];
    const chainNames = [t('all_network'), t('eth_etwork'), t('polygon_network'), t('arbitrum_network'), t('bsc_network')];

    const { navigate } = useContext(NavigateContext);
    const { showAddressCopied } = useContext(PopContext);

    const goTokens = async () => {
        navigate('Token')
    }

    const goHistorys = async () => {
        navigate('History')
    }

    const handleCopy = async (text) => {
        // toggleSubbmitLoading();
        // return;
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
        }
        showAddressCopied();
    };

    function sleep(time){
        return new Promise((resolve)=>setTimeout(resolve,time)
        )
    }

    useEffect(() => {
        var element = document.getElementById("crescent-content");
        var width = element.clientWidth;
        const cardHeight = (width - 40) * 1.0 /319.0 * 100;
        setCardHeight(cardHeight);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const response = await fetch(`/api/data?page=${this.state.currentPage}`);
            // const newData = await response.json();
            let newData = [];
            const length = isSearch ? 2: 20;
            for (let i = 0; i < length; i++) {
                newData.push({ name: "GRT" + i,
                    logo: "https://www.sohamkamani.com/favicon/favicon.ico",
                    amount: i * 10,
                    balance: '$' + (i*20),
                    isNativeCurrency: (i%4 === 0)
                });
            }
            setData(newData);

        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    const toastWalletCreated = () => {
        setShowWalletCreated(true);
        setTimeout(() => {
            setShowWalletCreated(false);
        }, 2000);
    }

    const handleTextChange = (event) => {
        setSearchText(event.target.value);
        // fetchData();
        setData([]);
    };

    const clickToTransak = () => {
        const newTab = window.open('about:blank');
        newTab.location.href = "https://global.transak.com/?apiKey=2bd8015d-d8e6-4972-bcca-22770dcbe595";
    }

    const toggleSubbmitLoading = () => {
        setTransationLoading(true);
        setTimeout(() => {
            setTransationStyle({width: 160})
        }, 300);

        setTimeout(() => {
            setTransationStyle({width: 0})
        }, 3000);
    }

    const renderItem = (item) => {
        return (
            <div className={'flex-col'} onClick={() => {
                navigate('Asset')
            }}>
                <div className={'main-asset-item-layout'} onClick={() => {
                }}>
                    <div className={'main-asset-item-icon-layout'}>
                        <img className={'main-asset-item-icon'} src={item.logo}/>
                        <img className={'main-asset-item-chain-tag'} src={ic_eth_tag}/>
                    </div>
                    <div className={'main-asset-item-token-left-layout'}>
                        <div className={'main-asset-item-token-name'}>
                            {item.name}
                        </div>
                        <div className={'main-asset-item-token-amount'}>
                            {item.amount}
                        </div>
                    </div>
                    <div className={'flex-full'}/>
                    <div className={'main-asset-item-token-balance'}>
                        {item.balance}
                    </div>
                </div>
                <div className={'main-asset-item-line'}/>
            </div>
        )
    }

    const renderItemAction = (item) => {
        const isAdd = false;
        const isEnable = item.isNativeCurrency;
        return (
            <div className={'main-asset-item-action-base-layout'} onClick={() => {
            }}>
                <div className={'flex-full'}/>
                <div className={'main-asset-item-action-wrap'}>
                    <img className={'main-asset-item-action-icon'} src={isAdd ? ic_add : isEnable ? ic_hide : ic_hide_disable}/>
                    <div className={'main-asset-item-action-text'} style={(!isAdd && !isEnable) ? {color: 'rgba(147,157,165,0.6)'} : {}}>
                        {isAdd ? t('add') : t('hide')}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={'main'}>
            <div className={'main-content'}>
                <div className={'main-title-layout'}>
                    <div className={'main-title-email-and-adrress-layout'}>
                        <div className={'main-title-email'}>
                            yyyyang@gmail.com
                        </div>
                        <div className={'main-title-address-layout'} onClick={() => handleCopy('0x480eBa…a89C3')}>
                            <div className={'main-title-address'}>
                                0x480eBa…a89C351e
                            </div>
                            <img className={'main-title-address-copy-icon'} src={ic_copy}/>
                        </div>
                    </div>
                    <img className={'main-title-setting-icon'} src={ic_setting} onClick={() => navigate('Setting')}/>
                </div>

                <div className={'main-card-wrap'}>
                    {chainTypes.map((item, index) => {
                        if (currentChainType === item) {
                            return (
                                <img className={'main-card-img'} src={chainCards[index]}/>
                            );
                        }
                    })}

                    <div className={'main-card-content'} style={{height: cardHeight}}>
                        <div className={'main-card-top-layout'}>
                            <div className={'main-card-balance-text'}>
                                $3,900.12
                            </div>
                            <div className={'main-card-history-wrap-layout'} onClick={() => navigate('History')}>
                                <img src={ic_history_black} className={'main-card-history-icon'}/>
                                <div className={'main-card-history-text'}>
                                    {t('tx_history')}
                                </div>
                            </div>
                        </div>
                        <div className={'main-card-chain-layout'}>
                            {chainTypes.map((item, index) => {
                                return (
                                    <div className={'main-card-chain-item-layout'} onClick={() => setCurrentChainType(item)}>
                                        <img className={'main-card-chain-logo'} src={currentChainType === item ? chainIcons[index] : chainIconAlphas[index]}/>
                                        <div className={'main-card-chain-name'}>{currentChainType === item ? chainNames[index] : '  '}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {isSearch ? (
                    <div className={'main-search-base-layout'}>
                        <div className={'main-search-wrap-layout'}>
                            <img className={'main-search-back-icon'} src={ic_back_white} onClick={() => setIsSearch(false)}/>
                            <img className={'main-search-edit-icon'} src={ic_search}/>
                            <input className={'main-search-edittext'}
                                   type={"text"}
                                   placeholder={t('token_or_contract_address')}
                                   value={searchText}
                                   onChange={handleTextChange}
                            />
                            {searchText !== '' && (
                                <img className={'main-search-edittext-clear'} src={ic_clear} onClick={() => {
                                    setSearchText("");
                                }}/>
                            )}
                        </div>
                        <div className={'main-asset-item-line'}/>
                    </div>
                ) : (
                    <div className={'main-asset-top-layout'}>
                        <div className={'main-assetlist-text'}>
                            {t('asset_list')}
                        </div>
                        <div className={'flex-full'}/>
                        <img src={ic_search} className={'main-asset-search-icon'} onClick={() => setIsSearch(true)}/>
                        <img src={ic_buy} className={'main-asset-buy-icon'} onClick={() => setShowTransak(true)}/>
                    </div>
                )}

                {data.length > 0 ? (
                    data.map((item, index) => (
                        <SwipeView btnWidth={42} rowRenderer={renderItem(item)} actionBtn={renderItemAction(item)} key={'swipeview' + index}/>
                    ))
                ) : isSearch ? (
                    <div className={'main-search-empty-data'}>
                        <img src={img_empty_search} className={'main-search-empty-icon'}/>
                        <div className={'main-search-empty-tip'}>{t('no_token_found')}</div>
                    </div>
                ) : (
                    <Lottie style={{marginTop: 32}} options={{
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
                )}
            </div>

            {showWalletCreated && (
                <div className={'main-toast'}>
                    {t('wallet_created')}
                </div>
            )}

            {showTransak && (
                <div className={'main-transak-layout'}>
                    <img className={'main-transak-close-icon'} src={ic_close} onClick={() => setShowTransak(false)}/>
                    <span className={'main-transak-title'}>
                        {t('buy_crypto_title')}
                    </span>
                    <div className={'main-transak-content1'} style={{ whiteSpace: "pre-line" }}>
                        {t('buy_crypto_content1')}
                    </div>
                    <img className={'main-transak-icon'} src={img_transak}/>
                    <span className={'main-transak-content2'}>
                        <a target="_blank" href="https://www.notion.so/Coverage-Payment-Methods-Fees-Limits-30c0954fbdf04beca68622d9734c59f9" className={'main-transak-click-here'} >{t('buy_crypto_click_here')}</a>{t('buy_crypto_content2')}
                    </span>
                    <div style={{display: 'flex', width: '100%'}}>
                        <Button text={t('buy_now')} style={{height: 36, marginTop: 24, marginBottom: 24, marginLeft: 20, marginRight: 20}} onClick={() => {
                            clickToTransak();
                            setShowTransak(false);
                        }}/>
                    </div>
                </div>
            )}

            {transationLoading && (
                <div className={'main-transation-loading-layout'}>
                    <animated.div className={'main-transation-submitted-layout'} style={transationStyle}>
                        {t('transaction_submitted')}
                    </animated.div>
                    <div className={'main-transation-right-layout'}>
                        <div className={'main-transation-number'}>
                            1
                        </div>
                        <Lottie options={{
                            isClickToPauseDisabled: false,
                            loop: true,
                            autoplay: true,
                            animationData: loading_ongoing,
                            rendererSettings: {
                                preserveAspectRatio: 'xMidYMid slice'
                            }
                        }}
                                height={42}
                                width={42}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
