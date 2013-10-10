define([
  'marionette',
  'handlebars',
  'bootstrap',

  // Templates
  'text!templates/stage/shredderThumb.hbs'
  ],function (Marionette, Handlebars, bs, tpl) {

  ShreddersThumbItemView = Backbone.Marionette.ItemView.extend ({
    template : Handlebars.compile(tpl),
    tagName: "div",
    className: "shredderThumb"
  });

  return ShreddersThumbItemView;
});