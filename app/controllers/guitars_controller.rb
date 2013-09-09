class GuitarsController < ApplicationController
	def getById
		@guitar = Guitar.find(id)
	end
end
