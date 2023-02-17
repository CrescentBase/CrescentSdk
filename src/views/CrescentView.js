import React, {useContext, useEffect} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ConfigContext from "../contexts/ConfigContext";
import Main from "./Main";
import History from "./History";
import Token from "./Token";
import SelectEmail from "./SelectEmail";
import Login from "./Login";
import SetPassword from "./SetPassword";

export default (props) => {

    const { navigator, params } = useContext(NavigateContext)
    const { title } = useContext(ConfigContext);
    // //
    // useEffect(() => {
    //     InitLocales('zh');
    // }, []);

    const routers = {
        Main: <Main params={params} />,
        History: <History params={params} />,
        Token: <Token params={params} />,
        SelectEmail: <SelectEmail params={params} />,
        Login: <Login params={params} />,
        SetPassword: <SetPassword params={params} />
    }

    return (
        <div className="App">
            <div className="MainSize">
                <div className={'content'}>
                    {routers[navigator]}
                </div>
            </div>
        </div>
    )
}
