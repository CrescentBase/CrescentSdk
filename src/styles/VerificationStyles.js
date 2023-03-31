export default () => {
    return(`
    
        .verification {
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            padding: 36px 25px 0px 25px;
        }
        
        .verification-page {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        
        .verification-title-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        
        .verification-title-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .verification-info-icon {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        
        .verification-need-verify-desc {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            margin-top: 8px;
            text-align: left;
        }
        
        .verification-email-img {
            width: 140px;
            height: 140px;
            margin-top: 36px;
            align-self: center;
        }
        
        .verification-page2 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            flex: 1;
            margin-bottom: 36px;
        }
        
        .verification-page2-email-receiving {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
        }
        
        .verification-page2-send-fail-desc {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-top: 40px;
            width: 213px;
        }
        
        .verification-page2-send {
            color: var(--system-color-1);
            cursor: pointer;
        }
        
        .verification-page3-back-icon {
            width: 24px;
            height: 24px;
        }
        
        .verification-page3-verification-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
            margin-top: 16px;
            text-align: left;
        }
        
        .verification-page3-verification-desc {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            margin-top: 8px;
            text-align: left;
        }
        
        .verification-page3-content-layout {
            background: var(--medium-color-1);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            display: flex;
            flex-direction: column;
            padding: 20px;
            margin-top: 19px;
        }
        
        .verification-page3-send-to-text {
            font-size: 14px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            text-align: left;
        }
        
        .verification-page3-send-to-email-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 2px;
        }
        
        .verification-page3-send-to-email {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-right: 8px;
        }
        
        .verification-page3-send-to-email-copy-icon {
            width: 12px;
            height: 12px;
            cursor: pointer;
        }
        
        .verification-page3-body-text {
            font-size: 14px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            margin-top: 10px;
            text-align: left;
        }
        
        .verification-page3-pk-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 2px;
            overflow: hidden;
        }
        
        .verification-page3-pk {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            margin-right: 8px;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .verification-page3-pk-copy-icon {
            width: 12px;
            height: 12px;
            cursor: pointer;
        }
        
        .verification-page3-email-img {
            width: 140px;
            height: 140px;
            margin-top: 16px;
            align-self: center;
        }
        
        .verification-pop-layout {
            width: 263px;
            padding: 12px;
            background: var(--medium-color-1);
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 66px;
            right: 16px;
        }
        
        .verification-pop-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 20px;
            text-align: left;
        }
        
        .verification-pop-desc {
            font-size: 12px;
            font-weight: 400;
            color: var(--medium-color-3);
            line-height: 16px;
            text-align: left;
            margin-top: 4px;
        }
  `)
}
