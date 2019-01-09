import React, {Component} from 'react';

import Listitem from './Listitem';
/*Venuelist component*/
export default class List extends Component {
/* renders the ul venuelist and uses the properties from venues and markers*/
render() {
  return(
    <div id="venueList" role="application" aria-label="List of Venues">
    <ul>
      {
       this.props.venues.map((venues, id) =>
       (
         <Listitem key = {id} venues = {venues} handleListItemClick={this.props.handleListItemClick}
         markers={ this.props.markers }/>
       ))
      }
    </ul>
      </div>
    )
  }
}
