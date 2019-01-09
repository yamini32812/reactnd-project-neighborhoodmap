import React, {Component} from 'react';
//searchbar component
export default class Search extends Component {
//renders the searchbar with the updateQuery function.
render() {
  return(
    <div id="venueFilter" role="application">
        <input type = "text"
               id = "search"
               placeholder = "venuenames"
               aria-label="Search Bar"
               value={this.props.query}
               onChange={event => this.props.updateQuery(event.target.value)}/>
      </div>
  )
}
}
