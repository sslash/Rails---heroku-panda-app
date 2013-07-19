define([
  'marionette',
  'controllers/MainController',
  'handlebars',
  'router'
  ], function (Marionette, MainController, Handlebars, AppRouter) {

    Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
      return Handlebars.compile(rawTemplate);
    };

    // set up the app instance
    window.Shredhub = new Marionette.Application();

    // configuration, setting up regions, etc ...
    Shredhub.addRegions({
     header : '#header',
     main   : '#main',
     modal  : "#modal",
     footer : '#footer'
   });

    Shredhub.addInitializer(function(options){
      var sync = Backbone.sync;
      Backbone.sync = function(method, model, options) {
        options.beforeSend = function(xhr){
          xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
        };
        sync(method, model, options);
      };

      Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue!=rvalue ) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      });
    });

    Shredhub.addInitializer(function(options){
      window.router = new AppRouter({controller:options.controller});
      Backbone.history.start();
    });
    
    window.mainController = new MainController();
    Shredhub.start({controller : mainController} );



    




    return Shredhub;
  });