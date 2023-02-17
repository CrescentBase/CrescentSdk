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
            overflow-y: scroll;
            background: var(--system-color-2);
            border-radius: 10px;
        }
  `)
}
