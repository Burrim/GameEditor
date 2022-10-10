
//Function for opening or closing menu elements. 
//Calling the function with the key of the desired menu toggles its visibility and sets the corresponding button

export default function menuControl(key){
    //Close
    if(window[key].active){
        window[key].setActive(false)
        
        if(key == 'tilesetSelector'){
            document.getElementById('tilesetWindow').style.display = 'none'
        }
    }
    //Open 
    else{
        window[key].setActive(true)

        if(key == 'ObjectList'){
            //Checks for mouse wheel inputs and then when the mouse is hovering over the element scrolls it
            
        }
    } 
}