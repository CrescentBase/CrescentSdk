import {ChainType, NetworkConfig, RPCHOST} from "./Config";
import {ethers} from "ethers";
import {renderFromWei, weiToFiat} from "./number";
import {CURRENCIES} from "./currencies";
import {
	getCode,
	getGasLimit,
	getRequestId,
	getUserOperationByNativeCurrency,
	getUserOperationByToken, getUserOperationByTx,
	UserOperationDefault
} from "./UserOp";
import {LOCAL_STORAGE_PUBLIC_ADDRESS} from "./StorageUtils";

const AVERAGE_GAS = 20;
const LOW_GAS = 20;
const FAST_GAS = 40;
const DEFAULT_GAS_LIMIT = '0x5208';
const testUo = {
	"sender": "0x6c3f14da26556585706c02af737a44e67dc6954d",
	"nonce": "0x0",
	"initCode": "0x",
	"callData": "0x",
	"callGas": "0x0",
	"verificationGas": "0x186A0",
	"preVerificationGas": "0x5208",
	"maxFeePerGas": "0x0",
	"maxPriorityFeePerGas": "0x0",
	"paymaster": "0x0000000000000000000000000000000000000000",
	"paymasterData": "0x",
	"signature": "0x"
};

export async function getSuggestedGasEstimates(wallet, asset, tx, toAddress, value) {
	let chainType = ChainType.Ethereum;
	if (asset) {
		chainType = asset.chainType;
	}
	const gasEstimates = await getBasicGasEstimates(wallet, chainType, asset, tx, toAddress, value);
	if (gasEstimates.errorMessage) {
		return gasEstimates;
	}
	if (chainType !== ChainType.Bsc) {
		let suggestedGasFees = await getSuggestedGasFees(chainType);
		if (!suggestedGasFees) {
			suggestedGasFees = await getRpcSuggestedGasFees(chainType); //就是就是bsc
		}
		if (suggestedGasFees) {
			const maxFeePerGas = suggestedGasFees.averageGwei.add(suggestedGasFees.estimatedBaseFee);
			return {
				...gasEstimates,
				...suggestedGasFees,
				maxPriorityFeePerGas: suggestedGasFees.averageGwei,
				maxFeePerGas,
				gasPrice: maxFeePerGas,
				isEIP1559: true
			};
		}
	}
	return {
		...gasEstimates,
		isEIP1559: false
	};
}

async function getRpcSuggestedGasFees(chainType) {
	try {
		const { rpcTarget, chainId, ticker, nickname } = NetworkConfig[chainType].Networks[NetworkConfig[chainType].NetworkNames[0]].provider;
		let provider;
		if (rpcTarget) {
			provider = new ethers.providers.JsonRpcProvider(rpcTarget, { chainId, name: nickname });
		}
		const { maxPriorityFeePerGas, baseFeePerGas, gasPrice } = await provider.getFeeData();
		// // const ethQuery = new ethers.providers.EtherscanProvider('bsc');
		// const { maxPriorityFeePerGas, baseFeePerGas, gasPrice } = await ethQuery.getFeeData();

		if (maxPriorityFeePerGas && baseFeePerGas) {
			const bnMax = hexToBN(maxPriorityFeePerGas);
			const estimatedBaseFee = hexToBN(baseFeePerGas);
			return {
				averageGwei: bnMax,
				fastGwei: bnMax.mul(3).div(2),
				safeLowGwei: bnMax.div(2),
				estimatedBaseFee
			};
		}
	} catch (e) {
		console.log('===getRpcSuggestedGasFees error:', e);
	}
	return undefined;
}

export async function getSuggestedGasFees(chainType) {
	if (chainType === ChainType.Polygon) {
		return getPolygonSuggestedGasFees();
	}
	return getOtherSuggestedGasFees(chainType);
}

