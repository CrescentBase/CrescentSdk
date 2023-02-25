export default () => {
    return(`
    
        .setting {
            height: 100%;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            padding: 0px 20px 10px 20px;
        }
        
        .setting-title-layout {
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 56px;
            align-self: flex-start;
        }
        
        .setting-title-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
            margin-left: -20px;
            margin-right: -20px;
        }
      
        .setting-title-text {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: var(--system-color-4);
            display: flex;
            margin-left: 8px;
        }
        
        .setting-title-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .setting-content-layout {
            width: 100%;
            height: 112px;
            border-radius: 10px 10px 10px 10px;
            display: flex;
            flex-direction: column;
            background: var(--medium-color-1);
            margin-top: 20px;
        }
        
        .setting-item-wrap {
            display: flex;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;
            height: 56px;
            cursor: pointer;
        }
        
        .setting-item-icon {
            width: 24px;
            height: 24px;
        }
        
        .setting-item-name {
            font-size: 14px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
            margin-left: 8px;
        }
        
        .setting-item-arrow {
            width: 16px;
            height: 16px;
        }
        
        .setting-item-state {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-right: 8px;
        }
        
        .setting-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
        }
  `)
}
