define([
  'marionette',
  'handlebars',
  'bootstrap',

  // Templates
  'text!templates/stage/shredThumb.hbs'
  ],function (Marionette, Handlebars, bs, tpl) {

  ThumbItemView = Backbone.Marionette.ItemView.extend ({
    template : Handlebars.compile(tpl),
    tagName: "div",
    className: "shredThumb",

    events : {
      "click img" : "__thumbClicked"
    },

    __thumbClicked : function() {
      this.trigger("thumb:pressed");
    }
  });

  return ThumbItemView;
});