let getSuggestedGasFees_timestamp = 0;
let temp_suggestedGasFees = null;
const bscScanApiKey = ["EPK36SPQWUD5CBNKRT3X796I2CFV4FSNHQ","AMUITAD3QF5KACZXTRCIEY8DPDB9YNVUUS","43GR8N8YX2TIPEHPM337GJVWPN8E9ATCSG","GKCNVNKKA4MJBBNCAU3WV9XW9E3VW5VDFT","DXFNMRG4GCK2NGIJVJVW215EYM35HMA6HJ"];

export async function fetchBscGasEstimates() {
	// Timeout in 7 seconds
	const timeout = 5000;
	const randomIndex = Math.floor(Math.random() * bscScanApiKey.length);
	const key = bscScanApiKey[randomIndex];
	const url = `https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${key}`;
	const fetchPromise = fetch(url)
		.then(r => r.json())
		.then(({ result }) => ({
			average: result.ProposeGasPrice,
			safeLow: result.SafeGasPrice,
			fast: result.FastGasPrice
		}));
	return Promise.race([
		fetchPromise,
		new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
	]);
}


export async function getOtherSuggestedGasFees(chainType) {
	try {
		if (temp_suggestedGasFees && Date.now() - getSuggestedGasFees_timestamp <= 3000) {
			return temp_suggestedGasFees;
		}
		const fetchGas = await fetchSuggestedGasFees(chainType);
		if (!fetchGas?.high) {
			return null;
		}
		const allGwei = [
			decGWEIToBNWEI(fetchGas.high.suggestedMaxPriorityFeePerGas),
			decGWEIToBNWEI(fetchGas.medium.suggestedMaxPriorityFeePerGas),
			decGWEIToBNWEI(fetchGas.low.suggestedMaxPriorityFeePerGas)
		];
		allGwei.sort((a, b) => a.lt(b));
		const suggestedGasFees = {
			averageGwei: allGwei[1],
			fastGwei: allGwei[0],
			safeLowGwei: allGwei[2],
			estimatedBaseFee: decGWEIToBNWEI(fetchGas.estimatedBaseFee)
		};
		temp_suggestedGasFees = suggestedGasFees;
		getSuggestedGasFees_timestamp = Date.now();
		return suggestedGasFees;
	} catch (e) {
		console.log('===getOtherSuggestedGasFees error:', e);
	}
	return null;
}

export async function fetchSuggestedGasFees(chainType) {
	// Timeout in 7 seconds
	const timeout = 14000;

	const chainId = NetworkConfig[chainType].MainChainId;
	const EIP1559APIEndpoint = `https://gas-api.metaswap.codefi.network/networks/${chainId}/suggestedGasFees`;
	const fetchPromise = fetch(EIP1559APIEndpoint).then(r => r.json());

	return Promise.race([
		fetchPromise,
		new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
	]);
}

export async function getPolygonSuggestedGasFees() {
	try {
		const fetchGas = await fetchPolygonSuggestedGasFees();
		const allGwei = [
			decGWEIToBNWEI(fetchGas.fast.maxPriorityFee),
			decGWEIToBNWEI(fetchGas.standard.maxPriorityFee),
			decGWEIToBNWEI(fetchGas.safeLow.maxPriorityFee)
		];
		allGwei.sort((a, b) => a.lt(b));
		const suggestedGasFees = {
			averageGwei: allGwei[1],
			fastGwei: allGwei[0],
			safeLowGwei: allGwei[2],
			estimatedBaseFee: decGWEIToBNWEI(fetchGas.estimatedBaseFee)
		};
		return suggestedGasFees;
	} catch (e) {
		console.log('===getPolygonSuggestedGasFees error:', e);
	}
	return null;
}

export async function fetchPolygonSuggestedGasFees() {
	// Timeout in 7 seconds
	const timeout = 14000;

	const EIP1559APIEndpoint = 'https://gasstation-mainnet.matic.network/v2';
	const fetchPromise = fetch(EIP1559APIEndpoint).then(r => r.json());

	return Promise.race([
		fetchPromise,
		new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
	]);
}

