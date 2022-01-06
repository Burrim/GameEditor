import React from 'react'
import './MapEntry.css'

class MapEntry extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className='entryBody' id={this.props.parentId + JSON.stringify(this.props.id)}  onClick={this.props.select}>
                {this.props.name}
            </div>
        )
    }
}

export default MapEntry