
const frame = 1000/60

/* window.addEventListener('contextmenu', function (e) { 
  e.preventDefault(); 
}, false); */   

// Ich hab ka, scheint aber nichts zu machen

//window.dispatchEvent(new Event('resize')); //Löst ein Event aus, als ob die grösse des Fensters verändert wurde. wahrscheinlich unnötig

const sizeOf = require('image-size')
const fs = require('fs');
const fse = require('fs-extra')
const customTitlebar = require('custom-electron-titlebar');
const {dialog} = require('electron').remote;

new customTitlebar.Titlebar //Erstellt Custom Toolbar, die besser aussieht als electron default
({
    backgroundColor: customTitlebar.Color.fromHex('#444'),
    shadow: true,
    icon: "assets/ui/logo.png"
}); 



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    scale: 
    {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#222222",
    scene: [Setup, Tileset,World],
    parent: 'parent',
    input: { gamepad: false},
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }, 
        debug: false
      }
    }
  };
  
  const game = new Phaser.Game(config);

  

