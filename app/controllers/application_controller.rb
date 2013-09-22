class ApplicationController < ActionController::Base
	protect_from_forgery

	protected 
	def fetch_user
		Shredder.find(session[:user_id]) if session[:user_id] 
	end
end
