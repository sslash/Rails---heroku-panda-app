class NoCompression
  def compress(string)
    # do nothing
    string
  end
end

config.assets.compress = true
config.assets.js_compressor = NoCompression.new
config.assets.css_compressor = NoCompression.new