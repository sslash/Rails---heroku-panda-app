class ShreddersController < ApplicationController

	def getShreddersByQuery
		sort = params[:sort]
		sort = addSort(sort)
		limit = params[:offset] || 40
		page = params[:page] || 0
		page = page.gsub(/\D/, '').to_i; 
		limit = limit.gsub(/\D/, '').to_i;
		skip = limit * page
		return render :nothing => true, :status => 401 if limit > 40
		
		@shredders = Shredder.sort(sort).reverse.limit(limit).skip(skip)
		render json: @shredders
	end
end
