define([
  'marionette',
  'handlebars',
  'bootstrap',
  'popcorn',
  // Templates
  'text!templates/shred/shred.hbs',
  ],function (Marionette, Handlebars, bs, Popcorn, tpl) {

  ShredView = Backbone.Marionette.Layout.extend({
		template : Handlebars.compile(tpl),
  });

  return ShredView;
});