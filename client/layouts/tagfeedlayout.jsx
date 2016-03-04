/*
Author: Xevinaly
Version: 2.0.0
*/
TagFeedLayout = React.createClass({
  render() {
    return (
      <div id="tag_feed_wrapper">
        <p id="tag_feed_header">FEEDS</p>
        <ul id="tag_feed_link_wrapper">
          <li id="tag_feed_link"><a href="/" id="tag_feed_item">Search Tags</a></li>
          <li id="tag_feed_link"><a href="marked" id="tag_feed_item">Marked Tags</a></li>
          <li id="tag_feed_link"><a href="completed" id="tag_feed_item">My Tags</a></li>
        </ul>
      </div>
    );
  }
});
