import React, { Component } from "react";

class LocationList extends Component {
//Constructor
  constructor(props) {
    super(props);
    this.state = {
      locations: "",
      query: "",
      suggestions: true
    };

    this.searchLocations = this.searchLocations.bind(this);
  }

//Search the location
  searchLocations(event) {
    this.props.closeInfoBox();
    const { value } = event.target;
    var locations = [];
    this.props.locations.forEach(function(location) {
      if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      locations: locations,
      query: value
    });
  }

  componentWillMount() {
    this.setState({
      locations: this.props.locations
    });
  }

//render function
  render() {
    var locationlist = this.state.locations.map(function(listItem, index) {
      return (
        <Place
          key={index}
          openInfoBox={this.props.openInfoBox.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <div className="search-field">
        <input
          role="search"
          aria-labelledby="search"
          id="search-field"
          className="search-input"
          type="text"
          placeholder="search"
          value={this.state.query}
          onChange={this.searchLocations}
        />
        <ul className="location-list">
          {this.state.suggestions && locationlist}
        </ul>
      </div>
    );
  }
}

class Place extends React.Component {

  render() {
    return ( <li role = "button"
      className = "place"
      tabIndex = "0"
      onKeyPress = {
        this.props.openInfoBox.bind(
          this,
          this.props.data.marker
        )
      }
      onClick = {
        this.props.openInfoBox.bind(this, this.props.data.marker)
      } >
      {
        this.props.data.longname
      } <
      /li>
    );
  }
}
export default LocationList;
