import {ethers} from "ethers";
import {ChainType} from "./Config";

export const MAX_SLIDER = 10;
export const calcGas = (suggestedGasFees, gasSpeedSelected) => {
    const gasFees = suggestedGasFees;
    if (!gasFees) {
        return ethers.BigNumber.from(0);
    }
    let gwei;
    const average = MAX_SLIDER / 2;
    if (gasSpeedSelected === average) {
        gwei = gasFees.averageGwei;
    } else if (gasSpeedSelected < average) {
        gwei = gasFees.averageGwei
            .sub(gasFees.safeLowGwei)
            .mul(gasSpeedSelected).div(average)
            .add(gasFees.safeLowGwei);
    } else {
        gwei = gasFees.fastGwei
            .sub(gasFees.averageGwei)
            .mul((gasSpeedSelected - average)).div(average)
            .add(gasFees.averageGwei);
    }
    return gwei;
};

export const fixGas = (suggestedGasFees, chainType) => {
    if (suggestedGasFees.fastGwei.lte(suggestedGasFees.averageGwei)) {
        suggestedGasFees.fastGwei = suggestedGasFees.averageGwei.mul(3).div(2);
    }
    if (chainType === ChainType.Bsc) {
        suggestedGasFees.safeLowGwei = suggestedGasFees.averageGwei;
        suggestedGasFees.averageGwei = suggestedGasFees.fastGwei.add(suggestedGasFees.safeLowGwei).div(2);
    } else if (suggestedGasFees.safeLowGwei.gte(suggestedGasFees.averageGwei)) {
        suggestedGasFees.safeLowGwei = suggestedGasFees.averageGwei.div(2);
    }

    return suggestedGasFees;
};

export const updateUoGasFees = (suggestedGasFees, maxFeePerGas) => {
    const uo = suggestedGasFees.uo;
    let maxPriorityFeePerGas;
    console.csLog('===uo = ', uo);
    console.csLog('====maxFeePerGas = ', maxFeePerGas);
    console.csLog('====maxFeePerGas.toHexString() = ', maxFeePerGas.toHexString());
    uo.maxFeePerGas = maxFeePerGas.toHexString();
    if (suggestedGasFees.isEIP1559) {
        maxPriorityFeePerGas = maxFeePerGas.sub(suggestedGasFees.estimatedBaseFee);
        uo.maxPriorityFeePerGas = maxPriorityFeePerGas.toHexString();
    } else {
        uo.maxPriorityFeePerGas = uo.maxFeePerGas;
    }
}
