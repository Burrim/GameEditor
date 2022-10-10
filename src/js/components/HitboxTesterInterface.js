import React from 'react'
import DropdownMenu from './DropdownMenu'
import changeTool from '../functions/changeTool'
import loadData from '../functions/loadData'

import "./Menustyle.css"
import "./HitboxTesterInterface.css"

/*
Displays Animations and hitboxes with a quick reload to test any changes and finetune hitbox parameters. For the time being doesn't support hitboxes that stay longer than the duration of the 
Animation. If this needs to be fixed it might be necessary to track any started animations or hitboxes and track each for when theire done instead of only the main Animation.
*/

export default class HitboxTesterInterface extends React.Component {
    constructor(props){
        super(props)
        window.HitboxTester = this
        this.active = false
        
        this.hitboxPlaceholder = {
            attached:World.animDoll,
            taskList: [],
        }

        this.update = this.update.bind(this)
    }

    /*Construction ----------------------------------------------------------------------

    ------------------------------------------------------------------------------------*/

    //Highlights the selected child and sends an Event with the key "{this.props.id}Select"
   
    update(){
        this.forceUpdate()
    }
    setActive(input){
        this.active = input
        this.forceUpdate()
    }
    selectDummy(){
        changeTool('placeDummy')
    }
    loop(){
        //Gets called when animDoll finishes an animation
        if(document.getElementById('AnimationLoop').checked)
        this.startAnimation()
    }
    startAnimation(init){
        if(World.animDoll == undefined) return

        
        if(init !== true){
            World.animDoll.allowPlaying = true
            World.animDoll.finished = false
            document.getElementById('currentFrame').innerHTML = 1
        } //Initializes Aniamtion but without the permission to go full loop

        if(AnimationSelection.selected != 'None')
        World.animDoll.sprite.play(AnimationSelection.selected)

        if(HitboxSelection.selected != 'None'){
            HC.spawnHitbox({
                attached: World.animDoll,
                taskList : files.hitboxes[HitboxSelection.selected].list
            })
            //If hitbox config contains config for a slash animation this will be played as well
            if(files.hitboxes[HitboxSelection.selected].slash){
                World.animDoll.slashSprite
                .setVisible(true)
                .setScale(files.hitboxes[HitboxSelection.selected].slash.x,files.hitboxes[HitboxSelection.selected].slash.y)
                .setAngle(90)
                .play(files.hitboxes[HitboxSelection.selected].slash.key)
            }
        }
    }
    step = () => {
        if(!World.animDoll.sprite.anims.hasStarted || World.animDoll.finished ){
            World.animDoll.finished = false
            this.startAnimation(true)
            document.getElementById('currentFrame').innerHTML = 1
        } 
        
        if(World.animDoll) World.animDoll.allowPlaying++

    }

    render(){

        if(!this.active) return (<div></div>)

        return(
            <div className='mainContainer' id='HitboxTester'>
                <div className='header'> Hitbox Tester </div>

                <div style={{display:'flex',flexDirection:'row',margin:"20px", alignItems:'center'}}>
                <button onClick={this.startAnimation} id='hitboxStart' style={{margin:"5px"}}>Start</button>
                <label>Loop </label>
                <input type="checkbox" id='AnimationLoop'></input>
                </div>

                <div style={{display:'flex',flexDirection:'row',margin:"20px",alignItems:'center'}}>
                    <label>Frame: </label>
                    <span id='currentFrame'>0</span>
                    <img src={files.editorGraphics.left} style={{margin:"5px"}}></img>
                    <img onClick={this.step} src={files.editorGraphics.right} style={{margin:"5px"}}></img>
                </div>

                <div style={{display:'flex',flexDirection:'row'}}>
                    <label>Animation: </label>
                    <DropdownMenu id='AnimationSelection' elements={Object.keys(World.animations)} key="animation"/>
                </div>

                <div style={{display:'flex',flexDirection:'row'}}>
                    <label>Hitbox: </label>
                    <DropdownMenu id='HitboxSelection' elements={Object.keys(files.hitboxes)} key="hitbox"/>
                </div>

                <img src={files.editorGraphics.object} style={{height:"64px",margin:'30px'}} onClick={this.selectDummy}></img>
                <img onClick={function(){loadData({target:'hitboxes', dir:'src/assets/hitboxInstructions'})}} src={files.editorGraphics.redo}></img>

               
                
            </div>
        )
        
    }
}
