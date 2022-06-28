export default function createParticle(config){
    global.particles = {}

    //Goes trough every file in the particles Folder
    Object.keys(files.particles).forEach(key => {

      let file = files.particles[key]

      let particle = {
          props: file.props,
          emitter:[],
          particleSrc:{},
          particles:[],
          animations: [],
          emit: function(x,y){
            this.particles.forEach(element =>{
              element.emitParticleAt(x,y)
            })
          }
      }
      
      //Goes trough every component inside the file 
      file.list.forEach(data => {

        //Creates Particles
        if(data.type == 'particle'){
          
        let config = Object.assign(data) //Copy Data to usable object

        //Seting up default Values
        config.on = false

        //translate Emit zone from json to usable config
        if(config.emitZone != undefined){
          config.emitZone = {
            source: new Phaser.Geom.Rectacle(config.emitZone.source[0],config.emitZone.source[1],config.emitZone.source[2], config.emitZone.source[3]),
            type : config.emitZone.type
        }}

        
        if(config.tint){
          eval(`config.tint =` + config.tint)
        }


        //Adding the phaser particle objects to the main container
        particle.particleSrc[config.id] = World.add.particles(config.texture)
        particle.particles.push(particle.particleSrc[config.id])
        particle.emitter.push(particle.particleSrc[config.id].createEmitter(config))
      
      }
        })
        global.particles[key] = particle

    })
    
}