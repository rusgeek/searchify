Searchify::Engine.routes.draw do
  get '/search/:collection' => "searchify#search"
end
