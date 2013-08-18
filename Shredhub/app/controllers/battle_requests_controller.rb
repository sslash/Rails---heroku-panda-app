class BattleRequestsController < ApplicationController

	before_filter :verify_user_is_allowed, :only => [:accept, :decline]

	def shredder
		logger.debug "battle req shredder: #{params[:id]}"
		@res = BattleRequest.all('battlee._id' => params[:id])
		render json: @res
	end


	def sent
		logger.debug "battle req sent: #{params[:id]}"
		@res = BattleRequest.all('battler._id' => params[:id])
		render json: @res
	end

	def create
		logger.debug "battle req create: #{params}"
		logger.debug "SESH: #{session}"

		if session[:user_id].to_s != params[:battler]
			render :nothing => true, :status => 400 
		end

		file = params[:file]
		battler = Shredder.find(params[:battler])
		battlee = Shredder.find(params[:battlee])


		filename = BattlesController.storeBattleShredFile file, session[:user_id].to_s
		shred = {
			:rating => {
				:currentRating => 0,
				:numberOfRaters => 0
				},
			:timeCreated => Time.now,
			:videoPath => filename
		}
		battleData = {
			:timeCreated => Time.new,
			:battleStyle => params[:style].to_s,
			:lastBattleShred => Time.now,
			:battleRounds => Array.new,
			:battler => {
				:_id => battler['_id'].to_s,
				:profileImagePath => battler['profileImagePath'],
				:username => battler['username'],
			},
			:battlee => {
				:_id => battlee['_id'].to_s,
				:profileImagePath => battlee['profileImagePath'],
				:username => battlee['username'],
			},
		}

		battleData[:battleRounds].push({
				:battlersShred => shred#,
				#:battleesShred => Hash.new
		})

		logger.debug("battle: #{battleData}" )

		battle = BattleRequest.new(battleData)
		if battle.save
			render :json => battle 
		else
			render :nothing => true, :status => 200
		end
	end

	def accept
		logger.debug "battle req accep: #{params}"
		logger.debug "SESH: #{session}"
		battle_req = BattleRequest.find(params[:bid])
		
		# Not allowed to accept other's. havent tested this..
		if session[:user_id].to_s != battle_req['battlee']['_id']
			render :nothing => true, :status => 400 
		end

		logger.debug "battle reqw: #{battle_req}"
		battle = Battle.new(battle_req.serializable_hash)
		if battle.save
			logger.debug "ok, will delete"
			battle_req.delete
			render :json => battle 
		else
			render :nothing => true, :status => 400
		end
	end

	def decline
		logger.debug "battle req accep: #{params}"
		logger.debug "SESH: #{session}"
	end
end
