import {ethers} from "ethers";
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils.js';
import {rpcFetch} from "./FatchUtils.js";

export const METHOD_ID_EXEC_FROM_ENTRY_POINT = "0x80c5c7d0";
export const METHOD_ID_TRANSFER = '0xa9059cbb';

export const entryPoint = "0xDd6c867f9267977FeA8D33e375190f2044cB346E";

export const UserOperationDefault = {
    sender: ethers.constants.AddressZero,
    nonce: 0,
    initCode: '0x',
    callData: '0x',
    callGas: 0,
    verificationGas: '0x186A0',
    preVerificationGas: '0x5208',
    maxFeePerGas: '0x0',
    maxPriorityFeePerGas: '0x0',
    paymaster: ethers.constants.AddressZero,
    paymasterData: '0x',
    signature: '0x'
};

export const getExecFromEntryPointCallData = (to, value, data) => {
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
    const data = getTransferCallData(toAddress, amount);
    return getExecFromEntryPointCallData(contractAddress, value, data);
}

export const getUserOperationByNativeCurrency = async (provider, sender, toAddress, value) => {
    if (!toAddress) {
        throw new Error("to address is empty");
    }
    if (!value) {
        throw new Error("value is empty");
    }
    const data = getTransferCallData(toAddress, value);
    return getUserOperation(provider, sender, data);
}

export const getUserOperationByToken = async (provider, sender, contractAddress, toAddress, amount) => {
    if (!contractAddress) {
        throw new Error("contract address is empty");
    }
    if (!toAddress) {
        throw new Error("to address is empty");
    }
    if (!amount) {
        throw new Error("amount is empty");
    }
    const data = getWalletTransferCallData(contractAddress, toAddress, '0x0', amount);
    return getUserOperation(provider, sender, data);
}

export const getUserOperationByTx = async (provider, sender, tx) => {
    if (!tx || !tx.to || !(tx.data || tx.value)) {
        throw new Error("Tx missing parameter");
    }
    let data;
    const value = '0x' + Number(tx.value).toString(16);
    if (tx.data && tx.data.length > 2) {
        data = getExecFromEntryPointCallData(tx.to, value, tx.data);
    } else {
        data = getTransferCallData(tx.to, value);
    }
    return getUserOperation(provider, sender, data);
}

export const getUserOperation = async (provider, sender, callData) => {
    const uo = {
        ...UserOperationDefault,
        sender,
        callData
    }
    const result = await provider.send("eth_estimateUserOperationGas", [uo]);
    uo.verificationGas = result.verificationGas;
    uo.preVerificationGas = result.preVerificationGas;
    uo.callGas = result.callGas;
    return uo;
}


//        "message": "",
//         "code": -32500

//0x7e1ed8acbab7d76bbf9754355d3236a20499cfa723a61266c1b417b1310836da
export const sendUserOperation = async (provider, uo) => {
    return await provider.send("eth_sendUserOperation", [uo, entryPoint]);
}


export const getGasLimit = (uo) => {
    return Number(uo.callGas) + Number(uo.verificationGas) + Number(uo.preVerificationGas);
}

export const packUserOp = (op) => {
    // lighter signature scheme (must match UserOperation#pack): do encode a zero-length signature, but strip afterwards the appended zero-length value
    const userOpType = {
        components: [
            { type: 'address', name: 'sender' },
            { type: 'uint256', name: 'nonce' },
            { type: 'bytes', name: 'initCode' },
            { type: 'bytes', name: 'callData' },
            { type: 'uint256', name: 'callGas' },
            { type: 'uint256', name: 'verificationGas' },
            { type: 'uint256', name: 'preVerificationGas' },
            { type: 'uint256', name: 'maxFeePerGas' },
            { type: 'uint256', name: 'maxPriorityFeePerGas' },
            { type: 'address', name: 'paymaster' },
            { type: 'bytes', name: 'paymasterData' },
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

export const getRequestId = (op, chainId) => {
    const userOpHash = keccak256(packUserOp(op, true))
    const enc = defaultAbiCoder.encode(
        ['bytes32', 'address', 'uint256'],
        [userOpHash, entryPoint, chainId])
    return keccak256(enc)
}


export const getCode = async (rpcUrl, address) => {
    const body = {jsonrpc:"2.0",method:"eth_getCode",params:[address, 'latest'],id:2};
    const result = await rpcFetch(rpcUrl, body);
    return result?.result;
}

export const hasSender = async (rpcUrl, sender) => {
    const code = await getCode(rpcUrl, sender);
    return code.length > 300;
}

export const getCreateOP = async (sender, pk) => {
    const url = `https://wallet.crescentbase.com/api/v1/getCreateOP/${sender}/${pk}`;
    const result = await fetch(url);
    if (!result || result.ret !== 200 || result.errmsg !== 'ok' || !result.data) {
        throw new Error("getCreateOP fail!");
    }
    return result.data;
}

export const sendOp = async (rpcUrl, op) => {
    const body = {jsonrpc:"2.0",method:"eth_sendUserOperation",params:[op, entryPoint],id:8};
    const result = await rpcFetch(rpcUrl, body);
    if (!result || !result.result) {
        throw new Error(`sendOp error ${result}`);
    }
    return result.result;
}


export const checkAndSendOp = async (sender, pk) => {
    const chainIds = [1, 56, 137, 42161];
    const url = 'https://wallet.crescentbase.com/api/v1/rpc/';
    let op;
    try {
        op = await getCreateOP(sender, pk);
    } catch (e) {
        console.error("checkAndSendOp getCreateOP", e);
    }
    if (!op) {
        return;
    }
    for (const chainId of chainIds) {
        const targetUrl = `${url}${chainId}`;
        try {
            const hasSender = await hasSender(targetUrl, sender);
            if (hasSender) {
                continue;
            }
            await sendOp(targetUrl, op);
        } catch (e) {
            console.error("checkAndSendOp sendOp", e);
        }
    }
}
