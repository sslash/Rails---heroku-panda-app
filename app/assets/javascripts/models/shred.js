 define([  
  'backbone'
  ],
  function(Backbone) {

    var Shred = Backbone.Model.extend({
      urlRoot : "/api/shreds"
    });

    return Shred;
});
