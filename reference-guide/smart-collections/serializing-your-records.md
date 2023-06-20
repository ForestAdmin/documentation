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
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/forest/customer_stats.js" %}
```javascript
const { collection } = require('forest-express-mongoose');

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
const serializedRecords = recordSerializer.serialize(records)
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
  fields: [{
    field: 'orders_count',
    type: 'Number',
  }, {
    field: 'total_amount',
    type: 'Number',
  }, {
    field: 'customer',
    type: 'String',
    reference: 'customers.id',
  }],
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
  fields: [{
    field: 'orders_count',
    type: 'Number',
  }, {
    field: 'total_amount',
    type: 'Number',
  }, {
    field: 'customer',
    type: 'String',
    reference: 'customers._id',
  }],
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
const serializedRecords = recordsSerializer.serialize(records)
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
