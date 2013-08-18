class Battle
  include MongoMapper::Document

  	key :timeCreated, Time
  	key :battleStyle, String
  	key :lastBattleShred, Time
  	key :battleRounds, Array
end
