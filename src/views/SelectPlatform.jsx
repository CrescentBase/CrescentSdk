import React, {useContext, useEffect, useState} from "react";
// import ic_close from '../assets/ic_close.png';
import ic_connect_crescent from '../assets/ic_connect_crescent.png';
import ic_connect_metamask from '../assets/ic_connect_metamask.png';
import {ILocal} from "../locales/i18n";
import {getCloseIcon} from "../helpers/GetIcon";


export default (props)=>{
    const ic_close = getCloseIcon();
    return (
        <div className={'select-platform'}>
            <div className={'select-platform-title-wrap'}>
                <span className={'select-platform-title'}>{ILocal('connect_a_wallet')}</span>
                <img src={ic_close} className={'select-platform-title-close'}/>
            </div>
            <div className={'select-platform-item'} onClick={async () => {
                if (typeof window.ethereum !== 'undefined') {
                    console.log('Metamask is installed!');
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    const address = accounts[0];
                    console.log(address);
                } else {
                    // window.ethereum.request({ method: 'eth_requestAccounts' });

                }

            }}>
                <span className={'select-platform-item-title'}>MetaMask</span>
                <img src={ic_connect_metamask} className={'select-platform-item-icon'}/>
            </div>
            <div className={'select-platform-item'} onClick={() => {

            }}>
                <span className={'select-platform-item-title'}>MetaMask</span>
                <img src={ic_connect_crescent} className={'select-platform-item-icon'}/>
            </div>
        </div>
    );
}
