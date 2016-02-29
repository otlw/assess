/*
Author: Xevinaly
Version: 1.0.0
*/
MainLayout = React.createClass({
  render() {
    return (
      <div id="wrapper">
        <div id="header_wrapper">{this.props.header}</div>
        <div id="fluid_sidebar">{this.props.sidebar}</div>
        <div id="main_content">{this.props.main}</div>
        <div id="fixed_sidebar">{this.props.navigation}</div>
      </div>
    );
  }
});
