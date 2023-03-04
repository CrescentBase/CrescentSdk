import ConfigContext from './ConfigContext'
import React, {useState} from 'react'

export default (props)=>{
    return(
        <ConfigContext.Provider value={{...props.config}}>
            { props.children }
        </ConfigContext.Provider>
    )
}

