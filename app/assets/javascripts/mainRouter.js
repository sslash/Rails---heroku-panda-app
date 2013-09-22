define([
  'marionette'
  ],function (Marionette) {

  var MainRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
		"theStage" : "stagePage",
		"*action" : "landingPage"
    },
  });

  return MainRouter;
});