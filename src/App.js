import React, {Component} from 'react';
import './App.css';
/*axios is used to retrieve data from Foursquare*/
import axios from 'axios';

import Search from './Components/Search';
import List from './Components/List';

export default class App extends Component {

  constructor(props) {
      super(props)
      this.state = {
        venues: [],
        markers: [],
        filterVenues: [],
        query: '',
        hideMarkers: []
    }}

	componentDidMount() {
		this.getVenueRecommendations();
	}


  /*
  * Function loadMap loads the script and initializes the map
  */

	loadMap = () => {

		loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyD-jUfA6QEzQ5-v57caaqO61_WHMdR8Lsc&callback=initMap");
		window.initMap = this.initMap;
	}


  /*
     * Initializes the map.
     */
	initMap = () => {

		const map = new window.google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 47.608,
				lng: -122.33
			},
			zoom: 10
		});
    /*
    * Create an InfoWindow
    */
		const infoWindow = new window.google.maps.InfoWindow();

		this.state.venues.map(venueList => {
      /*
      * Content of the InfoWindow
      */
			const contentString = `<b>${venueList.venue.name}</b> <br><i>${venueList.venue.location.address}</i>
      <br><br><i>Data provided by Foursquare.</i>`
      /*
       * Create a marker
       * Source: https://developers.google.com/maps/documentation/javascript/markers
       */
			const marker = new window.google.maps.Marker({
				position: {
					lat: venueList.venue.location.lat,
					lng: venueList.venue.location.lng
				},
				map: map,
        animation: window.google.maps.Animation.DROP,
				title: venueList.venue.name
			});

      this.state.markers.push(marker)
      //Creating a marker animation.
      function animationEffect() {
              marker.setAnimation(window.google.maps.Animation.BOUNCE)
              setTimeout(function(){ marker.setAnimation(null) }, 1000)
            }
      //Eventlistener for marker click.
			marker.addListener('click', function () {
				infoWindow.setContent(contentString);
				infoWindow.open(map, marker);
        animationEffect();
			});

		})
	}

  /* Source:
    * https://developer.foursquare.com/docs/api/venues/explore
    */

	getVenueRecommendations = () => {
			const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
			const parameters = {
				client_id: 'DRVL0540QAR1M4D0SW1A1KLGI0YR21KAN05KOCZCATJA453C',
				client_secret: 'ZEY5DPCCDRMXTLWM4H4NYFMQS40IMUCME4CWPQYSTR5NJ3J3',
				query: 'food',
				near: 'Seattle',
				v: '20181111'
			}

      /*
    * Source: https://github.com/axios/axios
    * Follows fetch API and loads the map after getting venue data to prevent null values.
    */

			axios.get(endPoint + new URLSearchParams(parameters))
				.then(response => {
					this.setState({
						venues: response.data.response.groups[0].items,
            filterVenues: response.data.response.groups[0].items
					}, this.loadMap()
        )
				})
        .catch(error => {
          //In case of a error the map will be loaded but not the data.
          this.loadMap();
          //Delaying the error for the map to display.
          setTimeout(function() {
            alert ('Foursquare data not loading!');
            }, 1000);
          })

				 }

        /*
           * Handling the query update i.e. when the user uses the filter option
          */
          updateQuery = query => {

            this.setState({ query })
            this.state.markers.map(marker => marker.setVisible(true))

            let filterVenues
            let hideMarkers

            if (query) {
              const match = new RegExp(query)
							/*Test whether the query matches the venue name*/
              filterVenues = this.state.venues.filter(myVenue =>
                match.test(myVenue.venue.name)
              )
							/*Assign filteredvenues to the venues variable*/
              this.setState({ venues: filterVenues })
							/*Hide markers that are not asked for in the query*/
              hideMarkers = this.state.markers.filter(marker =>
                filterVenues.every(myVenue => myVenue.venue.name !== marker.title)
              )

              /*
               * Hiding the markers for venues not included in the filtered venues
              */
              hideMarkers.forEach(marker => marker.setVisible(false))

              this.setState({ hideMarkers })
            } else {
							/* Show only those markers that are asked for in the query.*/
              this.setState({ venues: this.state.filterVenues })
              this.state.markers.forEach(marker => marker.setVisible(true))
            }
          }

				render() {
					return (
            <div id = "container">

  						<div id = "sidebar">

                <div id="search" aria-label="Search for venues">
                  <Search
      	        	    updateQuery={b => this.updateQuery(b)}
      	        	    clickLocation={this.clickLocation}
                  />
                </div>

                <div id="list" aria-label="venues list">
                  <List
                    venues={ this.state.venues }
                    markers={ this.state.markers }
                    handleListItemClick={this.props.handleListItemClick}
                  />
                </div>

              </div>


  						<div id = "map" aria-hidden="true"
                aria-label="Map showing the restaurant locations" role="application">
              </div>

						</div>
					)
				}
			}

//loading a url using script tag.
			function loadScript(url) {
				const index = window.document.getElementsByTagName("script")[0]
				const script = window.document.createElement("script")
				script.src = url
				script.async = true
				script.defer = true
				index.parentNode.insertBefore(script, index)
			}
