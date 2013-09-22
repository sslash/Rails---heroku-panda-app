class Shredder
  include MongoMapper::Document

  EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i
  validates :username, :presence => true, :uniqueness => true, :length => { :in => 3..30 }
  validates :email, :presence => true, :uniqueness => true, :format => EMAIL_REGEX
  
  key :username, String
  key :xp, Integer, :default => 1
  key :email, String
  key :fanees,  Array
  key :guitars, Array
  key :equiptment, Array
  key :birthdate, Date
  key :timeCreated, Time, :default => Time.now
  key :gender, String
  key :history, String
  key :location, String
  key :playstyle, String
  key :badges, Hash, :default => {}
  key :fans, Array, :default => []
  key :last_logged_in, Time
  key :image, String
  many :shreds

  def add_last_login_time
    self[:last_logged_in] = Time.now
    self.save
  end

  def add_image (params)
    # res = Cloudinary::Uploader.upload(params[:profilePicture], 
    #      :width => params[:w], :height => params[:h],
    #      :x  => params[:x1] , :y => params[:y1], 
    #      :crop => :crop, :format => 'jpg')
    # self.image = res["url"]
    # self.save
  end

  def self.create_from_omniauth(auth)
    shredder = Shredder.new
    shredder.username = auth['info']['name']
    shredder.location = auth['info']['location']
    shredder.image    = auth['info']['image']
    shredder.email    = auth['info']['email'] || ''
    shredder.save
    return shredder
  end

  def self.create_from_user(user)
    shredder = Shredder.new
    shredder.username = user.username
    shredder.email = user.email
    return shredder
  end
end