export async function estimateGas(transaction) {
	if (transaction === null) {
		return null;
	}
	// 连接以太坊网络
	const provider = new ethers.providers.JsonRpcProvider("https://cloudflare-eth.com");

// 创建交易对象
	const tx = {
		to: "0x6c3f14da26556585706c02af737a44e67dc6954d",
		value: ethers.utils.parseEther("1.0")
	};

// 估算交易所需gas
	const estimatedGas = await provider.estimateGas(tx); //gas的值

	const gasPrice = await provider.getGasPrice();
	console.log('==gasPrice = ', gasPrice, gasPrice.toString());

	// const bigNumber = new ethers.BigNumber('0x065e5494cb');

	console.log('====bigNumberify = ', gasPrice.toNumber());

	const bigNumber = ethers.BigNumber.from(gasPrice.toNumber())
	console.log('frome = ', bigNumber);

	console.log("Estimated gas: " + estimatedGas.toString());
}


export async function getBasicGasEstimates(wallet, chainType, asset, tx, toAddress, value) {
	const chainId = NetworkConfig[chainType].MainChainId;
	const url = `https://bundler-${chainId}.crescentbase.com/rpc`;//RPCHOST + "/api/v1/rpc/" + chainId;
	const provider = new ethers.providers.JsonRpcProvider(url);
	let uo, averageGasPrice, gasLimit, basicGasEstimates;
	if (tx) {
		try {
			const sender = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
			uo = await getUserOperationByTx(wallet, provider, tx.chainId, sender, tx);
			if (uo.errorMessage) {
				return uo;
			}
			console.log('===getUserOperationByTx uo = ', uo);
			if (uo) {
				gasLimit = ethers.BigNumber.from(getGasLimit(uo));
			} else {
				gasLimit = hexToBN(DEFAULT_GAS_LIMIT);
			}
			averageGasPrice = apiEstimateModifiedToWEI(AVERAGE_GAS);
		} catch (error) {
			console.log('===error = ', error);
			averageGasPrice = apiEstimateModifiedToWEI(AVERAGE_GAS);
			gasLimit = hexToBN(DEFAULT_GAS_LIMIT);
			uo = { ...UserOperationDefault };
		}
	} else {
		try {
			const sender = asset.account;
			if (asset.nativeCurrency) {
				const url = 'https://wallet.crescentbase.com/api/v1/rpc/';
				const rpcUrl = `${url}${chainId}`;
				const code = await getCode(rpcUrl, toAddress);
				console.log('=====code = ', code);
				if (code > 30) {
					uo = await getUserOperationByToken(wallet, provider, chainId, sender, toAddress, null, null, value);
				} else {
					uo = await getUserOperationByNativeCurrency(wallet, provider, chainId, sender, toAddress, value);
				}
			} else {
				uo = await getUserOperationByToken(wallet, provider, chainId, sender, asset.tokenAddress, toAddress, value);
			}
			console.log('===uo = ', uo);
			if (uo.errorMessage) {
				return uo;
			}
			if (uo) {
				gasLimit = ethers.BigNumber.from(getGasLimit(uo));
			} else {
				gasLimit = hexToBN(DEFAULT_GAS_LIMIT);
			}
			averageGasPrice = apiEstimateModifiedToWEI(AVERAGE_GAS);
		} catch (error) {
			console.log('==getBasicGasEstimates error = ', error);
			averageGasPrice = apiEstimateModifiedToWEI(AVERAGE_GAS);
			gasLimit = hexToBN(DEFAULT_GAS_LIMIT);
			uo = { ...UserOperationDefault };
		}
	}

	try {
		let fetchGas;
		if (chainType === ChainType.Ethereum) {
			fetchGas = await fetchMainnetGasEstimates();
		} else if (chainType === ChainType.Bsc) {
			fetchGas = await fetchBscGasEstimates();
		}
		// else if (isMainnetByChainType(ChainType.Heco, chainId)) {
		// 	fetchGas = await fetchHecoGasEstimates();
		// } else if (isMainnetByChainType(ChainType.Avax, chainId)) {
		// 	fetchGas = await fetchAvaxGasEstimates();
		// }
		if (fetchGas) {
			basicGasEstimates = {
				averageGwei: apiEstimateModifiedToWEI(fetchGas.average),
				fastGwei: apiEstimateModifiedToWEI(fetchGas.fast),
				safeLowGwei: apiEstimateModifiedToWEI(fetchGas.safeLow)
			};
		}
	} catch (error) {
		console.log('===Error while trying to get gas limit estimates', error);
	}

	if (!basicGasEstimates) {
		let safeLow;
		if (averageGasPrice.isZero()) {
			safeLow = ethers.BigNumber.from(0);
		} else {
			safeLow = averageGasPrice.div(2);
		}

		basicGasEstimates = {
			averageGwei: averageGasPrice,
			fastGwei: averageGasPrice.mul(3).div(2),
			safeLowGwei: safeLow
		};
	} else {
		averageGasPrice = basicGasEstimates.averageGwei;
	}
	basicGasEstimates = { uo, gas: gasLimit, gasPrice: averageGasPrice, ...basicGasEstimates };
	return basicGasEstimates;
}

