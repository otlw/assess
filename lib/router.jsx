/*
Author: Xevinaly
Version: 2.0.0
*/


//Tag routes
FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <TagFeedLayout />, sidebar: <AlertLayout />,  main: <TagSearchLayout />});
  }
});

FlowRouter.route('/marked', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <TagFeedLayout />, sidebar: <AlertLayout />,  main: <MarkedTagsLayout />});
  }
});

FlowRouter.route('/completed', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <TagFeedLayout />, sidebar: <AlertLayout />,  main: <MyTagsLayout />});
  }
});


//Activity routes
FlowRouter.route('/activity', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <ActivityFeedLayout />, sidebar: <PlaceholderLayout />,  main: <AssessLayout />});
  }
});

FlowRouter.route('/grading', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <ActivityFeedLayout />, sidebar: <PlaceholderLayout />,  main: <GradeLayout />});
  }
});

FlowRouter.route('/tests', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <ActivityFeedLayout />, sidebar: <PlaceholderLayout />,  main: <TestsLayout />});
  }
});

FlowRouter.route('/grades', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <ActivityFeedLayout />, sidebar: <PlaceholderLayout />,  main: <ResultsLayout />});
  }
});



//Options routes
FlowRouter.route('/profile', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <OptionsFeedLayout />, sidebar: <PlaceholderLayout />,  main: <ProfileLayout />});
  }
});

FlowRouter.route('/settings', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <OptionsFeedLayout />, sidebar: <PlaceholderLayout />,  main: <SettingsLayout />});
  }
});

FlowRouter.route('/search', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <OptionsFeedLayout />, sidebar: <PlaceholderLayout />,  main: <SearchLayout />});
  }
});
