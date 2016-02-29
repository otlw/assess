/*
Author: Xevinaly
Version: 2.0.0
*/
Alerts = new Mongo.Collection("alerts");
AllTags = new Mongo.Collection("all-tags");
var searchText = "";
if (Meteor.isClient) {
  // This code is executed on the client only
  Meteor.subscribe("alerts");
  Meteor.subscribe("all-tags");
}

if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("tasks", function () {
    return AllTags.find({name: searchText});
  Meteor.publish("tasks", function () {
      return Alertss.find({});
}

Meteor.methods({
  updateSearchTags(tagName) {
    searchText = tagName;
  },

  getSearchTagsLength() {
    return AllTags.find({}).count();
  },
});
