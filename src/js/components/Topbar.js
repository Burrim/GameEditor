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

    //Triggers function when clicking on topbar element. The Type of the topbar determines the kind of effect activated. type "special" has no general function and instead a special case defined vor every element.
    trigger = (e) => {
        switch(this.props.type){
            case 'menu':
                menuControl(e.target.id.slice(7))
            break;
            case 'tools':
                changeTool(e.target.id.slice(7))
            break;

            case 'special':
                switch(e.target.id.slice(7)){
                    case 'structure':
                        if(Structures.scene.isSleeping()){
                            Structures.scene.wake()
                            document.getElementById('Topbar-structure').parentNode.style.backgroundColor = 'red'
                        }
                        else{
                            Structures.scene.sleep()
                            document.getElementById('Topbar-structure').parentNode.style.backgroundColor = 'transparent'
                        }
                    break;
                    case 'plan':{
                        if(!World.map.plan) return
                        if(World.map.plan.visible){
                            document.getElementById('Topbar-plan').parentNode.style.backgroundColor = 'transparent'
                            World.map.plan.setVisible(false)
                        }
                        else{
                            document.getElementById('Topbar-plan').parentNode.style.backgroundColor = 'red'
                            World.map.plan.setVisible(true)

                        }
                    }
                    case 'preview':
                        if(World.activeTool == 'preview'){
                            changeTool(this.savedTool)
                            document.getElementById('Topbar-preview').parentNode.style.backgroundColor = 'transparent'
                        }
                        else{
                            this.savedTool = World.activeTool
                            changeTool('preview')
                        }
                    break;
                    case 'cords':
                        if(World.chunkCover.visible){
                            document.getElementById('Topbar-cords').parentNode.style.backgroundColor = 'transparent'
                            World.chunkCover.setVisible(false)
                        }
                        else{
                            document.getElementById('Topbar-cords').parentNode.style.backgroundColor = 'red'
                            World.chunkCover.setVisible(true)
                        }

                    break;
                }
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

