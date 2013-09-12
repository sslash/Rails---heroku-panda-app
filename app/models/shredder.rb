class Shredder
  include MongoMapper::Document

  #key :id, ObjectId
  key :username, String
  key :xp, Integer, :default => 1
  key :email, String
  key :fanees,  Array
  key :guitars, Array
  key :equiptment, Array
  key :birthdate, Date
  key :timeCreated, Date
  key :gender, String
  key :history, String
  key :country, String
  key :playstyle, String
  key :badges, Hash, :default => {}
  key :profileImagePath, String
  key :onlineProfileImagePath, String # Only face!
  key :uid, String # For face users only
  many :shreds

end
