define([
  'marionette',
  'handlebars',
  'bootstrap',
  'jcrop',
  'underscore',

  'text!templates/modal/loginModal.hbs',
  'text!templates/modal/loginModalRegister.hbs',
  ], function (Marionette, Handlebars, bs, Jcrop, _, tpl, registerTpl) {

    
    var LoginModalView = {

      MainView : Backbone.Marionette.Layout.extend({
        template: Handlebars.compile(tpl),

        ui : {
          modal : "#loginModal",
          register : "#register",
          login : "#login",
          modalBody : ".modal-body",
          signUpBtn : "#signupBtn",
          logo : ".logo-medium"
        },

        events : {
          "click #signupBtn" : "__signUpBtnCLicked",
          "submit #loginForm" : "__formSubmitted"
        },

        initialize : function() {
          this.setUpFaceLogin();
        },

        onDomRefresh : function() {
          this.ui.modal.modal('show');
        },

        __formSubmitted : function(e) {
          e.preventDefault();
          var username = $('#emailInput').val();
          var password = $('#passwordInput').val();
          $.post("/auth/userAuthenticate", {username_or_email : username, password : password})
          .done($.proxy(this.authenticateSuccess, this))
          .fail($.proxy(this.authenticateFail, this));

        },

        __signUpBtnCLicked : function() {
          this.ui.login.remove();
          this.ui.signUpBtn.remove();
          this.ui.logo.remove();

          var that = this;
          this.ui.modalBody.animate({
            height: "+=550px"
            }, "slow", function() {
              var registerView = new LoginModalView.RegisterView();
              registerView.on("user:auth:create:success", that.registerSuccess, that);
              that.ui.register.append(registerView.render().el);
            });
        },

        authenticateFail : function(msg) {
          $('.error').text("Wrong username or password").show();
        }, 

        authenticateSuccess : function(user) {
          this.ui.modal.modal('hide');
          this.ui.modal.on('hidden.bs.modal', function () {
            Shredr.vent.trigger("user:auth:success", user);
            Shredr.router.navigate("/theStage", {trigger: true});
          });
        },

        registerSuccess : function(user) {
          this.ui.modal.modal('hide');
          this.ui.modal.on('hidden.bs.modal', function () {
            Shredr.vent.trigger("user:auth:success", user);
            Shredr.buzz.openMessageModal();
          });
        },


        setUpFaceLogin : function() {
          $.ajax({
            url: window.location.protocol + "//connect.facebook.net/en_US/all.js",
            dataType: 'script',
            cache: true
          });

          window.fbAsyncInit = function(){
            FB.init({appId: '322423007904195', cookie: true});

            $('#faceLoginBtn').click(function(e) {
              e.preventDefault();
              FB.login (function(response){
                if (response.authResponse)
                  window.location = '/auth/facebook/callback';
              });
            }); //$
          }; // window
        } // setUpFaceLogin
      }), // Main View

      RegisterView : Backbone.Marionette.Layout.extend({
        template: Handlebars.compile(registerTpl),

        events : {
          "change #profileImgId"  : "__profileImgSelected",
          "submit #registerForm" : "__registerBtnClicked",
          "blur input" : "__inputBlurred"
        },

        __registerBtnClicked : function(e) {
          e.preventDefault();
          var username = $("input[name='username-input']").val();
          var email = $("input[name='email-input']").val();
          var pw1 = $("input[name='pw1-input']").val();
          var pw2 = $("input[name='pw2-input']").val();
          var data = new FormData();
          data.append("username", username);
          data.append("email", email);
          data.append("password", pw1);
          data.append("password2", pw2);

          // Add the file meta
          if ( this.profileImg ) {
            var fileMeta = this.getFileMeta(this.profileImg);
            _.each(_.pairs(fileMeta), function(pair){
              data.append(pair[0], pair[1]);
            });
          }

          $.ajax({
            url : "/api/shredders/",
            type : 'POST',
            data : data,
            //Options to tell JQuery not to process data or worry about content-type
            cache : false,
            contentType : false,
            processData : false,
            context:this,
            error: this.registerUserError,
            success: this.registerUserSuccess
          });
        },

        __profileImgSelected : function(e) {
          var f = this.getImgFile(e);
          if ( f ) {
            this.profileImg = f;
            this.displayImgOnDom(e);
          }
        },

        __inputBlurred : function() {
          $('.error').text("").hide();
        },

        registerUserSuccess : function(user) {
          this.trigger("user:auth:create:success", user);
        },

        registerUserError : function(errorObj) {
          var error = JSON.parse(errorObj.responseText);
          if ( error ) error = error.errors;
          var html = "";
          for(var prop in error) {
            html = prop + ": " + error[prop];
          }
          this.$('.error').text(html).show();
        },

        getImgFile : function(e) {
          var files = e.target.files;
          var f = files[0];

          if ( f && f.type.match('image.*')){
            return f;
          } else {
            return null;
          }
        },

        displayImgOnDom : function(e) {           
          var reader = new FileReader();
          var that = this;
          // Closure to capture the file information.
          reader.onload = (function(theFile, handler) {
            return function(e) {
              // Render thumbnail.
              var image = new Image();
              image.src = e.target.result;
              $('.profile-img').attr('src',image.src );
              handler(image);
              };
          })(this.profileImg, $.proxy(this.setJCrop,this));

          // Read in the image file as a data URL.
          reader.readAsDataURL(this.profileImg);
        },

        setJCrop : function(image) {
          var img = $('.profile-img');
          this.orgImage = image;
          this.domImage =  $('.profile-img');
          this.cropData = {};
          this.cropData.x1 = 30;
          this.cropData.x2 = 230;
          this.cropData.y1 = 30;
          this.cropData.y2 = 230;
          this.cropData.w = this.cropData.x1 + this.cropData.x2;
          this.cropData.h = this.cropData.y1 + this.cropData.y2;
          var that = this;

          $('.profile-img').Jcrop({
            aspectRatio: 4 / 4,
            setSelect:   [that.cropData.x1, that.cropData.y1, that.cropData.x2, that.cropData.y2],
            onSelect: $.proxy(that.setChords,that)
          });
        },

        setChords : function(c) {
          this.cropData.x1 = c.x;
          this.cropData.y1 = c.y;
          this.cropData.w = c.w;
          this.cropData.h = c.h;
        },

        getFileMeta : function(file) {
          var x1Aspect = this.cropData.x1 / this.domImage.width();
          var x1 = x1Aspect * this.orgImage.width;

          var y1Aspect = this.cropData.y1 / this.domImage.height();
          var y1 = y1Aspect * this.orgImage.height;

          var widthAspect = this.cropData.w / this.domImage.width();
          var w = widthAspect * this.orgImage.width;

          var heightAspect = this.cropData.h / this.domImage.height();
          var h = heightAspect * this.orgImage.height;
          return {
            profilePicture : file,
            x1: Math.round(x1),
            y1: Math.round(y1),
            w: Math.round(w),
            h: Math.round(h)
          };
        }
      })

    };
  return LoginModalView;
});

