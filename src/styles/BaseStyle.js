export default () => {
    return(`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input::-webkit-credentials-auto-fill-button {
            display: none !important;
            visibility: hidden;
            pointer-events: none;
            position: absolute; 
            right: 0;
        }
        
        input[type="number"],
        textarea {
          -moz-appearance: textfield;
          -webkit-appearance: textfield;
          appearance: textfield;
        }
        
        div {
          -ms-overflow-style: none;
          scrollbar-width: none;
          ::-webkit-scrollbar {
            display: none;
          }
        }
        
        :root {
            --base-bg-color: #000000;
            --gradient-color-1: #42FD86;
            --gradient-color-2: #FEF748;
            --gradient-color-1-alpha: rgba(66, 253, 134, 0.7);
            --gradient-color-2-alpha: rgba(254, 247, 72, 0.7);
            --system-color-1: #A3FF33;
            --system-color-2: #000000;
            --system-color-3: rgba(0, 0, 0, 0.5);
            --system-color-4: #FEFEFE;
            --system-color-5: rgba(255, 255, 255, 0.1);
            --medium-color-1: #1E2124;
            --medium-color-2: rgba(30,33,36,0.6);
            --medium-color-3: #939DA5;
            --medium-color-4: rgba(147, 157, 165, 0.6);
            --function-color-1: #25FF74;
            --function-color-2: #FF6A3C;
        }
  `)
}
