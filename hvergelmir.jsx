/*
Author: Xevinaly
Version: 2.0.0
*/
if (Meteor.isClient) {
  // This code is executed on the client only
  Meteor.startup(function () {
   // Use Meteor.startup to render the component after the page is ready
   React.render(<TestUI />, document.getElementById("render-target"));
   Session.set("Token Balance", '13' /*+ getTokenBalance()*/);
   Session.set("Assessment Address", '12341324'/*getAssessmentAddress()*/);
   Session.set("Searched Tag", '12341324');
 });
}
