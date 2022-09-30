import reactivateInactive from "../functions/reactivateInactive";

const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules

export default class HitboxController{
    constructor(){
        
        this.list = []
    }
    spawnHitbox(config,mod){
        let hitbox// = reactivateInactive(this.list)
        if(!hitbox){
            hitbox = new Hitbox(this,config,mod)
        }
    }
}

class Hitbox{
    constructor(parent,config,mod){

        this.active = true
        this.parent = parent
        this.id = assignId()
        this.config = config
        if(mod) this.config = Object.assign(mod)

        this.trueScale = {x:1,y:1} //Gets referenced when scaling the body as matter doesn't remember how much it has scaled already

        this.taskList = cloneDeep(config.taskList)
        this.body = World.matter.add.circle(1400, 260, 32,{
            isStatic: true,
            isSensor:true,
        })

        World.animDoll.updateEvents.push(this.runTask)
        parent.list.push(this)
    }

    despawn(){
        World.matter.world.remove(this.body)
        this.taskList = []
        this.active = false
    }

    runTask = () => {
        if(!this.active) return
        if(this.taskList.length == 0){
            this.despawn()
            return
        }
        //Executes Action when first running this task
        if(!this.taskList[0].initialized){

            //Puts Position relative to attached point
            if(this.config.attached) {
                this.taskList[0].position.x += this.config.attached.x
                this.taskList[0].position.y += this.config.attached.y
            }
            //Calculates scale needed to achieve target form
            if(this.taskList[0].scale){
                let targetValue = {x:this.taskList[0].scale.x, y:this.taskList[0].scale.y} //Needs to be saved externally since the original value will be modified
                this.taskList[0].scale.x /= this.trueScale.x; 
                this.taskList[0].scale.y /= this.trueScale.y;
                this.trueScale = targetValue
                Body.scale(this.body,this.taskList[0].scale.x,this.taskList[0].scale.y)
            }

            if(this.taskList[0].angle)  Body.setAngle(this.body,this.taskList[0].angle)
           
            Body.setPosition(this.body,this.taskList[0].position)

            this.taskList[0].initialized = true 
        }

        //Counts down instruction duration and removes it when reaching zero
        this.taskList[0].duration--
        if(this.taskList[0].duration == 0) this.taskList.shift()
    }

    collide({ bodyA, bodyB, pair }){
        if (bodyB.isSensor) return;
        if (this.config.ignore.includes(bodyB.gameObject.type)) return
        
        processHit(this,bodyB.gameObject)
    }
}

