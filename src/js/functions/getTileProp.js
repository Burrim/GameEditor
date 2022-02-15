
//Searches trough properties of a tile and return the desired value
const getTileProp = (arr, prop) => {
    let output
    for(let i = 0; i < arr.length; i++){
        if(arr[i].name == prop){
            output = arr[i].value
            break;
        }
    }
    return output
}

export default getTileProp