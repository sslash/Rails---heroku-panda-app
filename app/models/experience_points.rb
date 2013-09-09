class ExperiencePoints
	def increaseXPFromBadge(shredder, badge)
		return self.increaseXp(badge.xpGained, shredder)
	end

	def increaseXp(xp, shredder)
		oldXp = shredder.xp
		newXp = oldXp + xp;

		shredder.xp = newXp
		shredder.save()
	end
end
