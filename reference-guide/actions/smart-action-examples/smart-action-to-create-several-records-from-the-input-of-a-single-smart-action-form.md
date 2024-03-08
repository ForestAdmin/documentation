{% hint style="warning" %}
Please be sure of your agent type and version and pick the right documentation accordingly.
{% endhint %}

{% tabs %}
{% tab title="Node.js" %}
{% hint style="danger" %}
This is the documentation of the `forest-express-sequelize` and `forest-express-mongoose` Node.js agents that will soon reach end-of-support.

`forest-express-sequelize` v9 and `forest-express-mongoose` v9 are replaced by [`@forestadmin/agent`](https://docs.forestadmin.com/developer-guide-agents-nodejs/) v1.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="Ruby on Rails" %}
{% hint style="success" %}
This is still the latest Ruby on Rails documentation of the `forest_liana` agent, you’re at the right place, please read on.
{% endhint %}
{% endtab %}

{% tab title="Python" %}
{% hint style="danger" %}
This is the documentation of the `django-forestadmin` Django agent that will soon reach end-of-support.

If you’re using a Django agent, notice that `django-forestadmin` v1 is replaced by [`forestadmin-agent-django`](https://docs.forestadmin.com/developer-guide-agents-python) v1.

If you’re using a Flask agent, go to the [`forestadmin-agent-flask`](https://docs.forestadmin.com/developer-guide-agents-python) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="PHP" %}
{% hint style="danger" %}
This is the documentation of the `forestadmin/laravel-forestadmin` Laravel agent that will soon reach end-of-support.

If you’re using a Laravel agent, notice that `forestadmin/laravel-forestadmin` v1 is replaced by [`forestadmin/laravel-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v3.

If you’re using a Symfony agent, go to the [`forestadmin/symfony-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}
{% endtabs %}

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
