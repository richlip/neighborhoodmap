import React, {
    Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map'
import Sidebar from "./components/Sidebar";


class App extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            alllocations: require("./components/poi.json"),
            map: "",
            info: "",
            markers: ""
        };

        this.initMap = this.initMap.bind(this);
        this.generateMarkers = this.generateMarkers.bind(this);
        this.openMarker = this.openMarker.bind(this);
//        this.openInfoWindow = this.openInfoWindow.bind(this);
//        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyCnx_1AtdIREVDeTT9IsCMp5k9pCA1W17Q&callback=initMap');
    }

    initMap() {
        let map;
        map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {
                lat: 48.137154,
                lng: 11.576124
            }
        });

        var infowindow = new window.google.maps.InfoWindow({});



        this.setState({
            map: map,
            info: infowindow
        });
        this.generateMarkers(map);
    }

    generateMarkers(map) {
        let self = this;

        this.state.markers.forEach(marker => {
            const loc = {
                lat: marker.lat,
                lng: marker.long
            }

            let mark = new window.google.maps.Marker({
                position: loc,
                map: map,
                title: marker.name
            });

            mark.addListener('click', function() {
                self.openMarker(mark);
            });

            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({
                virtualMarkers: virtMarker
            });
        });
    }


    openMarker(marker = '') {
        const clientId = "PDJ4XZ2YTAGJTQIFGF4WUIY02B4TLZ5LFST1SG25XWWSXQ4M";
        const clientSecret = "K3MVN4PU0KANIZBYBNT0Q4QYT1LV50IOK45JDCHBWLUA4MZD";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";


        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function() {
                this.state.info.setMarker(null);
            });

            this.markerInfo(url);
        }
    }

    markerInfo(url) {
        let self = this.state.info;
        let place;
        fetch(url)
            .then(function(resp) {
                if (resp.status !== 200) {
                    const err = "Can't load data.";
                    this.state.info.setContent(err);
                }
                resp.json().then(function(data) {
                    var place = data.response.venues[0];
                    let phone = '';

                    if (place.contact.formattedPhone) {
                        phone = "<p><b>Phone:</b> " + place.contact.formattedPhone + "</p>";
                    }

                    let twitter = '';

                    if (place.contact.twitter) {
                        twitter = "<p><b>Phone:</b> " + place.contact.twitter + "</p>";
                    }

                    var info =
                        "<div id='marker'>" +
                        "<h2>" + self.marker.title + "</h2>" +
                        phone +
                        twitter +
                        "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
                        "</div>";
                    self.setContent(info);
                });

                console.log(place);
            })
            .catch(function(err) {
                const error = "Can't load data.";
                self.setContent(error);
            });

    }





    render() {
        return ( <div>
            		<header>
            			<Sidebar>
            infoWindow = {
                this.state.info
            }
            openInfo = {
                this.openMarker
            }
            virtualMarker = {
                this.state.virtualMarkers
            } 
            			</Sidebar>  
          <h1 id = "title" > my munich < /h1> <
            /header>

            <
            Map markers = {
                this.state.markers
            } > < /Map>  <
            /div>
        );
    }
}

function createMapLink(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');

    script.src = url;
    script.async = true;
    script.onerror = function() {
        document.write("Google Maps can't be loaded");
    };
    tag.parentNode.insertBefore(script, tag);
}

export default App;