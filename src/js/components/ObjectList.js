import React from 'react'
import ObjectEntry from './ObjectEntry'
import checkHover from '../utils/checkHover'

import './Menustyle.css'

//--------------

export default class ObjectList extends React.Component {
    constructor(props){
        super(props)
        window[props.id] = this //creates global available reference
        this.active = props.active
        this.state = {
            selected:null, //Index of currently selected child
        }
        this.update = this.update.bind(this)
        this.elements = props.elements
    }

    /*Construction ----------------------------------------------------------------------

    following props needs  to be provided: 

    id: String that determines reference name of Component as well as that of its children
    elements: Array that is used as source for the creation of child elements

    ------------------------------------------------------------------------------------*/

    //Highlights the selected child and sends an Event with the key "{this.props.id}Select"
    select = (e) => {
        if(e == undefined) return{}
        
        //Reads selected ID. If function is used without arguments (without an event) selection is reset
        let id;
        if(e) id = parseInt(e.target.id.slice(this.props.id.length))
        else id = undefined
        if (id == NaN) id = undefined //Catches exception when event is fired while clicking on an extender

        this.y = 0
        World.wheelListener = addEventListener('wheel', (event)=> {
            if(checkHover('ObjectList')){
                this.y -= event.deltaY/5
                document.getElementsByClassName('entryContainer')[0].style.transform = `translate(0,${this.y}px)`
            }
        });

        //Sets selected ID
        this.setState({ selected : id}, 
        //Followup Function : adjusts the styling of the component to reflect the selection
        () =>{
            for(let i = 0; i < this.elements.length; i++){
                if(this.state.selected == i){
                document.getElementById(`${this.props.id + i}`).style.borderLeft = '20px solid rgb(192, 70, 70)'
                document.getElementById(`${this.props.id + i}`).style.backgroundColor = 'rgb(66, 66, 66)'
            }
                else if(!this.elements[i].editorData.invisible) {
                document.getElementById(`${this.props.id + i}`).style.borderLeft = '25px solid rgb(77, 77, 77)'
                document.getElementById(`${this.props.id + i}`).style.backgroundColor = 'rgb(77, 77, 77)'
            }
        }
        if(id != undefined)
        document.dispatchEvent(this.event)
        })
        
    }

    update(){
        this.forceUpdate()
    }

    setActive(input){
        this.active = input
        this.forceUpdate()
    }

    render(){
        
        if(this.active == false)
        return(<div></div>)

        

        if(this.event == undefined) //creates event for selection
        this.event = new Event(`${this.props.id}Select`)
            return(
                <div style={{overflow:'hidden'}}>
                <div className='mainContainer' id={this.props.id}>
                    <div className='header'> {this.props.title} </div>
                    <div className='entryContainer'>
                        <div>{
                            this.elements.map((element, index) => (
                                <ObjectEntry
                                data = {element}
                                key = {index} 
                                id = {index} 
                                parentId = {this.props.id}
                                select = {this.select}
                            />))}
                        </div>
                    </div>
                </div>
                </div>
            )
        
    }
}
