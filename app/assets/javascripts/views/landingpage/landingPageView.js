define([
  'marionette',
  'handlebars',
  'popcorn',

  'views/landingPage/battleView',

  'text!templates/landingPage.hbs'
  ], function (Marionette, Handlebars, Popcorn, BattleView, tpl) {

    LandingPageView = Backbone.Marionette.Layout.extend({
      template: Handlebars.compile(tpl),

      regions : {
        battle : "#battle-area"
      },

      events : {},

      events : {
        'submit form' : '__formSubmitted',
        'click #logo-img' : '__logoHovered'

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

      __logoHovered : function() {
        console.log("sap");
        if ( !this.mainAreaPressed ){
          $('#main-area').animate({"top" : "+=60%"}, "slow");
          this.openBattleView();
          this.mainAreaPressed = true;
        } else {
          this.mainAreaPressed = false;
          $('#main-area').animate({"top" : "-=60%"}, "slow");
        }
      },

      openBattleView : function() {
        var view = new BattleView();
        this.battle.show(view);
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

