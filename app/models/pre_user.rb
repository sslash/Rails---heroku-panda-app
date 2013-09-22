class PreUser
  include MongoMapper::Document

  #protect attributes from mass assignment
	attr_accessible :email

	# Validations
	EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i
	validates :email, :presence => true, :uniqueness => true, :format => EMAIL_REGEX
	
	key :email, String
	key :timeCreated, Time, :default => Time.now
end
