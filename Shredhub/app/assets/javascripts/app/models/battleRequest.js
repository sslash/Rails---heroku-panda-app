// Battlerequest module
define([
  'backbone'
],

// Map dependencies from above array.
function(Backbone) {
  // Default Model.
  var BattleRequest = Backbone.Model.extend({
    urlRoot : '/api/battleRequests/',
    defaults: {
      battler: {},
      battlee: {}, 
      battleStyle: '',
      videoPath: '',
      videoThumbnail: ''
    },  

    uploadBattleShred : function(formData) {
          var that = this;  
          $.ajax({
              url: this.urlRoot + this.get('_id'), 
              type: 'POST', // Should be put, but has to be POST due to spring 
              xhr: function() {  // custom xhr
                  myXhr = $.ajaxSettings.xhr(); 
                  return myXhr;
              },
              //Ajax events
              beforeSend: function(){},
              success: function(res){
                console.log('done sending!'); 
              },
              error: function(res){
                console.log('error occured: ' + res);
              },  
              // Form data
              data: formData, 
              //Options to tell JQuery not to process data or worry about content-type
              cache: false,
              contentType: false,
              processData: false
          });
    }

  });

  // Return the module for AMD compliance.
  return BattleRequest;

});
