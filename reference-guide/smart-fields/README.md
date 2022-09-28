# Smart Fields

### What is a Smart Field? <a href="#what-is-a-smart-field" id="what-is-a-smart-field"></a>

A field that displays a computed value in your collection.

![](<../../.gitbook/assets/image (30).png>)

A Smart Field is a column that displays processed-on-the-fly data. It can be as simple as concatenating attributes to make them human friendly, or more complex (e.g. total of orders).

### Creating a Smart Field <a href="#creating-a-smart-field" id="creating-a-smart-field"></a>

{% tabs %}
{% tab title="SQL" %}
On our Live Demo, the very simple Smart Field `fullname` is available on the `customers` collection.

{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-sequelize');

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    }
  }]
});
```
{% endcode %}

\
Very often, the business logic behind the Smart Field is more complex and must be asynchronous. To do that, please have a look at [this section](./#createadvancedsmartfield).
{% endtab %}

{% tab title="Mongodb" %}
On our Live Demo, the very simple Smart Field `fullname` is available on the `customers` collection.

{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-mongoose');

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    }
  }]
});
```
{% endcode %}

\
Very often, the business logic behind the Smart Field is more complex and must be asynchronous. To do that, please have a look at [this section](./#createadvancedsmartfield).
{% endtab %}

{% tab title="Rails" %}
On our Live Demo, the very simple Smart Field `fullname` is available on the `Customer` collection.

{% code title="/lib/forest_liana/collections/customer.rb" %}
```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer

  field :fullname, type: 'String' do
    "#{object.firstname} #{object.lastname}"
  end
end
```
{% endcode %}

Very often, the business logic behind the Smart Field is more complex and must interact with the database. Here’s an example with the Smart Field `full_address` on the `Customer` collection.

{% code title="/lib/forest_liana/collections/customer.rb" %}
```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer

  field :full_address, type: 'String' do
    address = Address.find_by(customer_id: object.id)
    "#{address[:address_line_1]} #{address[:address_line_2]} #{address[:address_city]} #{address[:country]}"
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
On our Live Demo, the very simple Smart Field `fullname` is available on the `Customer` collection.

{% code title="app/forest/customer.py" %}
```python
from django_forest.utils.collection import Collection
from app.models import Customer


class CustomerForest(Collection):
    def load(self):
        self.fields = [
            {
                'field': 'fullname',
                'type': 'String',
                'get': self.get_fullname
            },
        ]

    def get_fullname(self, obj):
        return f'{obj.firstname} {obj.lastname}'


Collection.register(CustomerForest, Customer)
```
{% endcode %}

Very often, the business logic behind the Smart Field is more complex and must interact with the database. Here’s an example with the Smart Field `full_address` on the `Customer` collection.

{% code title="app/forest/customer.py" %}
```python
from django_forest.utils.collection import Collection
from app.models import Customer, Address


class CustomerForest(Collection):
    def load(self):
        self.fields = [
            {
                'field': 'full_address',
                'type': 'String',
                'get': self.get_full_address,
            },
        ]

    def get_full_address(self, obj):
        address = Address.objets.get(customer_id=obj.id)
        return f'{address.address_line_1} {address.address_line_2} {address.address_city} {address.country}'


Collection.register(CustomerForest, Customer)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
On our Live Demo, the very simple Smart Field `fullname` is available on the `Customer` model.

{% code title="app/Models/Customer.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartField;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Customer
 */
class Customer extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartField
     */
    public function fullname(): SmartField
    {
        return $this->smartField(['type' => 'String'])
            ->get(fn() => $this->firstname . '-' . $this->lastname);
    }
}
```
{% endcode %}

Very often, the business logic behind the Smart Field is more complex and must interact with the database. Here’s an example with the Smart Field `full_address` on the `Customer` model.

{% code title="app/Models/Customer.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartField;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Customer
 */
class Customer extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartField
     */
    public function fullAddress(): SmartField
    {
        return $this->smartField(['type' => 'String'])
            ->get(
                function () {
                    $address = Address::firstWhere('customer_id', $this->id);

                    return "$address->address_line1  $address->address_line2 $address->address_city  $address->country";
                }
            );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
The collection name must be the same as the **model name**.
{% endhint %}

![](<../../.gitbook/assets/Capture d’écran 2019-07-01 à 12.16.05.png>)

### Updating a Smart Field <a href="#updating-a-smart-field" id="updating-a-smart-field"></a>

{% tabs %}
{% tab title="SQL" %}
By default, your Smart Field is considered as read-only. If you want to update a Smart Field, you just need to write the logic to “unzip” the data. **Note that the `set` method should always return the object it’s working on**. In the example hereunder, the `customer` object is returned including only the modified data.

{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-sequelize');

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    set: (customer, fullname) => {
      let names = fullname.split(' ');
      customer.firstname = names[0];
      customer.lastname = names[1];

      // Don't forget to return the customer.
      return customer;
    }
  }]
});
```
{% endcode %}

Working with the actual record can be done this way:

{% code title="/forest/customers.js" %}
```javascript
const { collection, ResourceGetter } = require('forest-express-sequelize');
const { customers } = require('../models');

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    set: async (customer, fullname) => {
      const customerBeforeUpdate = await customers.findOne({ where: { id: customer.id }});

      const names = fullname.split(' ');
      customer.firstname = `${names[0]} ${customerBeforeUpdate.pseudo}`;
      return customer;
    }
  }]
});
```
{% endcode %}

{% hint style="info" %}
For security reasons, the `fullname` Smart field will remain **read-only**, even after you implement the `set` method. To edit it, disable read-only mode in the field settings.
{% endhint %}
{% endtab %}

{% tab title="Mongodb" %}
By default, your Smart Field is considered as read-only. If you want to update a Smart Field, you just need to write the logic to “unzip” the data. **Note that the `set` method should always return the object it’s working on**. In the example hereunder, the `customer` record is returned.

{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-mongoose');

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    set: (customer, fullname) => {
      let names = fullname.split(' ');
      customer.firstname = names[0];
      customer.lastname = names[1];

      // Don't forget to return the customer.
      return customer;
    }
  }]
});
```
{% endcode %}

Working with the actual record can be done this way:

{% code title="/forest/customers.js" %}
```javascript
const { collection, ResourceGetter } = require('forest-express-mongoose');
const { customers } = require('../models');

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    set: async (customer, fullname) => {
      const customerBeforeUpdate = await customers.findById(customer.id);

      const names = fullname.split(' ');
      customer.firstname = `${names[0]} ${customerBeforeUpdate.pseudo}`;
      return customer;
    }
  }]
});
```
{% endcode %}

{% hint style="info" %}
For security reasons, the `fullname` Smart field will remain **read-only**, even after you implement the `set` method. To edit it, disable read-only mode in the field settings.
{% endhint %}
{% endtab %}

{% tab title="Rails" %}
By default, your Smart Field is considered as read-only. If you want to update a Smart Field, you just need to write the logic to “unzip” the data. **Note that the set method should always return the object it’s working on**. In the example hereunder, the `user_params` is returned is returned including only the modified data.

{% code title="/lib/forest_liana/collections/customer.rb" %}
```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer

  set_fullname = lambda do |user_params, fullname|
    fullname = fullname.split
    user_params[:firstname] = fullname.first
    user_params[:lastname] = fullname.last

    # Returns a hash of the updated values you want to persist.
    user_params
  end

  field :fullname, type: 'String', set: set_fullname do
    "#{object.firstname} #{object.lastname}"
  end
