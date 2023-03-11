export default () => {
    return(`
        .send {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            position: relative;
            overflow: hidden;
        }
        
        .send-base {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .send-tilte-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 56px;
            padding-left: 20px;
            align-self: flex-start;
        }
        
        .send-title-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .send-title-text {
            font-size: 16px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
        }
        
        .send-tilte-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
        
        .send-content-layout {
            padding: 20px 20px 36px 20px;
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
        }
        
        .send-content-step-layout {
            display: flex;
            flex-direction: column;
        }
        
        .send-recipient-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            text-align: left;
        }
        
        .send-address-input-layout {
            display: flex;
            align-items: center;
            height: 39px;
        }
        
        .send-input {
            display: flex;
            flex: 1;
            font-size: 14px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
            overflow:hidden;
            white-space:nowrap;
            border-width: 0;
            background-color: transparent;
            outline: none;
            cursor: pointer;
        }
        
        .send-input::placeholder {
            color: rgba(147,157,165,0.6);
        }
        
        .send-address-correct {
            display: flex;
            font-size: 14px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
            margin-right: 8px;
            overflow:hidden;
            white-space:nowrap;
        }
        
        .send-input-address-correct-icon {
            width: 16px;
            height: 16px;
        }
        
        .send-input-address-clear-icon {
            width: 16px;
            height: 16px;
            margin-left: 10px;
        }
        
        .send-input-address-paste {
            font-size: 12px;
            font-weight: 400;
            color: var(--function-color-1);
            line-height: 16px;
            overflow:hidden;
            white-space:nowrap;
            margin-left: 10px;
        }
        
        .send-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
        
        .send-to-network {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            margin-top: 24px;
            text-align: left;
        }
        
        .send-chain {
            padding: 6px 12px;
            background: linear-gradient(143deg, var(--gradient-color-1) 0%, var(--gradient-color-2) 100%);
            border-radius: 18px 18px 18px 18px;
            opacity: 1;
            font-size: 12px;
            font-weight: 600;
            color: var(--system-color-2);
            line-height: 16px;
            margin-top: 10px;
            display: flex;
            align-self: flex-start;
        }
        
        .send-will-receive-tip {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-top: 4px;
            text-align: left;
        }
        
        .send-amount-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;
        }
        
        .send-amount-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .send-amount-available-text {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
        }
        
        .send-input-token-layout {
            display: flex;
            align-items: center;
            height: 40px;
            width: 100%;
        }
        
        .send-input-token-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }
        
        .send-input-token-max {
            font-size: 12px;
            font-weight: 400;
            color: var(--function-color-1);
            line-height: 16px;
            margin-left: 10px;
        }
        
        .send-equal {
            font-size: 20px;
            line-height: 24px;
            margin-top: 10px;
            margin-bottom: 2px;
            color: var(--system-color-4);
            text-align: left;
        }
        
        .send-input-dollar-usd {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            margin-left: 10px;
        }
        
        .send-pop-layout {
            display: flex;
            flex-direction: column;
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            background: var(--medium-color-1);
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            padding: 24px 20px;
        }
        
        .send-pop-title {
            font-size: 18px;
            font-weight: 600;
            color: white;
            line-height: 22px;
        }
        
        .send-pop-title-desc {
            font-size: 13px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            margin-top: 6px;
        }
        
        .send-step2-to-layout {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .send-step2-to {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .send-step2-chain {
            font-size: 14px;
            font-weight: 600;
            color: var(--medium-color-3);
            line-height: 20px;
        }
        
        .send-step2-address-text {
            font-size: 14px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 20px;
            margin-top: 10px;
            text-align: left;
        }
        
        .send-step2-amount-layout {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;
            width: 100%;
        }
        
        .send-step2-amount-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .send-step2-amount-use-text {
            font-size: 14px;
            font-weight: 600;
            color: var(--medium-color-3);
            line-height: 20px;
        }
        
        .send-step2-network-fee-layout {
            margin-top: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            justify-content: space-between;
        }
        
        .send-step2-network-fee-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .send-step2-network-fee-switch-icon {
            width: 16px;
            height: 16px;
        }
        
        .send-step2-gas-layout {
            height: 118px;
            display: flex;
            flex-direction: column;
            width: 100%;
            padding-top: 10px;
        }
        
        .send-step2-gwei-recommend-layout {
            display: flex;
            align-items: center;
        }
        
        .send-step2-gwei-recommend-text {
            font-size: 14px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
        }
        
        .send-step2-gwei-fire-icon {
            width: 16px;
            height: 16px;
            margin-left: 4px;
            margin-right: 4px;
        }
        
        .send-step2-gwei-equal-dollor {
            margin-top: 4px;
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            text-align: left;
            margin-bottom :14px;
        }
        
        .send-step2-gas-price-and-limit-layout {
            display: flex;
            width: 100%;
            height: 40px;
            align-items: center;
            overflow: hidden;
            white-space:nowrap;
        }
        
        .send-step2-gas-price-and-limit-item-layout {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
            white-space:nowrap;
        }
        
        .send-step2-gas-price-and-limit-item-row-layout {
            display: flex;
            align-items: center;
            overflow: hidden;
            white-space:nowrap;
            height: 39px;
        }
        
        .send-step2-gas-price-and-limit-item-row-tip {
            font-size: 14px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
            margin-right: 8px;
            text-align: left;
        }
        
        .send-step2-gas-equal-dollor {
            margin-top: 4px;
            font-size: 14px;
            font-weight: 600;
            color: var(--medium-color-3);
            line-height: 20px;
            text-align: left;
        }
        
        .send-slider-horizontal {
            width: 100%;
            height: 18px;
        }
        
        .send-slider-thumb {
            cursor: pointer;
        }
        
        .send-slider-horizontal .send-slider-thumb {
            top: 0px;
            width: 18px;
            height: 18px;
        }
        
        .send-slider-track {
            position: relative;
            background: #A3FF33;
        }
        
        .send-slider-track.send-slider-track-1 {
            background: #1E2124;
        }
        
        .send-slider-horizontal .send-slider-track {
            top: 7px;
            height: 4px;
            border-radius: 3px;
        }
        
        .send-load-wrap {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 1;
        }
    `)
}
