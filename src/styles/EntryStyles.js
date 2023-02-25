export default () => {
    return(`
        .App {
            height: 100%;
            width: 100%;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            align-items: center;
        }
      
        .content {
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            position: relative;
            height: 100%;
            width: 100%;
            overflow-x: hidden;
            background: var(--system-color-2);
            border-radius: 10px;
        }
        
        .content-inter {
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            position: relative;
            height: 100%;
            width: 100%;
        }
        
        .pop-provider-address-copied-layout {
            display: flex;
            flex-direction: column;
            width: 155px;
            height: 84px;
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            background: var(--medium-color-1);
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        
        .pop-provider-address-copied-icon {
            width: 28px;
            height: 28px;
        }
        
        .pop-provider-address-copied-text {
            font-size: 14px;
            font-weight: 400;
            color: white;
            line-height: 20px;
            margin-top: 4px;
        }
        
        .entry-main-wrap-layout {
            display: flex;
            position: absolute;
            left: 0px;
            right: 0px;
            top: 0px;
            bottom: 0px;
        }
  `)
}
