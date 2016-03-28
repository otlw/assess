/*
Author: Xevinaly
Version: 1.0.1
*/
FixedHeaderElementLayout = React.createClass({

  //Renders the results in three different columns
  renderResults() {

  },

  render() {
    return (
      <div id="search_wrapper">
        <form></form>
        <div id="search_results">
          {this.renderResults()}
        </div>
      </div>
    );
  }
});
