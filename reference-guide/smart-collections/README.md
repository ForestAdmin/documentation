# Smart Collections

### What is a Smart Collection?

A Smart Collection is a Forest Collection based on your API implementation. It allows you to reconcile fields of data coming from different or external sources in a single tabular view (by default), without having to physically store them into your database.

Fields of data could be coming from many other sources such as other B2B SaaS (e.g. Zendesk, Salesforce, Stripe), in-memory database, message broker, etc.

{% hint style="info" %}
This is an **advanced** notion. If you're just starting with Forest Admin, you should skip this for now.
{% endhint %}

In the following example, we have created a **Smart Collection** called `customer_stats`allowing us to see all customers who have placed orders, the number of order placed and the total amount of those orders.

**For an example of advanced customisation and featuring an Amazon S3 integration,** you can see [here](examples/amazon-s3-integration-example.md) how we've stored in our live demo the companies' legal documents on Amazon S3 and how we've implemented a **Smart Collection** to access and manipulate them.

### Creating a Smart Collection <a href="#creating-a-smart-collection" id="creating-a-smart-collection"></a>

{% tabs %}
{% tab title="SQL" %}
First, we declare the `customer_stats` collection in the `forest/` directory.

In this Smart Collection, we want to display for each customer its email address, the number of orders made (in a field `orders_count`) and the sum of the price of all those orders (in a field `total_amount`).

