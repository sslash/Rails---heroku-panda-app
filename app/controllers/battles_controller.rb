class BattlesController < ApplicationController
	before_filter :verify_user_is_allowed, :only => [:addBattleShred] 

	def withShredder
		logger.debug "battles with shredder: #{params[:id]}"
		uid = params[:id].to_s
		@battles = Battle.all({:$or => [
			{'battlee._id' => uid},
			{'battler._id' => uid}
			]})

		render json: @battles
	end

	def getBattle
		logger.debug "get battle: #{params[:id]}"
		logger.debug "sesh: #{session}"
		battle = Battle.find(params[:uid])
		if battle
			render json: battle
		else
			render :nothing => true, :status => 404
		end
	end

	def getBattles
		logger.debug "get battles: #{params}"
		offset = (params.has_key?("offset") ? params["offset"].to_s.gsub(/\D/, '').to_i : 20)
		skip = (params.has_key?("page") ? params["page"].to_s.gsub(/\D/, '').to_i - 1 : 0)
		battles = Battle.where({}).limit(offset).skip(skip)
		render json: battles
	end

	def addBattleShred
		logger.debug "add battle shred: #{params}"
		battle = Battle.find(params[:bid])

		if battle
			uid = params[:uid]
			if battle.battlee['_id'].to_s != uid and battle.battler['_id'].to_s != uid
				return render :nothing => true, :status => 401
			end

			filename = addBattleShredFile params[:file]
			shred = {
				:rating => {
					:currentRating => 0,
					:numberOfRaters => 0
					},
					:timeCreated => Time.now,
					:videoPath => filename
				}		

			# create new batttleesshred
			if !battle.battleRounds[0]['battleesShred']
				battle.battleRounds[0]['battleesShred'] = shred

			else
				battle.battleRounds.unshift({
					:battlersShred => shred,
					:battleesShred => nil
					})
			end
			battle.lastBattleShred = Time.now;
			battle.save
			render :json => battle
		else
			render :nothing => true, :status => 401
		end
	end

	def addBattleShredFile (file)
		filename = session[:user_id].to_s + '_battle'
		filename = filename + file.original_filename
		file.original_filename = filename
		uploadFile()
		return filename
	end

	def self.storeBattleShredFile (file, uid)
		filename = uid + '_battle'
		filename = filename + file.original_filename
		file.original_filename = filename
		uploadFile file
		return filename
	end

	def rateBattleShreder
		index = Integer(params[:index])
		battle = Battle.find(params[:bid])
		battleShred = battle.battleRounds[index]['battlersShred']	
		if battleShred
			battle.battleRounds[index]['battlersShred'] = doRate battleShred
			if battle.battleRounds[index]['battleesShred'] and battle.save
				logger.debug "Success. Tyee: #{battle}"
				return render :json => battle, :status => 200
			end
		end
		render :nothing => true, :status => 401
	end

	def rateBattleShredee
		index = Integer(params[:index])
		battle = Battle.find(params[:bid])
		battleShred = battle.battleRounds[index]['battleesShred']
		if battleShred
			battle.battleRounds[index]['battleesShred'] = doRate battleShred
			if battle.battleRounds[index]['battleesShred'] and battle.save

				logger.debug "Success. Ty: #{battleShred}"
				return render :json => battle, :status => 200
			end
		end
		render :nothing => true, :status => 401
	end

		def doRate (battleShred)
			rate = Integer(params[:val])
			rater = params[:uid]
			if ( rate < 0 || rate > 10 )
				return null
			else
				battleShred['rating']['currentRating'] = Integer(battleShred['rating']['currentRating']) + rate
				battleShred['rating']['numberOfRaters'] = Integer(battleShred['rating']['numberOfRaters']) + 1
				return battleShred

			end

		end
	end
