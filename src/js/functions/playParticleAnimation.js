import reactivateInactive from "./reactivateInactive"

export default function playParticleAnimation(x,y,animation,duration,tint){
    //Creates Container Array if not already present for maximum modularity
    if(World.animParticle == undefined) World.animParticle = [] 

    //Tries to fetch inactive Sprite. If no can be found a new one is created
    let container = reactivateInactive(World.animParticle,x,y,'animParticle') 

    if(!container){
        container = World.add.sprite(x,y,'props-placeholder')
        container.type = 'animParticle'
        container.disable = function(){
            this.setActive(false).setVisible(false)
            console.log('the disable') 
        }
    }

    if(tint != undefined) container.setTint(tint)
    else container.clearTint()

    container.play(animation)

    World.time.delayedCall(duration,function(){
        this.disable()
    },null,container)
   
}