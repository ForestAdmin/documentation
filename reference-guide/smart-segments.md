# Smart Segments

### What is a Smart Segment?

A **Segment** is a subset of a collection: it's basically a saved filter of your collection.

Segments are designed for those who want to _systematically_ visualize data according to specific sets of filters. It allows you to save your filters configuration so you don’t have to compute the same actions every day.

A **Smart Segments** is useful when you want to use a complex filter, which you'll add as code in your backend.

### Creating a Smart Segment <a href="#creating-a-smart-segment" id="creating-a-smart-segment"></a>

Sometimes, segment filters are complicated and closely tied to your business. Forest Admin allows you to code how the segment is computed.

On our Live Demo example, we’ve implemented a Smart Segment on the collection `products` to allow admin users to see the bestsellers at a glance.

{% tabs %}
{% tab title="SQL" %}
You’re free to implement the business logic you need. The only requirement is to return a valid Sequelize condition. Most of the time, your Smart Segment should return something like `{ id: { in: [ 1,2,3,4,5 ] } }`.

On our implementation, we use a raw SQL query to filter and sort the product that was sold the most.

{% code title="/forest/products.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const models = require('../models');

const { Op, QueryTypes } = models.objectMapping;

collection('products', {
  segments: [{
    name: 'Bestsellers',
    where: (product) => {
      return models.connections.default.query(`
        SELECT products.id, COUNT(orders.*)
        FROM products
        JOIN orders ON orders.product_id = products.id
        GROUP BY products.id
        ORDER BY count DESC
        LIMIT 5;
      `, { type: QueryTypes.SELECT })
      .then((products) => {
        let productIds = products.map((product) => product.id);
        return { id: { [Op.in]: productIds }};
      });
    }
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
You’re free to implement the business logic you need. Your Smart Segment should return something like `{ _id: { $in: [ 1,2,3,4,5 ] } }`.

{% code title="/forest/products.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
const { Product } = require('../models');

collection('Product', {
  fields: [{
    field: 'buyers',
    type: ['String'],
    reference: 'Customer'
  }],
  segments: [{
    name: 'Bestsellers',
    where: (product) => {
      return Product
      	.aggregate([
		    {
		        $project: { orders_count: {$size: { "$ifNull": [ "$orders", [] ] } } }
		    }, 
		    {   
		        $sort: {"orders_count":-1} 
		    },
		    { 
		    	$limit: 5
		    }
		])
        .then((products) => {
          let productIds = [];
          products.filter((product) => {
            if (product._id.length === 0) { return false; }
            return true; 
          })
          .forEach((product) => {
          	productIds.push(product._id);
          });
		  return {"_id": { $in: productIds} };
	  });
    }
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/collections/product.rb" %}
```ruby
class Forest::Product
  include ForestLiana::Collection

  collection :Product

  segment 'Bestsellers' do
    productIds = Product.joins(:orders).group('products.id').order('count(orders.id)').limit(10).pluck('products.id')

    { id: productIds }
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/product.py" %}
```python
from django.db.models import Q
from django_forest.utils.collection import Collection

from app.models import Product


class ProductForest(Collection):
    def load(self):
        
        self.segments = [
            {
                'name': 'Best sellers',
                'where': self.best_sellers
            }
        ]


    def best_sellers(self):
        products = Question.objects.raw('''SELECT app_product.id, COUNT(app_order.*)
            FROM app_product
            JOIN app_order ON app_order.product_id = app_product.id
            GROUP BY app_product.id
            ORDER BY count DESC
            LIMIT 5;''')
        return Q(**{'id__in': [product.id for product in products]})

Collection.register(ProductForest, Product)
```
{% endcode %}

Ensure the file app/forest/\_\_init\_\_.py exists and contains the import of the previous defined class :
{% code title="app/forest/\_\_init\_\_.py" %}
```python
from app.forest.product import ProductForest
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% hint style="info" %}
The 2nd parameter of the `SmartSegment` method is not required. If you don't fill it, the name of your SmartSegment will be the name of your method that wrap it.
{% endhint %}

{% code title="app/Models/Product.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartSegment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory
    use ForestCollection;

    /**
     * @return SmartSegment
     */
    public function bestSellers(): SmartSegment
    {
        return $this->smartSegment(
            fn(Builder $query) => $query->whereIn('products.id', function($q) {
                $q->select('products.id')
                    ->from('products')
                    ->join('order_product', 'order_product.product_id', '=', 'products.id')
                    ->groupBy('products.id')
                    ->orderByRaw('COUNT(order_product.order_id) DESC')
                    ->limit(10);
            }),
            'Best sellers'
        );
    }
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.38.24.png>)

### Setting up independent columns visibility <a href="#setting-up-independent-columns-visibility" id="setting-up-independent-columns-visibility"></a>

By default, Forest Admin applies the same configuration to all segments of the same collection.

However, the _Independent columns configuration_ option allows you to display different columns on your different segments.

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.40.03.png>)
