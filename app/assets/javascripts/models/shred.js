 define([  
  'backbone',
  'session',
  'underscore'
  ],
  function(Backbone, Session, _) {

   var Shred = Backbone.Model.extend({
     urlRoot : "/api/shreds",

     defaults : {
      videoPath : '',
      description : '',
      shredRating : {
        numberOfRaters : 0,
        currentRating : 0
      },
      title: '',
      viewed: 0,
      shredComments: [],
      owner: {},
      tags: [],
      shredType:"normal"
    },

    parse : function(response, options){

      // Set the new shredder label
      var that = this;
      _.each(response.shredComments, function(c) {
        that.setDateString(c);
      });

     this.setDateString(response);
     return response;
   },


  // uploadVideo : function(video){
  //   $.ajax({
  //       url : '/api/shreds/' + this.get('_id'), //server script to process data
  //       type : 'POST',
  //       // Form data
  //       data : video,
  //       xhr : function() { // custom xhr
  //         myXhr = $.ajaxSettings.xhr();
  //         return myXhr;
  //       },
  //       //Ajax events
  //       beforeSend : function() {
  //       },
  //       success : function(res) {
  //         console.log('done sending!');
  //       },
  //       error : function(res) {
  //         console.log('error occured: ' + res);
  //       },
  //       //Options to tell JQuery not to process data or worry about content-type
  //       cache : false,
  //       contentType : false,
  //       processData : false
  //     });
  // },

  addRating : function(rateValue) { 
    var shredderId = this.get('owner')._id;
    var userId = Session.getUser().id;

    if (shredderId == userId){
     return {errorMsg : 'Cannot rate own Shred!'};
    }
      //this.increaseShredderLevel(parseInt(rateValue,10));

      var that = this;
      var url = this.urlRoot + '/' + this.get('id') +
      '/rate/' + rateValue + '/' + userId;

      $.ajax({
        url: url,
        type: 'POST',
        success:function(res){
          var shredRating = that.get('shredRating');
          shredRating.numberOfRaters ++;
          shredRating.currentRating += parseInt(rateValue, 10);     
          that.set({'shredRating': shredRating});
          console.log("rate win");
          that.trigger('shred:change:rate');
        },
        error: function(res){
          // do nothing yet..
          console.log("rate fail");
        }
      })
      return true;
    },

    increaseViewed : function() {
      var shredderId = this.get('owner')._id;
      var userId = Session.getUser().id;

      if (shredderId != userId){
        var viewed = this.get('viewed');
        viewed ++;
        this.set({'viewed' : viewed});
        var that = this;
        var url = this.urlRoot + '/' + this.get('id') + '/increaseViewed';
        $.ajax({
          url: url,
          type: 'POST'
        });
      }
    },
    
    increaseShredderLevel : function(level) {
      var shredder = new Shredder.Model(this.get('owner'));
      return shredder.increaseShredderLevel(level);
    },
    
    deleteComment : function(index) {
      var comments = this.get('shredComments');
      var intIndex = parseInt(index,10);
      comments.splice(intIndex, 1);  
      this.trigger('change');   
      this.save('shredComments', comments);
    },

    addComment : function(commentText) {
      var shredderId = this.get('owner')._id;
      var user = Session.getUser();

      var shredComment = {
        text : commentText,
        commenterId : user.id,
        commenterName : user.username
      };

      var that = this;
      var url = this.urlRoot + '/' + this.get('id') + '/comment'
      $.ajax({
        url: url,
        type: 'POST',
        data : JSON.stringify(shredComment),
        contentType : 'application/json',

        success:function(res){
          _.each(res.shredComments, function(c){
            that.setDateString(c);
          });
          that.set({'shredComments': res.shredComments});
          that.trigger('shred:change:comment');
        }
      })
    },

    setDateString : function(c) {      
      c.timeCreated = c.timeCreated.split(/[A-Z]/)[0];
    }
  });
 
 return Shred;
});
