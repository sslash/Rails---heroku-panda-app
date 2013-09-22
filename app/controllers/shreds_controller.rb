class ShredsController < ApplicationController

	def getShredsByQuery
		sort = params[:sort]
		sort = addSort(sort)
		offset = params[:offset] || 40
		page = params[:page] || 0
		offset = offset.gsub(/\D/, '').to_i;
		page = page.gsub(/\D/, '').to_i; 
		skip = offset * page

		return render :nothing => true, :status => 401 if offset > 40

		logger.debug "sap: #{sort} #{offset}, #{skip}"
		@shreds = Shred.sort(sort).reverse.limit(offset).skip(skip)
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