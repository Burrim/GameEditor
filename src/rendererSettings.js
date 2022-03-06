import React from 'react'
import ReactDOM from 'react-dom'

import DataEditor from './js/components/DataEditor.js'

  
window.renderData = (data) => {
    window.elements = []
    window.name = data.name
    console.log(data)
    ReactDOM.render(
        <DataEditor input={data}/>
    ,document.getElementById('source'))
}

renderData(window.data)