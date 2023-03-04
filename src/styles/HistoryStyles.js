export default () => {
    return(`
        .history {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            position: relative;
            overflow: hidden;
        }
        
        .history-base {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .history-tilte-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 56px;
            padding-left: 20px;
            align-self: flex-start;
        }
        
        .history-title-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .history-title-text {
            font-size: 16px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
        }
        
        .history-tilte-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
        
        .history-content-layout {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 0px 20px;
            overflow-y: auto;
            overflow-x: hidden;
        }
        
        .history-time-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            margin-top: 20px;
            text-align: left;
        }
        
        .hirtory-item-layout {
            padding: 16px;
            background: var(--medium-color-2);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            margin-top: 12px;
            overflow: hidden;
        }
        
        .history-item-row-layout {
            display: flex;
            align-items: center;
        }
        
        .history-item-icon-layout {
            position: relative;
            width: 42px;
            height: 36px;
        }
        
        .history-item-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
        }
        
        .history-item-chain-tag {
            width: 18px;
            height: 18px;
            position: absolute;
            right: 0px;
            bottom: 2px;
        }
        
        .history-item-symbol-layout {
            display: flex;
            flex-direction: column;
            margin-left: 8px;
            justify-content: center;
        }
        
        .history-item-symbol {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            text-align: left;
        }
        
        .history-item-from-address {
            margin-top: 2px;
            font-size: 10px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 12px;
            text-align: left;
        }
        
        .history-item-amount-add {
            font-size: 18px;
            font-weight: 600;
            color: var(--function-color-1);
            line-height: 22px;
        }
        
        .history-item-amount-reduce {
            font-size: 18px;
            font-weight: 600;
            color: var(--function-color-2);
            line-height: 22px;
        }
        
        .history-item-txhash-layout {
            display: flex;
            margin-top: 17px;
            align-items: center;
        }
        
        .history-item-txhash-icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
        
        .history-item-txhash-text {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            text-align: left;
        }
        
        .history-item-copy-icon {
            width: 12px;
            height: 12px;
            margin-left: 8px;
            cursor: pointer;
        }
        
        .history-item-gas-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 8px;
        }
        
        .history-no-more-transactions {
            font-size: 12px;
            font-weight: 400;
            color: rgba(147,157,165,0.6);
            line-height: 16px;
            margin-top: 20px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .history-no-transaction-layout {
            display: flex;
            position: absolute;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        
        
        .history-no-transaction-icon {
            width: 84px;
            height: 84px;
        }
        
        .history-no-transaction-text {
            font-size: 10px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 12px;
            margin-top: 4px;
        }
        
    `)
}