end
```
{% endcode %}

{% hint style="info" %}
For security reasons, the `fullname` Smart field will remain **read-only**, even after you implement the `set` method. To edit it, disable read-only mode in the field settings.
{% endhint %}
{% endtab %}

{% tab title="Django" %}
By default, your Smart Field is considered as read-only. If you want to update a Smart Field, you just need to write the logic to “unzip” the data. **Note that the `set` method should always return the object it’s working on**. In the example hereunder, the `customer` object is returned including only the modified data.

{% code title="app/forest/customer.py" %}
```python
from django_forest.utils.collection import Collection
from app.models import Customer


class CustomerForest(Collection):
    def load(self):
        self.fields = [
            {
                'field': 'fullname',
                'type': 'String',
                'get': self.get_fullname,
                'set': self.set_fullname
            },
        ]

    def get_fullname(self, obj):
        return f'{obj.firstname} {obj.lastname}'
        
    def set_fullname(self, obj, value):
        firstname, lastname = value.split()
        obj.firstname = firstname
        obj.lastname = lastname
        return obj


Collection.register(CustomerForest, Customer)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/Customer.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartField;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Customer
 */
class Customer extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartField
     */
    public function fullname(): SmartField
    {
        return $this->smartField(['type' => 'String'])
            ->get(fn() => $this->firstname . ' ' . $this->lastname)
            ->set(
                function ($value) {
                    [$firstname, $lastname] = explode(' ', $value);
                    $this->firstname = $firstname;
                    $this->lastname = $lastname;

                    return $this;
                }
            );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../.gitbook/assets/Capture d’écran 2019-07-01 à 12.23.14.png>)

