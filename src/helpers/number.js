import {ethers} from "ethers";
import {ChainType} from "./Config";

export function renderShortValue(value, shortNum = 5) {
    if (value && value.toString().includes('.')) {
        const comps = value.toString().split('.');
        const whole = comps[0];
        let fraction = comps[1];
        if (fraction.length <= shortNum) {
            return value;
        }
        fraction = fraction.substr(0, shortNum);
        fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
        return '' + whole + (fraction === '0' ? '' : '.' + fraction);
    }
    return value;
}

export function renderAmount(weiAmount, decimals, decimalsToShow = 5) {
    if (!weiAmount) {
        return 0;
    }
    const amount = ethers.utils.formatUnits(weiAmount, decimals);
    return renderShortValue(amount, decimalsToShow);
}

export function renderBalanceFiat(weiAmount, decimals, price, decimalsToShow = 5) {
    if (!weiAmount) {
        return 0;
    }
    const amount = ethers.utils.formatUnits(weiAmount, decimals);
    const balancePrice = amount * price;
    return renderShortValue(balancePrice, decimalsToShow);
}

export const getTokenName = type => {
    if (type === ChainType.Bsc) {
        return 'BEP20';
    } else if (type === ChainType.Heco) {
        return 'HRC20';
    }
    return 'ERC20';
};
