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
		logger.debug "VERIFY USER: session: #{session}"
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

	def uploadFile
		logger.debug "Will store file: #{params[:file]}"
		# Write file
		file = params[:file]
		uploader = AvatarUploader.new
		uploader.store!(file)
		return true
	end

	def self.uploadFile (file)
		logger.debug "Will store file yo: #{file}"
		# Write file
		uploader = AvatarUploader.new
		uploader.store!(file)
		return true
	end
end
