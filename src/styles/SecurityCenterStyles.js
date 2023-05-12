export default () => {
    return(`
    
        .security-center {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            padding: 0px 25px 10px 25px;
        }
        
        .security-center-base {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        
        .security-center-title-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
            margin-left: -25px;
            margin-right: -25px;
        }
        
        .security-center-title-layout {
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 56px;
            align-self: flex-start;
        }
      
        .security-center-title-text {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: var(--system-color-4);
            display: flex;
            margin-left: 8px;
        }
        
        .security-center-title-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .security-center-page1-level-logo {
            width: 140px;
            height: 140px;
            align-self: center;
            margin-top: 20px;                    
        }
        
        .security-center-page1-level-wrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: 30px;
            width: 100%;
        }
        
        .security-center-page1-level-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .security-center-page1-level-text-icon {
            width: 20px;
            height: 20px;
        }
        
        .security-center-page1-level-state {
            font-size: 14px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            margin-top: 8px;
        }
        
        .security-center-page1-level-state-desc {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-top: 8px;
        }
        
        .security-center-page1-crescentwallet {
            font-size: 12px;
            font-weight: 400;
            color: #92F51A;
            line-height: 16px;
            cursor: pointer;
        }
        
        .security-center-page2-email-text {
            font-size: 14px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            margin-top: 30px;
        }
        
        .security-center-page2-level-state {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            margin-top: 8px;
        }
        
        .security-center-page2-email-wrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            width: 100%;
        }
        
        .security-center-page2-email-content {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
        }
        
        .security-center-page2-email-unbind-icon {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        .security-center-page2-unbind-line {
            background: var(--system-color-5);
            opacity: 1;
            height: 1px;
            margin-top: 10px;
        }
        
        .security-center-page2-unbind-btn {
            display: flex;
            margin-top: 30px;
            border-radius: 10px;
            height: 44px;
            width: 100%;;
            border: 1px solid #939DA5;
            font-size: 14px;
            font-weight: 600;
            color: #939DA5;
            line-height: 20px;
            cursor: pointer;
            justify-content: center;
            align-items: center;
        }
        
        .security-center-page3-desc {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin: 0px 13px 10px 13px;
            text-align: center;
        }
        
        .security-center-pop-layout-wrap {
            display: flex;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: var(--system-color-3);
        }
        
        .security-center-pop-layout {
            display: flex;
            flex-direction: column;
            position: absolute;
            left: 11%;
            right: 11%;
            top: 50%;
            transform: translateY(-50%);
            background: var(--medium-color-5);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            align-items: center;
            padding: 24px 20px;
            justify-content: center;
            align-self: center;
        }
        
        .security-center-pop-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .security-center-pop-desc {
            margin-top: 8px;
            width: 239px;
            font-size: 13px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .security-center-pop-btn-wrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;
            width: 251px;
        }
        
        .security-center-pop-cancel-btn {
            display: flex;
            width: 97px;
            height: 36px;
            border-radius: 10px;
            border: 1px solid var(--custom-color-1);
            font-size: 14px;
            font-weight: 600;
            color: var(--custom-color-1);
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            align-items: center;
            justify-content: center;
        }
        
        .security-center-pop-confirm-btn {
            display: flex;
            width: 130px;
            height: 36px;
            background: linear-gradient(143deg, var(--gradient-color-1) 0%, var(--gradient-color-2) 100%);
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            color: black;
            line-height: 20px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
        }
        
  `)
}
