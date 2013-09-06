class PandaController < ApplicationController
  def authorize_upload
    payload = JSON.parse(params['payload'])
    upload = Panda.post('/videos/upload.json', {
      file_name: payload['filename'],
      file_size: payload['filesize'],
      profiles: "h264",
      # payload: 'something',
      # path_format: ':video_id/:profile/play',
    })
    debugger
    logger.debug ("SWAG: #{upload}")
    if (upload['path'])
      logger.debug ("SWAG2: #{upload['path']}")
    end

    render :json => {:upload_url => upload['location']}
  end

  def show
    @video = Panda::Video.find(params[:id])
    @h264_encoding = @video.encodings['h264']
    logger.debug "SWAG: #{@h264_encoding}"
    render template: "show", status: :partial_content, layout: false
  end
end

# file:
# Xd {id: "file3", name: "swag.mov", size: 4387188, xb: Object, Na: File…}
# Ac: "application/octet-stream"
# Da: Yd
# I: "http://vm-32t40g.upload.pandastream.com/upload/session?id=24c049dff4a28a11f3c939b88127b779"
# Na: File
# U: 0
# a: $
# closure_uid_9c4dzb: 13
# fa: "file"
# id: "file3"
# mc: "http://vm-32t40g.upload.pandastream.com/upload/session?id=24c049dff4a28a11f3c939b88127b779"
# n: V
# name: "swag.mov"
# size: 4387188
# xb: Object
# __proto__: c
# data:
# Object {id: "844d28b6d5de279f40b878e131fca409", status: "processing", created_at: "2013/09/06 19:13:25 +0000", updated_at: "2013/09/06 19:13:26 +0000", mime_type: null…}
# audio_bitrate: 98
# audio_channels: 2
# audio_codec: "aac"
# audio_sample_rate: 44100
# created_at: "2013/09/06 19:13:25 +0000"
# duration: 15822
# extname: ".mov"
# file_size: 4387188
# fps: 14.49
# height: 426
# id: "844d28b6d5de279f40b878e131fca409"
# mime_type: null
# original_filename: "swag.mov"
# path: "844d28b6d5de279f40b878e131fca409"
# source_url: null
# status: "processing"
# updated_at: "2013/09/06 19:13:26 +0000"
# video_bitrate: 2056
# video_codec: "h264"
# width: 640
# __proto__: Object