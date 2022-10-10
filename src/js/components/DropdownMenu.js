import React from "react";
import "./DropdownMenu.css"

import checkHover from "../utils/checkHover";

export default class DropdownMenu extends React.Component{
    constructor(props){
        super(props)
        window[props.id] = this
        this.id = assignId()
        this.elements = props.elements
        this.elements.unshift('None')
        this.selected = 'None'

        //Checks if somewhere outside of the dropdown was clicked and closes it
        window.onclick = function(event) {
            if (!event.target.matches('.dropdownScroll') && !event.target.matches('.dropbtn') ) {
              var dropdowns = document.getElementsByClassName("dropdownScroll");
              for (let i = 0; i < dropdowns.length; i++) {
                if(dropdowns[i].style.display == 'block')
                dropdowns[i].style.display = 'none'
              }
            }
        }

        this.y = 0
        addEventListener('wheel', (event)=> {
            if(checkHover(`container${this.id}`)){
                this.y -= event.deltaY/5
                document.getElementById(`contents${this.id}`).style.transform = `translate(0,${this.y}px)`
            }
        });
    }
    expand = () => {
        document.getElementById(`container${this.id}`).style.display = 'block'
        this.open = true
    }
    close = () => {
        document.getElementById(`container${this.id}`).style.display = 'none'
        this.open = false
    }
    select(key){
        this.selected = key
        this.close()
        this.forceUpdate()
    }
    render(){
        return(
            <div>
                <div onClick={this.expand} className='dropbtn'>{this.selected}</div>
                <div className="dropdownScroll" id={`container${this.id}`}>
                    <div className="dropdownContent" id={`contents${this.id}`}>
                        {
                            this.elements.map(key =>{
                                return(
                                    <div key={key} id={`dropdown${key}`} onClick={()=>{this.select(key)}} style={{color:'black'}}>{key}</div>
                                    )
                                })
                            }
                    </div>
                </div>
            </div>

        )
    }
}