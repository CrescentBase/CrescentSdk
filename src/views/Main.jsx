import React, {useContext, useEffect, useState, useRef} from "react";
import NavigateContext from "../contexts/NavigateContext";
import PopContext from "../contexts/PopContext";
import { useSpring, animated } from 'react-spring';

import ic_copy from '../assets/ic_copy.png';
import ic_setting from '../assets/ic_setting.png'
import ic_history_black from '../assets/ic_history_black.png'
import ic_search from '../assets/ic_search.png'
import ic_buy from '../assets/ic_buy.png'
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
import ic_token_default from "../assets/ic_token_default.png"

import {useTranslation} from "react-i18next";
import {ChainType, HOST, NetworkConfig} from "../helpers/Config";
import SwipeView from "../widgets/SwipeView";
import Button from "../widgets/Button";
import ConfigContext from "../contexts/ConfigContext";
import {callUrlToNative} from "../helpers/Utils";
import {renderAmount, renderShortValue, renderBalanceFiat, renderFullAmount} from "../helpers/number";
import {ethers} from "ethers";
import {estimateGas, getSuggestedGasEstimates} from "../helpers/custom-gas";
import BigNumber from 'bignumber.js';
const LOCAL_STORAGE_HIDDEN_ID = 'storage_hidden_ids';
const LOCAL_STORAGE_OTHER_TOKENS = 'storage_other_tokens';
export const LOCAL_STORAGE_ONGOING_INFO = "storage_ongoin_info";


