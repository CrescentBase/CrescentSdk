import ic_eth_tag from "../assets/ic_eth_tag.png";
import ic_polygon_tag from "../assets/ic_polygon_tag.png";
import ic_bsc_tag from "../assets/ic_bsc_tag.png";
import ic_arb_tag from "../assets/ic_arb_tag.png";
import img_card_all from "../assets/img_card_all";
import ic_card_all from "../assets/ic_card_all.png";
import ic_card_all_alpha from "../assets/ic_card_all_alpha.png";
import img_card_eth from "../assets/img_card_eth";
import ic_card_eth from "../assets/ic_card_eth.png";
import ic_card_eth_alpha from "../assets/ic_card_eth_alpha.png";
import img_card_polygon from "../assets/img_card_polygon";
import ic_card_polygon from "../assets/ic_card_polygon.png";
import ic_card_polygon_alpha from "../assets/ic_card_polygon_alpha.png";
import img_card_arb from "../assets/img_card_arb";
import ic_card_arb from "../assets/ic_card_arb.png";
import ic_card_arb_alpha from "../assets/ic_card_arb_alpha.png";
import img_card_bsc from "../assets/img_card_bsc";
import ic_card_bsc from "../assets/ic_card_bsc.png";
import ic_card_bsc_alpha from "../assets/ic_card_bsc_alpha.png";

export const HOST = "https://controller.crescentbase.com";//"http://192.168.2.117:7017"
export const RPCHOST = "https://wallet.crescentbase.com";//"http://192.168.2.117:7017"

export const ChainType = {
    All: 0,
    Ethereum: 0x01,
    Polygon: 0x02,
    Arbitrum: 0x04,
    Bsc: 0x08
}

export const AllChainTypes = [ChainType.All, ChainType.Ethereum, ChainType.Polygon, ChainType.Arbitrum, ChainType.Bsc];

export const EnableChainTypes = [ChainType.All, ChainType.Polygon, ChainType.Arbitrum, ChainType.Bsc];//[ChainType.All, ChainType.Ethereum, ChainType.Polygon, ChainType.Arbitrum, ChainType.Bsc];

