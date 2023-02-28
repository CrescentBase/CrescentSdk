import React, {useContext, useEffect} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ConfigContext from "../contexts/ConfigContext";
import Main from "./Main";
import History from "./History";
import Asset from "./Asset";
import SelectEmail from "./SelectEmail";
import Login from "./Login";
import SetPassword from "./SetPassword";
import ChangePassword from "./ChangePassword"
import Setting from "./Setting";
import Send from "./Send";
import Receive from "./Receive";
import OngoingTx from "./OngoingTx";

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
        Asset: <Asset params={params} />,
        SelectEmail: <SelectEmail params={params} />,
        Login: <Login params={params} />,
        SetPassword: <SetPassword params={params} />,
        ChangePassword: <ChangePassword params={params} />,
        Setting: <Setting params={params} />,
        Send: <Send params={params} />,
        Receive: <Receive params={params} />,
        OngoingTx: <OngoingTx params={params} />
    }

    return (
        <div className={'content-inter'}>
            {navigator !== 'Main' && routers[navigator]}
            <div className={'entry-main-wrap-layout'} style={navigator === 'Main' ? {display: 'flex'} : {display: 'none'}}>
                <Main params={params}/>
            </div>
        </div>
    )
}
