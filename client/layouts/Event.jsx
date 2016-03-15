Event = React.createClass({
  propTypes: {
    eventx: React.PropTypes.object.isRequired
  },

  deleteThisTask() {
    Events.remove(this.props.eventx._id);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    return (
      <li id="test_item">
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>
        <span className="text">
          {this.props.eventx.type}: {this.props.eventx.text}
        </span>
      </li>
    );
  }
});
