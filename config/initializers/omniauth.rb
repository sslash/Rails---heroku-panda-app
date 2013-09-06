OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
	provider :facebook, '322423007904195', 'd7fd67f5fbda8a09badbce0f0d2ea102', :display => 'popup'
end