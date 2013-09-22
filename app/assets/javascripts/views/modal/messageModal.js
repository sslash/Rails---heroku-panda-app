define([
  'marionette',
  'handlebars',
  'bootstrap',

  // Templates
  'text!templates/modal/mainMessageLayout.hbs',
  ],function (Marionette, Handlebars, bs, tpl) {

  var MessageModal = {  
    MainLayout : Backbone.Marionette.Layout.extend({
      template : Handlebars.compile(tpl),

      ui : {
        modal : "#registerSuccessModal",
      },

      events : {
        "click button" : "__readyBtnClicked"
      },

      __readyBtnClicked : function() {
        this.ui.modal.modal('hide');
        Shredr.router.navigate("/theStage", {trigger: true});
      },

      onDomRefresh : function() {
        this.ui.modal.modal('show');
      },
    })
  };

  return MessageModal;
});