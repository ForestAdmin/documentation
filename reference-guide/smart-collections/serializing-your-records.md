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

# Serializing your records

To be interpreted correctly by the ForestAdmin UI, the data must be sent from your admin backend using a particular structure.\
\
This structure needs to comply to the JSON API standard. The JSON API standard is used to ensure a standardized way to format JSON responses returned to clients. You can find some more information directly from their [website](https://jsonapi.org/).\
\
Most of the time, your admin backend will handle this for you, and you will not have to play with serialization. However you might encounter specific use cases that will require you to serialize data yourself, such as smart collections for example.‌

In order to help you do so, the helper `RecordSerializer` is made available through the packages built-in your admin panel.‌

### Initializing the record serializer

{% tabs %}
{% tab title="SQL" %}

```javascript
const { RecordSerializer } = require('forest-express-sequelize');​

const recordSerializer = new RecordSerializer({ name: 'customer_stats' });
```

{% endtab %}

{% tab title="MongoDB" %}

```javascript
const { RecordSerializer } = require('forest-express-mongoose');​

const recordsSerializer = new RecordSerializer({ modelName: 'customer_stats' });
```

{% endtab %}
{% endtabs %}

To make use of the serializer, simply get it from your agent package, and initialize it with a collection of yours. The serializer will retrieve the structure of the collection, and thus, will know which attributes it needs to take in to perform the serialization.1‌

### Example 1 - Smart collection with simple fields

Let's take a look at the collection defined in the documentation's [smart collection example](./):

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/customer_stats.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

collection('customer_stats', {
  isSearchable: true,
  fields: [
    {
      field: 'email',
      type: 'String',
    },
    {
      field: 'orders_count',
      type: 'Number',
    },
    {
      field: 'total_amount',
      type: 'Number',
    },
  ],
});
```

{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/forest/customer_stats.js" %}

```javascript
const { collection } = require('forest-express-mongoose');

collection('customer_stats', {
  isSearchable: true,
  fields: [
    {
      field: 'email',
      type: 'String',
    },
    {
      field: 'orders_count',
      type: 'Number',
    },
    {
      field: 'total_amount',
      type: 'Number',
    },
  ],
});
```

{% endcode %}
{% endtab %}
{% endtabs %}

The serializer exposes a `.serialize()` method that takes as an argument an array of objects (or a single object). In the smart collection example, this array would be as such:

{% tabs %}
{% tab title="SQL" %}

```javascript
const records = [
  {
    id: 67427,
    email: 'janessa_langosh@example.net',
    orders_count: '4',
    total_amount: 93800,
    created_at: 2018-03-19T14:59:59.440Z,
    updated_at: 2018-03-19T15:00:00.443Z
  },
  {
    id: 67429,
    email: 'dortha90@example.net',
    orders_count: '3',
    total_amount: 106700,
    created_at: 2018-03-19T15:00:08.430Z,
    updated_at: 2018-03-19T15:00:09.134Z
  },
  ...
]
```

{% endtab %}

{% tab title="MongoDB" %}

```javascript
const records = [
  {
    _id: 5eebcb6bb9faba06df0cd7a9,
    email: 'janessa_langosh@example.net',
    orders_count: '4',
    total_amount: 93800,
    created_at: 2018-03-19T14:59:59.440Z,
    updated_at: 2018-03-19T15:00:00.443Z
  },
  {
    _id: 5eec5c30b9faba06df0cd917,
    email: 'dortha90@example.net',
    orders_count: '3',
    total_amount: 106700,
    created_at: 2018-03-19T15:00:08.430Z,
    updated_at: 2018-03-19T15:00:09.134Z
  }
  ...
]
```

{% endtab %}
{% endtabs %}

To perform the serialization just use the `.serialize()` method like this:

```javascript
const serializedRecords = recordSerializer.serialize(records);
```

The serialized records are formatted as follows:

{% tabs %}
{% tab title="SQL" %}

```javascript
{
  data: [
    {
      type: 'customer_stats',
      id: '67427',
      attributes: {
        email: 'janessa_langosh@example.net',
        orders_count: '4',
        total_amount: 93800
      }
    },
    {
      type: 'customer_stats',
      id: '67429',
      attributes: {
        email: 'dortha90@example.net',
        orders_count: '3',
        total_amount: 106700
      },
    },
    ...
  ]
}
```

{% endtab %}

{% tab title="MongoDB" %}

```javascript
{
  data: [
    {
      type: 'customer_stats',
      id: '5eebcb6bb9faba06df0cd7a9',
      attributes: {
        email: 'janessa_langosh@example.net',
        orders_count: '4',
        total_amount: 93800
      }
    },
    {
      type: 'customer_stats',
      id: '5eec5c30b9faba06df0cd917',
      attributes: {
        email: 'dortha90@example.net',
        orders_count: '3',
        total_amount: 106700
      },
    },
    ...
  ]
}
```

{% endtab %}
{% endtabs %}

This is the proper format expected by the UI to correctly display the records.‌

### Example 2 - Smart collection example with an added belongsTo relationship

Now let's say we want to reference the customer related to a stat instead of just displaying its `email`. We would then adapt the smart collection definition to include a field `customer` referencing the `customers` collection:

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/customer_stats.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

collection('customer_stats', {
  isSearchable: true,
  fields: [
    {
      field: 'orders_count',
      type: 'Number',
    },
    {
      field: 'total_amount',
      type: 'Number',
    },
    {
      field: 'customer',
      type: 'String',
      reference: 'customers.id',
    },
  ],
});
```

{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/forest/customer_stats.js" %}

```javascript
const { collection } = require('forest-express-mongoose');

collection('customer_stats', {
  isSearchable: true,
  fields: [
    {
      field: 'orders_count',
      type: 'Number',
    },
    {
      field: 'total_amount',
      type: 'Number',
    },
    {
      field: 'customer',
      type: 'String',
      reference: 'customers._id',
    },
  ],
});
```

{% endcode %}
{% endtab %}
{% endtabs %}

For the belongsTo relationship to be properly serialized, the records passed on to the serializer should include the related object (here `customer`), following this structure:

{% tabs %}
{% tab title="SQL" %}

```javascript
const records = [
  {
    id: 67427,
    customer: {
      id: 27048
    },
    orders_count: '4',
    total_amount: 93800,
    created_at: 2018-03-19T14:59:59.440Z,
    updated_at: 2018-03-19T15:00:00.443Z
  },
  {
    id: 67429,
    customer: {
      id: 27049
    },
    orders_count: '3',
    total_amount: 106700,
    created_at: 2018-03-19T15:00:08.430Z,
    updated_at: 2018-03-19T15:00:09.134Z
  },
  ...
]
```

{% endtab %}

{% tab title="MongoDB" %}

```javascript
const records = [
  {
    id: 5eebcb6bb9faba06df0cd7a9,
    customer: {
      id: 5eebcb6bb9faba06df0cd7a9
    },
    orders_count: '4',
    total_amount: 93800,
    created_at: 2018-03-19T14:59:59.440Z,
    updated_at: 2018-03-19T15:00:00.443Z
  },
  ...
]
```

{% endtab %}
{% endtabs %}

Now if we try to serialize this data, the serializer will automatically detect that the records to be serialized include another record (customer in this case), based on the collection definition.‌

The included records will then be picked up and wrapped to comply to the JSON API relationships format.

```javascript
const serializedRecords = recordsSerializer.serialize(records);
```

The serialized records are formatted as follows:

{% tabs %}
{% tab title="SQL" %}

```javascript
{
  data: [
    {
      type: 'customer_stats',
      id: '67427',
      attributes: {
        orders_count: '4',
        total_amount: 93800
      },
      relationships: {
        customer: {
          data: {type: "customers", id: "27048"}
          links: {related: {href: "/forest/customer_stats/67427/relationships/customer"}}
        }
      }
    },
    ...
  ],
  included: [
    {
      type: "customers"
      id: "27048"
      attributes: {
        id: 27048
      }
    },
    ...
  ]
}
```

{% endtab %}

{% tab title="MongoDB" %}

```javascript
{
  data: [
    {
      type: 'customer_stats',
      id: '5eebcb6bb9faba06df0cd7a9',
      attributes: {
        orders_count: '4',
        total_amount: 93800
      },
      relationships: {
        customer: {
          data: {type: "customers", id: "5eebcb6bb9faba06df0cd7a9"}
          links: {related: {href: "/forest/customer_stats/5eebcb6bb9faba06df0cd7a9/relationships/customer"}}
        }
      }
    },
    ...
  ],
  included: [
    {
      type: "customers"
      id: "5eebcb6bb9faba06df0cd7a9"
      attributes: {
        id: "5eebcb6bb9faba06df0cd7a9"
      }
    },
    ...
  ]
}
```

{% endtab %}
{% endtabs %}

Note that the `customer` relationship is clearly indicated under the `relationships` attribute. Also note that the customer is automatically wrapped in the `included` section, with its attributes if you specified some (only `id` in this case).
