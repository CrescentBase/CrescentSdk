import ConfigContext from './ConfigContext'
import React, {useState} from 'react'

export default (props)=>{
    const [mainVisible, setMainVisible] = useState(true);

    return(
        <ConfigContext.Provider value={{...props.config, mainVisible, setMainVisible}}>
            { props.children }
        </ConfigContext.Provider>
    )
}

