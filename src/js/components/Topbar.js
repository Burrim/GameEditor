import React from 'react'
import './Topbar.css'
import menuControl from '../functions/menuControl'

export default class Topbar extends React.Component {
    constructor(props){
        super(props)
        window.topbar = this
    }

    trigger(e){
       console.log(e.target.id.slice(7))
       menuControl(e.target.id.slice(7))
    }
    
    render(){
        console.log(this.props)
        return(
            <div id='Topbar-Body'>
                {this.props.elements.map(element => {
                    return(
                    <div className='Topbar-Border' key={element.key}>
                        <img className='Topbar-Icon' id={`Topbar-${element.key}`} src={files.editorGraphics[element.texture]} onClick={this.trigger}></img>
                    </div>
                    )
                })}
            </div>
        )
    }
}

