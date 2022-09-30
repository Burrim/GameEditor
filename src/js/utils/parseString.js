export default function(string){
    
    if(!isNaN(parseInt(string))) return parseInt(string)
    if(string == 'true') return true
    if(string == 'false') return false
    return string
}