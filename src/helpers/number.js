import {ethers} from "ethers";
import {ChainType} from "./Config";
import BigNumber from "bignumber.js";
import {CURRENCIES} from "./currencies";

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

export function renderFullAmount(weiAmount, decimals, decimalsToShow = 5) {
    if (!weiAmount) {
        return 0;
    }
    const amount = ethers.utils.formatUnits(weiAmount, decimals);
    return amount;
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

export function weiToGwei(weiBn) {
    const gweiValue = new BigNumber(weiBn.toHexString()).dividedBy('1000000000');
    return gweiValue
}

export function weiToEth(weiBn) {
    const gweiValue = new BigNumber(weiBn.toHexString()).dividedBy('1000000000000000000');
    return gweiValue
}

export function isDecimalValue(value) {
    const valueBigNumber = new BigNumber(value);
    return valueBigNumber.isFinite() && !valueBigNumber.isNaN();
}

export function formatNumberStr(value) {
    return new BigNumber(value).toString(10);
}

export function apiEstimateModifiedToWEI(estimate) {
    const wei = ethers.utils.parseUnits(String(estimate), 'gwei')
    return wei;
}

export function renderGwei(value) {
    if (!value) {
        return '0';
    }
    const valueBigNumber = new BigNumber(value.toHexString()).div(new BigNumber('1000000000'));
    if (valueBigNumber.isNaN() || !valueBigNumber.gt(0)) {
        return '0';
    }
    if (valueBigNumber.lt(0.0001)) {
        return '< 0.0001';
    }
    return valueBigNumber.dp(4).toString();
}

/**
 * Converts wei to render format string, showing 5 decimals
 *
 * @param {Number|String|BN} value - Wei to convert
 * @param {Number} decimalsToShow - Decimals to 5
 * @returns {String} - Number of token minimal unit, in render format
 * If value is less than 5 precision decimals will show '< 0.00001'
 */
export function renderFromWei(value, decimalsToShow = 5) {
    const wei = weiToEth(value);
    const weiBigNumber = wei;
    let renderWei;
    if (weiBigNumber.gt(0) && weiBigNumber.lt(0.00001)) {
        renderWei = '< 0.00001';
    } else {
        renderWei = renderShortValue(weiBigNumber.toString(10), decimalsToShow);
    }
    return renderWei;
}

export function greaterThanZero(value) {
    return new BigNumber(value).gt(0);
}

/**
 * Determines if a string is a valid decimal
 *
 * @param {string} value - String to check
 * @returns {boolean} - True if the string is a valid decimal
 */
export function isDecimal(value) {
    const valueBigNumber = new BigNumber(value);
    return valueBigNumber.isFinite() && !valueBigNumber.isNaN() && greaterThanZero(value);
}

export function renderSplitAmount(amount) {
    if (amount === undefined) {
        return amount;
    }
    amount += '';
    if (!isDecimal(amount)) {
        return amount;
    }
    const cd = amount.includes('.');
    amount = (amount + '').replace(/[^\d.\-E]/g, '') + '';
    const l = amount
        .split('.')[0]
        .split('')
        .reverse();
    let r = amount.split('.')[1];
    if (r === undefined && cd) {
        r = '';
    }
    let t = '';
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
    }
    return r !== undefined
        ? t
            .split('')
            .reverse()
            .join('') +
        '.' +
        r
        : t
            .split('')
            .reverse()
            .join('');

}

/**
 * Converts wei expressed as a BN instance into a human-readable fiat string
 *
 * @param {number} wei - BN corresponding to an amount of wei
 * @param {number} conversionRate - ETH to current currency conversion rate
 * @param {string} currencyCode - Current currency code to display
 * @returns {string} - Currency-formatted string
 */
export function weiToFiat(wei, conversionRate, currencyCode = "USD", decimalsToShow = 5) {
    const currency = CURRENCIES[currencyCode];
    if (!conversionRate) {
        if (currency?.symbol) {
            return `${currency?.symbol}${0.0}`;
        }
        return `0.00 ${currencyCode}`;
    }
    if (!wei || !ethers.BigNumber.isBigNumber(wei)|| !conversionRate) {
        if (currency?.symbol) {
            return `${currency?.symbol}${0.0}`;
        }
        return `0.00 ${currencyCode}`;
    }
    const value = renderSplitAmount(weiToFiatNumberStr(wei, conversionRate, decimalsToShow));
    if (currency?.symbol) {
        return `${currency?.symbol}${value}`;
    }
    return `${value} ${currencyCode}`;
}

/**
 * Converts wei expressed as a BN instance into a human-readable fiat string
 *
 * @param {number} wei - BN corresponding to an amount of wei
 * @param {number} conversionRate - ETH to current currency conversion rate
 * @param {Number} decimalsToShow - Decimals to 5
 * @returns {string} - The converted balance
 */
export function weiToFiatNumberStr(wei, conversionRate, decimalsToShow = 5) {
    const ethBigNumber = weiToEth(wei);
    return renderShortValue(ethBigNumber.multipliedBy(conversionRate).toString(10), decimalsToShow);
}
