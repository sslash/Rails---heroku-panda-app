class Shred
	include MongoMapper::Document

	key :username, String
	key :email, String
    key :videoPath, String
    key :description, String
    key :viewed, Integer 
    key :shredRating, Object
    key :title, String
    key :shredComments, Array
    key :owner, Hash
    key :tags, Array
    key :shredType, String
    key :timeCreated, Time #TODO: Check if this gets created
    #key :_id, ObjectId



end
