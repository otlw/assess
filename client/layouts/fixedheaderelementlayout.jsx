/*
Author: Xevinaly
Version: 1.0.3
*/
FixedHeaderElementLayout = React.createClass({
  render() {
    return (
      <div id="element_wrapper" class={this.props.backgroundcolor}>
        <div id="log_in"><p>Log In</p></div>
        <div id="sign_up"><p>Sign Up</p></div>
        <div id="balance"><span id="Ξ"><span id="fit_Ξ">Ξ</span></span><span id="balance_amount">300</span></div>
      </div>
    );
  }
});
