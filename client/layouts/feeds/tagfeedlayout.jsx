/*
Author: Xevinaly
Version: 2.0.0
*/
TagFeedLayout = React.createClass({
  render() {
    return (
      <div id="feed_wrapper">
        <p id="title">FEEDS</p>
        <ul id="feed_link_wrapper">
          <li id="feed_link"><a href="/" id="feed_item">Search Tags</a></li>
          <li id="feed_link"><a href="marked" id="feed_item">Marked Tags</a></li>
          <li id="feed_link"><a href="completed" id="feed_item">My Tags</a></li>
        </ul>
      </div>
    );
  }
});
