
//Function for opening or closing menu elements. 
//Calling the function with the key of the desired menu toggles its visibility and sets the corresponding button

export default function menuControl(key){
    //Close
    if(document.getElementById(key).style.display == 'block'){
        document.getElementById(key).style.display = 'none'
        document.getElementById('Topbar-'+key).parentNode.style.backgroundColor = 'transparent'
        
        if(key == 'tilesetSelector'){
            document.getElementById('tilesetWindow').style.display = 'none'
        }
    }
    //Open 
    else{
        document.getElementById(key).style.display = 'block'
        document.getElementById('Topbar-'+key).parentNode.style.backgroundColor = 'red'

        if(key == 'tilesetSelector'){
            document.getElementById('tilesetWindow').style.display = 'block'
        }

        if(key == 'objectSelector'){
           //gets initial coordinates of object selector
            window.objectListY = document.getElementsByClassName('entryContainer')[0].getClientRects()[0].height
            //Checks for mouse wheel inputs and then when the mouse is hovering over the element scrolls it
            World.wheelListener = addEventListener('wheel', function(event) {
            if(document.querySelectorAll( ":hover" )[4].id != 'objectSelector') return
            objectListY -= event.deltaY/5
            document.getElementsByClassName('entryContainer')[0].style.transform = `translate(0,${objectListY}px)`
  });
        }
    } 
}