export async function fetchMainnetGasEstimates() {
	// Timeout in 7 seconds
	const timeout = 5000;
	const key = 'FR1AM2TB4AU8GS29I8JNN53JCTPA8RVQV5';
	const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${key}`
	const fetchPromise = fetch(url)
		.then(r => r.json())
		.then(({ result }) => ({
			average: result.ProposeGasPrice,
			safeLow: result.SafeGasPrice,
			fast: result.FastGasPrice
		}));
	return Promise.race([
		fetchPromise,
		new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
	]);
}


export function decGWEIToBNWEI(decGWEI) {
	const wei = ethers.utils.parseUnits(String(decGWEI), 'ether').div(1000000000);
	//const wei = ethers.utils.parseEther(String(decGWEI)).div(1000000000);
	return wei;
}

// export function decGWEIToHexWEI(decGWEI) {
// 	const gwei = ethers.utils.parseUnits(String(decGWEI), 'gwei');
// 	const hexWei = ethers.utils.hexlify(gwei);
// 	return hexWei;
// }

export function apiEstimateModifiedToWEI(estimate) {
	return toWei(estimate, 'gwei');
}

function toWei(value, unit = 'ether') {
	return ethers.utils.parseUnits(value.toString(), unit);
}

function hexToBN(inputHex) {
	if (ethers.BigNumber.isBigNumber(inputHex)) {
		return inputHex;
	}
	return ethers.BigNumber.from(inputHex);
	// const hexString = ethers.utils.stripHexString(inputHex);
	// return ethers.BigNumber.from(hexString);
}

export function getEthGasFee(weiGas, gasLimitBN, moreGasFee = undefined) {
	if (!weiGas || !gasLimitBN) {
		return '0';
	}
	let gasFee = weiGas.mul(gasLimitBN);
	if (moreGasFee) {
		gasFee = gasFee.add(moreGasFee);
	}
	return renderFromWei(gasFee);
}

export function getFiatGasFee(weiGas, conversionRate, currencyCode, gasLimit = 21000, moreGasFee = undefined) {
	if (!weiGas) {
		return '0'
	}
	let wei = weiGas.mul(ethers.BigNumber.from(gasLimit));
	if (moreGasFee) {
		wei = wei.add(moreGasFee);
	}
	return weiToFiat(wei, conversionRate, currencyCode);
}

// export function decGWEIToBNWEI(decGWEI) {
// 	return hexToBN(decGWEIToHexWEI(decGWEI));
// }
//
// export function decGWEIToHexWEI(decGWEI) {
// 	return conversionUtil(decGWEI, {
// 		fromNumericBase: 'dec',
// 		toNumericBase: 'hex',
// 		fromDenomination: 'GWEI',
// 		toDenomination: 'WEI'
// 	});
// }
