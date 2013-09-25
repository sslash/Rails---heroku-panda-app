class ShredQuery

	##
	# Params could be: Title, tag, type
	def self.get_shreds_for_param(param, size, skip)
		q = Regexp.new(param, "i")
		Shred.where(:$or => [{:tags => {:$in => [q]}},{:title => q}]).limit(size).skip(skip)
	end
end