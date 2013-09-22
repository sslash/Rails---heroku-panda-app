define([
  'marionette'
  ],function (Marionette) {

  var MainRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
		"*action" : "landingPage"
    },
  });

  return MainRouter;
});