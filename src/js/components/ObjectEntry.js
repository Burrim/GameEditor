import React from 'react'
import './ObjectEntry.css'

class ObjectEntry extends React.Component {
    constructor(props){
        super(props)
    }

    expand = () => {
        //De Expands children list
        if(this.props.data.editorData.expanded){
            this.props.data.editorData.expanded = false
            this.props.data.relation.children.forEach(child => {
                child.editorData.invisible = true
            });
        } else{
            //Expands children list
            this.props.data.editorData.expanded = true
            this.props.data.relation.children.forEach(child => {
                child.editorData.invisible = false
            });
        }
        ObjectList.update()
    }
    
    render(){
        let expanderClass = 'entryNoExpander'
        if(this.props.data.editorData.expanded === true) expanderClass = "entryActiveExpander"
        else if(this.props.data.editorData.expanded === false) expanderClass = "entryInactiveExpander"
        
        if(this.props.data.editorData.invisible) return(<div></div>)

        else return(
            <div className='entryBody' id={this.props.parentId + JSON.stringify(this.props.id)}  onClick={this.props.select}>
                <img className='entryImg' src={files.editorSprites[this.props.data.editorData.img]} id={this.props.parentId + JSON.stringify(this.props.id)}  onClick={this.props.select}/>
                <label className='entryLabel' id={this.props.parentId + JSON.stringify(this.props.id)}  onClick={this.props.select}> {this.props.data.name} </label>
                <img className={[expanderClass]} src={files.editorSprites.expander}  onClick={this.expand}/>
            </div>
        )
    }
}

export default ObjectEntry