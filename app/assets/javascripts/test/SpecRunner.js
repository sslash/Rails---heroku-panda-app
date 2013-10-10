require.config({
  baseUrl: "/",
  urlArgs: 'cb=' + Math.random(),
  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths:{
    // Core Libraries
    "jquery":"vendor/jquery",
    "underscore":"vendor/underscore",
    "backbone":"vendor/backbone",
    "marionette":"vendor/backbone.marionette",
    "handlebars":"vendor/handlebars",
    "popcorn" : "vendor/popcorn",

    // Plugins
    "bootstrap":"vendor/bootstrap.min",
    "text":"vendor/text",
    "spec": 'test/spec/'
    //"sinon": "vendor/sinon"
  },
  // Sets the configuration for your third party scripts that are not AMD compatible
  shim:{
    // Twitter Bootstrap jQuery plugins
    "bootstrap":["jquery"],

    // Backbone
    "backbone":{
      // Depends on underscore/lodash and jQuery
      "deps":["underscore", "jquery"],
      // Exports the global window.Backbone object
      "exports":"Backbone"
    },
    //Marionette
    "marionette":{
      "deps":["underscore", "backbone", "jquery"],
      "exports":"Marionette"
    },

    "handlebars":{
      "exports": "Handlebars"
    },

    "bootstrap":{
      "deps": ['jquery'],
      "exports": 'Bootstrap'
    }

    // "sinon":{
    //   "exports": "sinon"
    // },
  }
});

require(['jquery', 'backbone', 'marionette',  'bootstrap', 'spec/index'], function($, Backbone, Marionette, Bootstrap, index) {
  var jasmineEnv = jasmine.getEnv(),
  htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  $(function() {
    require(index.specs, function() {
      jasmineEnv.execute();
    });
  });
});
