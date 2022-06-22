/* 
* Map Component.
*
* This component is used to fetch the latitude and longitude of current location.
*
*/
import React, { Component } from "react";
import { GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import * as Constants from "../../helpers/constants";

import CurrentLocation from "./Map";

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: "",
    latitude: "",
    longitude: ""
  };

  componentDidMount() {
    this.fetchLatitudeLongitude();
  }

  /* Used to fetch the latitude and longitude of current location. */
  fetchLatitudeLongitude() {
    let myApiKey = Constants.GOOGLE_MAP;
    let lat = "";
    let lng = "";

    fetch(
      Constants.MAP_GEO_URI + myApiKey,
      {
        method: "POST"
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let data = JSON.parse(JSON.stringify(responseJson));
        lat = data.location.lat;
        lng = data.location.lng;

        this.setState({
          latitude: lat,
          longitude: lng
        });
      });
  }

  /* Handles the api to fetch the address of location and manages event the show the details in popup. */
  onMarkerClick = (props, marker, e) => {
    let myApiKey = Constants.GOOGLE_MAP;

    let lat = this.state.latitude;
    let lng = this.state.longitude;
    let Address = "";

    fetch(
      Constants.MAP_ADD_URI +
      lat +
      "," +
      lng +
      "&key=" +
      myApiKey
    )
      .then(response => response.json())
      .then(responseJson => {
        let data = JSON.parse(JSON.stringify(responseJson));
        Address = data.results[0].formatted_address;

        this.setState({
          selectedPlace: Address,
          activeMarker: marker,
          showingInfoWindow: true
        });
      });

  };

  /* Handles the close event of info window popup*/
  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {

    return (
      <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
        <Marker onClick={this.onMarkerClick} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4 style={{ fontSize: '12px' }}>{this.state.selectedPlace}</h4>
          </div>
        </InfoWindow>
      </CurrentLocation>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_MAP
})(MapContainer);
