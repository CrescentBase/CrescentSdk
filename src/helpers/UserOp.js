import {ethers} from "ethers";
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils.js';
import {handleFetch, rpcFetch} from "./FatchUtils.js";
import {RPCHOST} from "./Config";
import BigNumber from "bignumber.js";
import {
    LOCAL_STORAGE_ENTRY_POINTS,
} from "./StorageUtils";
import {printToNative} from "./Utils";

export const METHOD_ID_EXEC_FROM_ENTRY_POINT = "0x80c5c7d0";
export const METHOD_ID_TRANSFER = '0xa9059cbb';

export let entryPoints = [];

export const setEntryPoint = (entryP) => {
    entryPoints = entryP;
    localStorage.setItem(LOCAL_STORAGE_ENTRY_POINTS, JSON.stringify(entryP));
}

export const getEntryPoint = (chainId) => {
    if (entryPoints.length === 0) {
        const jsonEntryPoints = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ENTRY_POINTS)) || [];
        if (jsonEntryPoints.length > 0) {
            const entryPoint = jsonEntryPoints.filter(item => String(item.chainId) === String(chainId));
            if (entryPoint.length > 0) {
                return entryPoint[0]['entryPoint'];
            }
        }
    } else {
        return entryPoints.filter(item => String(item.chainId) === String(chainId))[0]['entryPoint'];
    }
    return undefined;
}

export const UserOperationDefault = {
    sender: ethers.constants.AddressZero,
    nonce: 0,
    initCode: '0x',
    callData: '0x',
    callGasLimit: 0,
    paymasterAndData: '0x',
    signature: '0x',
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
    preVerificationGas: 0,
    verificationGasLimit: 10e6
};

export const getExecFromEntryPointCallData = (to, value, data) => {
    console.csLog('==getExecFromEntryPointCallData to = ', to, value, data);
    return METHOD_ID_EXEC_FROM_ENTRY_POINT + defaultAbiCoder.encode(
        ['address','uint256','bytes'],
        [to, value, data]
    ).substring(2);
}


export const getTransferCallData = (to, amount) => {
    return METHOD_ID_TRANSFER + defaultAbiCoder.encode(
        ['address','uint256'],
        [to, amount]
    ).substring(2);
}

export const getWalletTransferCallData = (contractAddress, toAddress, value, amount) => {
    let data = '0x';
    if (toAddress) {
        data = getTransferCallData(toAddress, amount);
    }
    return getExecFromEntryPointCallData(contractAddress, value, data);
}

export const getUserOperationByNativeCurrency = async (wallet, provider, chainId, sender, toAddress, value) => {
    if (!toAddress) {
        throw new Error("to address is empty");
    }
    if (!value) {
        throw new Error("value is empty");
    }
    const data = getTransferCallData(toAddress, value);
    return getUserOperation(wallet, provider, chainId, sender, data);
}

export const getUserOperationByToken = async (wallet, provider, chainId, sender, contractAddress, toAddress, amount, value = '0x0') => {
    if (!contractAddress) {
        throw new Error("contract address is empty");
    }
    // if (!toAddress) {
    //     throw new Error("to address is empty");
    // }
    // if (!amount) {
    //     throw new Error("amount is empty");
    // }
    const data = getWalletTransferCallData(contractAddress, toAddress, value, amount);
    console.csLog('====data = ', data);
    return getUserOperation(wallet, provider, chainId, sender, data);
}

export const getUserOperationByTx = async (wallet, provider, chainId, sender, tx) => {
    if (!tx || !tx.to || !(tx.data || tx.value)) {
        throw new Error("Tx missing parameter");
    }
    let data;
    console.csLog('===getUserOperationByTx = tx = ', tx);
    const value = '0x' + Number(tx.value || 0).toString(16);
    console.csLog('===getUserOperationByTx = value = ', value);
    if (tx.data && tx.data.length > 2) {
        data = getExecFromEntryPointCallData(tx.to, value, tx.data);
    } else {
        const url = 'https://wallet.crescentbase.com/api/v2/rpc/';
        const rpcUrl = `${url}${chainId}`;
        const code = await getCode(rpcUrl, sender);
        if (code > 30) {
            data = getExecFromEntryPointCallData(tx.to, value, '0x');
        } else {
            data = getTransferCallData(tx.to, value);
        }
    }
    return getUserOperation(wallet, provider, chainId, sender, data);
}

