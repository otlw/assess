/*
Author: Xevinaly
Version: 2.0.0
*/
OptionsFeedLayout = React.createClass({
  render() {
    return (
      <div id="feed_wrapper">
        <p id="title">FEEDS</p>
        <ul id="feed_link_wrapper">
          <li id="feed_link"><a href="profile" id="feed_item">Profile</a></li>
          <li id="feed_link"><a href="settings" id="feed_item">Settings</a></li>
          <li id="feed_link"><a href="search" id="feed_item">Find User</a></li>
        </ul>
      </div>
    );
  }
});
