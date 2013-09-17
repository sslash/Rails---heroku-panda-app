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
  key :fans, Array, :default => []
  key :last_logged_in, Time
  key :profileImagePath, String # Old, this should be removed!
  key :onlineProfileImagePath, String
  key :uid, String # For face users only
  many :shreds
end
