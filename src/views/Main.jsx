import React, {useContext, useEffect, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import PopContext from "../contexts/PopContext";
import { useSpring, animated } from 'react-spring';

import ic_copy from '../assets/ic_copy.png';
// import ic_setting from '../assets/ic_setting.png'
// import ic_search from '../assets/ic_search.png'
// import ic_buy from '../assets/ic_buy.png'
// import ic_hide from '../assets/ic_hide.png'
// import ic_hide_disable from '../assets/ic_hide_disable.png'
// import ic_add from '../assets/ic_add.png'
// import ic_back_white from '../assets/ic_back_white.png'
import {getBackIcon, getAddIcon, getHideIcon, getBuyIcon, getClearIcon, getCloseIcon, getHideDisableIcon, getSearchIcon, getSettingIcon} from "../helpers/GetIcon";
// import ic_clear from "../assets/ic_clear.png";
import img_empty_search from "../assets/img_empty_search.png"
import Lottie from 'react-lottie'
import loadig_index from '../assets/loadig_index.json'
import loading_ongoing from '../assets/loading_ongoing.json'
// import ic_close from "../assets/ic_close.png"
import img_transak from "../assets/img_transak.png"
import ic_token_default from "../assets/ic_token_default.png"

import {useTranslation} from "react-i18next";
import {ChainType, HOST, NetworkConfig, EnableChainTypes} from "../helpers/Config";
import SwipeView from "../widgets/SwipeView";
import Button from "../widgets/Button";
import ConfigContext from "../contexts/ConfigContext";
import {callToNativeMsg, callUrlToNative, printToNative} from "../helpers/Utils";
import {renderAmount, renderShortValue, renderBalanceFiat, renderFullAmount} from "../helpers/number";
import {
    LOCAL_STORAGE_BIND_EMAIL,
    LOCAL_STORAGE_GET_OP_DATE,
    LOCAL_STORAGE_HAS_SEND_TEMP,
    LOCAL_STORAGE_HAS_SEND_TEMP_DATE,
    LOCAL_STORAGE_ONGOING_INFO,
    LOCAL_STORAGE_PAYSTER_OP,
    LOCAL_STORAGE_PUBLIC_ADDRESS,
    LOCAL_STORAGE_SEND_OP_SUCCESS,
    LOCAL_STORAGE_TG_FIRST_NAME,
    LOCAL_STORAGE_TG_LAST_NAME,
    LOCAL_STORAGE_TG_USERID
} from "../helpers/StorageUtils";
import {
    checkAndSendOp,
    getCreateOP,
    getPaymasterData,
    setEntryPoint,
    entryPoints, getBindEmail, sendbindEmailByChainId
} from "../helpers/UserOp";
import {handleFetch} from "../helpers/FatchUtils";
import ImageWithFallback from "../widgets/ImageWithFallback";

export default (props)=>{
    const { t, i18n } = useTranslation();
    const ic_add = getAddIcon();
    const ic_hide = getHideIcon();
    const ic_back_white = getBackIcon();
    const ic_buy = getBuyIcon();
    const ic_clear = getClearIcon();
    const ic_close = getCloseIcon();
    const ic_search = getSearchIcon();
    const ic_hide_disable = getHideDisableIcon();
    const ic_setting = getSettingIcon();
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
    const [tgName, setTgName] = useState('');
    const [account, setAccount] = useState('');
    const [swipeKey, setSwipeKey] = useState('');
    const { platform, ChainDisplayNames, wallet, paymasterUrl, isWeb } = useContext(ConfigContext);
    const { navigate, navigator, ongoing, showOngoing } = useContext(NavigateContext);
    const { showAddressCopied } = useContext(PopContext);
    const [initLoaded, setInitLoaded] = useState(false);
    const [ongoingNum, setOngoingNum] = useState(1);
    const [viewportHeight, setViewportHeight] = useState(0);

    function setViewportData() {
        const viewpartHeight = Math.round(window.Telegram.WebApp.viewportHeight, 2);
        setViewportHeight(viewpartHeight);
    }

    useEffect(() => {
        window.Telegram.WebApp.onEvent('viewportChanged', setViewportData);
        setViewportData();
    }, [])

    const goAsset = (item) => {
        navigate('Asset', { asset: item });
    }

    const fetchEntryPoint = () => {
        const url = `https://wallet.crescentbase.com/api/v2/getEntryPoints`;
        handleFetch(url).then((result) => {
            if (result && result.ret === 200 && result.errmsg === "ok" && result.data.length > 0) {
                setEntryPoint(result.data);
            }
        });
    }

    useEffect(() => {
        const interval = setInterval( () => {
            if (entryPoints.length > 0) {
                clearInterval(interval);
                return;
            }
            fetchEntryPoint();
        }, 30 * 1000);
        fetchEntryPoint();
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        // return;
        const interval = setInterval(async () => {
            if (wallet) {
                const sendOps = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SEND_OP_SUCCESS)) || [];
                console.csLog('===sendOps = ', sendOps);
                if (sendOps.length >= EnableChainTypes.length - 1) {
                    clearInterval(interval);
                    return;
                }
                const hasSendTemps = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HAS_SEND_TEMP)) || [];
                console.csLog('===hasSendTemps = ', hasSendTemps);
                if (hasSendTemps.length >= EnableChainTypes.length - 1) {
                    clearInterval(interval);
                    return;
                }

                const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
                const sender = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
                const pksync = await wallet.getAddress();
                const pk = pksync.toLowerCase();
                let preDate = localStorage.getItem(LOCAL_STORAGE_GET_OP_DATE);
                if (!preDate) {
                    preDate = String(new Date().getTime());
                    localStorage.setItem(LOCAL_STORAGE_GET_OP_DATE, preDate);
                }
                console.csLog('===sendOps = ', sendOps);
                try {
                    if (preDate === "fail") {
                        callToNativeMsg("error;create", platform);
                        clearInterval(interval);
                        return;
                    }
                    for (const chainType of EnableChainTypes) {
                        if (chainType !== ChainType.All) {
                            const chainId = NetworkConfig[chainType].MainChainId;
                            if (!sendOps.includes(chainId)) {
                                const paymasterOps = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PAYSTER_OP)) || [];
                                const payOp = paymasterOps[chainId]
                                let op;
                                if (payOp) {
                                    console.csLog('====hasPayOp = ', payOp);
                                    op = payOp;
                                } else {
                                    op = await getCreateOP(sender, pk, chainId);
                                    if (op !== null && preDate !== 'success') {
                                        preDate = 'success';
                                        localStorage.setItem(LOCAL_STORAGE_GET_OP_DATE, preDate);
                                    }
                                    if (op != null) {
                                        console.csLog('====pre = ', op);
                                        if (!op.paymasterAndData || op.paymasterAndData === '0x') {
                                            console.csLog('===paymasterUrl url = ', paymasterUrl)
                                            const paymasterData = await getPaymasterData(paymasterUrl, op, userId, pk, chainId)
                                            op = paymasterData;
                                            paymasterOps[chainId] = paymasterData;
                                            // localStorage.setItem(LOCAL_STORAGE_PAYSTER_OP, JSON.stringify(paymasterOps));
                                            console.csLog('====paymasterData = ', op);
                                        }
                                    }
                                }
                                console.csLog('===chainId = ', chainId, ' ; op = ', op);
                                if (op && op.paymasterAndData && op.paymasterAndData !== '0x') {
                                    if (!hasSendTemps.includes(chainId)) {
                                        console.csLog('====hasSendTemps no include');
                                        const hasSend = await checkAndSendOp(op, sender, pk, chainId);
                                        if (hasSend) {
                                            sendOps.push(chainId);
                                        }
                                        hasSendTemps.push(chainId);
                                        localStorage.setItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE, String(new Date().getTime()));
                                    } else {
                                        console.csLog('====hasSendTemps.includes(chainId)');
                                    }
                                }
                            }
                        }
                    }
                    if (sendOps.length > 0) {
                        localStorage.setItem(LOCAL_STORAGE_SEND_OP_SUCCESS, JSON.stringify(sendOps));
                    }
                    if (hasSendTemps.length > 0) {
                        // localStorage.setItem(LOCAL_STORAGE_HAS_SEND_TEMP, JSON.stringify(hasSendTemps));
                    }
                } catch (error) {
                    printToNative(error)
                    console.csLog('===getCreateOP = ', error);
                }
                // if (preDate !== 'success') {
                //     const nowDate = new Date().getTime();
                //     if (nowDate - Number(preDate) > 1 * 60 * 60 * 1000) {
                //         callToNativeMsg("error;create", platform);
                //         localStorage.setItem(LOCAL_STORAGE_GET_OP_DATE, 'fail');
                //         clearInterval(interval);
                //     }
                // }

                // clearInterval(interval);
            }
        }, 30 * 1000);
        return () => clearInterval(interval);
    }, [wallet]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (wallet) {
                fetchData(account, true, currentChainType, isSearch)
                fetchOnGoings();
            }
        }, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [wallet, account, currentChainType, isSearch]);

    useEffect(() => {
        if (navigator === "Main") {
            if (!initLoaded) {
                // localStorage.removeItem(LOCAL_STORAGE_SEND_OP_SUCCESS);
                // localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE);
                // localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP);
                // localStorage.removeItem(LOCAL_STORAGE_PAYSTER_OP);
                const userId = localStorage.getItem(LOCAL_STORAGE_TG_USERID);
                getBindEmail(userId).then((result) => {
                    if (result) {
                        const type = result.type;
                        if (type === 'NoBind') {
                            localStorage.removeItem(LOCAL_STORAGE_BIND_EMAIL);
                        } else if (type === 'Binding') {
                            localStorage.setItem(LOCAL_STORAGE_BIND_EMAIL, JSON.stringify(result));
                            const email = result.email;
                            const hmua = result.hmua;
                            const unbind = result.UnBind;
                            const sendOps = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SEND_OP_SUCCESS)) || [];
                            console.csLog('===getBindEmail localstorage sendOps = ', sendOps);
                            for (const chainId of unbind) {
                                if (sendOps.includes(String(chainId))) {
                                    sendbindEmailByChainId(paymasterUrl, wallet, hmua, chainId);
                                }
                            }
                        } else {
                            localStorage.setItem(LOCAL_STORAGE_BIND_EMAIL, JSON.stringify(result));
                        }
                        console.csLog('===getBindEmail = ', result);
                        // localStorage.setItem(LOCAL_STORAGE_BIND_EMAIL, result);
                    }
                })

                const hasSendTempDate = localStorage.getItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE);
                const nowDate = new Date().getTime();
                if (hasSendTempDate && nowDate - Number(hasSendTempDate) > 8 * 60 * 1000) {
                    localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP);
                }
                setInitLoaded(true);
                var element = document.getElementById("crescent-content");
                var width = element.clientWidth;
                const cardHeight = (width - (isWeb ? 50 : 40)) * 1.0 /319.0 * 100;
                setCardHeight(cardHeight);
                const address = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
                let firstName = localStorage.getItem(LOCAL_STORAGE_TG_FIRST_NAME) || '';
                const lastName = localStorage.getItem(LOCAL_STORAGE_TG_LAST_NAME) || '';
                const tgName = i18n.language == 'en' ? (firstName + ' ' + lastName) : (lastName + ' ' + firstName);
                setAccount(address);
                tgName && setTgName(tgName);
                fetchData(address);
            }

            const ongoingInfos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ONGOING_INFO)) || [];
            if (ongoingInfos.length > 0) {
                setTransationLoading(true);
            }
            setOngoingNum(ongoingInfos.length);
            if (ongoing) {
                toggleSubbmitLoading();
                showOngoing(false);
            }
            fetchOnGoings();
        }
    }, [navigator]);

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

    const fetchData = async (account, interval = false, currentChainType = ChainType.All, isSearch = false) => {
        console.csLog('====fetchdata interval = ', interval);
        if (!interval) {
            setDataLoading(true);
        }
        let preDate = localStorage.getItem(LOCAL_STORAGE_GET_OP_DATE);
        if (!preDate) {
            await handleFetch(HOST + '/api/v1/addAccount?address=' + account)
        }
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
                console.csLog('===token = ', tokens);
                if (!tokens || tokens.length === 0) {
                    setData([]);
                    if (!interval) {
                        setDataLoading(false);
                    }
                    return;
                }
                const assets = [];
                tokens.map((item, index) => {
                    const amount = renderAmount(item.balances, item.decimals);
                    const fullAmount = renderFullAmount(item.balances, item.decimals);
                    const balanceFiat = Number(renderBalanceFiat(item.balances, item.decimals, item.price));
                    const balanceFiatUsd = "$" + renderBalanceFiat(item.balances, item.decimals, item.price);
                    const nativeCurrency = item.tokenAddress === "0x0";
                    item.image = item.image || ic_token_default;
                    item.decimals = item.decimals ? item.decimals : 18;
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
                if (!interval) {
                    setDataLoading(false);
                }
                if (!isSearch) {
                    loadDisplayData(assets, currentChainType);
                }
                setData(assets);
            }).catch(error => {
                console.csLog(error)
                if (!interval) {
                    setDataLoading(false);
                }
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
                console.csLog('====tokens = ', tokens);
                const assets = [];

                tokens.map((item, index) => {
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
                    assets.push({...item, account, amount, fullAmount, balanceFiat, balanceFiatUsd, nativeCurrency, chainType, change24h: Number(renderShortValue(item.change24h, 5))});
                })
                console.csLog('===search tokens = ', tokens);
                loadDisplayData(assets, currentChainType);
                // setData(assets);
            }).catch(error => {
            console.csLog(error)
        });
    };

    const addToken = (asset) => {
        const url = HOST + '/api/v1/addToken?chain_id=' + asset.chainId + '&account=' + account + '&address=' + asset.tokenAddress + '&balances=' + (asset.balances || 0);
        console.csLog('====url = ', url)
        fetch(url)
            .then(response => response.json())
            .then(result => {
                if (!result || result.ret !== 200 || result.errmsg !== 'ok') {
                    return;
                }
                asset.searchType = 0;
                const newData = [asset, ...data];
                setData(newData);
                if (!isSearch) {
                    let newDisplayData = [asset, ...displayData];
                    setDisplayData(newDisplayData);
                }
            }).catch(error => {
            console.csLog(error)
        });
    }

    const removeToken = (asset) => {
        const url = HOST + '/api/v1/removeToken?chain_id=' + asset.chainId + '&account=' + account + '&address=' + asset.tokenAddress;
        fetch(url)
            .then(response => response.json())
            .then(result => {
                if (!result || result.ret !== 200 || result.errmsg !== 'ok') {
                    return;
                }
                asset.searchType = 1;
                let newData = [...data];
                newData = newData.filter(item => item.tokenAddress !== asset.tokenAddress);
                setData(newData);
                if (!isSearch) {
                    let newDisplayData = [...displayData];
                    newDisplayData = newDisplayData.filter(item => item.tokenAddress !== asset.tokenAddress);
                    setDisplayData(newDisplayData);
                }
            }).catch(error => {
            console.csLog(error)
        });
    }

    const fetchOnGoingItem = async token => {
        const chainId = NetworkConfig[token.chainType].MainChainId;
        const url = `https://bundler-${chainId}.crescentbase.com/rpc`
            // RPCHOST + '/api/v1/rpc/' + NetworkConfig[token.chainType].MainChainId;
        try {
            const response = await fetch(url, {
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
                    "params":[token.txHash, token.blockNumber]
                })
            });
            const json = await response.json();
            const result = json.result;
            // 以上逻辑等于以下这个
            // const provider = new ethers.providers.JsonRpcProvider(url);
            // const result = await provider.send("eth_getUserOperationReceipt", [token.txHash]);
            return result;
        } catch (error) {
            console.error('===fetchOnGoingItem', error);
        }
        return null;
    }

    const fetchOnGoings = async () => {
        const ongoingInfos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ONGOING_INFO)) || [];
        if (ongoingInfos.length === 0) {
            setTransationLoading(false);
            return;
        }
        const spliceIndexs = [];
        for (let i = 0; i < ongoingInfos.length; i++) {
            const ongoingInfo = ongoingInfos[i];
            const nowDate = new Date().getTime();
            if (nowDate - ongoingInfo.txTime > 3 * 60 * 60 * 1000) {
                spliceIndexs.push(i);
            } else {
                const token = await fetchOnGoingItem(ongoingInfo);
                if (token) {
                    spliceIndexs.push(i);
                } else {
                    //token.success === true  成功， token.success === false； 失败
                }
            }
        }
        if (spliceIndexs.length > 0) {
            for (let i = spliceIndexs.length - 1; i >= 0; i--) {
                ongoingInfos.splice(spliceIndexs[i], 1);
            }
            localStorage.setItem(LOCAL_STORAGE_ONGOING_INFO, JSON.stringify(ongoingInfos));
            setOngoingNum(ongoingInfos.length);
            if (ongoingInfos.length === 0) {
                setTransationLoading(false);
            }
        }
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
                <div className={'main-asset-item-layout'} style={isSearch ? {marginLeft: 42} : {}}>
                    <div className={'main-asset-item-icon-layout'}>
                        <ImageWithFallback className={'main-asset-item-icon'} src={item.image} defaultSrc={ic_token_default}/>
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
        const isAdd = isSearch && item.searchType === 1;
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
            <div className={'main-content'} style={isWeb ? { paddingTop: 20, paddingLeft: 25, paddingRight: 25 } : {}}>
                <div className={'main-title-layout'}>
                    <div className={'main-title-email-and-adrress-layout'}>
                        <div className={'main-title-email'}>
                            {tgName}
                        </div>
                        <div className={'main-title-address-layout'} onClick={() => showAddressCopied(account)}>
                            <div className={'main-title-address'}>
                                {account?.substring(0, 13) + "..." + account?.substring(30)}
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
                    <div className={'main-search-base-layout'}>
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
                    </div>
                )}

                {dataLoading ? (
                    <div className={'main-search-lottie-layout'}>
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
                    </div>
                ) : displayData.length > 0 ? (
                    displayData.map((item, index) => (
                        <SwipeView
                            expand={isSearch}
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
                                        addToken(item);
                                    } else {
                                        removeToken(item);
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
                <div className={'main-transak-layout-wrap'} style={{height: viewportHeight}}>
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
