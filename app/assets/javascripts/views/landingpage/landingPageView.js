define([
  'marionette',
  'handlebars',

  'text!templates/landingpage/landingPage.hbs',
  'text!templates/landingpage/landingPageLoggedIn.hbs'
  ], function (Marionette, Handlebars, tpl, tplLoggedIn) {

    LandingPageView = Backbone.Marionette.ItemView.extend({
      template: Handlebars.compile(tpl),
      templateLoggedIn: Handlebars.compile(tplLoggedIn),

      ui : {
        loginBtn: "#loginBtn"
      },

      events : {
        "click #loginBtn" : "__loginBtnClicked"
      },

      getTemplate: function(){
        if (Shredr.loggedIn){
          return this.templateLoggedIn;
        } else {
          return this.template;
        }
      },

      __loginBtnClicked : function() {
        Shredr.buzz.openLoginModal();
      }

    });

    return LandingPageView;
});

