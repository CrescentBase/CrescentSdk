export default () => {
    return(`
        .select-email {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--system-color-2);
        }
      
        .select-email-logo {
            width: 198.2px;
            height: 60px;
            align-items: center;
            margin-top: 36px;
        }
      
        .select-email-with-email {
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
            color: var(--medium-color-3);
            margin-top: 24px;
            margin-bottom: 8px;
        }
      
        .select-email-email-layout {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .select-email-email-lottie-layout {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: row;
            overflow: hidden;
            align-items: center;
            justify-content: center;
        }
        
        .select-email-email-layout-inter {
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            white-space: nowrap;
            padding: 0px 20px 0px 20px;
        }
      
        .select-email-email-wrap {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 68px;
            height: 68px;
            background: var(--medium-color-1);
            border-radius: 10px;
        }
      
        .select-email-email-wrap-empty {
            width: 68px;
            height: 68px;
        }
      
         .select-email-email-logo {
            width: 32px;
            height: 32px;
         }
      
        .select-email-email-name {
            width: 68px;
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            text-align: center;
            color: var(--system-color-4);
            margin-top: 4px;
        }
      
        .select-email-powered-by {
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            text-align: center;
            color: var(--medium-color-4);
            margin-top: 8px;
            margin-bottom: 8px;
        }
  `)
}
