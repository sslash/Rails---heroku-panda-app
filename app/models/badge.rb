class Badge
  include MongoMapper::Document

  key :title, String
  key :description, String
  key :img, String
  key :xpGained, Integer

end
