/*
Author: Xevinaly
Version: 2.0.5
*/

//The home page which feature the Activity page
FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(MainLayout, { fixedheaderelement: <FixedHeaderElementLayout backgroundcolor={"ffffff"} />, header: <a href="/SEARCH/:ACTIVITY"><span>Search</span></a>, sidebar: <SidebarLayout currentPage={"ACTIVITY"} />,  main: <PlaceholderLayout />});
  }
});

//Alerts for tests and assessments, done to simplfy the method for link creation
FlowRouter.route('/ACTIVITY', {
  action: function() {
    ReactLayout.render(MainLayout, { fixedheaderelement: <FixedHeaderElementLayout backgroundcolor={"ffffff"} />, header: <a href="/SEARCH/:ACTIVITY"><span>Search</span></a>, sidebar: <SidebarLayout currentPage={"ACTIVITY"} />,  main: <PlaceholderLayout />});
  }
});

//Tags marked for future completion page
FlowRouter.route('/MARKED', {
  action: function() {
    ReactLayout.render(MainLayout, { fixedheaderelement: <FixedHeaderElementLayout backgroundcolor={"ffffff"} />, header: <a href="/SEARCH/:MARKED"><span>Search</span></a>, sidebar: <SidebarLayout currentPage={"MARKED"} />,  main: <PlaceholderLayout />});
  }
});

//Tags which the current user has already completed
FlowRouter.route('/COMPLETED', {
  action: function() {
    ReactLayout.render(MainLayout, { fixedheaderelement: <FixedHeaderElementLayout backgroundcolor={"ffffff"} />, header: <a href="/SEARCH/:COMPLETED"><span>Search</span></a>, sidebar: <SidebarLayout currentPage={"COMPLETED"} />,  main: <PlaceholderLayout />});
  }
});

//The profile of the current user
FlowRouter.route('/PROFILE', {
  action: function() {
    ReactLayout.render(MainLayout, { fixedheaderelement: <FixedHeaderElementLayout backgroundcolor={"ffffff"} />, header: <a href="/SEARCH/:PROFILE"><span>Search</span></a>, sidebar: <SidebarLayout currentPage={"PROFILE"} />,  main: <PlaceholderLayout />});
  }
});

//Settings
FlowRouter.route('/SETTINGS', {
  action: function() {
    ReactLayout.render(MainLayout, { fixedheaderelement: <FixedHeaderElementLayout backgroundcolor={"ffffff"} />, header: <a href="/SEARCH/:SETTINGS"><span>Search</span></a>, sidebar: <SidebarLayout currentPage={"SETTINGS"} />,  main: <PlaceholderLayout />});
  }
});

//Search Page
FlowRouter.route('/SEARCH/:link', {
  action: function(params) {
    ReactLayout.render(MainLayout, { fixedheaderelement: <FixedHeaderElementLayout backgroundcolor={"plzwork"} />, header: <div id="blank_header"></div>, sidebar: <div id="blank_sidebar"><p id="blank_sidebar_header">OTLW</p></div>,  main: ""});
  }
});
