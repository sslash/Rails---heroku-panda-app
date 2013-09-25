require 'test_helper'

class ShredTest < ActiveSupport::TestCase

	test "Invalid without a name" do
		s = Shred.new
		assert !s.valid?, "Title is not being validated"
	end

	test "Valid with all attributes" do
		attrs = {
			:title => "Sweet title",
			:videoPath => "sap/dap.fap"
		}

		s = Shred.new(attrs)
		assert s.valid?, "Should be valid with attributes"
	end

end