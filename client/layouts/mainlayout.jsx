/*
Author: Xevinaly
Version: 2.0.5
*/
MainLayout = React.createClass({
  render() {
    return (
      <div id="wrapper">
        <div id="fixed_header_element"><FixedHeaderElementLayout /></div>
        <div id="absolute_sidebar">{this.props.sidebar}</div>
        <div id="content_wrapper">
          <div id="header">{this.props.header}</div>
          <div id="main_content">{this.props.main}</div>
        </div>
      </div>
    );
  }
});
