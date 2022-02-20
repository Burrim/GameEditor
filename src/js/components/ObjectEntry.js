import React from 'react'
import './ObjectEntry.css'

class ObjectEntry extends React.Component {
    constructor(props){
        super(props)
    }
    
    render(){
        return(
            <div className='entryBody' id={this.props.parentId + JSON.stringify(this.props.id)}  onClick={this.props.select}>
                <img className='entryImg' src={this.props.img} id={this.props.parentId + JSON.stringify(this.props.id)}  onClick={this.props.select}/>
                <label className='entryLabel' id={this.props.parentId + JSON.stringify(this.props.id)}  onClick={this.props.select}> {this.props.name} </label>
            </div>
        )
    }
}

export default ObjectEntry