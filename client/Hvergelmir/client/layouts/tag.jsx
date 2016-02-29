// Task component - represents a single todo item
Tag = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    tag: React.PropTypes.object.isRequired
  },
  render() {
    return (
      <li id="tag_item"><p>{this.props.tag.name}</p></li>
    );
  }
});
