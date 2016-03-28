/*
Author: Xevinaly
Version: 1.0.4
*/
SidebarLayout = React.createClass({

  //Define the passed static proptypes
  propTypes: {
    currentPage: React.PropTypes.string.isRequired
  },

  //Actively render the current sidebar tab
  renderLinks() {
    return ["ACTIVITY", "MARKED", "COMPLETED", "PROFILE", "SETTINGS"].map((name) => {
      if(this.props.currentPage == name)
        return <li id="sidebar_item_current">{name}</li>;
      return <li id="sidebar_item"><a href={"/" + name}><span>{name}</span></a></li>;
    });
  },

  render() {
    return (
      <div>
        <p id="sidebar_header">OTLW</p>
        <p id="sidebar_header">{Master.return4().toNumber()}</p>
        <ul id="sidebar_list">
          {this.renderLinks()}
        </ul>
      </div>
    );
  }
});
