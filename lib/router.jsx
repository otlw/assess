/*
Author: Xevinaly
Version: 2.0.0
*/
FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <TagFeedLayout />, sidebar: <AlertLayout />,  main: <TagSearchLayout />});
  }
});

FlowRouter.route('/marked', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <TagFeedLayout />, sidebar: <AlertLayout />,  main: <PlaceholderLayout />});
  }
});

FlowRouter.route('/completed', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <TagFeedLayout />, sidebar: <AlertLayout />,  main: <PlaceholderLayout />});
  }
});

FlowRouter.route('/activity', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <PlaceholderLayout />, sidebar: <PlaceholderLayout />,  main: <PlaceholderLayout />});
  }
});

FlowRouter.route('/settings', {
  action: function() {
    ReactLayout.render(MainLayout, { navigation: <PlaceholderLayout />, sidebar: <PlaceholderLayout />,  main: <PlaceholderLayout />});
  }
});
