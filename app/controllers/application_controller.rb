class ApplicationController < ActionController::Base
	protect_from_forgery

	protected 
	def authenticate_user
		unless session[:user_id]
			#redirect_to(:controller => 'sessions', :action => 'home')
			#redirect_to :back

			return false
		else
			# set current user object to @current_user object variable
			# @current_user = User.find session[:user_id] 
			# TODO: get shredder username from mongo given session id.
			# Getuser from User in mongo
			return true
		end
	end

	# prevents the user from accessing the signup
	# and login pages whilst logged in.
	def save_login_state
		if session[:user_id]
			redirect_to(:controller => 'sessions', :action => 'home')
			return false
		else
			return true
		end
	end

	def verify_user_is_allowed
		logger.debug "VERIFY USER IS ALLOWED: session: #{session}"
		res = session[:user_id].to_s == params[:uid].to_s

		unless session[:user_id] and res
			logger.debug "Verify user failed! #{session[:user_id]}, #{params[:uid]} "
			#redirect_to :back
			#redirect_to(:controller => 'sessions', :action => 'home')
			render :nothing => true, :status => 401
			return false
		else
			return true
		end
	end

	def verify_owner_is_user
		logger.debug "VERIFY OWNER IS LE USER: session: #{session}"
		res = session[:user_id].to_s == params[:owner].to_s

		unless session[:user_id] and res
			logger.debug "Verify owner is user failed! #{session[:user_id]}, #{params[:uid]} "
			render :nothing => true, :status => 401
			return false
		else
			return true
		end
	end

	# def uploadFile
	# 	logger.debug "Will store file: #{params[:file]}"
	# 	# Write file
	# 	file = params[:file]
	# 	uploader = AvatarUploader.new
	# 	model = { :crop_x => params[:x1], :crop_y => params[:y1], :crop_width => params[:w], :crop_height => params[:h]}

	# 	res = uploader.store!(file, :model => model)
	# 	logger.debug "SWAG! Uploaded: #{res}"
	# 	logger.debug "SWAG! Uploadedjson: #{JSON.pretty_generate(res)}"
	# 	return res
	# end

private
	def current_user
		@current_user ||= FBUser.find(session[:user_id]) if session[:user_id]
	end
	helper_method :current_user
end
