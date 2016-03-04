// Task component - represents a single todo item
Alert = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    alert: React.PropTypes.object.isRequired
  },
  render() {
    return (
      <li id="alert_item"><a href="/activity">{this.props.alert.text}</a></li>
    );
  }
});
