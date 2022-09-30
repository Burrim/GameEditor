import React from 'react'
import './DataEditor.css'

export default class DataEditor extends React.Component {
    constructor(){
        super();
    }

    returnData(){


        //Itterates trough every Object and writes the data back in to a useable object format
        let collectedValues = {}
        elements.forEach(element=>{
            //Reads simple var type elements
            if(element.type == 'var')
            collectedValues[element.name] = parseString(element.value)
            //reads nested object type elements
            else if(element.type == 'object'){
                collectedValues[element.name] = {}
                element.entries.forEach(entry=>{
                    collectedValues[element.name][entry.name] = parseString(entry.value)
                })
            }
        })

        let returnObj = {
            values : {},
            id : data.id
        }
        //Checks every value for change and writes all changed values in to an object that can be returned 
        Object.keys(collectedValues).forEach(key => {
            if(!advancedCompare(collectedValues[key],data.values[key])){ //Checks if there are any differences
                //Just writes the Data if it is a simple value
                if(typeof collectedValues[key] != 'object'){
                    returnObj.values[key] = collectedValues[key]
                }
                //Writes data in case of array (for now don't make special treatments for arrays)
                else if(Array.isArray()){
                    returnObj.values[key] = collectedValues[key]
                }
                //only write the necessary attributes in case of an object 
                else{
                    returnObj.values[key] = {}
                    Object.keys(collectedValues[key]).forEach(att =>{
                        if(collectedValues[key][att] != data.values[key][att])
                        returnObj.values[key][att] = collectedValues[key][att]
                    })
                }
                
            }
        })
        console.log(returnObj)
        ipcRenderer.send('returnData', returnObj)
    }

    render(){
        //Filters all Data in either simple var or nested data in the form of objects and makes it readabable for the next component to render
        console.log(this.props.input.values)
        Object.keys(this.props.input.values).forEach(key => {
            //If data is a nested Object
            if(typeof this.props.input.values[key] == 'object'){
                let obj = {
                    name: key,
                    entries : [],
                    type : 'object'
                }
                Object.keys(this.props.input.values[key]).forEach(objKey =>{
                    obj.entries.push({
                        name: objKey,
                        value: this.props.input.values[key][objKey],
                        valueType: typeof this.props.input.values[key][objKey]
                    })
                })
                elements.push(obj)

            } else {
                //if data is a single value
                elements.push({
                    name: key,
                    value: this.props.input.values[key],
                    valueType: typeof this.props.input.values[key],
                    type: 'var'
                    
                }) 
            }
        });
        return(
            <div className='DataEditor-Body'>
            <input className='DataEditor-Title' defaultValue={this.props.input.values.name}/>
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
        //Data Readings for var type components
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