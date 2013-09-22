OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
	provider :facebook, '322423007904195', 'd7fd67f5fbda8a09badbce0f0d2ea102', :display => 'popup'
	provider :twitter, 'sj8ID8ZqhP6WSr1aLRvTfQ', '6vnl3rvpb0ygxl8jhvvULWzwbsnradHLPhRplJaUIdE'
	provider :google_oauth2, '457713609877.apps.googleusercontent.com', 'qoeWFdkSKtzetF8VoG3JSuGT'
end