source 'https://rubygems.org'
ruby '1.9.3'

gem 'rails', '3.2.13'

gem "mongo_mapper"
gem 'bson_ext'

gem 'rails_12factor', group: :production

gem "requirejs-rails", "~> 0.9.1"

# Becuase file uploads kill sessions
#gem "redactor-rails", "~> 0.3"

gem 'bcrypt-ruby', :require => 'bcrypt'

# File uploads
gem 'carrierwave'
gem 'cloudinary'
gem 'panda', '~> 1.6.0'

#Authentication
gem 'omniauth'
gem 'omniauth-facebook', '1.4.0'
gem 'omniauth-twitter'
gem "omniauth-google-oauth2"

group :development, :test do
	gem 'linecache19', :git => 'git://github.com/mark-moseley/linecache'
	gem 'ruby-debug-base19x', '~> 0.11.30.pre4'
	gem 'ruby-debug19'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
	gem 'sass-rails',   '~> 3.2.3'
	gem 'coffee-rails', '~> 3.2.1'
	gem 'therubyracer'  # If using Ruby
	gem 'less-rails-bootstrap'
  	gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
#gem 'debugger'
#gem 'ruby-debug19'