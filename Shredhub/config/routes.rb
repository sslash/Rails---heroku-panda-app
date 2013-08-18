Shredhub::Application.routes.draw do
  root :to => 'sessions#home'

  # Main domains
  get "drums" => "sessions#drums"

  post "sessions/login"
  post "sessions/logout"
  #get "sessions/home"


  post "users/create"
  #resources :shredders
  #resources :shreds
  #resources :users


  # API
  scope "/api" do
    # battles

    post "/battleRequests/create/:battler/:battlee/" => "battleRequests#create"
    post "/battleRequests/:bid/accept/:uid/" => "battleRequests#accept"
    post "/battleRequests/:bid/decline/:uid/" => "battleRequests#decline"
    get "/battleRequests/shredder/:id" => "battleRequests#shredder"
    get "/battleRequests/sent/:id" => "battleRequests#sent"
    get "/battles/shredder/:id" => "battles#withShredder"
    get "/battles/:uid" => "battles#getBattle"
    get "/battles/" => "battles#getBattles"
    post "/battles/:bid/rateee/:index/:uid/" => "battles#rateBattleShredee"
    post "/battles/:bid/rateer/:index/:uid/" => "battles#rateBattleShreder"
    post "/battles/:bid/addBattleShred/:uid" => "battles#addBattleShred"

    # Shredders
    get "/shredders/sotw" => "shredders#getSotw"
    get "/shredders/sweetShredders" => "shredders#getSweetShredder"
    get "/shredders/:id" => "shredders#getById"
    get "/shredders" => "shredders#getShredders"
    post "/shredders/:uid/addFile" => "shredders#addFile"
    post "/shredders/:uid/addGuitar" => "shredders#addGuitar"
    post "/shredders/:uid/addGear" => "shredders#addGear"
    post "/shredders/:uid/update" => "shredders#update"
    post "/shredders/:uid/addFanee" => "shredders#addFanee"

    # Shreds
    post "/shreds/file" => "shreds#upload"
    post "/shreds" => "shreds#save"
    post "/shreds/:id/increaseViewed" => "shreds#increaseViewed"
    
    # api/shreds/:id/rate/:val/:id
    post "/shreds/:id/rate/:val/:raterId" => "shreds#rate"
    post "/shreds/:id/comment" => "shreds#comment"
    
    # api/shreds/topRated?limit=100&offset=1
    get "/shreds/topRated" => "shreds#topRated"

    # SHREDPOOL
    get "/shreds/byFanees/" => "shreds#byFanees"
    get "/shreds/byLocation/" => "shreds#byLocation"
    get "/shreds/byRating/" => "shreds#byRating"
    get "/shreds/byPopularity/" => "shreds#byPopularity"
    get "/shreds/byDate/" => "shreds#byDate"
    

    get "/shreds/:id" => "shreds#get"
  end


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
