define([
  'marionette',
  'handlebars',

  'text!templates/landingPage.hbs'
  ], function (Marionette, Handlebars, tpl) {

    LandingPageView = Backbone.Marionette.ItemView.extend({
      template: Handlebars.compile(tpl),

      ui : {},

      events : {},

      events : {
        "submit form" : "__formSubmitted"
      },

      __formSubmitted : function(e) {
        e.preventDefault();
        var email = e.currentTarget[0].value;
        if (email) {
          $.post('/api/shredders/', {email : email})
          .done(this.postSuccess)
          .fail(this.postFail)
        }
      },

      postSuccess : function(res) {
        $('#success').text("Thank you").show();
      },

      postFail : function(errorObj) {
        var error = JSON.parse(errorObj.responseText);
        if ( error ) error = error.errors;
        var html = "";
        for(var prop in error) {
          html = prop + ": " + error[prop];
        }
        $('.error').text(html).show();
      }


    });

    return LandingPageView;
});

