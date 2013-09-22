class SessionsController < ApplicationController

	def landingpage
		logger.debug "SWAG: Logged in? #{session[:user_id]}"
		@user = fetch_user
		if flash[:message]
			@message = flash[:message]
		end
		render "/home.html.erb"
	end

	def omniAuth_login
		auth = request.env["omniauth.auth"]
		user = User.find_by_provider_and_uid(auth["provider"], auth["uid"])
		if not user
			shredder = Shredder.create_from_omniauth(auth)
			if shredder.save
				user = User.create_with_omniauth(auth, shredder._id)
				if not user.save
					return redirect_to root_url
				end
				flash[:message] = "user:register:success";
			else
				return redirect_to root_url
			end
		end
		session[:user_id] = user.shredder_id
		redirect_to root_url
	end

	def user_login
		authorized_user = User.authenticate(params[:username_or_email],params[:password])
		if authorized_user
			shredder = Shredder.first(:username => authorized_user.username);
			# Always store the ID that refers to the object in the session file, not the object itself”
			session[:user_id] = shredder._id
			render json: shredder
		else
			render :nothing => true, :status => 401
		end
	end

	def create_new_user
		userdata = {
			:username => params[:username],
			:email => params[:email],
			:password => params[:password],
			:password_confirmation => params[:password2]
		}

		@user = User.new(userdata)
		if @user.save
			# Create a shredder
			@shredder = Shredder.create_from_user @user
			if @shredder.save
				if params[:profilePicture]
					@shredder.add_image params
				end
				session[:user_id] = @shredder._id
				render json: @shredder
			else
				render json: {:errors => @shredder.errors.as_json}, :status => 401
			end	
		else
			render json: {:errors => @user.errors.as_json}, :status => 401
		end
	end

	def logout
		user = fetch_user
		user.add_last_login_time
		session[:user_id] = nil
		redirect_to root_url
	end

	def omniAuth_login_failure
		render :nothing => true
	end
end