### Searching, Sorting and Filtering on a Smart Field

To perform a search on a Smart Field, you also need to write the logic to “unzip” the data, then the search query which is specific to your zipping. In the example hereunder, the `firstname` and `lastname` are searched separately after having been unzipped.

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const models = require('../models/');
const _ = require('lodash');
const Op = models.objectMapping.Op;

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    search: function (query, search) {
      let split = search.split(' ');

      var searchCondition = {
        [Op.and]: [
          { firstname: { [Op.like]: `%${split[0]}%` } },
          { lastname: { [Op.like]: `%${split[1]}%` } },
        ]
      };

      query.where[Op.and][0][Op.or].push(searchCondition);

      return query;
    }
  }]
});
```
{% endcode %}

{% hint style="info" %}
For **case insensitive** search using PostgreSQL database use `ilike` operator. See [Sequelize operators documentation](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators).
{% endhint %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
const models = require('../models/');
const _ = require('lodash');

collection('customers', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    search(search) {
      let names = search.split(' ');
    ​
      return {
        firstname: names[0],
        lastname: names[1]
      };
    }
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/collections/customer.rb" %}
```ruby
class Forest::Customer
  include ForestLiana::Collection
​
  collection :Customer
​
  search_fullname = lambda do |query, search|
    firstname, lastname = search.split
​
    # Injects your new filter into the WHERE clause.
    query.where_clause.send(:predicates)[0] << " OR (firstname = '#{firstname}' AND lastname = '#{lastname}')"
​
    query
  end
