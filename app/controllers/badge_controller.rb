class BadgeController < ApplicationController

	def checkForFirst10FansBadge (user)
		if user.badges['First 10 Fans']
			return nil
		end

		if user.fans.length >= 10
			badge = Badge.first(:title => 'First 10 Fans')
			return addBadgeToUser(badge, user)
		else
			return nil
		end

	end

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
			:timeCreated => Time.now,
			:badgeRef => badge.id
		}
		user.xp += badge[:xpGained]
		user.save
		return badge
	end
end
