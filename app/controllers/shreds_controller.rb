#require 'app/controllers/battles_controller.rb'
class ShredsController < ApplicationController

	before_filter :verify_owner_is_user, :only => [:save]


	def obainBadgeWhenTabsAreCreated(user)
		if not user.badges['The Young Tutorer']
			badge = Badge.first(:title => 'The Young Tutorer')
			return addBadgeToUser(badge, user)
		else
			return nil
		end
	end

	def addBadgeToUser (badge, user)
		user.badges[badge.title] = {
			:timeCreated => Time.now,
			:badgeRef => badge.id
		}
		user.save
		return badge
	end

	# def upload
	# 	# Write video
	# 	file = params[:file]
	# 	uploader = AvatarUploader.new
	# 	uploader.store!(file)

	# 	# Read file, write thumnail
	# 	filename = params[:file].original_filename
	# 	full_filename = "public/uploads/#{filename}"
	# 	movie = FFMPEG::Movie.new(full_filename)

	# 	filename_stripped = File.basename( filename, ".*" ) 
	# 	logger.debug("filename stripped: #{filename_stripped}")
	# 	new_path = "public/uploads/thumbs/#{filename_stripped}.jpg"
	# 	logger.debug("new path: #{new_path}")
	# 	movie.screenshot(new_path)

	# 	render :json => {
	# 		:filename => filename,
	# 		:thumbname => "#{filename_stripped}.jpg"
	# 	}
	# end

	def save
		logger.debug "Will save shred: #{params[:shred]}"
		id = params[:owner]
		@shredder = Shredder.find(id)
		if !@shredder
			return :nothing => true, :status => 401
		end
		experiencePoints = ExperiencePoints.new

		shredData = params[:shred]
		shredData['owner'] = {
			'_id' => @shredder._id.to_s,
			'username' => @shredder.username,
			'imgPath' => @shredder.profileImagePath
		}
		shredData['country'] = @shredder.country
		shredData['timeCreated'] = Time.now

		if params[:tabs]
			# for adding tabs
			experiencePoints.increaseXp(150, @shredder)
			shredData[:tabs] = params[:tabs]
			#TODO: Uncomment this
			#badge = new BadgeController().obainBadgeWhenTabsAreCreated(@shredder)
			#TODO: And remove this with their respective functions
			@badge = obainBadgeWhenTabsAreCreated(@shredder)
		end


		# Fetch video. This must be uncommented changed when releasing!
		#vidId = params[:vidId]
		#@video = Panda::Video.find(vidId)
    	#@h264_encoding = @video.encodings['h264']
    	#shredData['videoPath'] = @h264_encoding.url
    	#shredData['videoThumbnail'] = @h264_encoding.screenshots[1]
    	shredData['videoPath'] = "http://shreddr-vidz.s3.amazonaws.com/75bad08e0a37aa7160adb98e8650bf4c.mp4"
    	shredData['videoThumbnail'] = "http://shreddr-vidz.s3.amazonaws.com/75bad08e0a37aa7160adb98e8650bf4c_2.jpg"


		@shredMongo = Shred.new(shredData)

		if @shredMongo.save

			if @badge
				@shredMongo[:owner][:newBadge] = @badge
				experiencePoints.increaseXPFromBadge(@shredder, @badge)
			end

			# For adding le shred
			experiencePoints.increaseXp(1000, @shredder)

			render json: @shredMongo, :status => 200	
		else
			render :nothing => true, :status => 401
		end
	end

	# TODO: Check if query string is ok
	def topRated
		logger.debug "Will get top rated shred: #{params}"
		query = addParams(params)
		offset = params[:offset] || 20
		page = params[:page] || 0
		offset = offset.gsub(/\D/, '').to_i;
		page = page.gsub(/\D/, '').to_i; 
		skip = offset * page

		@shreds = Shred.where(query).sort('shredRating.currentRating').reverse.limit(offset).skip(skip)
		render json: @shreds
	end 

	def get
		logger.debug "Will get shred: #{params[:id]}"
		render :nothing => true, :status => 200
	end


	# TODO: Verify user is allowed to rate using session
	def rate
		logger.debug "Will rate shred: #{params[:id]},#{params[:val]}"
		id = params[:id]
		rate = Integer(params[:val])
		rater = params[:raterId]
		if ( rate < 1 || rate > 5 || !rater)
			logger.debug "Illegal args. fail"
			render :nothing => true, :status => 401
		end
		@shred = Shred.find(id)
		@shredder = 
		if not @shred
			render :nothing => true, :status => 401
		end
		if ( rater == @shred._id )
			logger.debug "Equal shredder. fail"
			render :nothing => true, :status => 401
		else
			@rating = @shred.shredRating
			@rating['currentRating'] += rate
			@rating['numberOfRaters'] += 1

			if @shred.save
				logger.debug "Success. Ty: #{@shred}"

				# Increase xp for shredder
				ownerId = @shred['owner']['_id']
				@shredder = Shredder.find(ownerId)
				if @shredder
					experiencePoints = ExperiencePoints.new
					experiencePoints.increaseXp(rate, @shredder)
				end

				render :json => @shred, :status => 200
			else
				logger.debug "Failed to save. fail"
				render :nothing => true, :status => 401
			end
		end
	end

	# TODO: Verify user is allowed to rate using session
	def increaseViewed
		logger.debug "Will increase viewed: #{params}"
		id = params[:id]
		@shred = Shred.find(id)
		if @shred
			@shred.viewed += 1
			@shred.save
			render :nothing => true, :status => 200
		else
			render :nothing => true, :status => 500
		end
	end

	def comment
		logger.debug "Will comment shred: #{params[:id]}"
		shredId = params[:id]
		comment = Hash.new
		comment['text'] = params[:text]
		comment['commenterId'] = params[:commenterId]
		comment['commenterName'] = params[:commenterName]
		comment['timeCreated'] = Time.now

		@shred = Shred.find(shredId)
		if @shred
			logger.debug "shred found: #{@shred}"
			@comments = @shred.shredComments
			logger.debug "comments: #{@comments}"
			@comments.push comment
			if @shred.save
				logger.debug "Success. Ty: #{@shred}"
				render :json => @shred, :status => 200
			else
				logger.debug "Failed to save. fail"
				render :nothing => true, :status => 401
			end
		else
			logger.debug "Failed to find. fail"
			render :nothing => true, :status => 401
		end
	end

	##
	# Shredpool
	##
	def byFanees
		logger.debug "Getting shredpool shreds: #{params}"
		id = params[:uid]
		shredder = Shredder.find(id)
		query = addParams(params)
		query['owner._id'] = shredder.fanees.map{|f| f['_id']}		
		shreds = Shred.where(query).limit(40)
		render json: shreds, :status => 200
	end

	# TODO: Country search doesn't work here.. Haven't decided what to do in this case
	def byLocation
		logger.debug "Getting shredpool byLocation: #{params}"
		id = params[:uid]
		@shredder = Shredder.find(id)
		query = addParams(params)
		query['country'] = @shredder.country
		@shreds = Shred.where(query).limit(40)
		render json: @shreds, :status => 200
	end

	def byPopularity
		logger.debug "Getting shredpool byPopularity: #{params}"
		offset = params[:offset] || 40
		page = params[:page] || 0
		offset = offset.gsub(/\D/, '').to_i;
		page = page.gsub(/\D/, '').to_i; 
		skip = offset * (page-1)
		query = addParams(params)
		@shreds = Shred.where(query).sort('viewed').reverse.limit(offset).skip(skip)
		render json: @shreds
	end

	def byDate
		logger.debug "Getting shredpool by date: #{params}"
		offset = params[:offset] || 40
		page = params[:page] || 0
		offset = offset.gsub(/\D/, '').to_i;
		page = page.gsub(/\D/, '').to_i; 
		skip = offset * (page-1)
		query = addParams(params)
		@shreds = Shred.where(query).sort('timeCreated').reverse.limit(offset).skip(skip)
		render json: @shreds
	end

	def addParams (params)
		query = Hash.new
		if params['tags'] and params['tags'].length > 0
			query['tags'] = params['tags'].split(',')
		end
		if params['country']
			query['country'] = params['country']
		end	
		return query
	end
end
