class ApplicationController < ActionController::Base
	protect_from_forgery

	protected 
	def fetch_user
		Shredder.find(session[:user_id]) if session[:user_id] 
	end

	def must_be_logged_in
		logger.debug "Logged in? #{session[:user_id]}"
		if session[:user_id]
			return true
		else
			render :nothing => true, :status => 401
			return false
		end
	end
end
