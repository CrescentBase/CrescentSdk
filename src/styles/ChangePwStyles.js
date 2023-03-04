export default () => {
    return(`
    
        .changepw {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            padding: 0px 20px 10px 20px;
        }
        
        .changepw-comfirm-base {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-top: 16px;
        }
        
        .changepw-title-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
            margin-left: -20px;
            margin-right: -20px;
        }
        
        .changepw-title-layout {
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 56px;
            align-self: flex-start;
        }
      
        .changepw-title-text {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: var(--system-color-4);
            display: flex;
            margin-left: 8px;
        }
        
        .changepw-title-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .changepw-comfirm-pw {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            text-align: left;
        }
        
        .changepw-comfirm-pw-tip {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            margin-top: 8px;
            margin-bottom: 16px;
            text-align: left;
        }
        
  `)
}
