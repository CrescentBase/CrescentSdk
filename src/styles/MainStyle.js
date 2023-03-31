export default () => {
    return(`
        .main {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            position: relative;
            overflow: hidden;
        }
        
        .main-content {
            display: flex;
            flex-direction: column;
            overflow: auto;
            padding: 16px 20px 0px 20px;
            height: 100%;
            position: relative;
        }
        
        .main-title-layout {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        
        .main-title-email-and-adrress-layout {
            display: flex;
            flex-direction: column;
        }
        
        .main-title-email {
            font-size: 16px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            text-align: left;
        }
        
        .main-title-address-layout {
            display: flex;
            align-items: center;
            margin-top: 4px;
            cursor: pointer;
        }
        
        .main-title-address {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-right: 4px;
        }
        
        .main-title-address-copy-icon {
            width: 12px;
            height: 12px;
        }
        
        .main-title-setting-icon {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        .main-card-wrap {
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .main-card-img {
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }
        
        .main-card-content {
            display: flex;
            height: 100%;
            position: relative;
            flex-direction: column;
            justify-content: center;
            padding-left: 10px;
        }
        
        .main-card-top-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        
        .main-card-balance-text {
            font-size: 30px;
            font-weight: 600;
            color: var(--system-color-2);
            line-height: 36px;
            margin-left: 6px;
        }
        
        .main-card-history-wrap-layout {
            height: 18px;
            background: rgba(108,108,108,0.12);
            border-radius: 100px 0px 0px 100px;
            display: flex;
            padding: 1px 8px 1px 8px;
            align-items: center;
            cursor: pointer;
        }
        
        .main-card-history-icon {
            width: 12px;
            height: 12px;
        }
        
        .main-card-history-text {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-2);
            line-height: 16px;
            margin-left: 4px;
        }
        
        .main-card-chain-layout {
            display: flex;
            flex-direction: row;
            margin-top: 8px;
        }
        
        .main-card-chain-item-layout {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 40px;
        }
        
        .main-card-chain-logo {
            width: 24px;
            height: 24px;
        }
        
        .main-card-chain-name {
            margin-top: 2px;
            font-size: 8px;
            font-weight: 400;
            color: #000000;
            line-height: 10px;
        }
        
        .main-asset-top-layout {
            display: flex;
            align-items: center;
            margin: 16px 0px 5px 0px
        }
        
        .main-assetlist-text {
            font-size: 14px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 20px;
            display: flex;
        }
        
        .main-asset-search-icon {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        .main-asset-buy-icon {
            width: 20px;
            height: 20px;
            margin-left: 20px;
            cursor: pointer;
        }
        
        .main-asset-item-layout {
            height: 60px;
            display: flex;
            align-items: center;
            background-color: var(--system-color-2);
        }
        
        .main-asset-item-icon-layout {
            position: relative;
            width: 42px;
            height: 36px;
        }
        
        .main-asset-item-icon {
            width: 36px;
            height: 36px;
            border-radius: 6px;
        }
        
        .main-asset-item-chain-tag {
            width: 18px;
            height: 18px;
            position: absolute;
            right: 0px;
            bottom: 2px;
        }
        
        .main-asset-item-token-left-layout {
            display: flex;
            flex-direction: column;
            margin-left: 8px;
        }
        
        .main-asset-item-token-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            display: flex;
        }
        
        .main-asset-item-token-amount {
            font-size: 13px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            display: flex;
        }
        
        .main-asset-item-token-balance {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            display: flex;
        }
        
        .main-asset-item-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
        
        .main-asset-item-action-base-layout {
            width: 42px;
            height: 60px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-right: 2px;
        }
        
        .main-asset-item-action-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .main-asset-item-action-icon {
            width: 20px;
            height: 20px;
        }
        
        .main-asset-item-action-text {
            font-size: 10px;
            font-weight: 400;
            color: var(--system-color-1);
            line-height: 12px;
            margin-top: 2px;
            width: 30px;
        }
        
        .main-search-base-layout {
            display: flex;
            flex-direction: column;
        }
        
        .main-search-wrap-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 16px 0px 4px 0px
        }
        
        .main-search-back-icon {
            width: 20px;
            height: 20px;
        }
        
        .main-search-edit-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }
        
        .main-search-edittext {
            font-size: 13px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            display: flex;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            border-width: 0;
            background-color: transparent;
            outline: none;
            cursor: pointer;
            width: 100%
        }
        
        .main-search-edittext::placeholder {
            color: var(--medium-color-3);
        }
        
        .main-search-edittext:focus {
            background-color: transparent;
            border-width: 0;
            outline: none;
        }
        
        .main-search-edittext-clear {
            width: 14px;
            height: 14px;
            cursor: pointer;
        }
        
        .main-search-empty-data {
            display: flex;
            flex-direction: column;
            padding-top: 20px;
            align-items: center;
        }
        
        .main-search-lottie-layout {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
        }
       
        .main-search-empty-icon {
            width: 84px;
            height: 84px;
        }
        
        .main-search-empty-tip {
            font-size: 10px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 12px;
            margin-top: 4px;
        }
        
        .main-toast {
            position: absolute;
            bottom: 20px;
            padding: 10px 20px;
            background: var(--medium-color-1);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            color: var(--system-color-4);
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .main-transak-layout {
            display: flex;
            flex-direction: column;
            position: absolute;
            left: 11%;
            right: 11%;
            top: 50%;
            transform: translateY(-50%);
            background: var(--medium-color-1);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            align-items: center;
        }
        
        .main-transak-close-icon {
            width: 16px;
            height: 16px;
            align-self: flex-end;
            margin-right: 8px;
            margin-top: 8px;
            cursor: pointer;
        }
        
        .main-transak-title {
            font-size: 18px;
            font-weight: 600;
            color: white;
            line-height: 22px;
        }
        
        .main-transak-content1 {
            font-size: 13px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin: 8px 20px 4px 20px;  
            text-align: center;
        }
        
        .main-transak-icon {
            width: 76px;
            height: 20px;
        }
        
        .main-transak-content2 {
            font-size: 13px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            text-align: center;
            margin: 8px 20px 0px 20px;  
        }
        
        .main-transak-click-here {
            color: var(--system-color-1);
            text-decoration: none;
            cursor: pointer;
        }
        
        .main-transation-loading-layout {
            display: flex;
            flex-direction: row;
            position: absolute;
            right: 20px;
            bottom: 20px;
            align-items: center;
            background: var(--medium-color-1);
            border-radius: 100px 100px 100px 100px;
            opacity: 1;
        }
        
        .main-transation-submitted-layout {
            width: 0px;
            height: 44px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-size: 13px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            white-space: nowrap;
        }
        
        .main-transation-right-layout {
            width: 42px;
            height: 42px;
            position: relative;
            justify-content: center;
            align-items: center;
            display: flex;
        }
        
        .main-transation-number {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-1);
            line-height: 22px;
            text-align: center;
            width: 42px;
            height: 42px;
            position: absolute;
            left: 0px;
            top: 0px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
  `)
}
