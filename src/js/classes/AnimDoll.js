import Phaser from "phaser";

//Container Object for everything needed to display animation and hitbox tests

export default class AnimDoll extends Phaser.GameObjects.Container{
    constructor(x,y){
        super(World,x,y)

        World.add.existing(this)
        this.allowPlaying = 0
        this.finished = false;

        this.sprite = World.add.sprite(0,0,"object")
        this.slashSprite = World.add.sprite(0,0,"object").setVisible(false)

        this.sprite.on('animationcomplete', ()=>{
            this.finished = true
            this.allowPlaying = 0
            HitboxTester.loop()

        })

        this.slashSprite.on('animationcomplete', function(){
            this.setVisible(false)
        })

        this.add([this.sprite,this.slashSprite])

        this.updateEvents = []
        World.updateEvents.push(this.update)
    }
    update = () =>{
        if(!this.allowPlaying){
            this.sprite.anims.pause()
            this.slashSprite.anims.pause()
            return
        } 
        else{
            this.sprite.anims.resume()
            this.slashSprite.anims.resume()
        }
        document.getElementById('currentFrame').innerHTML = parseInt(document.getElementById('currentFrame').innerHTML)+1
        this.updateEvents.forEach(event =>{event()})
        if(this.allowPlaying !== true) this.allowPlaying--
    }
}