Shredhub::Application.routes.draw do
  root :to => 'sessions#landingpage'

  scope "/api" do
    post "/shredders/" => "sessions#create_new_user"
  end
end
