import React, { Component } from 'react';
import PropTypes from 'prop-types';
var loadjs = require('loadjs');


class Map extends Component {

  static propTypes = {
    landmarks: PropTypes.array.isRequired,
  }

  state ={
    markers: [],
    map: "",
    infoWindow: "",
    query: "",
    showingMarkers: [],
    apiLoaded: false,
    weatherData: {},
  }

createMarker(data) {
  var marker = new window.google.maps.Marker ({
    map: this.state.map,
    position: {lat:data.lat,lng:data.lng},
    title:data.name,
    animation: window.google.maps.Animation.DROP,
    id: data.id,
  });
  this.state.markers.push(marker);
  this.state.showingMarkers.push(marker);
}


initMap() {
   this.state.map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat:35.6803471 ,lng:139.7603036},
    zoom: 13,
      });
    this.props.landmarks.map((landmark)=>{
      this.createMarker(landmark);
    })
    this.state.infoWindow = new window.google.maps.InfoWindow();
    this.setState({apiLoaded:true});
}

setMarkersVisibility() {
  this.state.markers.map(marker => marker.setVisible(false));
  this.state.showingMarkers.map(marker => marker.setVisible(true));
}

activateWindow(marker, iWindow) {
  marker.setAnimation(window.google.maps.Animation.BOUNCE);
  setTimeout(marker.setAnimation(null), 2000)
    if(iWindow.marker!==marker){
      iWindow.marker = marker;
      iWindow.setContent('<h3>'+ marker.title +'</h3>')
      iWindow.open(window.map,marker);
      iWindow.addListener('closeclick', function() {
        iWindow.marker = null;
});
    }
}

updateQuery(query) {
  if(query){
    this.setState({
      markers: this.state.markers,
      map: this.state.map,
      query: query,
      showingMarkers: this.state.markers.filter(marker => {
        let str = marker.title.substring(0,query.length);
        return str.toLowerCase()===query.toLowerCase();
      })
    })
  }else{
    this.setState({
      markers: this.state.markers,
      map: this.state.map,
      query: "",
      showingMarkers: this.state.markers,
    })
  }
}

componentDidMount() {
  window.initMap = this.initMap.bind(this);
    loadjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyA6KQkA-DUZQ0Pz4B7x-pSVwdv1DZpRKNA&v=3&callback=initMap');
    fetch('http://api.openweathermap.org/data/2.5/weather?q=Tokyo&APPID=d08860ecba20364095d791cd88bd0fa0&units=metric')
    .then(resp => resp.json())
    .then(resp=>{this.setState({weatherData: {
      temp: resp.main.temp,
      humidity: resp.main.humidity,
      wind: resp.wind.speed,
    }})})
  }


  render() {
      var activateWindow = this.activateWindow;
      var infoWindow = this.state.infoWindow;
      this.state.markers.map(marker => marker.addListener('click', function(){activateWindow(this,infoWindow)}))
    this.setMarkersVisibility();
    return(
      <div>
      <div id="map" role="application" tabIndex="-1" aria-label="location">
      </div>
      <ul className="listView">
      {this.state.showingMarkers.map((marker) =>(
        <li className="listView-element" onClick={()=>{activateWindow(marker,infoWindow)}} key={marker.id}>{marker.title}</li>
      ))}
      </ul>
        <input className="searchBar" type="text" placeholder="Search by landmark name" value={this.state.query} onChange={(event)=>{this.updateQuery(event.target.value)}}/>
        <div className="weatherDisplay">
        <h3 className="weatherDisplay-title">Weather in Tokyo</h3>
        <p className="weatherDisplay-info"><strong>Temperature: </strong>{this.state.weatherData.temp+'\xB0'+'C'}</p>
        <p className="weatherDisplay-info"><strong>Humidity: </strong>{this.state.weatherData.humidity+'%'}</p>
        <p className="weatherDisplay-info"><strong>Wind: </strong>{this.state.weatherData.wind+'m/s'}</p>
        </div>
      </div>
    );
  }
}

export default Map
