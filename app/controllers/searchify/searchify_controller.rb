module Searchify
  class SearchifyController < ::ApplicationController

    respond_to :js

    skip_before_action :verify_authenticity_token

    layout false

    def search
      resource_class  = params[:collection].classify.constantize
      search_term     = params[:term]
      search_keyword  = extract_search_key(resource_class)
      search_strategy = params[:search_strategy] || :search_strategy

      collection = if resource_class.respond_to?(search_strategy)
        resource_class.send(search_strategy, search_term, searchify_scopes)
      else
        columns = Searchify::Config.column_names & resource_class.column_names

        scoped = resource_class.where( columns.map{ |c| "(#{c} #{search_keyword} :term)" }.join(' OR '), :term => "%#{search_term}%")

        searchify_scopes.each do |key, value|
          scoped = scoped.send(key, value) if resource_class.respond_to?(key)
        end

        scoped.limit(Searchify::Config.limit).map do |resource|
          {:label => resource.send(Searchify::Config.label_method), :id => resource.id}
        end
      end

      render :json => collection.to_json
    end

    protected

    def extract_search_key(resource_class)
      Searchify::Config.search_key || begin
        case resource_class.connection.adapter_name
          when 'PostgreSQL'
            'ILIKE'
          else
            'LIKE'
        end
      end
    end
  end
end
