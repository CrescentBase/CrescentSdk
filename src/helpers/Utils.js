export const isValidAddress = (hexAddress) => {
    if (!hexAddress) {
        return false;
    }
    if (typeof hexAddress !== 'string') {
        return;
    }
    return /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
}

// function renderShortAddress(address, chars = 4) {
//     if (!address) return address;
//     const checksummedAddress = toChecksumAddress(address);
//     return `${checksummedAddress.substr(0, chars + 2)}...${checksummedAddress.substr(-chars)}`;
// }

export const isPcPlatform = (paramPlatform) => {
    let platform = paramPlatform;
    if (!paramPlatform) {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('android') !== -1) {
            platform = 1;
        } else if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1) {
            platform = 2;
        } else {
            platform = 3;
        }
    }
    return platform === 3;
}

export const callToNativeMsg = (msg, paramPlatform) => {
    let platform = paramPlatform;
    if (!paramPlatform) {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('android') !== -1) {
            platform = 1;
        } else if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1) {
            platform = 2;
        } else {
            platform = 3;
        }
    }
    if (platform === 1) {
        prompt(msg);
    } else if (platform === 2) {
        window.webkit.messageHandlers.ReactCallBack.postMessage(msg);
    } else {
        console.log(msg);
    }
}
