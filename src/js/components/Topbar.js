import React from 'react'
import './Topbar.css'

export default class Topbar extends React.Component {
    constructor(props){
        super(props)
    }

    
    render(){
        console.log(this.props)
        return(
            <div id='Topbar-Body'>
                {this.props.elements.map(element => {
                    return(
                    <img src={files.editorGraphics[element.texture]}></img>
                    )
                })}
            </div>
        )
    }
}

