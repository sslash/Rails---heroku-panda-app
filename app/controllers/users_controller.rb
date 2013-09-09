class UsersController < ApplicationController

	# Filter controller
	before_filter :save_login_state, :only => [:new, :create]
	
	def create
		@user = User.new(params[:user])
		logger.debug "New user: #{@user.attributes.inspect}"
		if @user.save
			logger.debug "SUCCESS!"

			# Create a shredder
			@shredder = Shredder.new({ :username => @user.username, :email =>@user.email});
			@shredder.timeCreated = Time.now
			#@shredder.badges = {}
			if @shredder.save
				logger.debug("saved shredder!");
			end	
			render json: @user
		else
			logger.debug "FAIL: Form is invalid"
			render :nothing => true, :status => 401
		end
	end
end
