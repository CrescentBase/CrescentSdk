import React, {useContext} from "react";
import NavigateContext from "../contexts/NavigateContext";
export default (props)=>{

    const { navigate } = useContext(NavigateContext);
    return (
        <div style={{backgroundColor: "blue"}}>
            Token
        </div>
    );
}