​
  field :fullname, type: 'String', set: set_fullname, search: search_fullname do
    "#{object.firstname} #{object.lastname}"
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/customer.py" %}
```python
from django.db.models import Q

from django_forest.utils.collection import Collection
from app.models import Customer


class CustomerForest(Collection):
    def load(self):
        self.fields = [
            {
                'field': 'fullname',
                'type': 'String',
                'get': self.get_fullname,
                'search': self.search_fullname
            },
        ]

    def get_fullname(self, obj):
        return f'{obj.firstname} {obj.lastname}'
        
    def search_fullname(self, search):
        firstname, lastname = value.split()
        return Q(Q(firstname=firstname) & Q(lastname=lastname))


Collection.register(CustomerForest, Customer)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/Customer.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartAction;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartField;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Customer
 */
class Customer extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartField
     */
    public function fullname(): SmartField
    {
        return $this->smartField(['type' => 'String'])
            ->get(fn() => $this->firstname . ' ' . $this->lastname)
            ->set(
                function ($value) {
                    [$firstname, $lastname] = explode(' ', $value);
                    $this->firstname = $firstname;
                    $this->lastname = $lastname;

                    return $this;
                }
            )
            ->search(
                function (Builder $query, $value) {
                    [$firstname, $lastname] = explode(' ', $value);
                    return $query->orWhere(
                        fn($query) => $query->where('firstname', $firstname)
                            ->where('lastname', $lastname)
                    );
                }
            );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../.gitbook/assets/Capture d’écran 2019-07-01 à 12.25.58.png>)

#### Filtering

{% hint style="warning" %}
This feature is only available for version **6.7+** of the liana (version **6.2+** for Rails).
{% endhint %}

To perform a filter on a Smart Field, you need to write the filter query logic, which is specific to your use case.

In the example hereunder, the `fullname` is filtered by checking conditions on the `firstname` and `lastname` depending on the filter operator selected.

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const models = require('../models/');

const { Op } = models.Sequelize;

collection('customers', {
  fields: [{
    field: 'fullname',
    isFilterable: true,
    type: 'String',
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    filter({ condition, where }) {
      const firstWord = !!condition.value && condition.value.split(' ')[0];
      const secondWord = !!condition.value && condition.value.split(' ')[1];

      switch (condition.operator) {
        case 'equal':
          return {
            [Op.and]: [
              { firstname: firstWord },
              { lastname: secondWord || '' },
            ],
          };
        case 'ends_with':
          if (!secondWord) {
            return {
              lastName: { [Op.like]: `%${firstWord}` },
            };
          }
          return {
            [Op.and]: [
              { firstName: { [Op.like]: `%${firstWord}` } },
              { lastName: secondWord },
            ],
          };

        // ... And so on with the other operators not_equal, starts_with, etc.

        default:
          return null;
      }
    },
  }],
  segments: [],
});
```
{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
const models = require('../models');

collection('customer', {
  actions: [],
  fields: [{
    field: 'fullName',
    type: 'String',
    isFilterable: true,
    get: (customer) => {
      return customer.firstname + ' ' + customer.lastname;
    },
    filter({ condition, where }) {
      const firstWord = !!condition.value && condition.value.split(' ')[0];
      const secondWord = !!condition.value && condition.value.split(' ')[1];

      switch (condition.operator) {
        case 'equal':
          return {
            $and: [
              { firstname: firstWord },
              { lastname: secondWord || '' },
            ],
          };
        case 'ends_with':
          if (!secondWord) {
            return {
              lastname: { $regex: `.*${firstWord}` },
            };
          }
          return {
            $and: [
              { firstname: { $regex: `.*${firstWord}` } },
              { lastname: secondWord },
            ],
          };
          
        // ... And so on with the other operators not_equal, starts_with, etc.
        
        default:
          return null;
      }
    },
  }],
  segments: [],
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/customer.rb" %}
```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer

  filter_fullname = lambda do |condition, where|
    first_word = condition['value'] && condition['value'].split[0]
    second_word = condition['value'] && condition['value'].split[1]

    case condition['operator']
    when 'equal'
      "firstname = '#{first_word}' AND lastname = '#{second_word}'"
    when 'ends_with'
      if second_word.nil?
        "lastname LIKE '%#{first_word}'"
      else
        "firstname LIKE '%#{first_word}' AND lastname = '#{second_word}'"
      end
    # ... And so on with the other operators not_equal, starts_with, etc.
    end
  end

  field :fullname, type: 'String', is_read_only: false, is_required: true, is_filterable: true, filter: filter_fullname do
    "#{object.firstname} #{object.lastname}"
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/customer.py" %}
```python
from django.db.models import Q

from django_forest.utils.collection import Collection
from django_forest.resources.utils.queryset.filters.utils import OPERATORS
from app.models import Customer


class CustomerForest(Collection):
    def load(self):
        self.fields = [
            {
                'field': 'fullname',
                'type': 'String',
                'get': self.get_fullname,
                'filter': self.filter_fullname
            },
        ]

    def get_fullname(self, obj):
        return f'{obj.firstname} {obj.lastname}'
        
    def filter_fullname(self, operator, value):
        firstname, lastname = value.split()
        firstname_kwargs = {f'firstname{OPERATORS[operator]}': firstname}
        firstname_filter = Q(**firstname_kwargs)
        flastname_kwargs = {f'lastname{OPERATORS[operator]}': lastname}
        lastname_filter = Q(**lastname_kwargs)   
            
        is_negated = operator.startswith('not')
        if is_negated:
            return ~Q(firstname_filter & lastname_filter)
        return Q(firstname_filter & lastname_filter)


Collection.register(CustomerForest, Customer)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/Customer.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartAction;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartField;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Customer
 */
class Customer extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartField
     */
    public function fullname(): SmartField
    {
        return $this->smartField(['type' => 'String'])
            ->get(fn() => $this->firstname . ' ' . $this->lastname)
            ->set(
                function ($value) {
                    [$firstname, $lastname] = explode(' ', $value);
                    $this->firstname = $firstname;
                    $this->lastname = $lastname;

                    return $this;
                }
            )
            ->filter(
                function (Builder $query, $value, string $operator, string $aggregator) {
                    $data = explode(' ', $value);
                    switch ($operator) {
                        case 'equal':
                            $query->where(
                                fn($query) => $query->where('firstname', $data[0])
                                    ->where('lastname', $data[1]),
                                null,
                                null,
                                $aggregator
                            );
                            break;
                        case 'ends_with':
                            if ($data[1] === null) {
                                $query->where(
                                    fn($query) => $query->whereRaw("lastname LIKE ?", ['%' . $data[0] . '%']),
                                    null,
                                    null,
                                    $aggregator
                                );
                            } else {
                                $query->where(
                                    fn($query) => $query->whereRaw("firstname LIKE ?", ['%' . $value . '%'])
                                        ->whereRaw("lastname LIKE ?", ['%' . $value . '%']),
                                    null,
                                    null,
                                    $aggregator
                                );
                            }
                            break;
                       //... And so on with the other operators not_equal, starts_with, etc.
                        default:
                            throw new ForestException(
                                "Unsupported operator: $operator"
                            );
                    }

                    return $query;
                }
            );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../.gitbook/assets/Capture d’écran 2021-04-02 à 16.09.16.png>)

{% hint style="info" %}
Make sure you set the option `isFilterable: true` in the field definition of your code. Then, you will be able to toggle the "Filtering enabled" option in the browser, in your **Fields Settings**.
{% endhint %}

![](<../../.gitbook/assets/image (405).png>)

#### Sorting

{% hint style="danger" %}
**Sorting** on a Smart Field is not _natively supported_ in Forest Admin. However you can check out those guides:

* [Sort by Smart field](smart-field-examples/sort-by-smart-field.md)
* [Sort by Smart field that includes value from a belongsTo relationship](smart-field-examples/sort-by-smart-field-that-includes-value-from-a-belongsto-relationship.md)
{% endhint %}

### Available Field Options <a href="#available-field-options" id="available-field-options"></a>

Here are the list of available options to customize your Smart Field:

| Name        | Type             | Description                                                                                                                    |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| field       | string           | The name of your Smart Field.                                                                                                  |
| type        | string           | Type of your field. Can be `Boolean`, `Date`, `Json`,`Dateonly`, `Enum`, `File`, `Number, ['String']` or `String` .            |
| enums       | array of strings | (optional) Required only for the `Enum` type. This is where you list all the possible values for your input field.             |
| description | string           | (optional) Add a description to your field.                                                                                    |
| reference   | string           | (optional) Configure the Smart Field as a [Smart Relationship](../models/relationships/#what-is-a-smart-relationship).         |
| isReadOnly  | boolean          | (optional) If `true`, the Smart Field won’t be editable in the browser. Default is `true` if there’s no `set` option declared. |
| isRequired  | boolean          | (optional) If true, your Smart Field will be set as required in the browser. Default is false.                                 |

{% hint style="info" %}
You can define a widget for a smart field from the [settings of your collection](https://docs.forestadmin.com/user-guide/collections/customize-your-fields).
{% endhint %}

### Building Performant Smart Fields <a href="#createadvancedsmartfield" id="createadvancedsmartfield"></a>

To optimize your smart field performance, we recommend using a mechanism of batching and caching data requests.

Implement them using the DataLoader which is a generic utility to be used as part of your application's data fetching layer to provide a simplified and consistent API over various remote data sources.

#### Smart field declaration

{% tabs %}
{% tab title="SQL" %}
{% code title="forest/post.js" %}
```javascript
const DataLoader = require('dataloader');

const authorLoader = new DataLoader(async (authorKeys) => {
  const authors = await users.findAll({
    where: { id: authorKeys },
  });

  const authorsById = new Map(authors.map(user => [user.id, user]));

  return authorKeys.map(authorKey => authorsById.get(authorKey));
})

collection('posts', {
  actions: [],
  fields: [
    {
      field: 'author_name',
      type: 'String',
      get: async (record) => {
        const author = await authorLoader.load(record.authorKey);

        return author.name;
      }
    }
  ],
  segments: []
});
```
{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="forest/post.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
const { Address } = require('../models');
const Dataloader = require('dataloader');

const addressLoader = new Dataloader((customerIds) => {
  const addresses = await models.addresses.find({
    customer_id: {
      $in: customerIds
    }
  });

  const addressesByCustomerId = new Map(addresses.map(
    address => [address.customer_id, address]
  ));

  return customerIds.map(customerId => addressesByCustomerId.get(customerId));
})

collection('customers', {
  fields: [{
    field: 'full_address',
    type: 'String',
    get: (customer) => {
      return addressLoader.load(customer.id)
        .then((address) => {
          return address.address_line_1 + '\n' +
            address.address_line_2 + '\n' +
            address.address_city + ' ' + address.country;
        });
    }
  }]
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

####
