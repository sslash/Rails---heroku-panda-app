define([
  'marionette',
  'controllers/MainController',
  'handlebars',
  'router',
  'models/user'
  ], function (Marionette, MainController, Handlebars, AppRouter, User) {

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
      Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length <3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue!=rvalue ) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      });
    });

    Shredhub.addInitializer(function(options) {
      $.ajaxSetup({
        beforeSend: function(xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        }
      }); 
    });

    Shredhub.addInitializer(function(options){
      window.router = new AppRouter({controller:options.controller});
      Backbone.history.start();
    });

    Shredhub.addInitializer (function(options) {
      if ( window.user) {
        Shredhub.user = new User(window.user);
        Shredhub.user.initUser(window.user);
      }
    });
    
    window.mainController = new MainController();
    Shredhub.start({controller : mainController} );

    return Shredhub;
  });
