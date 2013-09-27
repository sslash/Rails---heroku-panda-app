define([
  'marionette',
  'handlebars',
  'bootstrap',
  'popcorn',
  'models/tabGenerator',

  'models/shred',
  // Templates
  'text!templates/shred/createShred.hbs',
  ],function (Marionette, Handlebars, bs, tg, Popcorn, Shred, tpl) {

  CreateShredView = Backbone.Marionette.Layout.extend({
		template : Handlebars.compile(tpl),

    events : {
      'change #shredvideo' : '__shredVideoChanged',
      'change #jamTrack' : '__jamTrackChanged',
      'click #playBtn' : '__playBtnClicked',
      'click #stopBtn' : '__stopBtnClicked',
      'change #syncRange' : '__rangeValChanged',
      'click #rewindBtn' : '__rewindBtnClicked',
      'change #backingTrackSelect' : '__backingTrackSelected',
      'click #publishBtn' : '__publishBtnClicked'
    },

    initialize : function() {
      this.tags = [];
      this.shred = new Shred();
      this.rangeVal = 0;
    },

    onDomRefresh: function(){
      //this.initPanda();
      $('.tabsArea').tabGenerator({notes : $('.notes')});
    },

    __jamTrackChanged : function(e) {
      var file = $("#jamTrack")[0].files[0];
      if ( file.type.match("audio*")){
        this.jamTrackFile = file;
        this.jamTrackFilePicked = true;
        this.handleJamTrackSelect();
      }
    },  

    __shredVideoChanged : function(e){
      var file = $('#shredvideo')[0].files[0];
      if ( file.type.match('video.*') ){
        this.file = file;
        this.handleShredFileSelect();
      }
    },

    __rewindBtnClicked : function() {
      if ( this.jamTrackFilePicked ){
        $('#audioFile')[0].currentTime = 0;
      }

      if ( this.file ) {
        $('#videoFile')[0].currentTime = 0;
      }
    },

    __stopBtnClicked : function() {
      if ( this.jamTrackFilePicked ){
        $('#audioFile')[0].pause();
      }

      if ( this.file ) {
        $('#videoFile')[0].pause();
      }
    },

    __playBtnClicked : function() {
      var syncTime = parseInt(this.rangeVal,10);
      var delayAudio = syncTime > 0 ? syncTime : 0;
      var delayVideo = syncTime <0 ? syncTime * -1 : 0;

      if ( this.file ) {
        setTimeout(function(){
          $('#videoFile')[0].play();
        },delayVideo);
      }

      if ( this.jamTrackFilePicked ){
        setTimeout(function(){
          $('#audioFile')[0].play();
        },delayAudio);
      }
    },

    __rangeValChanged : function() {
      this.rangeVal = $('#syncRange').val();
      $('#rangeVal').text(this.rangeVal + " MS");
    },

    __backingTrackSelected : function() {
      var selected = $('#backingTrackSelect option:selected').text();
      if ( selected === 'Clapton Style Blues') {
        this.showBackingTrack("/assets/jamtrack2.mp3");
      }
    },

    __publishBtnClicked : function() {
      attrs = {
        title : $('#titleInput').val(),
        description : $('#descInput').val(),
        type : $('#styleInput option:selected').text(),
        tags : this.getTags(),
        guitar : this.getGuitar(),
        backingTrack : this.getBackingTrack(),
        shredVideo : this.getShredFile()
      };
      var shred = new Shred(attrs);
      if ( !shred.isValid() ){
        this.displayErrorMsg(shred.validationError);
        return;
      }

      shred.on('shred:save:error', this.displayErrorMsg);
      shred.save();
    },

    displayErrorMsg : function(error){
      var msg ="";
      if (typeof(error)==="object"){
        if ( error.status === 401 ){
          msg = "Error! You must be registered in order to Shred!";
        }else{
          errorKeyVal = _.pairs(JSON.parse(error.responseText).errors)[0];
          msg = errorKeyVal[0];
          msg += ": " + errorKeyVal[1];
        }
      }else{
        msg = error;
      }
      $('.error').text(msg).show();
    },

    getTags : function() {
      return $('#tagsInput').val().split(/\s*,\s*/);
    },

    getGuitar : function() {
      return $('#guitarInput').val();
    },

    getBackingTrack : function() {
      return this.jamTrackFile;
    },

    getShredFile : function() {
      return this.file;
    },

    showBackingTrack : function(file) {
      var jamHtml = "<audio controls id='audioFile'>" + 
            "<source src='" + file + "' type='audio/mpeg'>" +
            "<embed height='50' width='100' src='" + file + "'>" +
            "</audio>";
      $('#leAudio').append(jamHtml);
      this.jamTrackFilePicked = true;
      this.showPlayBtn();
    },

    handleJamTrackSelect : function() {
      var reader = new FileReader();
      var that = this;
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          that.showBackingTrack(e.target.result);
        };
      })(this.jamTrackFile);

      // Read in the video file as a data URL.
      reader.readAsDataURL(this.jamTrackFile);
      this.showPlayBtn();
    },

    handleShredFileSelect : function() {
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {

        var vidHtml = '<video controls id="videoFile">' +
         '<source src="' + e.target.result + '"</source></video>';
         $('#leVideo').append(vidHtml);
        };

      })(this.file);

      // Read in the video file as a data URL.
      reader.readAsDataURL(this.file);
      this.showPlayBtn();
    },

    showPlayBtn : function() {
      $('.lePlay').show();
    },

    initPanda : function() {
      var that = this;
      var upl = panda.uploader.init({
        buttonId: 'browse-files',
        onProgress: function(file, percent) {
          console.log("progress", percent, "%");
        },

        onSuccess: function(file, data) {
          that.vidId = data.id;
          // $("#new_video")
          // .find("[name=panda_video_id]")
          // .val(data.id)
          // .end()
          // .submit();
        },
        onError: function(file, message) {
          console.log("error", message);
        }
      });
    }
  });

  return CreateShredView;
});