import {ethers} from "ethers";
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils.js';
import {handleFetch, rpcFetch} from "./FatchUtils.js";
import {HOST, NetworkConfig, RPCHOST} from "./Config";
import BigNumber from "bignumber.js";

export const METHOD_ID_EXEC_FROM_ENTRY_POINT = "0x80c5c7d0";
export const METHOD_ID_TRANSFER = '0xa9059cbb';

export const entryPoint = "0xDd6c867f9267977FeA8D33e375190f2044cB346E";

export const UserOperationDefault = {
    sender: ethers.constants.AddressZero,
    nonce: 0,
    initCode: '0x',
    callData: '0x',
    callGas: 0,
    paymaster: ethers.constants.AddressZero,
    paymasterData: '0x',
    signature: '0x',
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
    preVerificationGas: 0,
    verificationGas: 10e6
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

export const getUserOperationByToken = async (wallet, provider, chainId, sender, contractAddress, toAddress, amount) => {
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
    return getUserOperation(wallet, provider, chainId, sender, data);
}

export const getUserOperationByTx = async (wallet, provider, chainId, sender, tx) => {
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
    return getUserOperation(wallet, provider, chainId, sender, data);
}

export const getUserOperation = async (wallet, provider, chainId, sender, callData) => {
    console.log('===UserOperationDefault = ', UserOperationDefault);
    console.log('===chianId = ', chainId);
    const uo = {
        ...UserOperationDefault,
        sender,
        callData
    }
    const kk = {
        ...uo
    }
    console.log('====uo = ', kk);
    console.log('====callData = ', callData);
    const txId = getRequestId(uo, Number(chainId));
    console.log('===txId= ', txId);

    const walletNew = wallet.connect(provider);//new ethers.Wallet(privateKey, provider);
    const privateKey = walletNew.privateKey;
    const publicKey = await walletNew.getAddress();
    console.log('===privateKey = ', privateKey, ' ; publicKey = ', publicKey);
    try {
        const signedTx = await walletNew.signMessage(ethers.utils.arrayify(txId));
        console.log('====signedTx = ', signedTx);
        uo.signature = signedTx;
        console.log('====uo 222= ', uo);
        const result = await provider.send("eth_estimateUserOperationGas", [uo, entryPoint]);
        console.log('====result = ', result);
        console.log('====result.verificationGas = ', result.verificationGas);
        console.log('===new BigNumber(result.verificationGas) = ', new BigNumber(result.verificationGas));
        console.log('===new BigNumber(result.verificationGas).multipliedBy(1.5) = ', new BigNumber(result.verificationGas).multipliedBy(1.5));
        uo.verificationGas = '0x' + new BigNumber(result.verificationGas).multipliedBy(3).toString(16);
        console.log('===uo.verificationGas = ', uo.verificationGas);
        uo.preVerificationGas = result.preVerificationGas;
        uo.callGas = result.callGas;
        return uo;
    } catch (error) {
        console.log('===getUserOperation = ', error)
    }
    return null;
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

export const getCreateOP = async (sender, pk, chainId) => {
    const url = `https://wallet.crescentbase.com/api/v1/getCreateOP?sender=${sender}&pk=${pk}&chain_id=${chainId}`;
    console.log('===url = ', url);
    const result = await handleFetch(url);
    if (!result || result.ret !== 200 || result.errmsg !== 'ok' || !result.data) {
        return null;
    }
    return result.data;
}

export const sendOp = async (rpcUrl, op, chainId) => {
    const body = {jsonrpc:"2.0",method:"eth_sendUserOperation",params:[op, entryPoint],id:8};
    const result = await rpcFetch(rpcUrl, body);
    console.log('===result = ', chainId, result);
    if (!result || !result.result) {
        throw new Error(`sendOp error ${result}`);
    }
    return result.result;
}


export const checkAndSendOp = async (op, sender, chainId) => {
    const url = 'https://wallet.crescentbase.com/api/v1/rpc/';
    const hasSendUrl = `${url}${chainId}`;
    const targetUrl = `https://bundler-${chainId}.crescentbase.com/rpc`//`${url}${chainId}`;
    try {
        const hasSenderResult = await hasSender(hasSendUrl, sender);
        if (hasSenderResult) {
            return true;
        }
        sendOp(targetUrl, op, chainId);
    } catch (e) {
        console.error("checkAndSendOp sendOp", e);
    }
    return false;
}

export const getSender = async (email) => {
    const url = RPCHOST + "/api/v1/getAAddress?email=" + email;
    try {
        const json = await handleFetch(url);
        const data = json.data;
        return data;
    } catch (error) {

        console.log("==getSender = ", error);
    }
    return null;
}


export const getNonce = async (sender, chainId) => {
    const abi = [
        {
            "inputs": [],
            "name": "nonce",
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
    const provider = new ethers.providers.JsonRpcProvider(RPCHOST + '/api/v1/rpc/' + chainId);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const nonce = await contract.nonce();
    return nonce;
}
