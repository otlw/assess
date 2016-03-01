/*
Author: Xevinaly
Version: 2.0.0
*/
Alerts = new Mongo.Collection("alerts");
SearchTags = new Mongo.Collection("search-tags");
var searchText = "";
if (Meteor.isClient) {
  // This code is executed on the client only
  Meteor.subscribe("alerts");
  Meteor.subscribe("search-tags");
}

if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("alerts", function () {
    return Alerts.find({});
  });
  Meteor.publish("search-tags", function () {
    return SearchTags.find({});
  });
}

Meteor.methods({
  getAlertsLength(){
    return SearchTags.find({}).count();
  }
});
