export default function randomString(length){
    let characters = 'qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM'
    let string = ''
    for(let i = 0; i < length; i++){
        string += characters[Math.floor(Math.random()*characters.length)]
    }
    return string
}