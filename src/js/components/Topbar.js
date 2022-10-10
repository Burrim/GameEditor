import React from 'react'
import './Topbar.css'
import menuControl from '../functions/menuControl'
import changeTool from '../functions/changeTool'

export default class Topbar extends React.Component {
    constructor(props){
        super(props)
        window[`topbar${props.type}`] = this
    }

    resetSelection(){
        this.props.elements.forEach(element =>{
            document.getElementById(`Topbar-${element.key}`).parentNode.style.backgroundColor = 'transparent'

        })
    }


    trigger = (e) => {
        switch(this.props.type){
            case 'menu':
                menuControl(e.target.id.slice(7))
            break;
            case 'tools':
                changeTool(e.target.id.slice(7))
            break;
        }
    }
    
    render(){
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

