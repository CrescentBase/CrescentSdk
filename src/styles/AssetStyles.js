export default () => {
    return(`
        .asset {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            position: relative;
        }
        
        .asset-base {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .asset-title-back-icon {
            width: 24px;
            height: 24px;
            margin: 16px 20px;
        }
        
        .asset-tilte-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
        
        .asset-content-layout {
            height: 100%;
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
        }
        
        .asset-top-layout {
            display: flex;
            align-items: center;
        }
        
        .asset-token-logo {
            width: 50px;
            height: 50px;
            min-width: 50px;
            min-height: 50px;
        }
        
        .asset-top-right-layout {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-left: 8px;
        }
        
        .asset-tokenname-and-price {
            display: flex;
            flex-direction: row;
            align-items: center;   
        }
        
        .asset-chain-and-price-change {
            display: flex;
            flex-direction: row;
            align-items: center;  
            margin-top: 3px;
        }
        
        .asset-token-name {
            font-size: 24px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 30px;
        }
        
        .asset-address-copy-icon {
            width: 20px;
            height: 20px;
            margin-left: 4px;
        }
        
        .asset-token-price {
            font-size: 24px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 30px;
        }
        
        .asset-chain-name {
            padding: 1px 6px;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            border: 1px solid #23A1F0;
            font-size: 10px;
            font-weight: 400;
            color: #23A1F0;
            line-height: 12px;
            align-items: center
        }
        
        .asset-price-change-text {
            font-size: 14px;
            font-weight: 400;
            color: var(--function-color-1);
            line-height: 20px;
            margin-left: 4px;
            align-items: center;
            display: flex;
        }
        
        .asset-price-change-icon {
            width: 16px;
            height: 16px;
        }
        
        .asset-balance-tip {
            font-size: 14px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 20px;
            text-align: left;
        }
        
        .asset-balance {
            font-size: 28px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 34px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
        }
        
        .asset-networth-tip {
            font-size: 14px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 20px;
            text-align: left;
        }
        
        .asset-networth {
            font-size: 28px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 34px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
        }
        
        .asset-action-layout {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        
        .asset-action-item-layout {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 98px;
            height: 60px;
            background: var(--medium-color-1);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
        }
        
        .asset-action-icon {
            width: 20px;
            height: 20px;
        }
        
        .asset-action-text {
            font-size: 14px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 20px;
        }
        
        .asset-address-pop-layout {
            position: absolute;
            left: 77px;
            top: 102px;
            display: flex;
            flex-direction: column;
            background: var(--medium-color-1);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            padding: 12px;
        }
        
        .asset-address-pop-contract {
            font-size: 14px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            text-align: left;
        }
        
        .asset-address-pop-address-detail-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 4px;
        }
        
        .asset-address-pop-address-detail {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            text-align: left;
            overflow: hidden;
            text-overflow: clip;
            white-space: nowrap;
        }
        
        .asset-address-pop-address-copy-icon {
            width: 12px;
            height: 12px;
            margin-left: 4px;
        }
    `)
}