export const getUserOperation = async (wallet, provider, chainId, sender, callData) => {
    console.csLog('===UserOperationDefault = ', UserOperationDefault);
    console.csLog('===chianId = ', chainId);
    const uo = {
        ...UserOperationDefault,
        sender,
        callData
    }
    const kk = {
        ...uo
    }
    console.csLog('====uo = ', kk);
    console.csLog('====callData = ', callData);

    const nonce = await getNonce(sender, chainId);
    console.csLog('====nonce = ', nonce);
    const bb = nonce.toHexString();
    console.csLog('===bb = ', bb);
    uo.nonce = bb;

    const txId = await getRequestId(uo, Number(chainId));
    console.csLog('===txId= ', txId);

    const walletNew = wallet.connect(provider);//new ethers.Wallet(privateKey, provider);
    const privateKey = walletNew.privateKey;
    const publicKey = await walletNew.getAddress();
    console.csLog('===privateKey = ', privateKey, ' ; publicKey = ', publicKey);
    try {
        const signedTx = await walletNew.signMessage(ethers.utils.arrayify(txId));
        console.csLog('====signedTx = ', signedTx);
        uo.signature = signedTx;
        printToNative(uo.toString());
        console.csLog('====uo 222= ', uo);
        const result = await provider.send("eth_estimateUserOperationGas", [uo, getEntryPoint(chainId)]);
        console.csLog('====result = ', result);
        console.csLog('====result.verificationGasLimit = ', result.verificationGasLimit);
        console.csLog('===new BigNumber(result.verificationGasLimit) = ', new BigNumber(result.verificationGas));
        console.csLog('===new BigNumber(result.verificationGas).multipliedBy(1.5) = ', new BigNumber(result.verificationGas).multipliedBy(1.5));
        uo.verificationGasLimit = '0x' + new BigNumber(result.verificationGas).multipliedBy(3).toString(16);
        console.csLog('===uo.verificationGas = ', uo.verificationGasLimit);
        uo.preVerificationGas = result.preVerificationGas;
        uo.callGasLimit = result.callGasLimit;//result.callGasLimit;
        console.csLog('===uo.callGasLimit = ', uo.callGasLimit);
        // if (String(chainId) === '42161') {
        //     if (new BigNumber(uo.callGas).lt(new BigNumber(800000))) {
        //         uo.callGas = '0x' + new BigNumber(800000).toString(16);
        //     }
        // }
        return uo;
    } catch (error) {
        printToNative(error);
        console.csLog('===getUserOperation = ', error)
        const message = String(error.message);
        return { errorMessage: message }
    }
    return null;
}


//        "message": "",
//         "code": -32500

//0x7e1ed8acbab7d76bbf9754355d3236a20499cfa723a61266c1b417b1310836da
export const sendUserOperation = async (provider, uo, chainId) => {
    return await provider.send("eth_sendUserOperation", [uo, getEntryPoint(chainId)]);
}


export const getGasLimit = (uo) => {
    return Number(uo.callGasLimit) + Number(uo.verificationGasLimit) + Number(uo.preVerificationGas);
}

export const packUserOp = (op) => {
    // lighter signature scheme (must match UserOperation#pack): do encode a zero-length signature, but strip afterwards the appended zero-length value
    const userOpType = {
        components: [
            { type: 'address', name: 'sender' },
            { type: 'uint256', name: 'nonce' },
            { type: 'bytes', name: 'initCode' },
            { type: 'bytes', name: 'callData' },
            { type: 'uint256', name: 'callGasLimit' },
            { type: 'uint256', name: 'verificationGasLimit' },
            { type: 'uint256', name: 'preVerificationGas' },
            { type: 'uint256', name: 'maxFeePerGas' },
            { type: 'uint256', name: 'maxPriorityFeePerGas' },
            { type: 'bytes', name: 'paymasterAndData' },
            { type: 'bytes', name: 'signature' }
        ],
        name: 'userOp',
        type: 'tuple'
    }
    let encoded = defaultAbiCoder.encode([userOpType], [{ ...op, signature: '0x' }])
    // remove leading word (total length) and trailing word (zero-length signature)
    encoded = '0x' + encoded.slice(66, encoded.length - 64)
    return encoded
}

