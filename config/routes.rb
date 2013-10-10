Shredhub::Application.routes.draw do
  root :to => 'sessions#landingpage'

  # Authentication
  match '/auth/:provider/callback', :to => 'sessions#omniAuth_login'
  match '/bail', :to => 'sessions#logout'
  match '/auth/failure', :to => 'sessions#omniAuth_login_failure'
  match '/registerSuccess', :to => 'sessions#registerUserSuccess'
  match '/auth/userAuthenticate', :to => 'sessions#user_login' 

  scope "/api" do
    post "/shredders/" => "sessions#create_new_user"


    # Shredders
    get "/shredders/" => "shredders#getShreddersByQuery"

    # Shreds
    post "/shreds/" => "shreds#save"
    get "/shreds/" => "shreds#getShredsByQuery"
  end
end
