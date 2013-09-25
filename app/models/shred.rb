class Shred
	include MongoMapper::Document


    validates :title, presence: true, length: { minimum: 2 }
    validates :videoPath, presence: true
    validates :videoThumbnail, presence: true
    validates :type, presence: true, inclusion: { in: %w(Shred Tutorial Cover Gear-Review JamTrack),message: "%{value} is not a valid type" }

    key :title, String
    key :videoPath, String
    key :videoThumbnail, String
    key :description, String
    key :viewed, Integer 
    key :shredRating, Object
    key :shredComments, Array
    key :owner, Hash
    key :tags, Array, :default => []
    key :tabs, Object
    key :type, String
    key :backingTrack, String 
    key :timeCreated, Time, :default => Time.now

    def addShredVideo(videFile)
        return nil unless videoFile
        @video = Panda::Video.find(videFile)
        @h264_encoding = @video.encodings['h264']
        self.videoPath = @h264_encoding.url
        self.videoThumbnail = @h264_encoding.screenshots[1]
    end

    def addShredVideo_test(video)
        return nil unless video
        self.videoPath = video
        self.videoThumbnail = video
    end


    def addBackingTrack track

    end

    def addTabs tabs

    end

    def self.parseTags(tags)
        return tags.split(/\s*,\s*/)
    end

    def self.create_from_params (params, owner)
        shred = Shred.new
        shred.title = params[:title]
        shred.description = params[:description] 
        shred.type = params[:type]
        shred.tags = parseTags(params[:tags]) if params[:tags]

        shred.addShredVideo_test(params[:shredVideo])

        shred.addBackingTrack(params[:backingTrack]) if params[:backingTrack]
        shred.addTabs(params[:tabs]) if params[:tabs]
        return shred
    end
end
