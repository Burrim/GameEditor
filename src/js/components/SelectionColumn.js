import React from 'react'
import MapEntry from './MapEntry'

import './SelectionColumn.css'

//--------------

class SelectionColumn extends React.Component {
    constructor(){
        super()
        this.state = {
            selected:null, //Index of currently selected child
        }
        this.update = this.update.bind(this)
        this.elements = window.reactData
    }

    /*Construction ----------------------------------------------------------------------

    following props needs  to be provided: 

    id: String that determines reference name of Component as well as that of its children
    elements: Array that is used as source for the creation of child elements

    ------------------------------------------------------------------------------------*/

    //Highlights the selected child and sends an Event with the key "{this.props.id}Select"
    select = (e) => {
        this.setState({selected : parseInt(e.target.id.slice(this.props.id.length))}, () =>{
            for(let i = 0; i < this.elements[this.props.dataReader].length; i++){
                if(this.state.selected == i){
                document.getElementById(`${this.props.id + i}`).style.borderLeft = '20px solid rgb(192, 70, 70)'
                document.getElementById(`${this.props.id + i}`).style.backgroundColor = 'rgb(66, 66, 66)'
            }
                else {
                document.getElementById(`${this.props.id + i}`).style.borderLeft = '25px solid rgb(77, 77, 77)'
                document.getElementById(`${this.props.id + i}`).style.backgroundColor = 'rgb(77, 77, 77)'
            }
        }
        document.dispatchEvent(this.event)
        })
    }

    update(){
        this.forceUpdate()
    }

    render(){ 

        window[this.props.id] = this //creates global available reference

        if(this.event == undefined) //creates event for selection
        this.event = new Event(`${this.props.id}Select`)

        return (
            <div className='mainContainer' id={this.props.id}>
                <div className='header'> {this.props.title} </div>
                {this.elements[this.props.dataReader].map((element, index) => (
                <MapEntry 
                    name = {element} 
                    key = {index} 
                    id = {index} 
                    parentId = {this.props.id}
                    select = {this.select}
                />))}
            </div>
        )
    }
}

export default SelectionColumn