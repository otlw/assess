/*
Author: Xevinaly
Version: 2.0.0
*/
ActivityFeedLayout = React.createClass({
  render() {
    return (
      <div id="feed_wrapper">
        <p id="title">FEEDS</p>
        <ul id="feed_link_wrapper">
          <li id="feed_link"><a href="activity" id="feed_item">Assess</a></li>
          <li id="feed_link"><a href="grading" id="feed_item">Grade</a></li>
          <li id="feed_link"><a href="tests" id="feed_item">Tests</a></li>
          <li id="feed_link"><a href="grades" id="feed_item">Results</a></li>
        </ul>
      </div>
    );
  }
});
