{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Smart action to create several records from the input of a single smart action form

**Description**: From a smart action form which asks input for 3 new products at a time (picture + description), catch the posted payload and create 3 products

```ruby
require 'data_uri'
require 'base64'

class Forest::ProductsController < ForestLiana::ApplicationController

  def split_product
    attrs = params.dig('data', 'attributes', 'values')
    created_items = 0

    (1..3).each do |i|
      new_product_picture = attrs["product_#{i}_picture"];
      new_product_description = attrs["product_#{i}_description"];
      if new_product_picture && new_product_description
        # if you are storing your pictures in a cloud and your DB stores the pictures url -> include here a function to send the base64 image to your cloud and fetch back the corresponding url
        Product.new({
          label: product_description,
          picture: product_picture,
        })
        created_items += 1 if Product.save
      end
    end

    success_message = 'Successfully created ' + created_items.to_s + ' item(s)'
    puts success_message
    render json: { success: success_message }

  end

  def split_product_values
    context = get_smart_action_context
    picture_url = context[:picture]

    render serializer: nil, json: { product_1_picture: picture_url, product_2_picture: picture_url, product_3_picture: picture_url}, status: :ok
  end

end
```
