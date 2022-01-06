import * as React from 'react';
import './App.css';


import SelectionColumn from './SelectionColumn.js'
import MapEntry from './MapEntry';



function App() {
  
  return (
    <div className="App">
      <SelectionColumn id='MapList' elements={window.mapList}/>
    </div>
  );
}

export default App;
