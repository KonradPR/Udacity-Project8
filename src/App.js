import React, { Component } from 'react';
import './App.css';
import Map from './mapProto';



class App extends Component {

  state ={
    landmarks: [
      {id:1, lat:35.685360,lng:139.753372,name:"Imperial Palace",},
      {id:2, lat:35.656830,lng:139.768496,name:"Tsukiji Fish Market",},
      {id:3, lat:35.658581,lng:139.745438,name:"Tokyo Tower",},
      {id:4, lat:35.689830,lng:139.739163,name:"Yasukuni Shrine",},
      {id:5, lat:35.681382,lng:139.766083,name:"Tokyo Station",},
    ],
  }

  render() {
    return (
    <div>

      <Map
      landmarks={this.state.landmarks}/>

    </div>
    );
  }
}

export default App;