You can check out the list of [available field options ](../smart-fields/#available-field-options)if you need it.

{% hint style="warning" %}
You **MUST** declare an `id` field when creating a Smart Collection. The value of this field for each record **MUST** be unique.

As we are using the _customer id_ in this example, we do not need to declare an `id` manually.
{% endhint %}

{% code title="forest/customer_stats.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const models = require('../models');

collection('customer_stats', {
  isSearchable: true,
  fields: [{
      field: 'email',
      type: 'String',
    }, {
      field: 'orders_count',
      type: 'Number',
    }, {
      field: 'total_amount',
      type: 'Number',
  }],

});
```
{% endcode %}

{% hint style="info" %}
The option`isSearchable: true` added to your collection allows to display the search bar. Note that you will have to implement the search yourself by including it into your own `get` logic.
{% endhint %}
{% endtab %}

{% tab title="Mongodb" %}
_Work in progress - this section will soon be released_
{% endtab %}

{% tab title="Rails" %}
First, we declare the `CustomerStat` collection in the `lib/forest-liana/collections/` directory.

In this Smart Collection, we want to display for each customer its email address, the number of orders made (in a field `orders_count`) and the sum of the price of all those orders (in a field `total_amount`).

You can check out the list of [available field options ](../smart-fields/#available-field-options)if you need it.

{% hint style="warning" %}
You **MUST** declare an `id` field when creating a Smart Collection. The value of this field for each record **MUST** be unique.

As we are using the _customer id_ in this example, we do not need to declare an `id` manually.
{% endhint %}

{% code title="lib/forest-liana/collections/customer_stat.rb" %}
```ruby
class Forest::CustomerStat
  include ForestLiana::Collection

  collection :CustomerStat, is_searchable: true

  field :id, type: 'Number', is_read_only: true
  field :email, type: 'String', is_read_only: true
  field :orders_count, type: 'Number', is_read_only: true
  field :total_amount, type: 'Number', is_read_only: true

end
```
{% endcode %}

{% hint style="info" %}
The option`is_searchable: true` added to your collection allows to display the search bar. Note that you will have to implement the search yourself by including it into your own `get` logic in your collection controller.
{% endhint %}
{% endtab %}

{% tab title="Django" %}
First, we declare the `CustomerStat` collection in the `app/forest/customer_stat.py` file.

In this Smart Collection, we want to display for each customer its email address, the number of orders made (in a field `orders_count`) and the sum of the price of all those orders (in a field `total_amount`).

You can check out the list of [available field options ](../smart-fields/#available-field-options)if you need it.

{% hint style="warning" %}
You **MUST** declare an `id` field when creating a Smart Collection. The value of this field for each record **MUST** be unique.

As we are using the _customer id_ in this example, we do not need to declare an `id`
{% endhint %}

{% code title="app/forest/customer_stats.py" %}
```python
from django_forest.utils.collection import Collection


class CustomerStat(Collection):

    is_searchable = True
    
    def load(self):
        self.name = 'CustomerStat'
        self.fields = [
            {
                'field': 'id',
                'type': 'Number',
            },
            {
                'field': 'email',
                'type': 'String'
            },
            {
                'field': 'orders_count',
                'type': 'Number'
            },
            {
                'field': 'total_count',
                'type': 'Number'
            }
        ]


Collection.register(CustomerStat)
```
Ensure the file app/forest/\_\_init\_\_.py exists and contains the import of the previous defined class :
{% code title="app/forest/\_\_init\_\_.py" %}
```python
from app.forest.customer_stats import CustomerStat
```
{% endcode %}

{% endcode %}

{% hint style="info" %}
The option`is_searchable = True` added to your collection allows to display the search bar. Note that you will have to implement the search yourself by including it into your own `get` logic in your collection controller.
{% endhint %}
{% endtab %}

{% tab title="Laravel" %}
First, we declare the `CustomerStat` collection in the `app/Models/SmartCollections/CustomerStat.php` file.

In this Smart Collection, we want to display for each customer its email address, the number of orders made (in a field `orders_count`) and the sum of the price of all those orders (in a field `total_amount`).

You can check out the list of [available field options ](../smart-fields/#available-field-options)if you need it.

{% hint style="warning" %}
You **MUST** declare an `id` field when creating a Smart Collection. The value of this field for each record **MUST** be unique.

As we are using the _customer id_ in this example, we do not need to declare an `id`
{% endhint %}

{% code title="app/Models/SmartCollections/CustomerStat.php" %}
```php
<?php

namespace App\Models\SmartCollections;

use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartField;
use Illuminate\Support\Collection;

class CustomerStat extends SmartCollection
{
    protected string $name = 'customerStat';

    protected bool $is_searchable = true;

    protected bool $is_read_only = true;

    /**
     * @return Collection
     */
    public function fields(): Collection
    {
        return collect(
            [
                new SmartField(
                    [
                        'field' => 'id',
                        'type'  => 'Number',
                    ]
                ),
                new SmartField(
                    [
                        'field' => 'email',
                        'type'  => 'String',
                    ]
                ),
                new SmartField(
                    [
                        'field' => 'orders_count',
                        'type'  => 'Number',
                    ]
                ),
                new SmartField(
                    [
                        'field' => 'total_count',
                        'type'  => 'Number',
                    ]
                ),
            ]
        );
    }
}
```
{% endcode %}

{% hint style="info" %}
The option`is_searchable = True` added to your collection allows to display the search bar. Note that you will have to implement the search yourself by including it into your own `get` logic in your collection controller.
{% endhint %}
{% endtab %}
{% endtabs %}

### Implementing the GET (all records)

At this time, there’s no Smart Collection Implementation because no route in your app handles the API call yet.

{% tabs %}
{% tab title="SQL" %}
In the file `routes/customer_stats.js`, we’ve created a new route to implement the API behind the Smart Collection.

The logic here is to list all the customers that have made orders (with their email), to count the number of orders made and to sum up the price of all the orders.

The `limit` and `offset` variables are used to paginate your collection according to the number of records per page set in your UI.

We have implemented a **search logic** to catch if a search query (accessible through `req.query.search`) has been performed and to return all records for which the `email` field matches the search.

Finally, the last step is to serialize the response data in the expected format which is simply a standard [JSON API](http://jsonapi.org) document. A class called RecordSerializer is made available to help you serialize the records. You can read [more about this class here](serializing-your-records.md).

{% code title="/routes/customer_stats.js" %}
```javascript
const { RecordSerializer } = require('forest-express-sequelize');
const express = require('express');
const router = express.Router();
const { connections } = require('../models');

const sequelize = connections.default;

router.get('/customer_stats', (req, res, next) => {
  const limit = parseInt(req.query.page.size) || 20;
  const offset = (parseInt(req.query.page.number) - 1) * limit;
  const queryType = sequelize.QueryTypes.SELECT;
  let conditionSearch = '';

  if (req.query.search) {
    conditionSearch = `customers.email LIKE '%${req.query.search.replace(/\'/g, '\'\'')}%'`;
  }

  const queryData = `
    SELECT customers.id,
      customers.email,
      count(orders.*) AS orders_count,
      sum(products.price) AS total_amount,
      customers.created_at,
      customers.updated_at
    FROM customers
    JOIN orders ON customers.id = orders.customer_id
    JOIN products ON orders.product_id = products.id
    ${conditionSearch ? `WHERE ${conditionSearch}` : ''}
    GROUP BY customers.id
    ORDER BY customers.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const queryCount = `
    SELECT COUNT(*)
    FROM customers
    WHERE
      EXISTS (
        SELECT *
        FROM orders
        WHERE orders.customer_id = customers.id
      )
      ${conditionSearch ? `AND ${conditionSearch}` : ''}
  `;

  Promise.all([
    sequelize.query(queryData, { type: queryType }),
    sequelize.query(queryCount, { type: queryType }),
  ])
    .then(async ([customerStatsList, customerStatsCount]) => {
      const customerStatsSerializer = new RecordSerializer({ name: 'customer_stats' });
      const customerStats = await customerStatsSerializer.serialize(customerStatsList);
      const count = customerStatsCount[0].count;
      res.send({ ...customerStats, meta:{ count: count }});
    })
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
_Work in progress - this section will soon be released_
{% endtab %}

{% tab title="Rails" %}
In the repository `lib/forest_liana/controllers/`, we’ve created a controller file `customer_stats.rb` to implement API behind the Smart Collection.

The logic here is to index all the customers that have made orders (with their email), to count the number of orders made and to sum up the price of all the orders.

The `limit` and `offset` variables are used to paginate your collection according to the number of records per page set in your UI.

We have implemented a **search logic** to catch if a search query (accessible through `params[:search]`) has been performed and to return all records for which the `email` field matches the search.

Finally, the last step is to serialize the response data in the expected format which is simply a standard [JSON API](http://jsonapi.org) document. We use the [JSON API Serializer](https://github.com/fotinakis/jsonapi-serializers) library for this task.

{% code title="lib/forest-liana/controllers/customer_stats_controller.rb" %}
```ruby
class Forest::CustomerStatsController < ForestLiana::ApplicationController
  require 'jsonapi-serializers'

  before_action :set_params, only: [:index]

  class BaseSerializer
    include JSONAPI::Serializer

    def type
      'customerStat'
    end

    def format_name(attribute_name)
      attribute_name.to_s.underscore
    end

    def unformat_name(attribute_name)
      attribute_name.to_s.dasherize
    end
  end

  class CustomerStatSerializer < BaseSerializer
    attribute :email
    attribute :total_amount
    attribute :orders_count
  end

  def index
    customers_count = Customer.count_by_sql("
      SELECT COUNT(*)
      FROM customers
      WHERE
        EXISTS (
          SELECT *
          FROM orders
          WHERE orders.customer_id = customers.id
        )
        AND email LIKE '%#{@search}%'
    ")
    customer_stats = Customer.find_by_sql("
      SELECT customers.id,
        customers.email,
        count(orders.*) AS orders_count,
        sum(products.price) AS total_amount,
        customers.created_at,
        customers.updated_at
      FROM customers
      JOIN orders ON customers.id = orders.customer_id
      JOIN products ON orders.product_id = products.id
      WHERE email LIKE '%#{@search}%'
      GROUP BY customers.id
      ORDER BY customers.id
      LIMIT #{@limit}
      OFFSET #{@offset}
    ")
    customer_stats_json = CustomerStatSerializer.serialize(customer_stats, is_collection: true, meta: {count: customers_count})
    render json: customer_stats_json
  end

  private

  def set_params
    @limit = params[:page][:size].to_i
    @offset = (params[:page][:number].to_i - 1) * @limit
    @search = sanitize_sql_like(params[:search]? params[:search] : "")
  end

  def sanitize_sql_like(string, escape_character = "\\")
    pattern = Regexp.union(escape_character, "%", "_")
    string.gsub(pattern) { |x| [escape_character, x].join }
  end
end
```
{% endcode %}

You then need to create a route pointing to your collection's index action to get all your collection's records.

{% code title="config/routes.rb" %}
```ruby
Rails.application.routes.draw do
  # MUST be declared before the mount ForestLiana::Engine.
  namespace :forest do  
    get '/CustomerStat' => 'customer_stats#index'
  end

  mount ForestLiana::Engine => '/forest'
 
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
First we will add the right path to the **urls.py** file

{% code title="app/urls.py" %}
```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/CustomerStats', csrf_exempt(views.CustomerStatsView.as_view()), name='customer-stats'),
]
```
{% endcode %}

Then we will create the pertained view

{% code title="app/views.py" %}
```python
from django.http import JsonResponse
from django.views import generic
from django.db.models import Sum, Count

from django_forest.utils.schema.json_api_schema import JsonApiSchema
from django_forest.resources.utils.queryset.pagination import PaginationMixin
from django_forest.resources.utils.queryset.search import SearchMixin

class CustomerStatsViewView(PaginationMixin, SearchMixin, generic.ListView):

    def get(self, request, *args, **kwargs):
        params = request.GET.dict()

        # queryset
        queryset = Customer.objects.all()

        # annotate
        queryset = queryset.annotate(total_amount=Sum('product__prices'))
        queryset = queryset.annotate(orders_count=Count('orders'))

        # search
        queryset = queryset.filter(self.get_search(params, Customer))

        # pagination
        queryset = self.get_pagination(params, queryset)
    
        # use automatically generated Schema or use your own thanks to marshmallow-jsonapi
        Schema = JsonApiSchema.get('CustomerStats')
        data = Schema().dump(queryset, many=True)

        return JsonResponse(data, safe=False)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
Create a controller `CustomerStatsController`

{% code title="app/Http/Controllers/CustomerStatsController.php" %}
```php
<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use ForestAdmin\LaravelForestAdmin\Facades\JsonApi;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CustomerStatsController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $customerStats = Customer::select(DB::raw('customers.id, customers.email, COUNT(DISTINCT orders.*) AS orders_count, SUM(products.price) AS total_count'))
            ->join('orders', 'orders.customer_id', '=', 'customers.id')
            ->join('order_product', 'order_product.order_id', '=', 'orders.id')
            ->join('products', 'products.id', '=', 'order_product.product_id')
            ->groupBy('customers.id')
            ->orderBy('customers.id');

        if (request()->has('search')) {
            $customerStats->whereRaw("LOWER (customers.email) LIKE LOWER(?)", ['%' . request()->input('search') . '%']);
        }

        $pageParams = request()->query('page') ?? [];

        return response()->json(
            JsonApi::render(
                $customerStats->paginate(
                    $pageParams['size'] ?? null,
                    '*',
                    'page',
                    $pageParams['number'] ?? null
                ),
                'customerStat',
            )
        );
    }
}
```
{% endcode %}

Then add the route.

{% code title="routes/web.php" %}
```php
<?php

use App\Http\Controllers\CustomerStatsController;
use Illuminate\Support\Facades\Route;

Route::get('forest/customerStat', [CustomerStatsController::class, 'index']);
```
{% endcode %}
{% endtab %}
{% endtabs %}

Now we are all set, we can access the Smart Collection as any other collection.

![](<../../.gitbook/assets/image (296).png>)

{% hint style="info" %}
In this example we have only implemented the **GET all records** action but you can also add the following actions: **GET specific records**, **PUT, DELETE** and **POST**. These are shown in the next page explaining how a Smart Collection can be used to access and manipulate data stored in Amazon S3.
{% endhint %}
