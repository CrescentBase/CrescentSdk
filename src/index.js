import CrescentEntry from './CrescentEntry'
import EmailEntry from "./EmailEntry";
import LoadingEntry from "./LoadingEntry";
import connect from "./connect";
import {
    LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_GET_OP_DATE, LOCAL_STORAGE_HAS_SEND_TEMP, LOCAL_STORAGE_HAS_SEND_TEMP_DATE,
    LOCAL_STORAGE_ONGOING_INFO, LOCAL_STORAGE_PAYSTER_OP,
    LOCAL_STORAGE_PUBLIC_ADDRESS, LOCAL_STORAGE_SEND_OP_SUCCESS,
    LOCAL_STORAGE_TEMP_PV, LOCAL_STORAGE_WALLET_KEYSTORE
} from "./helpers/StorageUtils";

const originalConsoleLog = console.log;
function log(...args) {
    if (true) {
        originalConsoleLog(...args);
    }
}
console.csLog = log;

function isConnected() {
    return getUserInfo() !== undefined;
}

function getUserInfo() {
    const email = localStorage.getItem(LOCAL_STORAGE_EMAIL);
    const address = localStorage.getItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
    if (email && address) {
        return {email, address};
    }
    return undefined;
}

function logout() {
    localStorage.removeItem(LOCAL_STORAGE_TEMP_PV);
    localStorage.removeItem(LOCAL_STORAGE_ONGOING_INFO);
    localStorage.removeItem(LOCAL_STORAGE_PUBLIC_ADDRESS);
    localStorage.removeItem(LOCAL_STORAGE_EMAIL);
    localStorage.removeItem(LOCAL_STORAGE_GET_OP_DATE);
    localStorage.removeItem(LOCAL_STORAGE_SEND_OP_SUCCESS);
    localStorage.removeItem(LOCAL_STORAGE_WALLET_KEYSTORE);
    localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP);
    localStorage.removeItem(LOCAL_STORAGE_HAS_SEND_TEMP_DATE);
    localStorage.removeItem(LOCAL_STORAGE_PAYSTER_OP);
}

function sendTransaction(props) {
    if (!props.tx) {
        originalConsoleLog("No tx parameter");
        return;
    }
    connect(props)
}

const CrescentSDK = {
    CrescentEntry,
    EmailEntry,
    LoadingEntry,
    connect,
    isConnected,
    logout,
    sendTransaction
}

export default CrescentSDK;
