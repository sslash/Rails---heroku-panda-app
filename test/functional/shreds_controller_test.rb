require 'test_helper'

class ShredsControllerTest < ActionController::TestCase
  test "should create shred with title and video and type" do
  	attrs = {
  		:title => "Title sap",
  		:shredVideo => "Video lol",
  		:type => "Tutorial"
  	}

    post("save", attrs, {'user_id' => "1234"})
    assert_response 200
  end

  test "should not create shred with wrong type" do
  	attrs = {
  		:title => "Title sap",
  		:shredVideo => "Video lol",
  		:type => "Retard"
  	}

    post("save", attrs, {'user_id' => "1234"})
    assert_response 400
  end

  test "should not create shred without title" do
  	attrs = {
  		:shredVideo => "Video lol",
  		:type => "Shred"
  	}

    post("save", attrs, {'user_id' => "1234"})
    assert_response 400
  end

  test "should not create shred without video" do
  	attrs = {
  		:title => "Title sap",
  		:type => "Shred"
  	}

    post("save", attrs, {'user_id' => "1234"})
    assert_response 400
  end

  test "should not be allowed to save if not logged in" do
    post("save", {}, {'user_id' => nil})
    assert_response 401
  end
end
