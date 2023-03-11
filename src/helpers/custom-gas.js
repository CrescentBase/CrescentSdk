import {ChainType, NetworkConfig} from "./Config";
import {ethers} from "ethers";

const AVERAGE_GAS = 20;
const LOW_GAS = 20;
const FAST_GAS = 40;
const DEFAULT_GAS_LIMIT = '0x5208';

export async function getSuggestedGasEstimates(chainType, forceNormalFee = false) {
	const gasEstimates = await getBasicGasEstimates(chainType);
	if (!forceNormalFee) {
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
		// ...gasEstimates,
		isEIP1559: false
	};
}

async function getRpcSuggestedGasFees(chainType) {
	try {

		const { rpcTarget, chainId, ticker, nickname } = NetworkConfig[chainType].Networks['BSC Mainnet'].provider;
		let provider;
		if (rpcTarget) {
			provider = new ethers.providers.JsonRpcProvider(rpcTarget, { chainId, name: nickname });
		}
		const ethQuery = new ethers.providers.EtherscanProvider('bsc');
		const { maxPriorityFeePerGas, baseFeePerGas, gasPrice } = await ethQuery.getFeeData();

		if (maxPriorityFeePerGas && baseFeePerGas) {
			const bnMax = hexToBN(maxPriorityFeePerGas);
			const estimatedBaseFee = hexToBN(baseFeePerGas);
			return {
				averageGwei: bnMax,
				fastGwei: bnMax.muln(1.5),
				safeLowGwei: bnMax.muln(0.5),
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

export async function getBasicGasEstimates(chainType) {
	// const { TransactionController } = Engine.context;
	// const chainId = transaction.chainId;

	let averageGasPrice, gasLimit, basicGasEstimates;
	// try {
	// 	const estimation = await TransactionController.estimateGas({
	// 		from: transaction.from,
	// 		data: transaction.data,
	// 		to: transaction.to,
	// 		value: transaction.value,
	// 		gas: transaction.gas,
	// 		chainId
	// 	});
	// 	averageGasPrice = hexToBN(estimation.gasPrice);
	// 	gasLimit = hexToBN(estimation.gas);
	// } catch (error) {
	// 	averageGasPrice = apiEstimateModifiedToWEI(TransactionTypes.CUSTOM_GAS.AVERAGE_GAS);
	// 	gasLimit = hexToBN(TransactionTypes.CUSTOM_GAS.DEFAULT_GAS_LIMIT);
	// 	util.logInfo(
	// 		'Error while trying to get gas price from the network',
	// 		error,
	// 		' transaction:',
	// 		transaction
	// 	);
	// }
	averageGasPrice = apiEstimateModifiedToWEI(AVERAGE_GAS);
	gasLimit = hexToBN(DEFAULT_GAS_LIMIT);

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

	// let l1Fee;
	// if (isMainnetByChainType(ChainType.Optimism, chainId) && gasLimit && averageGasPrice) {
	// 	try {
	// 		l1Fee = await getOptimismL1Fee({
	// 			...transaction,
	// 			gas: '0x' + gasLimit.toString(16),
	// 			gasPrice: '0x' + averageGasPrice.toString(16)
	// 		});
	// 		l1Fee = hexToBN(l1Fee.toHexString());
	// 	} catch (e) {
	// 		console.log('getOptimismL1Fee e:', e);
	// 		l1Fee = undefined;
	// 	}
	// }

	if (!basicGasEstimates) {
		let safeLow;
		if (averageGasPrice.isZero()) {
			safeLow = ethers.BigNumber.from(0);
		} else {
			safeLow = averageGasPrice.muln(0.5);
		}

		basicGasEstimates = {
			averageGwei: averageGasPrice,
			fastGwei: averageGasPrice.muln(1.5),
			safeLowGwei: safeLow
		};
	} else {
		averageGasPrice = basicGasEstimates.averageGwei;
	}
	basicGasEstimates = { gas: gasLimit, gasPrice: averageGasPrice, ...basicGasEstimates };
	console.log('===basicGasEstimates', basicGasEstimates);
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
	const gwei = ethers.utils.parseUnits(String(decGWEI), 'gwei');
	const wei = ethers.BigNumber.from(gwei);
	return wei;
	// return ethers.utils.parseUnits(String(decGWEI), 'gwei');
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
	return ethers.utils.parseUnits(value, unit);
}

function hexToBN(inputHex) {
	if (ethers.BigNumber.isBigNumber(inputHex)) {
		return inputHex;
	}
	return ethers.BigNumber.from(inputHex);
	// const hexString = ethers.utils.stripHexString(inputHex);
	// return ethers.BigNumber.from(hexString);
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