export const getRequestId = async (op, chainId) => {
    const abi = [{
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "initCode",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "callData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint256",
                        "name": "callGasLimit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "verificationGasLimit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preVerificationGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxFeePerGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPriorityFeePerGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "paymasterAndData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct UserOperation",
                "name": "userOp",
                "type": "tuple"
            }
        ],
        "name": "getUserOpHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }];
    const provider = new ethers.providers.JsonRpcProvider(RPCHOST + '/api/v2/rpc/' + chainId);
    const contract = new ethers.Contract(getEntryPoint(chainId), abi, provider);
    const opHash = await contract.getUserOpHash(op);
    console.csLog('==opHash = ', opHash);
    return opHash;
    // const userOpHash = keccak256(packUserOp(op, true))
    // const enc = defaultAbiCoder.encode(
    //     ['bytes32', 'address', 'uint256'],
    //     [userOpHash, getEntryPoint(chainId), chainId])
    // return keccak256(enc)
}


export const getCode = async (rpcUrl, address) => {
    const body = {jsonrpc:"2.0",method:"eth_getCode",params:[address, 'latest'],id:2};
    const result = await rpcFetch(rpcUrl, body);
    return result?.result;
}

export const hasSender = async (rpcUrl, sender) => {
    const code = await getCode(rpcUrl, sender);
    console.csLog('==hasSender = ', code);
    return code.length > 300;
}

export const getCreateOP = async (sender, pk, chainId) => {
    const url = `https://wallet.crescentbase.com/api/v2/getCreateOP?sender=${sender}&pk=${pk}&chain_id=${chainId}`;
    console.csLog('===url = ', url);
    const result = await handleFetch(url);
    console.csLog('===getCreateOP = ', result);
    if (!result || result.ret !== 200 || result.errmsg !== 'ok' || !result.data) {
        return null;
    }
    return result.data;
}

export const sendOp = async (rpcUrl, op, chainId) => {
    if (!getEntryPoint(chainId)) {
        throw new Error(`sendOp error entrypoint is null`);
    }
    const body = {jsonrpc:"2.0",method:"eth_sendUserOperation",params:[op, getEntryPoint(chainId)],id:8};
    const result = await rpcFetch(rpcUrl, body);
    console.csLog('===result = ', chainId, result);
    if (!result || !result.result) {
        throw new Error(`sendOp error ${result}`);
    }
    return result.result;
}

export const getPaymasterData = async (paymasterUrl, op, email, pk, chainId) => {
    const body = { op, email: email, public_key: pk, chain_id: chainId };
    const result = await rpcFetch(paymasterUrl, body);
    console.csLog('===getPaymaster result = ', chainId, result);
    if (!result || !result.data) {
        throw new Error(`getPaymaster error ${result}`);
    }
    return result.data;
}

export const checkAndSendOp = async (op, sender, owner, chainId) => {
    const url = 'https://wallet.crescentbase.com/api/v2/rpc/';
    const hasSendUrl = `${url}${chainId}`;
    const targetUrl = `https://bundler-${chainId}.crescentbase.com/rpc`//`${url}${chainId}`;
    try {
        const hasSenderResult = await hasSender(hasSendUrl, sender);
        if (hasSenderResult) {
            const hasOwner = await containOwner(sender,owner, chainId)
            if (hasOwner) {
                return true;
            }
        }
        sendOp(targetUrl, op, chainId);
    } catch (e) {
        printToNative(e);
        console.error("checkAndSendOp sendOp", e);
    }
    return false;
}

export const getSender = async (email) => {
    const url = RPCHOST + "/api/v2/getAAddress?email=" + email;
    try {
        printToNative(url)
        const json = await handleFetch(url);
        const data = json.data;
        return data;
    } catch (error) {
        printToNative(error);
        console.csLog("==getSender = ", error);
    }
    return null;
}


export const getNonce = async (sender, chainId) => {
    const abi = [
        {
            "inputs": [],
            "name": "getNonce",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const contractAddress = sender;
    const provider = new ethers.providers.JsonRpcProvider(RPCHOST + '/api/v2/rpc/' + chainId);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const nonce = await contract.getNonce();
    console.csLog('==getNonce = ', nonce);
    return nonce;
}

export const containOwner = async (sender, owner, chainId) => {
    const abi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "containOwner",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const contractAddress = sender;
    const provider = new ethers.providers.JsonRpcProvider(RPCHOST + '/api/v2/rpc/' + chainId);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const isOwner = await contract.containOwner(owner);
    return isOwner;
}
