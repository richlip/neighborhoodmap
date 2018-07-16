import React, { Component } from "react";
import LocList from "./LocList";

class App extends Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      locations: [{
      "name": "Viktualienmarkt",
      "type": "public market",
      "latitude": 48.135114,
      "longitude": 11.576255
      }, {
      "name": "Turmstüberl",
      "type": "coffeeshop",
      "latitude": 48.134940,
      "longitude": 11.581787
      }, {
      "name": "Alter Peter",
      "type": "church",
      "latitude": 48.136495,
      "longitude": 11.576028
      }, {
      "name": "Bratwurstherzl",
      "type": "Restaurant",
      "latitude": 48.135388,
      "longitude": 11.577412
      }, {
      "name": "Schgneider Bräuhaus",
      "type": "Restaurant",
      "latitude": 48.136461,
      "longitude": 11.578361
      }],
      map: "",
      infobox: "",
      marker: ""
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
    this.openInfoBox = this.openInfoBox.bind(this);
    this.closeInfoBox = this.closeInfoBox.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadMapJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCnx_1AtdIREVDeTT9IsCMp5k9pCA1W17Q&callback=initMap"
    );
  }

  /**
   * Initialise the map once the google map script is loaded
   */
  initMap() {
    var self = this;

    var mapview = document.getElementById("map");
    mapview.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(mapview, {
      zoom: 16,
      center: {
        lat: 48.137154,
        lng: 11.576124
      },
      
      mapTypeControl: true
    });

    var InfoBox = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoBox, "closeclick", function() {
      self.closeInfoBox();
    });

    this.setState({
      map: map,
      infowindow: InfoBox
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoBox();
    });

    var locations = [];
    this.state.locations.forEach(function(location) {
      var longname = location.name + " - " + location.type;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener("click", function() {
        self.openInfoBox(marker);
      });

      location.longname = longname;
      location.marker = marker;
      location.display = true;
      locations.push(location);
    });
    this.setState({
      locations: locations
    });
  }

  /**
   * Open the infoBox for the marker
   * @param {object} location marker
   */
  openInfoBox(marker) {
    this.closeInfoBox();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.DROP);
    this.setState({
      prevmarker: marker
    });
    this.state.infowindow.setContent("Loading Data...");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);
  }

  /**
   * Retrive the location data from the foursquare api
   */
  getMarkerInfo(marker) {
    var self = this;

        const url = "https://api.foursquare.com/v2/venues/search?client_id=PDJ4XZ2YTAGJTQIFGF4WUIY02B4TLZ5LFST1SG25XWWSXQ4M&client_secret=K3MVN4PU0KANIZBYBNT0Q4QYT1LV50IOK45JDCHBWLUA4MZD&v=20130815&ll="
          + marker.getPosition().lat() + ", " + marker.getPosition().lng() + " & limit = 1 ";
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Sorry data can't be loaded");
          return;
        }

        // Get the text in the response
        response.json().then(function(data) {
          console.log(data);

          var location_data = data.response.venues[0];
          var place = `<h3>${location_data.name}</h3>`;
          var street = `<div>${location_data.location.formattedAddress[0]}</div>`;
          var plz = `<div>80331 München</div>`;
          var country = `<div>Deutschland</div>`;
           
          var More =
            '<a href="https://foursquare.com/v/' +
            location_data.id +
            '" target="_blank">Details on Foursquare</a>';
          self.state.infowindow.setContent(
            place + street + plz + country + More
          );
        });
      })
      .catch(function(err) {
        self.state.infowindow.setContent("Sorry data can't be loaded");
      });
  }

  /**
   * Close the info window previously opened
   *
   * @memberof App
   */
  closeInfoBox() {
    if (this.state.marker) {
      this.state.marker.setAnimation(null);
    }
    this.setState({
      prevmarker: ""
    });
    this.state.infowindow.close();
  }

  /**
   * Render for react
   */
  render() {
    return (
      <div>
        <LocList
          key="100"
          locations={this.state.locations}
          openInfoBox={this.openInfoBox}
          closeInfoBox={this.closeInfoBox}
        />
        <div id="map" />
      </div>
    );
  }
}

export default App;

/**
 * Load the google maps
 * @param {src} url of the google maps script
 */
function loadMapJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
