class ShredsController < ApplicationController

	before_filter :must_be_logged_in, :only => [:save]

	def save
		user = fetch_user
		@shred = Shred.create_from_params(params,user)
		if @shred.save
			render json: @shred
		else
			render json: {:errors => @shred.errors.as_json}, :status => 400
		end
	end

	def getShredsByQuery
		sort = params[:sort]
		sort = addSort(sort)
		limit = params[:offset] || 40
		page = params[:page] || 0
		page = page.gsub(/\D/, '').to_i; 
		limit = limit.gsub(/\D/, '').to_i;
		skip = limit * page
		return render :nothing => true, :status => 401 if limit > 40


		if params[:params]
			@shreds = ShredQuery.get_shreds_for_param params[:params], limit, skip
		else
			@shreds = Shred.sort(sort).reverse.limit(limit).skip(skip)
		end
		render json: @shreds
	end

	def addSort query
		if query == 'topRated'
			return 'shredRating.currentRating'
		else
			return ''
		end
	end
end