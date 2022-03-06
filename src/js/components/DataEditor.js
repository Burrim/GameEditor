import React from 'react'
import './DataEditor.css'

export default class DataEditor extends React.Component {
    constructor(){
        super();
    }

    returnData(){
        let value = {
            name: name,
            data: {}
        }
        //Repacks the choosen values back to a usable object
        elements.forEach(element=>{
            if(element.type == 'var')
            value.data[element.name] = element.value
            else if(element.type == 'object'){
                value.data[element.name] = {}
                element.entries.forEach(entry=>{
                    value.data[element.name][entry.name] = entry.value
                })
            }
        })

        
        let returnObj = {
            customData : {},
            id : data.id
        } 
        Object.keys(value.data).forEach(key => {
            if(value.data[key] != data.data[key] )
            returnObj.customData[key] = value.data[key]
        })
        ipcRenderer.send('returnData', returnObj)
    }

    render(){
        //Filters all Data in either simple var or nested data in the form of objects and makes it readabable for the next component to render
        console.log(this.props.input.data)
        Object.keys(this.props.input.data).forEach(key => {
            if(typeof this.props.input.data[key] == 'object'){
                let obj = {
                    name: key,
                    entries : [],
                    type : 'object'
                }
                Object.keys(this.props.input.data[key]).forEach(objKey =>{
                    obj.entries.push({
                        name: objKey,
                        value: this.props.input.data[key][objKey],
                        valueType: typeof this.props.input.data[key][objKey]
                    })
                })
                elements.push(obj)

            } else {
                elements.push({
                    name: key,
                    value: this.props.input.data[key],
                    valueType: typeof this.props.input.data[key],
                    type: 'var'
                    
                }) 
            }
        });
        return(
            <div className='DataEditor-Body'>
            <input className='DataEditor-Title' defaultValue={this.props.input.name}/>
            {
                elements.map((element,index) => (
                    <DataEntry key={index} index={index} data={element}/>
                ))
            }
            <button className='DataEditor-Button' onClick={this.returnData}>Confirm</button>
            </div>
        )
    }
}


class DataEntry extends React.Component {
    constructor(){
        super()
    }

    changeValue = () => {
        //Data Readings vor var type components
        if(this.props.data.type == 'var'){
             
            elements[this.props.index].name = document.getElementsByClassName(`${this.props.index}`)[0].value,
            elements[this.props.index].value = document.getElementsByClassName(`${this.props.index}`)[1].value,
            elements[this.props.index].type = 'var'
            
            //Checks if the targeted value should be an integer and converts if necessary
            if( elements[this.props.index].valueType == 'number')
            elements[this.props.index].value = parseInt( elements[this.props.index].value )

        }
        //Data Readings for object type components
        else if(this.props.data.type == 'object') {
            for(let i = 0; i < elements[this.props.index].entries.length; i++){
                elements[this.props.index].entries[i].name = document.getElementsByClassName(`${this.props.index}`)[i*2].value
                elements[this.props.index].entries[i].value = document.getElementsByClassName(`${this.props.index}`)[i*2+1].value

                //Checks if the targeted value should be an integer and converts if necessary
                if(elements[this.props.index].entries[i].valueType == 'number')
                elements[this.props.index].entries[i].value = parseInt(elements[this.props.index].entries[i].value)

            }
        }
        console.log(elements)
    }

    render(){
        //Render single value
        if(this.props.data.type == 'var'){ return(
                <div className='DataEntry-Body'>
                <input className={`${this.props.index}`} defaultValue={this.props.data.name} onChange={this.changeValue}/>
                <input className={`${this.props.index}`} defaultValue={this.props.data.value} onChange={this.changeValue}/> 
                </div>
            )
        }
        //Renders nested values
        else if(this.props.data.type == 'object'){ return(
            <div className='DataEntry-Body'>
            <div className='DataEntry-Header'> {this.props.data.name} </div>
            {this.props.data.entries.map((element,index) => (
                <div className='DataEntry-Container' key={index}>
                    <input className={`${this.props.index}`} defaultValue={element.name} onChange={this.changeValue}/>
                    <input className={`${this.props.index}`} defaultValue={element.value} onChange={this.changeValue}/> 
                </div>
            ))}
            </div>
        )
    }
        
    }
}