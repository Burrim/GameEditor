import React from 'react'
import ReactDOM from 'react-dom'

import DataEditor from './js/components/DataEditor.js'
import utilsInit from './js/utils/utils-init.js'

utilsInit()

  
window.renderData = (data) => {
    window.elements = []
    window.name = data.text
    console.log(data)
    ReactDOM.render(
        <DataEditor input={data}/>
    ,document.getElementById('source'))
}

renderData(window.data)