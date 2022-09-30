//Controls if a specific element is below the mouse cursor

export default function checkHover(key){
    let bool = false
    let elements = document.querySelectorAll(":hover")
    for(let i = 0; i < elements.length; i++){
        if(elements[i].id == key){
            bool = true
            break;
        }
    }
    return bool
}