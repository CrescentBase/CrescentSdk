import BaseStyle from "../styles/BaseStyle";
import MainStyle from "../styles/MainStyle";
import FontStyle from "../styles/FontStyle";
import CommonStyles from "../styles/CommonStyles";
import SelectEmailStyle from "../styles/SelectEmailStyle";
import EntryStyles from "../styles/EntryStyles";
import LoginStyles from "../styles/LoginStyles";
import SetPwStyles from "../styles/SetPwStyles";
import WidgetStyles from "../styles/WidgetStyles"
import ChangePwStyles from "../styles/ChangePwStyles"
import SettingStyles from "../styles/SettingStyles";
import HistoryStyles from "../styles/HistoryStyles";
import AssetStyles from "../styles/AssetStyles"
import ReceiveStyles from "../styles/ReceiveStyles"
import SendStyles from "../styles/SendStyles"
import OngoingTxStyles from "../styles/OngoingTxStyles";
import CreateLoadingStyles from "../styles/CreateLoadingStyles";

function getStyle(style = '') {
    const allStyle = [
        BaseStyle(),
        CommonStyles(),
        EntryStyles(),
        LoginStyles(),
        SetPwStyles(),
        FontStyle(),
        MainStyle(),
        WidgetStyles(),
        ChangePwStyles(),
        SettingStyles(),
        SelectEmailStyle(),
        HistoryStyles(),
        AssetStyles(),
        ReceiveStyles(),
        SendStyles(),
        OngoingTxStyles(),
        CreateLoadingStyles(),
        style
    ].join('');
    return trimStyle(allStyle);
}

function trimStyle(style) {
    return style.replace(/\s*[\r\n]\s*/g, '')
}

function createStyle(document, style) {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(getStyle(style)));
    document.body.appendChild(styleElement);
}

export { createStyle, getStyle, trimStyle }