export default (props)=>{
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [cardHeight, setCardHeight] = useState(0);
    const [displayBalanceFait, setDisplayBalanceFait] = useState(0);
    const [currentChainType, setCurrentChainType] = useState(ChainType.All);
    const [searchText, setSearchText] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [showWalletCreated, setShowWalletCreated] = useState(false);
    const [showTransak, setShowTransak] = useState(false);
    const [transationLoading, setTransationLoading] = useState(false);
    const [transationStyle, setTransationStyle] = useSpring(() => ({ width: 0 }));
    const [emailAccount, setEmailAccount] = useState('test@gmail.com');
    const [account, setAccount] = useState('0x6c3f14da26556585706c02af737a44e67dc6954d');
    const [swipeKey, setSwipeKey] = useState('');
    const { platform, ChainDisplayNames, EnableChainTypes } = useContext(ConfigContext);
    const { navigate, navigator, ongoing } = useContext(NavigateContext);
    const { showAddressCopied } = useContext(PopContext);
    const [initLoaded, setInitLoaded] = useState(false);
    const [hiddenIds, setHiddenIds] = useState([]);
    const [ongoingNum, setOngoingNum] = useState(1);

    const goAsset = (item) => {
        navigate('Asset', { asset: item });
    }

    const goHistory = async () => {
        navigate('History');
    }

    // decGWEI =  0.3
    // index.bundle.js:58 ===wei =  BigNumber$1 {_hex: '0x11e1a300', _isBigNumber: true}
    useEffect(async () => {
        // const gwei = ethers.utils.parseEther(String(0.3)).div(1000000000); //decGWEI有小数点的时候奔溃
        // console.log('==gwei = ', gwei);
        // const wei = ethers.BigNumber.from(gwei);
        // console.log('===wei = ', wei.toString());
        //
        // const a = ethers.BigNumber.from('100');
        // console.log('===a = ', a);
        // const d = a.mul(2);
        // console.log('===d= ', d.toString());

        // const Ethereum = await getSuggestedGasEstimates(ChainType.Ethereum);
        // console.log('==Ethereum = ', Ethereum);
        //
        // const Polygon = await getSuggestedGasEstimates(ChainType.Polygon);
        // console.log('==Polygon = ', Polygon);
        //
        // const Bsc = await getSuggestedGasEstimates(ChainType.Bsc);
        // console.log('==Bsc = ', Bsc);
        //
        // const Arbitrum = await getSuggestedGasEstimates(ChainType.Arbitrum);
        // console.log('==Arbitrum = ', Arbitrum);

        //x
        // const { rpcTarget, chainId, ticker, nickname } = NetworkConfig[ChainType.Bsc].Networks['BSC Mainnet'].provider;
        // let provider;
        // console.log(rpcTarget, nickname);
        // if (rpcTarget) {
        //     provider = new ethers.providers.JsonRpcProvider(rpcTarget, { chainId: 56, name: 'bsc' });
        // }
        // const { maxPriorityFeePerGas, baseFeePerGas, gasPrice } = await provider.getFeeData();
        // console.log(maxPriorityFeePerGas, baseFeePerGas, gasPrice);
        //
        // const block = await provider.send('eth_getBlockByNumber', ['latest', false]);
        // const maxPriorityFeePerGas1 = block.maxPriorityFeePerGas;
        // console.log('=maxPriorityFeePerGas1 = ', maxPriorityFeePerGas1);

        // const ethQuery = new ethers.providers.EtherscanProvider('bsc');
        // const { maxPriorityFeePerGas, baseFeePerGas, gasPrice } = await ethQuery.getFeeData();

    }, [])

    useEffect(() => {
        if (navigator === "Main") {
            if (!initLoaded) {
                setInitLoaded(true);
                var element = document.getElementById("crescent-content");
                var width = element.clientWidth;
                const cardHeight = (width - 40) * 1.0 /319.0 * 100;
                setCardHeight(cardHeight);
                const address = localStorage.getItem("address") || account;
                const emailAccount = localStorage.getItem('emailAccount');
                console.log('==address = ', address);
                setAccount(address);
                emailAccount && setEmailAccount(emailAccount);
                const storedIds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HIDDEN_ID));
                if (storedIds) {
                    setHiddenIds(storedIds);
                }
                const storedTokens = JSON.parse(localStorage.getItem(LOCAL_STORAGE_OTHER_TOKENS));
                fetchData(storedIds);
            }
            if (ongoing) {
                toggleSubbmitLoading();
            }
            // fetchOnGoing();
            //fetch ongoing 数据
            // localStorage.getItem(LOCAL_STORAGE_ONGOING_INFO);
            // setTransationLoading(true);
        }
    }, [navigator]);

    const handleAddHiddenId = (id) => {
        let storageId = [];
        if (hiddenIds.includes(id)) {
            storageId = hiddenIds.filter((hiddenId) => hiddenId !== id);
            setHiddenIds(storageId);
        } else {
            storageId = [...hiddenIds, id];
            setHiddenIds(storageId);
        }
        localStorage.setItem(LOCAL_STORAGE_HIDDEN_ID, JSON.stringify(storageId));
    };

    const handleRemoveHiddenId = (id) => {
        let storageId = hiddenIds.filter((selectedId) => selectedId !== id);
        setHiddenIds(storageId);
        localStorage.setItem(LOCAL_STORAGE_HIDDEN_ID, JSON.stringify(storageId));
    };

    const isHiddenId = (id) => hiddenIds.includes(id);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isSearch) {
                fetchSearchData();
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [searchText])

    const loadDisplayData = (allData, type) => {
        let balanceFait = 0;
        if (type === ChainType.All) {
            allData.map((item, index) => {
                balanceFait = balanceFait + item.balanceFiat;
            })

            setDisplayBalanceFait("$" + renderShortValue(balanceFait));
            setDisplayData(allData);
        } else {
            let displayData = [];
            allData.map((item, index) => {
                if (item.chainType === type) {
                    displayData.push(item);
                    balanceFait = balanceFait + item.balanceFiat;
                }
            })
            setDisplayBalanceFait("$" + renderShortValue(balanceFait));
            setDisplayData(displayData);
        }
    }

    const fetchData = async () => {
        setDataLoading(true);
        let chainIds = "[";
        EnableChainTypes.map((item, index) => {
            if (item != ChainType.All) {
                chainIds += (NetworkConfig[item].MainChainId + ",");
            }
        })
        chainIds = chainIds.substring(0, chainIds.length - 1);
        chainIds += "]";
        fetch(HOST + '/api/v1/getAssets?address=' + account + '&chainIds=' + chainIds + '&rate=usd&offset=0&count=200')
            .then(response => response.json())
            .then(data => {
                const tokens = data.data;
                if (!tokens || tokens.length === 0) {
                    setData([]);
                    return;
                }
                const assets = [];
                tokens.map((item, index) => {
                    // if (hiddenId.includes(item.id)) {
                    //     return null;
                    // }
                    const amount = renderAmount(item.balances, item.decimals);
                    const fullAmount = renderFullAmount(item.balances, item.decimals);
                    const balanceFiat = Number(renderBalanceFiat(item.balances, item.decimals, item.price));
                    const balanceFiatUsd = "$" + renderBalanceFiat(item.balances, item.decimals, item.price);
                    const nativeCurrency = item.tokenAddress === "0x0";
                    item.image = item.image || ic_token_default;
                    let chainType = ChainType.Ethereum;
                    EnableChainTypes.map((type, index) => {
                        if (type != ChainType.All) {
                            if (String(NetworkConfig[type].MainChainId) === String(item.chainId)) {
                                chainType = type;
                            }
                        }
                    })
                    assets.push({...item, amount, fullAmount, balanceFiat, balanceFiatUsd, nativeCurrency, chainType, change24h: Number(renderShortValue(item.change24h, 5))});
                })
                setDataLoading(false);
                loadDisplayData(assets, ChainType.All);
                setData(assets);
            }).catch(error => {
                console.log(error)
                setDataLoading(false);
            });
    };

    const fetchSearchData = () => {
        const text = searchText;
        if (!text || text === '') {
            loadDisplayData(data, currentChainType);
            return;
        }
        let chainIds = "";
        if (currentChainType === ChainType.All) {
            EnableChainTypes.map((item, index) => {
                if (item != ChainType.All) {
                    chainIds += (NetworkConfig[item].MainChainId + ",");
                }
            })
            chainIds = chainIds.substring(0, chainIds.length - 1);
        } else {
            chainIds = NetworkConfig[currentChainType].MainChainId;
        }

        const url = HOST + '/api/v1/searchToken?name=' + text + '&account=' + account + '&chain_id=' + chainIds + '&limit=30';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const tokens = data.data;
                if (!tokens || tokens.length === 0) {
                    loadDisplayData([], currentChainType);
                    return;
                }
                const assets = [];

                tokens.map((item, index) => {
                    if (isHiddenId(item.id)) {
                        item.isHidden = true;
                    }
                    item.tokenAddress = item.address;
                    item.chainId = item.chain_id;
                    const amount = renderAmount(item.balances, item.decimals);
                    const fullAmount = renderFullAmount(item.balances, item.decimals);
                    const balanceFiat = Number(renderBalanceFiat(item.balances, item.decimals, item.price));
                    const balanceFiatUsd = "$" + renderBalanceFiat(item.balances, item.decimals, item.price);
                    const nativeCurrency = item.tokenAddress === "0x0";
                    item.image = item.image || ic_token_default;
                    let chainType = ChainType.Ethereum;
                    EnableChainTypes.map((type, index) => {
                        if (type != ChainType.All) {
                            if (String(NetworkConfig[type].MainChainId) === String(item.chainId)) {
                                chainType = type;
                            }
                        }
                    })
                    assets.push({...item, amount, fullAmount, balanceFiat, balanceFiatUsd, nativeCurrency, chainType, change24h: Number(renderShortValue(item.change24h, 5))});
                })
                loadDisplayData(assets, currentChainType);
                // setData(assets);
            }).catch(error => {
            console.log(error)
        });
    };

    const addToken = (asset) => {
        const url = HOST + '/api/v1/addToken?chain_id=' + asset.chain_id + '&account=' + account + '&address=' + asset.address + '&balances=' + (asset.balances || 0);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const tokens = data.data;
                asset.searchType = 0;

            }).catch(error => {
            console.log(error)
        });
    }

    const fetchOnGoing = () => {
        fetch('http://192.168.2.117:3000/rpc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({
            //     data: 'example data'
            // })
            body: JSON.stringify({
                "jsonrpc":"2.0",
                "id":1,
                "method":"eth_getUserOperationReceipt",
                "params":["0x534988b2dd27af8d95343f57e758db5afe79dd826c64e85b422fc78ce1bde954"]
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    const toastWalletCreated = () => {
        setShowWalletCreated(true);
        setTimeout(() => {
            setShowWalletCreated(false);
        }, 2000);
    }

    const handleTextChange = (event) => {
        const text = event.target.value;
        setTextChange(text);
        // fetchData();
        // setData([]);

    };

    const setTextChange = (text) => {
        setSearchText(text);
    }

    const clickToTransak = () => {
        const url = "https://global.transak.com/?apiKey=2bd8015d-d8e6-4972-bcca-22770dcbe595";
        callUrlToNative(url, platform);
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
            <div className={'flex-col'}>
                <div className={'main-asset-item-layout'}>
                    <div className={'main-asset-item-icon-layout'}>
                        <img className={'main-asset-item-icon'} src={item.image}/>
                        <img className={'main-asset-item-chain-tag'} src={NetworkConfig[item.chainType].tag}/>
                    </div>
                    <div className={'main-asset-item-token-left-layout'}>
                        <div className={'main-asset-item-token-name'}>
                            {item.symbol}
                        </div>
                        <div className={'main-asset-item-token-amount'}>
                            {item.amount}
                        </div>
                    </div>
                    <div className={'flex-full'}/>
                    <div className={'main-asset-item-token-balance'}>
                        {item.balanceFiatUsd}
                    </div>
                </div>
                <div className={'main-asset-item-line'}/>
            </div>
        )
    }

    const renderItemAction = (item) => {
        const isAdd = isSearch && item.searchType === 1 && !item.isHidden;
        const isDisable = item.nativeCurrency;
        return (
            <div className={'main-asset-item-action-base-layout'}>
                <div className={'flex-full'}/>
                <div className={'main-asset-item-action-wrap'}>
                    <img className={'main-asset-item-action-icon'} src={isAdd ? ic_add : isDisable ? ic_hide_disable : ic_hide}/>
                    <div className={'main-asset-item-action-text'} style={isDisable ? {color: 'rgba(147,157,165,0.6)'} : {}}>
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
                            {emailAccount}
                        </div>
                        <div className={'main-title-address-layout'} onClick={() => showAddressCopied(account)}>
                            <div className={'main-title-address'}>
                                {account.substring(0, 13) + "..." + account.substring(30)}
                            </div>
                            <img className={'main-title-address-copy-icon'} src={ic_copy}/>
                        </div>
                    </div>
                    <img className={'main-title-setting-icon'} src={ic_setting} onClick={() => navigate('Setting')}/>
                </div>

                <div className={'main-card-wrap'}>
                    <img className={'main-card-img'} src={NetworkConfig[currentChainType].chainCards}/>

                    <div className={'main-card-content'} style={{height: cardHeight}}>
                        <div className={'main-card-top-layout'}>
                            <div className={'main-card-balance-text'}>
                                {displayBalanceFait}
                            </div>
                            {/*<div className={'main-card-history-wrap-layout'} onClick={() => goHistory()}>*/}
                            {/*    <img src={ic_history_black} className={'main-card-history-icon'}/>*/}
                            {/*    <div className={'main-card-history-text'}>*/}
                            {/*        {t('tx_history')}*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                        <div className={'main-card-chain-layout'}>
                            {EnableChainTypes.map((item, index) => {
                                return (
                                    <div className={'main-card-chain-item-layout'} onClick={() => {
                                        loadDisplayData(data, item);
                                        setCurrentChainType(item);
                                        setSwipeKey('');
                                    }}>
                                        <img className={'main-card-chain-logo'} src={currentChainType === item ? NetworkConfig[item].chainIcons : NetworkConfig[item].chainIconAlphas}/>
                                        <div className={'main-card-chain-name'}>{currentChainType === item ? ChainDisplayNames[item].displayName : '  '}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {isSearch ? (
                    <div className={'main-search-base-layout'}>
                        <div className={'main-search-wrap-layout'}>
                            <img className={'main-search-back-icon'} src={ic_back_white} onClick={() => {
                                setIsSearch(false);
                                setTextChange('');
                                setSwipeKey('');
                                loadDisplayData(data, currentChainType);
                            }}/>
                            <img className={'main-search-edit-icon'} src={ic_search}/>
                            <input className={'main-search-edittext'}
                                   type={"text"}
                                   placeholder={t('token_or_contract_address')}
                                   value={searchText}
                                   onChange={handleTextChange}
                            />
                            {searchText !== '' && (
                                <img className={'main-search-edittext-clear'} src={ic_clear} onClick={() => {
                                    setTextChange("");
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
                        <img src={ic_search} className={'main-asset-search-icon'} onClick={() => {
                            setIsSearch(true)
                            setSwipeKey('');
                        }}/>
                        <img src={ic_buy} className={'main-asset-buy-icon'} onClick={() => setShowTransak(true)}/>
                    </div>
                )}

                {dataLoading ? (
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
                ) : displayData.length > 0 ? (
                    displayData.map((item, index) => (
                        <SwipeView
                            btnWidth={42}
                            rowRenderer={renderItem(item)}
                            actionBtn={renderItemAction(item)}
                            key={'swipeview' + index}
                            id={'swipeview' + index}
                            swipeKey={swipeKey}
                            onClickItem={() => goAsset(item)}
                            onClickAction={() => {
                                setSwipeKey('');
                                const isAdd = isSearch && item.searchType === 1;
                                const isDisable = item.nativeCurrency;
                                if (!isDisable) {
                                    if (isAdd) {
                                        handleRemoveHiddenId(item.id);
                                        addToken(item);
                                    } else {
                                        handleAddHiddenId(item.id);
                                    }
                                }
                            }}
                            swipe={(key) => {
                                setSwipeKey(key);
                            }}/>
                    ))
                ) : (
                    <div className={'main-search-empty-data'}>
                        <img src={img_empty_search} className={'main-search-empty-icon'}/>
                        <div className={'main-search-empty-tip'}>{t('no_token_found')}</div>
                    </div>
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
                        <span
                            className={'main-transak-click-here'}
                            onClick={() => {
                                const url = "https://www.notion.so/Coverage-Payment-Methods-Fees-Limits-30c0954fbdf04beca68622d9734c59f9";
                                callUrlToNative(url, platform);
                            }}
                        >{t('buy_crypto_click_here')}</span>{t('buy_crypto_content2')}
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
                    <div className={'main-transation-right-layout'} onClick={() => {
                        navigate("OngoingTx")
                    }}>
                        <div className={'main-transation-number'}>
                            {ongoingNum}
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
