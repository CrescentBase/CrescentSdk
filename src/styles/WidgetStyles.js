export default () => {
    return(`
        .widget-btn {
            width: 100%;
            height: 44px;
            background: linear-gradient(143deg, var(--gradient-color-1) 0%, var(--gradient-color-2) 100%);
            border-radius: 10px 10px 10px 10px;
            font-size: 14px;
            font-weight: 600;
            color: black;
            line-height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        
        .widget-btn:active {
            background: linear-gradient(143deg, var(--gradient-color-1-alpha) 0%, var(--gradient-color-2-alpha) 100%);
        }
        
        .widget-btn-no-click {
            pointer-events: none;
            user-select: none;
            width: 100%;
            height: 44px;
            background: rgba(147, 157, 165, 0.60);
            border-radius: 10px 10px 10px 10px;
            font-size: 14px;
            font-weight: 600;
            color: black;
            line-height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .widget-textinput-base-layout {
            display: flex;
            flex-direction: column;
        }
        
        .widget-textinput-tip {
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
            color: var(--system-color-4);
            display: flex;
            margin-bottom: 10px;
        }
        
        .widget-textinput-edit-layout {
            display: flex;
            justify-content: space-between;
            width: 100%;
            align-items: center;
        }
        
        .widget-textinput-edittext {
            font-size: 12px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 16px;
            display: flex;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            border-width: 0;
            background-color: transparent;
            outline: none;
            cursor: pointer;
            flex: 1;
        }
        
        .widget-textinput-edittext::placeholder {
            color: var(--medium-color-4);
        }
        
        .widget-textinput-edittext:focus {
            background-color: transparent;
            border-width: 0;
            outline: none;
        }
        
        .widget-textinput-edittext-clear {
            width: 14px;
            height: 14px;
            cursor: pointer;
        }
        
        .widget-textinput-line {
            width: 100%;
            height: 1px;
            background: var(--system-color-5);
            margin-top: 10px;
        }
        
        .widget-textinput-wrong-tip {
            font-size: 12px;
            font-weight: 400;
            color: var(--function-color-2);
            line-height: 16px;
            display: flex;
            margin-top: 4px;
            user-select: none;
        }
        
        .widget-textinput-right-text {
            font-size: 12px;
            font-weight: 400;
            color: #101010;
            line-height: 16px;
            color: var(--system-color-4);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
            
  `)
}