export const NetworkConfig = {
    [ChainType.All]: {
        chainCards: img_card_all,
        chainIcons: ic_card_all,
        chainIconAlphas: ic_card_all_alpha,
    },
    [ChainType.Ethereum]: {
        Name: "Ethereum",
        chainCards: img_card_eth,
        chainIcons: ic_card_eth,
        chainIconAlphas: ic_card_eth_alpha,
        tag: ic_eth_tag,
        ticker: "ETH",
        color: '#627EEA',
        MainChainId: '1',
        UseInfura: true,
        Disabled: false,
        DefiTokenChain: [],
        CoingeckoId: 'ethereum',
        SwapUrl: 'https://bafybeidlvfo3j6lbrq56uultqp5urpirthugtwcrjc642jci4ntkko5ra4.ipfs.cf-ipfs.com/#/swap',
        SwapTokenUrl: 'https://bafybeidlvfo3j6lbrq56uultqp5urpirthugtwcrjc642jci4ntkko5ra4.ipfs.cf-ipfs.com/#/swap?inputCurrency=',
        CurrencyLogo: 'https://cdn.gopocket.finance/files/eth_logo.png',
        NeedAvailableUrl: true,
        OtherCoinInfoUrl: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
        SushiswapGraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
        NetworkNames: ['Ethereum Mainnet', 'Ropsten', 'Kovan', 'Rinkeby', 'Goerli', 'Ropsten', ],
        Networks: {
            "Ethereum Mainnet": {
                provider: {
                    "rpcTarget": "",
                    "type": "Ethereum Mainnet",
                    "chainId": "1",
                    "ticker": "ETH",
                    "nickname": "Ethereum"
                },
                infuraType: "mainnet",
                ExplorerUrl: 'https://etherscan.io',
                ExplorerApiUrl: 'https://api.etherscan.io',
            },
            "Ropsten": {
                provider: {
                    "rpcTarget": "",
                    "type": "Ropsten",
                    "chainId": "3",
                    "ticker": "ETH",
                    "nickname": "Ethereum"
                },
                infuraType: "ropsten",
                ExplorerUrl: 'https://ropsten.etherscan.io',
                ExplorerApiUrl: 'https://api-ropsten.etherscan.io',
            },
            "Kovan": {
                provider: {
                    "rpcTarget": "",
                    "type": "Kovan",
                    "chainId": "42",
                    "ticker": "ETH",
                    "nickname": "Ethereum"
                },
                infuraType: "kovan",
                ExplorerUrl: 'https://kovan.etherscan.io',
                ExplorerApiUrl: 'https://api-kovan.etherscan.io',
            },
            "Rinkeby": {
                provider: {
                    "rpcTarget": "",
                    "type": "Rinkeby",
                    "chainId": "4",
                    "ticker": "ETH",
                    "nickname": "Ethereum"
                },
                infuraType: "rinkeby",
                ExplorerUrl: 'https://rinkeby.etherscan.io',
                ExplorerApiUrl: 'https://api-rinkeby.etherscan.io',
            },
            "Goerli": {
                provider: {
                    "rpcTarget": "",
                    "type": "Goerli",
                    "chainId": "5",
                    "ticker": "ETH",
                    "nickname": "Ethereum"
                },
                infuraType: "goerli",
                ExplorerUrl: 'https://goerli.etherscan.io',
                ExplorerApiUrl: 'https://api-goerli.etherscan.io',
            },
        }
    },
    [ChainType.Polygon]: {
        Name: "Polygon",
        chainCards: img_card_polygon,
        chainIcons: ic_card_polygon,
        chainIconAlphas: ic_card_polygon_alpha,
        tag: ic_polygon_tag,
        ticker: "MATIC",
        color: '#8247E5',
        MainChainId: '137',
        UseInfura: true,
        Disabled: false,
        DefiTokenChain: ['matic'],
        CoingeckoId: 'matic-network',
        SwapUrl: 'https://quickswap.exchange/#/swap',
        SwapTokenUrl: 'https://quickswap.exchange/#/swap?inputCurrency=',
        CurrencyLogo: 'https://cdn.gopocket.finance/files/matic_network_logo.png',
        NeedAvailableUrl: true,
        OtherCoinInfoUrl: 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
        SushiswapGraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
        NetworkNames: ['Polygon Mainnet', 'Polygon Testnet'],
        Networks: {
            "Polygon Mainnet": {
                "provider": {
                    "rpcTarget": "https://rpc-mainnet.maticvigil.com",
                    "type": "Polygon Mainnet",
                    "chainId": "137",
                    "ticker": "MATIC",
                    "nickname": "Polygon"
                },
                "infuraType": "polygon-mainnet",
                ExplorerUrl: 'https://polygonscan.com',
                ExplorerApiUrl: 'https://api.polygonscan.com',
                "partnerChainId": "1",
                "DepositManagerProxy": "0x401F6c983eA34274ec46f84D70b31C151321188b",
                "Tokens": {
                    "MaticToken": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
                    "TestToken": "0x3db715989dA05C1D17441683B5b41d4510512722",
                    "RootERC721": "0x96CDDF45C0Cd9a59876A2a29029d7c54f6e54AD3",
                    "MaticWeth": "0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8"
                },
                "RootChainManagerProxy": "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77",
                "MaticWETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                "MaticTokenMatic": "0x0000000000000000000000000000000000001010",
            },
            "Polygon Testnet": {
                "provider": {
                    "rpcTarget": "https://rpc-mumbai.matic.today",
                    "type": "Polygon Testnet",
                    "chainId": "80001",
                    "ticker": "MATIC",
                    "nickname": "Polygon"
                },
                "infuraType": "polygon-mumbai",
                ExplorerUrl: 'https://mumbai.polygonscan.com',
                ExplorerApiUrl: 'https://api-testnet.polygonscan.com',
                "partnerChainId": "5",
                "DepositManagerProxy": "0x7850ec290A2e2F40B82Ed962eaf30591bb5f5C96",
                "Tokens": {
                    "MaticToken": "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
                    "TestToken": "0x3f152B63Ec5CA5831061B2DccFb29a874C317502",
                    "RootERC721": "0xfA08B72137eF907dEB3F202a60EfBc610D2f224b",
                    "MaticWeth": "0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc"
                },
                "RootChainManagerProxy": "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74",
                "MaticWETH": "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
                "MaticTokenMatic": "0x0000000000000000000000000000000000001010",
            }
        }
    },
    [ChainType.Arbitrum]: {
        Name: "Arb",
        chainCards: img_card_arb,
        chainIcons: ic_card_arb,
        chainIconAlphas: ic_card_arb_alpha,
        tag: ic_arb_tag,
        ticker: "ETH",
        color: '#23A1F0',
        MainChainId: '42161',
        UseInfura: true,
        Disabled: false,
        DefiTokenChain: ['arb'],
        CoingeckoId: 'ethereum',
        SwapUrl: 'https://sushiswap-interface-teamsushi.vercel.app/swap',
        SwapTokenUrl: 'https://sushiswap-interface-teamsushi.vercel.app/swap/swap?inputCurrency=',
        CurrencyLogo: 'https://cdn.gopocket.finance/files/eth_logo.png',
        NeedAvailableUrl: false,
        OtherCoinInfoUrl: '',
        SushiswapGraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange',
        NetworkNames: ['Arbitrum Mainnet', 'Arbitrum Testnet Rinkeby'],
        Networks: {
            "Arbitrum Mainnet": {
                "provider": {
                    "rpcTarget": "https://arb1.arbitrum.io/rpc",
                    "type": "Arbitrum Mainnet",
                    "chainId": "42161",
                    "ticker": "ETH",
                    "nickname": "Arbitrum"
                },
                ExplorerUrl: 'https://arbiscan.io',
                ExplorerApiUrl: 'https://api.arbiscan.io',
                "confirmIntervalInSecond": 604800,
                "partnerChainId": "1",
                "infuraType": "arbitrum-mainnet",
                "inbox": "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f",
                "outbox": "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a",
                "outbox2": "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40",
                "l1GatewayRouter": "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef",
                "arbsys": "0x0000000000000000000000000000000000000064",
                "node_interface": "0x00000000000000000000000000000000000000C8",
                "l2GatewayRouter": "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933",
                "l1ERC20Gateway": "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC",
                "l2ERC20Gateway": "0x09e9222E96E7B4AE2a407B98d48e330053351EEe",
            },
            "Arbitrum Testnet Rinkeby": {
                "provider": {
                    "rpcTarget": "https://rinkeby.arbitrum.io/rpc",
                    "type": "Arbitrum Testnet Rinkeby",
                    "chainId": "421611",
                    "ticker": "ETH",
                    "nickname": "Arbitrum"
                },
                ExplorerUrl: 'https://testnet.arbiscan.io',
                ExplorerApiUrl: 'https://api-testnet.arbiscan.io',
                "confirmIntervalInSecond": 86400,
                "partnerChainId": "4",
                "infuraType": "arbitrum-rinkeby",
                "inbox": "0x578BAde599406A8fE3d24Fd7f7211c0911F5B29e",
                "outbox": "0xefa1a42D3c4699822eE42677515A64b658be1bFc",
                "outbox2": "0xefa1a42D3c4699822eE42677515A64b658be1bFc",
                "l1GatewayRouter": "0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380",
                "arbsys": "0x0000000000000000000000000000000000000064",
                "node_interface": "0x00000000000000000000000000000000000000C8",
                "l2GatewayRouter": "0x9413AD42910c1eA60c737dB5f58d1C504498a3cD",
                "l1ERC20Gateway": "0x91169Dbb45e6804743F94609De50D511C437572E",
                "l2ERC20Gateway": "0x195C107F3F75c4C93Eba7d9a1312F19305d6375f"
            }
        }
    },
    [ChainType.Bsc]: {
        Name: "Bsc",
        chainCards: img_card_bsc,
        chainIcons: ic_card_bsc,
        chainIconAlphas: ic_card_bsc_alpha,
        tag: ic_bsc_tag,
        ticker: "BNB",
        color: '#FEBF27',
        MainChainId: '56',
        UseInfura: false,
        Disabled: false,
        DefiTokenChain: ['bsc'],
        CoingeckoId: 'wbnb',
        SwapUrl: 'https://exchange.pancakeswap.finance/#/swap',
        SwapTokenUrl: 'https://exchange.pancakeswap.finance/#/swap?inputCurrency=',
        CurrencyLogo: 'https://cdn.gopocket.finance/files/bnb.png',
        NeedAvailableUrl: true,
        OtherCoinInfoUrl: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
        SushiswapGraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange',
        NetworkNames: ['BSC Mainnet', 'BSC Testnet'],
        Networks: {
            "BSC Mainnet": {
                "provider": {
                    "rpcTarget": "https://bsc-dataseed1.defibit.io/",
                    "type": "BSC Mainnet",
                    "chainId": "56",
                    "ticker": "BNB",
                    "nickname": "Biannce"
                },
                rpcTargets: [
                    'https://bsc-dataseed.binance.org/',
                    'https://bsc-dataseed1.defibit.io/',
                    'https://bsc-dataseed1.ninicoin.io/',
                    'https://bsc-dataseed2.defibit.io/',
                    'https://bsc-dataseed3.defibit.io/',
                    'https://bsc-dataseed4.defibit.io/',
                    'https://bsc-dataseed2.ninicoin.io/',
                    'https://bsc-dataseed3.ninicoin.io/',
                    'https://bsc-dataseed4.ninicoin.io/',
                    'https://bsc-dataseed1.binance.org/',
                    'https://bsc-dataseed2.binance.org/',
                    'https://bsc-dataseed3.binance.org/',
                    'https://bsc-dataseed4.binance.org/',
                    'https://binance.ankr.com/',
                    'https://rpc.ankr.com/bsc',
                    'https://bscrpc.com',
                    'https://bsc.mytokenpocket.vip',
                    'https://binance.nodereal.io'
                ],
                ExplorerUrl: 'https://bscscan.com',
                ExplorerApiUrl: 'https://api.bscscan.com',
            },
            "BSC Testnet": {
                "provider": {
                    "rpcTarget": "https://data-seed-prebsc-1-s1.binance.org:8545/",
                    "type": "BSC Testnet",
                    "chainId": "97",
                    "ticker": "BNB",
                    "nickname": "Biannce"
                },
                ExplorerUrl: 'https://testnet.bscscan.com',
                ExplorerApiUrl: 'https://api-testnet.bscscan.com',
            }
        }
    }
};
