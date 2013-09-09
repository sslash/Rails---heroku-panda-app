source 'https://rubygems.org'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

#gem 'sqlite3'

require 'rubygems'
require 'mongo'
source 'http://gemcutter.org'

gem 'rails', '3.2.13'
#gem 'rails', '4.0.0'
gem "mongo_mapper"
gem 'bson_ext'

# Becuase file uploads kill sessions
gem "redactor-rails", "~> 0.3"

# Use haml templates
#gem 'haml'

gem 'bcrypt-ruby', :require => 'bcrypt'

# File uploads
gem 'carrierwave'

# streamio-ffmpeg
require 'rubygems'
#require 'streamio-ffmpeg'
gem 'panda', '~> 1.6.0'

# Facebook login
#gem 'omniauth-facebook'
gem 'omniauth-facebook', '1.4.0'

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
	gem 'less-rails'
	#gem 'jquery-rails'  # If using Bootstrap's JS plugins.
	gem 'less-rails-bootstrap'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platforms => :ruby

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