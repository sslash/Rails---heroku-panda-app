// User module
define([
  'session',
  'ajaxHelper',
  'collections/battleRequests'
  ],

  function(Session, Ah, BattleRequests) {

  // This represents an authenticated User!
  var User = Backbone.Model.extend({

    initUser : function(user){
      Session.setUser(user);
      this.resetUser();
    },

    resetUser : function(){
      var that = this;
      this.fetchBattleRequests()
      .done(function(battleRequestCollection){
        Session.setIncomingBattleRequests(battleRequestCollection);          
        that.populateSessionData();
      })
      .done(function(){
        mainController.trigger("sessionDataFetched");                    
      });
    },

    addFaneeRelationship : function(fanee) {
    // Check if they are friends already
    delete fanee['shreds'];
    var that = this;
    Ah.post({
      url : "/api/shredders/" +fanee.id + "/addFanee/",
      data : fanee,
      handler : function(res){
        console.log("res add fanee: " + JSON.stringify(res));
        that.updateSessionAddFanee(res);
      }
    });
  },

  updateSessionAddFanee : function(fanee) {
    var user = Session.getUser();
    user.fanees.push(fanee);
    console.log("now: " + JSON.stringify(user.fanees));
    Session.setUser(user);
    mainController.trigger("action:updateNavBar");
  },

  /*
  * Fetches necessary data like battles and sentout battlerequests
  */
  populateSessionData : function(){
    var dfr = $.Deferred();
    Ah.get({
      url : '/api/battleRequests/sent/' + Session.getUser().id
    })
    .done(function(res){
      Session.setSentBattleRequests(res);
      console.log("fetched breqs");
      return this;
    })
    .done(function(){
      return Ah.get({
        url : '/api/battles/shredder/' + Session.getUser().id
      })
    })     
    .done(function(res){
        Session.setBattles(res);
        console.log("fetched battles");
    });

    return dfr.promise();


    //var dfr = $.Deferred();
    // // Fetch battle requests sent out
    // $.ajax('/api/battleRequests/sent/' + Session.getUser().id,
    // {
    //   beforeSend: function ( xhr ) {
    //     xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
    //   },
    //   success : function(res) {
    //     Session.setSentBattleRequests(res);
    // }})
    // .done(function(){

    // // // Fetch battles
    //  $.ajax( '/api/battles/shredder/' + Session.getUser().id,
    //  {
    //   beforeSend: function ( xhr ) {
    //     xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
    //   },
    //   success : function(res) {
    //     Session.setBattles(res);
    //   }});
    // })
    // .done(function(){
    //    dfr.resolve();
    // });
    // return dfr.promise();
  },

  doLogOut : function() {
    console.log("WILL LOG OUT");
    var that = this;
    $.post('/sessions/logout')
    .done( function() {
      console.log("logout win. ");
      Session.clear(); 
      router.navigate("/", {trigger : true});
    })
    .fail( function() { console.log("logout fail");});
  },

  fetchBattleRequests : function() {
    var dfr = $.Deferred();

    var battleCollection = new BattleRequests();
    battleCollection.setShredderId(Session.getUser().id);

    battleCollection.fetch({
      success : function(res) { 
        dfr.resolve(battleCollection);
      }
    });      

    return dfr.promise();
  }

  });

  // Return the module for AMD compliance.
  return User;
});
