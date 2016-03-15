/*
Author: Xevinaly
Version: 2.0.0
*/
TestElements = new Mongo.Collection("test-elements");
Events = new Mongo.Collection("events");
if (Meteor.isClient) {
  // This code is executed on the client only
  Meteor.startup(function () {
   // Use Meteor.startup to render the component after the page is ready
   React.render(<TestUI />, document.getElementById("render-target"));
   TestElements.remove({});
   Events.remove({});
   TestElements.insert({type: "Token Balance", text: "13" /*+ getTokenBalance()*/});
   TestElements.insert({type: "Assessment Address", text: "12341324"/*getAssessmentAddress()*/});
 });
}
