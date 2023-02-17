import React, {useContext} from "react";
import NavigateContext from "../contexts/NavigateContext";
export default (props)=>{

    const { navigate } = useContext(NavigateContext);

    const goTokens = async () => {
        navigate('Token')
    }

    const goHistorys = async () => {
        navigate('History')
    }

    return (
        <div className={'Main'} >
            <button onClick={goTokens}>
                Token
            </button>

            <button onClick={goHistorys}>
                History
            </button>
        </div>
    );
}
