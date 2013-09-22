class Shred
	include MongoMapper::Document

	key :username, String
	key :email, String
    key :videoPath, String
    key :videoThumbnail, String
    key :description, String
    key :viewed, Integer 
    key :shredRating, Object
    key :title, String
    key :shredComments, Array
    key :owner, Hash
    key :tags, Array
    key :shredType, String
    key :timeCreated, Time, :default => Time.now
end
