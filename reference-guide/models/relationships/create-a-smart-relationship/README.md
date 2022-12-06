# Create a Smart relationship

### What is a Smart Relationship? <a href="#what-is-a-smart-relationship" id="what-is-a-smart-relationship"></a>

Sometimes, you want to create a virtual relationship between two set of data that does not exist in your database. A concrete example could be creating a relationship between two collections available in two different databases. Creating a Smart Relationship allows you to customize with code how your collections are linked together.

### Create a BelongsTo Smart Relationship <a href="#creating-a-belongsto-smart-relationship" id="creating-a-belongsto-smart-relationship"></a>

On the Live Demo example, we have an **order** which `belongsTo` a **customer** which `belongsTo` a **delivery address**. We’ve created here a BelongsTo Smart Relationship that acts like a shortcut between the **order** and the **delivery address**.

A BelongsTo Smart Relationship is created like a [Smart Field](../../../smart-fields/#what-is-a-smart-field) with the `reference` option to indicate on which collection the Smart Relationship points to. You will also need to code the logic of the search query.

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/orders.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const models = require('../models');
​
collection('orders', {
  fields: [{
    field: 'delivery_address',
    type: 'String',
    reference: 'addresses.id',
    get: function (order) {
      return models.addresses
        .findAll({
          include: [{
            model: models.customers,
            where: { id: order.customer_id },
            include: [{
              model: models.orders,
              where: { ref: order.ref }
            }]
          }],
        })
        .then((addresses) => {
          if (addresses) { return addresses[0]; }
        });
    }
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/forest/orders.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
const Address = require('../models/addresses');

collection('Order', {
  fields: [{
    field: 'delivery_address',
    type: 'String',
    reference: 'Address._id',
    get: function (order) {
      return Address
        .aggregate([
          {
            $lookup:
            {
              from: 'orders',
              localField: 'customer_id',
              foreignField: 'customer_id',
              as: 'orders_docs'
            }
          }, 
          {
            $match:
            {
              'orders_docs._id': order._id
            }
          }
        ])
        .then((addresses) => {
          if (addresses) { return addresses[0]._id; }
        });
    }
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="lib/forest_liana/collections/order.rb" %}
```ruby
class Forest::Order
  include ForestLiana::Collection

  collection :Order

  search_delivery_address = lambda do |query, search|

    query.joins(customer: :address).or(Order.joins(customer: :address).where("addresses.country ILIKE ?", "%#{search}%"))

  end

  belongs_to :delivery_address, reference: 'Address.id', search: search_delivery_address do
    object.customer.address
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/order.py" %}
```python
from django_forest.utils.collection import Collection
from app.models import Order, Address


class OrderForest(Collection):
    def load(self):
        self.fields = [
            {
                'field': 'delivery_address',
                'reference': 'app_addresses.id',
                'type': 'String',
                'get': self.get_subject,
            }
        ]

    def get_delivery_address(self, obj):
        queryset = Address.objects.filter(customer__in=(obj.customer_id,))
        if len(queryset):
            return queryset[0]
            
Collection.register(OrderForest, Order)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/Order.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartRelationship;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Order
 */
class Order extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartRelationship
     */
    public function deliveryAddress(): SmartRelationship
    {
        return $this->smartRelationship(
            [
                'type' => 'String',
                'reference' => 'address.id'
            ]
        )
            ->get(
                function () {
                    return Order::join('customers', 'customers.id', '=', 'orders.customer_id')
                        ->join('addresses', 'addresses.customer_id', '=', 'customers.id')
                        ->where('orders.id', $this->id)
                        ->first();
                }
            );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../../../.gitbook/assets/Capture d’écran 2019-07-01 à 11.00.28.png>)

### Create a HasMany Smart Relationship <a href="#creating-a-hasmany-smart-relationship" id="creating-a-hasmany-smart-relationship"></a>

On the Live Demo example, we have a **product** `hasMany` **orders** and an **order** `belongsTo` **customer**. We’ve created a Smart Relationship that acts like a shortcut: **product** `hasMany` **customers**.

A HasMany Smart Relationship is created like a [Smart Field](https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields) with the `reference` option to indicates on which collection the Smart Relationship points to.

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/products.js" %}
```javascript
const { collection } = require('forest-express-sequelize');

collection('products', {
  fields: [{
    field: 'buyers',
    type: ['String'],
    reference: 'customers.id'
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/forest/products.js" %}
```javascript
const { collection } = require('forest-express-mongoose');

collection('products', {
  fields: [{
    field: 'buyers',
    type: ['String'],
    reference: 'Customer._id'
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="lib/forest_liana/collections/product.rb" %}
```ruby
class Forest::Product
  include ForestLiana::Collection

  collection :Product

  has_many :buyers, type: ['String'], reference: 'Customer.id'
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/product.py" %}
```python
from django_forest.utils.collection import Collection
from app.models import Product


class ProductForest(Collection):
    def load(self):
        self.fields = [
            {
                'field': 'buyers',
                'reference': 'app_customer.id',
                'type': ['String'],
            }
        ]


Collection.register(ProductForest, Product)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/Product.php" %}
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * Class Product
 */
class Product extends Model
{
    use HasFactory;

    /**
     * @return SmartRelationship
     */
    public function buyers(): SmartRelationship
    {
        return $this->smartRelationship(
            [
                'type' => ['String'],
                'reference' => 'customer.id'
            ]
        );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="SQL" %}
Upon browsing, an API call is triggered when accessing the data of the HasMany relationships in order to fetch them asynchronously. In the following example, the API call is a GET on `/products/:product_id/relationships/buyers`.

**Option 1: using Sequelize ORM**

We’ll use the **findAll** and **count** methods provided by [Sequelize](https://sequelize.org/v5/manual/querying.html) to find and count all customers who bought the current product (_buyers_).

Then, you should handle pagination in order to avoid performance issue. The API call has a query string available which gives you all the necessary parameters you need to enable pagination.

Finally, you don’t have to serialize the data yourself. The Forest Liana already knows how to serialize your collection (`customers` in this example). You can access to the serializer through the `recordsGetter.serialize` function.

{% code title="/routes/products.js" %}
```javascript
const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');
const { products, customers, orders} = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('products');

router.get('/products/:product_id/relationships/buyers', (request, response, next) => {
  const productId = request.params.product_id;
  const limit = parseInt(request.query.page.size, 10) || 20;
  const offset = (parseInt(request.query.page.number, 10) - 1) * limit;
  const include = [{
    model: orders,
    as: 'orders',
    where: { product_id: productId },
  }];

  // find the customers for the requested page and page size
  const findAll = customers.findAll({
    include,
    offset,
    limit,
  });

  // count all customers for pagination
  const count = customers.count({ include });

  // resolve the two promises and serialize the response
  const serializer = new RecordSerializer(customers);
  Promise.all([findAll, count])
    .then(([customersFound, customersCount]) =>
      serializer.serialize(customersFound, { count: customersCount }))
    .then((recordsSerialized) => response.send(recordsSerialized))
    .catch(next);
});
```
{% endcode %}

**Option2: using raw SQL**

We’ll use raw SQL query and [Sequelize](http://docs.sequelizejs.com) to **count** and **find all** customers who bought the current product (_buyers_).

Then, you should handle pagination in order to avoid performance issue. The API call has a query string available which gives you all the necessary parameters you need to enable pagination.

Finally, you don’t have to serialize the data yourself. The Forest Liana already knows how to serialize your collection (`customers` in this example). You can access to the serializer through the `recordsGetter.serialize` function.

{% code title="/routes/products.js" %}
```javascript
const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/products/:product_id/relationships/buyers', (req, res, next) => {
  let limit = parseInt(req.query.page.size) || 10;
  let offset = (parseInt(req.query.page.number) - 1) * limit;
  let queryType = models.sequelize.QueryTypes.SELECT;

  let countQuery = `
    SELECT COUNT(*)
    FROM customers
    JOIN orders ON orders.customer_id = customers.id
    JOIN products ON orders.product_id = products.id
    WHERE product_id = ${req.params.product_id};
  `;

  let dataQuery = `
    SELECT customers.*
    FROM customers
    JOIN orders ON orders.customer_id = customers.id
    JOIN products ON orders.product_id = products.id
    WHERE product_id = ${req.params.product_id}
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const serializer = new RecordsSerializer(customers);
  return Promise
    .all([
      models.sequelize.query(countQuery, { type: queryType }),
      models.sequelize.query(dataQuery, { type: queryType })
    ])
    .then(([count, customers]) => serializer.serialize(customers, { count: count[0].count }))
    .then((customers) => res.send(customers))
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}

{% hint style="warning" %}
If your primary key column name (`customer_id`) is different than the model field name (`customerId`), you must alias the primary key column with the name of the model field in the **dataQuery**.\
\
Ex: `SELECT customers.*, customers.customer_id AS “customerId”`
{% endhint %}
{% endtab %}

{% tab title="Mongodb" %}
Upon browsing, an API call is triggered when accessing the data of the HasMany relationships in order to fetch them asynchronously. In the following example, the API call is a GET on `/Product/:product_id/relationships/buyers`.

We use the `$lookup` operator of the **aggregate** pipeline. Since there's a many-to-many relationship between `Product` and `Customer`, the `$lookup` operator needs to look into orders which is an array we have to flatten first using `$unwind`.

Finally, you don’t have to serialize the data yourself. The Forest Liana already knows how to serialize your collection (`Customer` in this example). You can access to the serializer through the `Liana.ResourceSerializer` object.

{% code title="/forest/products.js" %}
```javascript
const { collection } = require('forest-express-mongoose');

collection('products', {
  fields: [{
    field: 'buyers',
    type: ['String'],
    reference: 'Customer._id'
  }]
});
```
{% endcode %}

{% code title="/routes/products.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-mongoose');
const { Customers } = require('../models');
const mongoose = require('mongoose');

router.get('/Product/:product_id/relationships/buyers', (req, res, next) => {
    let limit = parseInt(req.query.page.size) || 10;
    let offset = (parseInt(req.query.page.number) - 1) * limit;

    let countQuery = Customers.aggregate([
          {
            $lookup:
            {
              from: 'orders',
              localField: 'orders',
              foreignField: '_id',
              as: 'orders_docs'
            }
          },
          {
            $unwind: "$orders_docs"
          },
          {
            $lookup:
            {
              from: 'products',
              localField: 'orders_docs._id',
              foreignField: 'orders',
              as: 'products_docs'
            }
          },
          {
            $match:
            {
              'products_docs._id': mongoose.Types.ObjectId(req.params.product_id)
            }
          },
          {
            $count: "products_docs"
          }
        ]);

    let dataQuery = Customers.aggregate([
          {
            $lookup:
            {
              from: 'orders',
              localField: 'orders',
              foreignField: '_id',
              as: 'orders_docs'
            }
          },
          {
            $unwind: "$orders_docs"
          },
          {
            $lookup:
            {
              from: 'products',
              localField: 'orders_docs._id',
              foreignField: 'orders',
              as: 'products_docs'
            }
          },
          {
            $match:
            {
              'products_docs._id': mongoose.Types.ObjectId(req.params.product_id)
            }
          }
        ]);

    return P
      .all([
        countQuery,
        dataQuery
      ])
      .spread((count, customers) => {
        const serializer = new Liana.RecordSerializer(Customers);
        return serializer.serialize(customers, { count: count.orders_count });
      })
      .then((products) => {
        res.send(products);
      })
      .catch((err) => next(err));
  });

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
Upon browsing, an API call is triggered when accessing the data of the HasMany relationships in order to fetch them asynchronously. In the following example, the API call is a GET on `/Product/:product_id/relationships/buyers`.

We’ve built the right SQL query using [Active Record](http://guides.rubyonrails.org/active\_record\_basics.html) to **count** and **find all** customers who bought the current product.

Then, you should handle pagination in order to avoid performance issue. The API call has a querystring available which gives you all the necessary parameters you need to enable pagination.

Finally, you don’t have to serialize the data yourself. The Forest Liana already knows how to serialize your collection (`Customer` in this example). You can access to the serializer through the `serialize_models()` function.

```ruby
Rails.application.routes.draw do
  # MUST be declared before the mount ForestLiana::Engine.
  namespace :forest do
    get '/Product/:product_id/relationships/buyers' => 'orders#buyers'
  end
  
  mount ForestLiana::Engine => '/forest'
end
```

```ruby
class Forest::ProductsController < ForestLiana::ApplicationController
  def buyers
    limit = params['page']['size'].to_i
    offset = (params['page']['number'].to_i - 1) * limit

    orders = Product.find(params['product_id']).orders
    customers = orders.limit(limit).offset(offset).map(&:customer)
    count = orders.count

    render json: serialize_models(customers, include: ['address'], meta {count: count})
  end
end
```
{% endtab %}

{% tab title="Django" %}
Upon browsing, an API call is triggered when accessing the data of the HasMany relationships in order to fetch them asynchronously. In the following example, the API call is a GET on `/app_product/:product_pk/relationships/buyers`.\
\
You will have to declare this route in your app **urls.py** file

{% code title="app/urls.py" %}
```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/app_product/<pk>/relationships/buyers', views.BuyersView.as_view(), name='product-buyers'),
]
```
{% endcode %}

Then create the pertained view

{% code title="app/views.py" %}
```python
from django.http import JsonResponse
from django.views import generic

from django_forest.resources.utils.queryset import PaginationMixin
from django_forest.utils.schema.json_api_schema import JsonApiSchema

class BuyersView(PaginationMixin, generic.ListView):

    def get(self, request, pk, *args, **kwargs):
        params = request.GET.dict()

        # queryset
        queryset = Customer.objects.filter(order__product_id=pk).distinct()

        # pagination
        queryset = self.get_pagination(params, queryset)

        # json api serializer
        Schema = JsonApiSchema.get('app_customer')
        data = Schema().dump(queryset, many=True)

        return JsonResponse(data, safe=False)
```
{% endcode %}

We’ve built the right SQL query using [Django ORM](https://docs.djangoproject.com/en/3.2/topics/db/queries/) to **find all** customers who bought the current product.

Then, you should handle pagination in order to avoid performance issue. The API call has a querystring available which gives you all the necessary parameters you need to enable pagination.

Finally, you don’t have to serialize the data yourself. The Forest Liana already knows how to serialize your collection (`Customer` in this example, with the table name `app_customer`). You can access to the serializer through the `Schema().dump` function (using [marshmallow-jsonapi](https://marshmallow-jsonapi.readthedocs.io/en/latest/) internally).
{% endtab %}

{% tab title="Laravel" %}
Upon browsing, an API call is triggered when accessing the data of the HasMany relationships in order to fetch them asynchronously. In the following example, the API call is a GET on `/product/{id}/relationships/buyers`.

We’ve built the right SQL query using [Active Record](http://guides.rubyonrails.org/active\_record\_basics.html) to **count** and **find all** customers who bought the current product.

Then, you should handle pagination in order to avoid performance issue. The API call has a querystring available which gives you all the necessary parameters you need to enable pagination.

Finally, you don’t have to serialize the data yourself. The Forest Liana already knows how to serialize your collection (`Customer` in this example). You can access to the serializer through the `render()` function of JsonApi facade.

{% code title="routes/web.php" %}
```php
<?php

use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;


Route::get('forest/product/{id}/relationships/buyers', [ProductsController::class, 'buyers']);
```
{% endcode %}

{% code title="app/Http/controllers/ProductsController.php" %}
```php
<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use ForestAdmin\LaravelForestAdmin\Facades\JsonApi;
use ForestAdmin\LaravelForestAdmin\Http\Controllers\ForestController;
use Illuminate\Http\JsonResponse;

/**
 * Class ProductsController
 */
class ProductsController extends ForestController
{
    /**
     * @param int $id
     * @return JsonResponse
     */
    public function buyers(int $id): JsonResponse
    {
        $query = Customer::whereHas('orders.products', fn ($query) => $query->where('products.id', $id))
            ->paginate($pageParams['size'] ?? null, '*', 'page', $pageParams['number'] ?? null);

        return response()->json(
            JsonApi::render($query, 'customers', ['count' => $query->total()])
        );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../../../.gitbook/assets/Capture d’écran 2019-07-01 à 11.02.40.png>)
