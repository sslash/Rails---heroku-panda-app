class BadgeController < ApplicationController
	def obainBadgeForShred(user, shred)

	end

	def obainBadgeWhenTabsAreCreated(user)
		if not user.badges['theYoungTutorer']
			badge = Badge.find(:title => 'The Young Tutorer')
			return addBadgeToUser(badge, user)
		else
			return nil
		end
	end

	def addBadgeToUser (badge, user)
		user.badges[badge.title] = {
			timeCreated : Time.now,
			badgeRef : badge.id
		}
		user.save
		return badge
	end
end
