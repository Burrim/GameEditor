
    //--- Creates Animations -------------
    global.anims = {}
    Object.keys(files.editorSprites).forEach(dir =>{
      Object.keys(files.editorSprites[dir].config).forEach(key =>{
        let config = files.editorSprites[dir].config[key]
        if(config.animation == undefined || config.animation == {}) return;

        //Creates object to insert out of config data and handles edge cases
        let anim = config.animation

        if(anim.frames == undefined) anim.frames = `${dir}-${key}`
        anim.duration = config.animation.duration * frame
        anim.key = `${dir}-${key}`

        global.anims[`${dir}-${key}`] = this.anims.create(anim)
      })
    })