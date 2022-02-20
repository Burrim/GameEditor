import React from 'react'
import './DataEditor.css'

export default class DataEditor extends React.Component {
    constructor(){}
    render(){
        //Filters all Data that isn't further encased in further objects
        let singleEntries = []
        Object.keys(this.props.input.data).forEach(key => {
            if(typeof this.props.input.data[key] != 'object')
            singleEntries.push({
                name: key,
                value: this.props.input.data[key]
            }) 
        });


        return(
            <div>
            <div className='title'>{this.props.input.name}</div>
            {
                singleEntries.map((element,index) => (
                    <DataEntry id={index} data={element}/>
                ))
            }
            </div>
        )
    }
}

class DataEntry extends React.Component {
    constructor(){}
    render(){
        return(
            <div>

            </div>
        )
    }
}