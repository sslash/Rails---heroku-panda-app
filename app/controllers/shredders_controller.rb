class ShreddersController < ApplicationController

	before_filter :verify_user_is_allowed, :only => [:addFile, :update, 
		:addGuitar, :addGear] 

		def getById
			shredder = Shredder.find(params[:id].to_s)
			if shredder 
				return fetchShredsForShredder(shredder);
			else
				return render :nothing => true, :status => 400
			end
		end

		def getShredders
			logger.debug "sesh: #{session}"
			query = Hash.new
			if params['q']
				query[:username] = params['q']
			end
			offset = params['offset']
			if offset
				offset = offset.to_s.gsub(/\D/, '').to_i
			else
				offset = 20
			end
			skip = Integer(params['page'])
			if skip
				skip = skip.to_s.gsub(/\D/, '').to_i - 1
			else
				skip = 0
			end

			shredders = Shredder.where(query).limit(offset).skip(skip)
			if shredders
				render :json => shredders
			else
				render :nothin => true
			end
		end

		def index
			@shredders = Shredder.all(:limit => 20)

			respond_to do |format|
				format.json { render json: @shredders }
			end
		end

		def getSotw
			logger.debug("Shredder of the week");
			logger.debug("Session in sotw: #{session}")
			@shredder = Shredder.first(:shredderOfTheWeek => true)
			if @shredder
				@shreds = Shred.where('owner._id' => @shredder.id.to_s).limit(4)
				logger.debug("#{@shreds}")
				logger.debug("#{@shredder}")
				return render json: {:shredder => @shredder, :shreds => @shreds}
			end

			render :nothing => true, :status => 500
		end

		def fetchShredsForShredder (shredder)
			shreds = Shred.where('owner._id' => shredder.id.to_s).limit(20)
			return fetchBattlesForShredder(shredder, shreds)
			#return render json: {:shredder => shredder, :shreds => shreds}
		end

		def fetchBattlesForShredder(shredder,shreds)
			s_id = shredder.id.to_s
			battles = Battle.where({:$or => [
			{'battlee._id' => s_id},
			{'battler._id' => s_id}
			]}).limit(20)

			return render json: {
				:shredder => shredder,
				:shreds => shreds,
				:battles => battles
			}
		end

		def getSweetShredder
			shredders = Shredder.sort(:timeCreated).limit(4);
			render :json => shredders;
		end

		def addGuitar
			logger.debug("add guitar: #{params}")
			logger.debug("Session: #{session}")
			@shredder = Shredder.find session[:user_id]
			arr = @shredder[:guitars]
			gtr = params[:shredder]
			arr.push(gtr);

			if @shredder.save
				render :json => {:shredder => @shredder}, :status => 200
			else
				return render :nothing => true, :status => 400
			end	
		end

		def addGear
			logger.debug("add gear: #{params}")
			logger.debug("Session: #{session}")
			@shredder = Shredder.find session[:user_id]
			arr = @shredder[:equiptment]
			equiptment = params[:shredder]
			arr.push(equiptment);

			if @shredder.save
				render :json => {:shredder => @shredder}, :status => 200
			else
				return render :nothing => true, :status => 400
			end	
		end

		def update
			logger.debug("edit profile: #{params}")
			logger.debug("Session: #{session}")
			@shredder = Shredder.find session[:user_id]

			@shredder.gender = params[:gender]

			if params[:birthdate]
				@shredder.birthdate = Date.strptime(params[:birthdate], '%d-%m-%Y')
			end

			if params[:country]
				@shredder.country = params[:country]	
			end
			if params[:playstyle]
				@shredder.playstyle = params[:playstyle]
			end
			if params[:history]
				@shredder.history = params[:history]
			end

			if @shredder.save
				render :json => {:shredder => @shredder}, :status => 200
			else
				render :nothing => true, :status => 400
			end	
		end

		def addFile
			logger.debug("Add file yea: #{params}")
			logger.debug("Session: #{session}")
			file = params[:file]
			kind = params[:kind]

			filename = session[:user_id].to_s + '_'

			if ( 'guitarImg' == kind)
				filename = filename + "guitar_"
			elsif ( 'gearImg' == kind)
				filename = filename + "gear_"
			elsif ( 'profileImg' == kind)
				filename = filename + "profile_" + file.original_filename
				file.original_filename = filename
				uploadFile()
				@shredder = Shredder.find session[:user_id]
				@shredder.profileImagePath = filename
				@shredder.save
				return render :json => @shredder, :status => 200
			else
				return render :nothing => true, :status => 400
			end

			filename = filename + file.original_filename
			file.original_filename = filename

			uploadFile()
			render :json => {'filename' => filename}, :status => 200		
		end

		def addFanee
			logger.debug("Add fanee: #{params}")
			logger.debug("Sesh: #{session}")
			userId = session[:user_id] 
			uid = params[:uid]
			shredder = Shredder.find(uid)
			user = Shredder.find(userId)
			if shredder and user
				fanees = user.fanees

      			# Check if they are fanee
      			fanees.each do | f |
      				logger.debug "f: #{f}"
      				if f['id'].to_s == uid
      					return render :nothing => true, :status => 400
      				end
      			end

      			# use data from fetched!!!! 
      			
      			# Add to fanees list
      			fanee = {
      				"_id" => shredder['_id'],
      				"username" => shredder['username'],
      				"profileImagePath" => shredder['profileImagePath']
      			}

      			fanees.push (fanee)
      			user.save
      			render :json => fanee, :status => 200
      		else
      			return render :nothing => true, :status => 400
      		end
      	end
      end
