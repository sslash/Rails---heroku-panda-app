# http://rubysource.com/rails-userpassword-authentication-from-scratch-part-ii/
class SessionsController < ApplicationController

	# Filters that are added to all controller handlers

	# Called to verify user is logged in
	before_filter :authenticate_user, :only => [:logout] 

	# Called to verify user is not allowed to login when when already logged in
	before_filter :save_login_state, :only => [:login, :login_attempt]

	def home
		logger.debug "login:"
		render :file => "app/assets/index.html", :formats => [:html]
	end

	def login
		logger.debug "login: #{params[:username_or_email]}, #{params[:login_password]} "
		authorized_user = User.authenticate(params[:username_or_email],params[:login_password])
		if authorized_user
			logger.debug "Auth success: #{session}"
			# Fetch the shredder
			shredder = Shredder.first(:username => authorized_user.username);
			logger.debug "Auth success: #{shredder}"
			# Always store the ID that refers to the object in the session file, not the object itself”
			session[:user_id] = shredder._id
			logger.debug "LOGGED IN: #{session}"
			render json: shredder
		else
			logger.debug "login: failed"
			render :nothing => true, :status => 401
		end
	end

	def logout
		logger.debug "logout: #{@current_user} "
		session[:user_id] = nil
		render :nothing => true, :status => 200
	end
end
