export default () => {
    return(`
        .ongoingtx {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            position: relative;
            overflow: hidden;
        }
        
        .ongoingtx-base {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .ongoingtx-tilte-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 56px;
            padding-left: 20px;
            align-self: flex-start;
        }
        
        .ongoingtx-title-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .ongoingtx-title-text {
            font-size: 16px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
        }
        
        .ongoingtx-tilte-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
        
        .ongoingtx-content-layout {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 0px 20px;
            overflow-y: auto;
            overflow-x: hidden;
        }
        
        .ongoingtx-time-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            margin-top: 20px;
            text-align: left;
        }
        
        .ongoingtx-item-layout {
            padding: 16px;
            background: var(--medium-color-2);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            margin-top: 12px;
            overflow: hidden;
        }
        
        .ongoingtx-item-row-layout {
            display: flex;
            align-items: center;
            overflow: hidden;
        }
        
        .ongoingtx-item-icon-layout {
            position: relative;
            width: 42px;
            height: 36px;
        }
        
        .ongoingtx-item-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
        }
        
        .ongoingtx-item-chain-tag {
            width: 18px;
            height: 18px;
            position: absolute;
            right: 0px;
            bottom: 2px;
        }
        
        .ongoingtx-item-symbol-layout {
            display: flex;
            flex-direction: column;
            margin-left: 8px;
            justify-content: center;
        }
        
        .ongoingtx-item-symbol {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 10px;
        }
        
        .ongoingtx-item-to-address {
            margin-top: 2px;
            font-size: 10px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 12px;
            text-align: left;
            cursor: pointer;
        }
        
        .ongoingtx-item-amount-add {
            font-size: 18px;
            font-weight: 600;
            color: var(--function-color-1);
            line-height: 22px;
        }
        
        .ongoingtx-item-amount-reduce {
            font-size: 18px;
            font-weight: 600;
            color: var(--function-color-2);
            line-height: 22px;
        }
        
        .ongoingtx-item-txhash-layout {
            display: flex;
            margin-top: 17px;
            align-items: center;
        }
        
        .ongoingtx-item-txhash-icon {
            width: 16px;
            height: 16px;
        }
        
        .ongoingtx-item-txhash-text {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            text-align: left;
            margin-left: 8px;
        }
        
        .ongoingtx-item-copy-icon {
            width: 12px;
            height: 12px;
            margin-left: 8px;
            cursor: pointer;
        }
        
        .ongoingtx-no-more-transactions {
            font-size: 12px;
            font-weight: 400;
            color: rgba(147,157,165,0.6);
            line-height: 16px;
            margin-top: 20px;
            margin-bottom: 20px;
            text-align: center;
        }
    `)
}
