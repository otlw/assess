/*
Author: Xevinaly
Version: 2.0.0
*/
FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(MainLayout, { header: <HeaderLayout />, sidebar: <AlertLayout />,  main: <TagSearchLayout />});
  }
});

FlowRouter.route('/青出于蓝', {
  action: function() {
    ReactLayout.render(MainLayout, { header: <HeaderLayout />, sidebar: <DeleterLayout />,  main: <PlaceholderLayout />});
  }
});
