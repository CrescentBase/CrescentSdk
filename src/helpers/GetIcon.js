import ic_back_white from "../assets/ic_back_white.png"
import ic_back_black from "../assets/ic_back_black.png"
import ic_add_white from "../assets/ic_add.png"
import ic_add_black from "../assets/ic_add_black.png"
import ic_hide_white from "../assets/ic_hide.png"
import ic_hide_black from "../assets/ic_hide_black.png"
import ic_receive_white from "../assets/ic_receive.png"
import ic_receive_black from "../assets/ic_receive_black.png"
import ic_history_white from "../assets/ic_history.png"
import ic_history_black from "../assets/ic_history_black.png"
import ic_send_white from "../assets/ic_send.png"
import ic_send_black from "../assets/ic_send_black.png"
import ic_set_language_solid_white from "../assets/ic_set_language_solid.png"
import ic_set_language_solid_black from "../assets/ic_set_language_solid_black.png"
import ic_set_safe_solid_white from "../assets/ic_set_safe_solid.png"
import ic_set_safe_solid_black from "../assets/ic_set_safe_solid_black.png"
import ic_address_white from "../assets/ic_address.png"
import ic_address_black from "../assets/ic_address_black.png"
import ic_buy_white from "../assets/ic_buy.png"
import ic_buy_black from "../assets/ic_buy_black.png"
import ic_clear_white from "../assets/ic_clear.png"
import ic_clear_black from "../assets/ic_clear_black.png"
import ic_close_white from "../assets/ic_close.png"
import ic_close_black from "../assets/ic_close_black.png"
import ic_gas_edit_white from "../assets/ic_gas_edit.png"
import ic_gas_edit_black from "../assets/ic_gas_edit_black.png"
import ic_hide_disable_white from "../assets/ic_hide_disable.png"
import ic_hide_disable_black from "../assets/ic_hide_disable_black.png"
import ic_search_white from "../assets/ic_search.png"
import ic_search_black from "../assets/ic_search_black.png"
import ic_setting_white from "../assets/ic_setting.png"
import ic_setting_black from "../assets/ic_setting_black.png"
import ic_setting_enter_white from "../assets/ic_setting_enter.png"
import ic_setting_enter_black from "../assets/ic_setting_enter_black.png"
import ic_setting_switch_white from "../assets/ic_setting_switch.png"
import ic_setting_switch_black from "../assets/ic_setting_switch_black.png"
import img_logo_white from "../assets/img_logo"
import img_logo_black from "../assets/img_logo_black"

import ic_unbind_black from "../assets/ic_unbind_black.png"
import ic_unbind from "../assets/ic_unbind.png"

import img_warn_black from "../assets/img_warn_black"
import img_warn from "../assets/img_warn"

import img_safe_black from "../assets/img_safe_black"
import img_safe from "../assets/img_safe"

export let isLight = false;

export const setIsLight = (isL) => {
    console.log('====isLight = ', isL);
    isLight = isL;
}

export function getBackIcon() {
    if (isLight) {
        return ic_back_black;
    } else {
        return ic_back_white;
    }
}

export function getAddIcon() {
    if (isLight) {
        return ic_add_black;
    } else {
        return ic_add_white;
    }
}

export function getHideIcon() {
    if (isLight) {
        return ic_hide_black;
    } else {
        return ic_hide_white;
    }
}

export function getReceiveIcon() {
    if (isLight) {
        return ic_receive_black;
    } else {
        return ic_receive_white;
    }
}

export function getHistoryIcon() {
    if (isLight) {
        return ic_history_black;
    } else {
        return ic_history_white;
    }
}

export function getSendIcon() {
    if (isLight) {
        return ic_send_black;
    } else {
        return ic_send_white;
    }
}

export function getLanguageIcon() {
    if (isLight) {
        return ic_set_language_solid_black;
    } else {
        return ic_set_language_solid_white;
    }
}

export function getSafeIcon() {
    if (isLight) {
        return ic_set_safe_solid_black;
    } else {
        return ic_set_safe_solid_white;
    }
}

export function getAddressIcon() {
    if (isLight) {
        return ic_address_black;
    } else {
        return ic_address_white;
    }
}

export function getBuyIcon() {
    if (isLight) {
        return ic_buy_black;
    } else {
        return ic_buy_white;
    }
}

export function getClearIcon() {
    if (isLight) {
        return ic_clear_black;
    } else {
        return ic_clear_white;
    }
}

export function getCloseIcon() {
    if (isLight) {
        return ic_close_black;
    } else {
        return ic_close_white;
    }
}

export function getGasEditIcon() {
    if (isLight) {
        return ic_gas_edit_black;
    } else {
        return ic_gas_edit_white;
    }
}

export function getHideDisableIcon() {
    if (isLight) {
        return ic_hide_disable_black;
    } else {
        return ic_hide_disable_white;
    }
}

export function getSearchIcon() {
    if (isLight) {
        return ic_search_black;
    } else {
        return ic_search_white;
    }
}

export function getSettingIcon() {
    if (isLight) {
        return ic_setting_black;
    } else {
        return ic_setting_white;
    }
}

export function getSettingEnterIcon() {
    if (isLight) {
        return ic_setting_enter_black;
    } else {
        return ic_setting_enter_white;
    }
}

export function getSettingSwitchIcon() {
    if (isLight) {
        return ic_setting_switch_black;
    } else {
        return ic_setting_switch_white;
    }
}

export function getLogoIcon() {
    if (isLight) {
        return img_logo_black;
    } else {
        return img_logo_white;
    }
}

export function getUnbindIcon() {
    if (isLight) {
        return ic_unbind_black;
    } else {
        return ic_unbind;
    }
}

export function getBindWarnIcon() {
    if (isLight) {
        return img_warn_black;
    } else {
        return img_warn;
    }
}

export function getBindSafeIcon() {
    if (isLight) {
        return img_safe_black;
    } else {
        return img_safe;
    }
}
