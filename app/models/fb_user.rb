class FbUser
	include MongoMapper::Document

	#protect attributes from mass assignment
	attr_accessible :provider, :uid, :name, :email, :oauth_token, :oauth_expires_at

	# Validations
	#EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i
	#validates :name, :presence => true, :uniqueness => true, :length => { :in => 3..20 }
	#validates :uid, :presence => true, :uniqueness => true, :length => { :in => 3..30 }

	# Variable
	key :provider, String
	key :name, String
	key :uid, String
	key :email, String
	userstamps!

	#OAUTH THINGS
	key :oauth_token, String
	key :oauth_expires_at, Date

	# FACEBOOK
	# Called every time with login, so if name changes rails will update too
	def self.from_omniauth(auth)
		logger.debug "Facebook login: #{JSON.pretty_generate(auth)}"
		user = FbUser.first(:uid => auth['uid'])
		if !user
			user = FbUser.new()
			user.provider = auth['provider']
			user.oauth_token = auth.credentials.oauth_token
			user.oauth_expires_at = Time.at(auth.credentials.expires_at)
			user.uid = auth['uid']
			if auth['info']
				user.name = auth['info']['name'] || ""
				user.email = auth['info']['email'] || ""
			end
			if user.save
				shredder = Shredder.first(:username => user.name)
				if !shredder
					shredder = Shredder.new({ :username => user.name, :email =>user.email});
					shredder.timeCreated = Time.now
					#shredder.badges = {}
					shredder.onlineProfileImagePath = auth['info']['image']
					if shredder.save
						shredder
					else
						nil
					end
				else
					shredder
				end
			else
				nil
			end
		else
			user.oauth_token = auth.credentials.oauth_token
			user.oauth_expires_at = Time.at(auth.credentials.expires_at)
			user.save
			shredder = Shredder.first(:username => user.name)
			shredder
		end
	end
end
