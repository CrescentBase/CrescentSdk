export default () => {
    return(`
        .receive {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            position: relative;
        }
        
        .receive-base {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .receive-tilte-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 56px;
            padding-left: 20px;
            align-self: flex-start;
        }
        
        .receive-title-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .receive-title-text {
            font-size: 16px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
        }
        
        .receive-tilte-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
        
        .receive-content-layout {
            display: flex;
            flex-direction: column;
            flex: 1;
            align-items: center;
        }
        
        .receive-wallet-address-tip {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            margin-top: 36px;
        }
        
        .receive-address-text {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-top: 8px;
        }
        
        .receive-only-send {
            font-size: 13px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            color: var(--medium-color-3);
            margin-top: 24px;
        }
        
        .receive-chain {
            padding: 4px 10px;
            background: rgba(163,255,51,0.15);
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            font-weight: 400;
            color: var(--system-color-1);
            line-height: 16px;
            margin-top: 4px;
        }
        
        .receive-to-this-address {
            margin-top: 4px;
            font-size: 13px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
        }
    `)
}
