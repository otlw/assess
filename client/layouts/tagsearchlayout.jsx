/*
Author: Xevinaly
Version: 2.0.0
*/
TagSearchLayout = React.createClass({

    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
      return {
        tags: SearchTags.find({}).fetch(),
      };
    },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();

    //Send to blockchain search function

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  renderTags() {
    return this.data.tags.map((tag) => {
      return <Tag key={tag._id} tag={tag} />;
    });
  },

  render() {
    return (
      <div>
        <p id="tag_search_header">SEARCH TAGS</p>
        <form id="tag_search_bar_wrapper" onSubmit={this.handleSubmit} >
          <input
            id="tag_search_bar"
            type="text"
            ref="textInput"
            placeholder="Type to search tags..." />
        </form>
        <ul id="tag_search_tags">
          {this.renderTags()}
        </ul>
      </div>
    );
  }
});
