class User
  include MongoMapper::Document

  #protect attributes from mass assignment
	attr_accessible :username, :email, :password, :password_confirmation

	# Validations
	EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i
	validates :username, :presence => true, :uniqueness => true, :length => { :in => 3..30 }
	validates :email, :uniqueness => true, :format => EMAIL_REGEX
	validates :password, :confirmation => true #password_confirmation attr
	validates_length_of :password, :in => 4..20, :on => :create

	# Variable
	key :username, String
	key :email, String
	key :encrypted_password, String
	key :salt, String
	key :provider, String
  	key :uid, String
  	key :shredder_id, ObjectId
	userstamps!


	# Callbacks
	before_save :encrypt_password


	# Functions
	def encrypt_password
		if password.present?
			self.salt = BCrypt::Engine.generate_salt
			self.encrypted_password = BCrypt::Engine.hash_secret(password, salt)
			self.password = nil
		end
	end

	# Authenticate
	def self.authenticate(username_or_email="", login_password="")
		if  EMAIL_REGEX.match(username_or_email)    
			user = User.find_by_email(username_or_email)
		else
			user = User.find_by_username(username_or_email)
		end

		if user && user.match_password(login_password)
			return user
		else
			return false
		end
	end   

	def match_password(login_password="")
		encrypted_password == BCrypt::Engine.hash_secret(login_password, salt)
	end

	def self.create_with_omniauth(auth, shredder_id)
		user = User.new
		user["password"] = "lolswagswapmart"
		#user["password_confirmation"] = "lolswagswapmart"
		user.provider = auth["provider"]
		user.uid = auth["uid"]
		user.email = auth['info']['email'] || ''
    	user.username = auth["info"]["name"]
    	user.shredder_id = shredder_id
    	user.save
    	return user
	end
end
