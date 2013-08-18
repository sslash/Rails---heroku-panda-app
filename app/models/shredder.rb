class Shredder
  include MongoMapper::Document

  #key :id, ObjectId
  key :username, String
  key :email, String
  key :fanees,  Array
  key :guitars, Array
  key :equiptment, Array
  key :birthdate, Date
  key :gender, String
  key :history, String
  key :country, String
  key :playstyle, String
  key :profileImagePath, String
  many :shreds

end
