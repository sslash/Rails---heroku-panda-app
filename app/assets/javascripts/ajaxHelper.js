	// Used to copy-paste in stuff
	define([
		], function(){

			var Ah = function() {};

			Ah.post = function(obj) {
				var that = this;
				$.ajax({
					url: obj.url,
					type: 'POST',
					data : JSON.stringify(obj.data),
					contentType : 'application/json',
					beforeSend: function ( xhr ) {
						xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
					},
					success:function(res){
						console.log("Ah.post success: " + JSON.stringify(res));
						obj.handler(res);
					},
					error: function(res){
						console.log("Ah.post fail: " + JSON.stringify(res));
					}
				});
			};

			Ah.get = function(obj) {
				var dfr = $.Deferred();
				// Fetch battle requests sent out
				$.ajax(
					obj.url,
				{
					beforeSend: function ( xhr ) {
						xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
					},
					success : function(res) {
						dfr.resolve(res);
					}
				});
				return dfr.promise();
			};

			Ah.uploadFile =  function(obj) {
				var that = this;
				var file = obj.file;
				var that = this;
				if ( file ) {
					var data = new FormData();
					data.append("file", file);

					$.ajax({
						url : obj.url,
						type : 'POST',
						data : data,
						beforeSend: function ( xhr ) {
							xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
						},
						success : function(res) {
							that.successHandler(obj.handler, res)
						},
						error : function(res) {
							console.log('error occured: ' + res);
						},
							//Options to tell JQuery not to process data or worry about content-type
							cache : false,
							contentType : false,
							processData : false
						});
				} else {
					obj.handler();
				}
			};

			Ah.successHandler = function(handler, res) {
				if ( typeof(handler) == "function") {
					handler(res);
				} else {
					console.log("NO HANDLER: " + JSON.stringify(res));
				}
			};

			Ah.getImgFile = function(e) {
				var files = e.target.files;
				var f = files[0];

				if ( f && f.type.match('image.*')){
					return f;
				} else {
					return null;
				}
			};

			Ah.verifyVideo  = function(f){				
				if ( f && f.type.match('video.*')){
					return f;
				} else {
					return null;
				}
			};

			Ah.getVideoFile = function(e) {
				var files = e.target.files;
				var f = files[0];
				return this.verifyVideo(f);
			};

			return Ah; 
		});