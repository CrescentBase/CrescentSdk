export default () => {
    return(`
        .select-platform {
            height: 236px;
            width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--system-color-2);
            border-radius: 10px;
        }
      
        .select-platform-title-wrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 350px;
            margin-bottom: 14px;
        }
        
        .select-platform-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--system-color-4);
            line-height: 22px;
        }
        
        .select-platform-title-close {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        .select-platform-item {
            width: 318px;
            height: 60px;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            margin-top: 10px;
            cursor: pointer;
            flex-direction: row;
            background: var(--medium-color-1);
            border-radius: 10px;
            display: flex;
        }
        
        .select-platform-item-title {
            font-size: 14px;
            font-weight: 400;
            color: var(--system-color-4);
            line-height: 20px;
        }
        
        .select-platform-item-icon {
            width: 24px;
            height: 24px;
        }
  `)
}
