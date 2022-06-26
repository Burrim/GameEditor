//Generic Loader Function for dynamically Loading Data in to the Project via node file system

export default function loadData(config){

    /* 
    --- Config ---
    target = name of array in files object eg "particles"
    dir = target directory relative to "src" folder of project
    nested(optional) = Can be defined if files shouldn't be saved directly to the files object but one level higher
    */
   
if(!files[config.target]) files[config.target] = {} //Creates empty file object if not already present

if(config.nested != undefined && !files[config.target][config.nested]) files[config.target][config.nested] = {}

//Checks Directory for Files
let keys = fs.readdirSync(path+"/src/" + config.dir)

//Load individual Files
keys.forEach(key => {
  let file
  if(key.charAt(key.length-1) == 'g'){ //Checks if file is json or image depending on the last char in the key string
    //Loading png/jpg
    file = fs.readFileSync(path + "/src/" + config.dir + "/" + key, 'base64')
    file = "data:image/png;base64, " + file 
  }
  else{
    //Loading json
    file = JSON.parse( fs.readFileSync(path+ "/src/" + config.dir + '/' + key))
  }
  
 
  //Filters file endings
  if(config.nested == undefined)
  files[config.target][key.replace(/.(png|jpg|jpeg|json)/,'')] = file
  else {
    files[config.target][config.nested][key.replace(/.(png|jpg|jpeg|json)/,'')] = file 
  }

  return files[config.target]
})
}