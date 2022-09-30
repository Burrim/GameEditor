export default function advancedCompare(value1,value2){
    //Checks the datatypes of given values
    let type1 = typeof value1
    let type2 = typeof value2
    
    if(type1 == 'object' && Array.isArray(value1)) type1 = 'array'
    if(type2 == 'object' && Array.isArray(value2)) type2 = 'array'

    if(type1 != type2) return false //returns false if the 2 given values have different types

    switch(type1){
        case 'string': case 'number': case 'boolean':
            if(value1 == value2) return true
            else return false
        
        case 'object': case 'array':
            let arr1 = Object.values(value1)
            let arr2 = Object.values(value2)

            for(let i = 0; i < arr1.length; i++){
                if (!advancedCompare(arr1[i],arr2[i])) return false
            }

            return true //returns true when no array segments report a missmatch
    }
    
}