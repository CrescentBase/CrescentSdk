export default () => {
    return(`
    
        .setpw {
            height: 100%;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            background-color: var(--system-color-2);
            padding: 16px 20px 10px 20px;
        }
      
        .setpw-password {
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
            color: var(--system-color-4);
            display: flex;
        }
        
        .setpw-password-desc {
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            color: var(--system-color-4);
            display: flex;
            margin-top: 8px;
            text-align: left;
        }
        
  `)
}
