import React, {Component} from 'react';
//ListItems components
export default class Listitem extends Component {

  //Eventlistener for location click.
  handleListItemClick = venues => {
    this.props.markers.forEach(marker => {
      if(marker.title === venues)
      {
       window.google.maps.event.trigger(marker, "click")
     }
   })
  }
//renders each item of the venue list
render() {
  return(
    <div id="listitem" role="application" aria-label={this.props.venues.venue.name}>
               <li
                   tabIndex="0"
                   onClick={() =>
                   {this.handleListItemClick(this.props.venues.venue.name)}
                 }
                >
                   {this.props.venues.venue.name}
              </li>
      </div>
    )
  }
}
