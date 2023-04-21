import CryptoJS from "crypto-js";
import {JSEncrypt} from 'encryptlong';

export function encrypt(data, key, iv) {
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export function encryptRSA(publicKey, data) {
    let encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    let cptData = encryptor.encryptLong(data)
    return cptData
}

export function encryptTGMsg(cid, publicKey, data) {
    const time = Date.now().toString();
    const enTime = time + "engine";
    cid = cid + "crescent";
    const eData = encrypt(data, cid, enTime);
    const rasData = { time, msg: eData };
    return encryptRSA(publicKey, JSON.stringify(rasData));
}
