//Generic Loader Function for dynamically Loading Data in to the Project via node file system

export default function loadData(config){

    /* 
    --- Config ---
    target = name of array in files object eg "particles"
    dir = target directory relative to "src" folder of project
    */
   
//Checks Directory for Files
let keys = fs.readdirSync(path+"/src/" + config.dir)
keys.forEach(key => {
  //Load individual Files
  let file = JSON.parse( fs.readFileSync(path+ "/src/" + config.dir + '/' + key))
 
  //Filters file endings
  files[config.target][key.replace(/.(json)/,'')] = file

  return files[config.target]
})
}