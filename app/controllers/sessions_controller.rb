class SessionsController < ApplicationController

	def landingpage
		@shred = Shred.find("5242dedfca85e58a166decf3")
		render "/home.html.erb"
	end

	def create_new_user
		email = params[:email]
		@user = PreUser.new :email => email
		
		if @user.save
			logger.debug "SWAG: Shredder saved!"
			render json: @user
		else
			logger.debug "SWAG: Shredder failed! "
			render json: {:errors => @user.errors.as_json}, :status => 401
		end

	end
end
