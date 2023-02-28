export const isValidAddress = (hexAddress) => {
    if (!hexAddress) {
        return false;
    }
    if (typeof hexAddress !== 'string') {
        return;
    }
    return /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
}

function renderShortAddress(address, chars = 4) {
    if (!address) return address;
    const checksummedAddress = toChecksumAddress(address);
    return `${checksummedAddress.substr(0, chars + 2)}...${checksummedAddress.substr(-chars)}`;
}
