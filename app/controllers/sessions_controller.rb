# http://rubysource.com/rails-userpassword-authentication-from-scratch-part-ii/
class SessionsController < ApplicationController

	# Filters that are added to all controller handlers

	# Called to verify user is logged in
	before_filter :authenticate_user, :only => [:logout] 

	# Called to verify user is not allowed to login when when already logged in
	before_filter :save_login_state, :only => [:login, :login_attempt]

	def home
		if session[:user_id]
			logger.debug("User is logged in already: #{session[:user_id]}")
			@user = Shredder.first(:id => session[:user_id])
			@guitars = Guitar.all
			@new_badges = self.fetchNewBadges @user
		end
		render "/home.html.erb"
	end

	def drums
		render :file => "app/views/layouts/application.html.erb", "sap" => "saaaap"
	end

	def add_last_logged_in (shredder)
		shredder[:last_logged_in] = Time.now
		shredder.save!
	end

	def login
		logger.debug "login: #{params[:username_or_email]}, #{params[:login_password]}"
		authorized_user = User.authenticate(params[:username_or_email],params[:login_password])
		if authorized_user
			# Fetch the shredder
			shredder = Shredder.first(:username => authorized_user.username);
			# Always store the ID that refers to the object in the session file, not the object itself”
			session[:user_id] = shredder._id
			session[:mongo_user_id] = authorized_user._id
			logger.debug "LOGGED IN: #{session}"
			@new_badges = self.fetchNewBadges shredder
			render json: shredder
		else
			logger.debug "login: failed"
			render :nothing => true, :status => 401
		end
	end

	def logout
		logger.debug "logout: #{@current_user} "
		user = Shredder.first(:id => session[:user_id])
		self.add_last_logged_in user
		session[:user_id] = nil
		render :nothing => true, :status => 200
	end


	# FACEBOOK
	def create 
		auth = request.env["omniauth.auth"]
		user = FbUser.from_omniauth(auth)
		session[:user_id] = user[:shredder][:_id]
		session[:mongo_user_id] = user[:user][:_id]
		redirect_to root_url
	end

	def destroy
		session[user_id] = nil
		redirect_to root_url
	end



	def fetchNewBadges (shredder)
		badge = BadgeController.new().checkForFirst10FansBadge shredder
		return badge
	end
end
