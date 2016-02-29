/*
Author: Xevinaly
Version: 2.0.0
*/
AlertLayout = React.createClass({
   // This mixin makes the getMeteorData method work
   mixins: [ReactMeteorData],

   // Loads items from the Tasks collection and puts them on this.data.tasks
   getMeteorData() {
     return {
       alerts: Alerts.find({}, {sort: {createdAt: -1}}).fetch()
     }
   },

  renderAlerts() {
    // Get tasks from this.data.tasks
    return this.data.alerts.map((alert) => {
      return <Alert key={alert._id} alert={alert} />;
    });
  },

  render() {
    return (
      <div id="alerts">
        <div id="alerts_header">
          <p id="alerts_title">Alerts ({Alerts.find({}).count()})</p>
        </div>
        <ul id="alerts_list">
          {this.renderAlerts()}
        </ul>
      </div>
    );
  }
});
