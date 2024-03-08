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

# Razorpay

**Context**: As a user I want to be able to see all payments and orders related to a customer from Razorpay.

**Example**: I have a collection `users` and a collection `orders` in the database. An order belongs to a customer through a field `user`. An order has a field `order_reference` and `payment_reference` that are ids of objects from Razorpay.

![](<../../.gitbook/assets/image (534).png>)

### Models

`models/users.js`

```jsx
const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    Age: Number,
    Interests: [String],
    Name: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('users', schema, 'users');
```

`models/orders.js`

```jsx
const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    reference: String,
    payment_ref: String,
    order_ref: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('orders', schema, 'orders');
```

### Implementation

#### Declare virtual collections

`forest/razorpay-payments`

```jsx
const { collection } = require('forest-express-mongoose');

collection('razorpayPayments', {
  actions: [],
  fields: [
    {
      field: 'amount',
      type: 'Number',
    },
    {
      field: 'entity',
      type: 'String',
    },
    {
      field: 'method',
      type: 'String',
    },
    {
      field: 'international',
      type: 'Boolean',
    },
    {
      field: 'currency',
      type: 'String',
    },
    {
      field: 'method',
      type: 'String',
    },
    {
      field: 'amount_refunded',
      type: 'Number',
    },
    {
      field: 'refund_status',
      type: 'String',
    },
    {
      field: 'captured',
      type: 'Boolean',
    },
    {
      field: 'description',
      type: 'String',
    },
    {
      field: 'card_id',
      type: 'String',
    },
    {
      field: 'bank',
      type: 'String',
    },
    {
      field: 'wallet',
      type: 'String',
    },
    {
      field: 'vpa',
      type: 'String',
    },
    {
      field: 'email',
      type: 'String',
    },
    {
      field: 'contact',
      type: 'String',
    },
    {
      field: 'fee',
      type: 'Number',
    },
    {
      field: 'tax',
      type: 'Number',
    },
    {
      field: 'error_code',
      type: 'String',
    },
    {
      field: 'error_description',
      type: 'String',
    },
    {
      field: 'status',
      type: 'String',
    },
    {
      field: 'created_at',
      type: 'Date',
    },
  ],
  segments: [],
});
```

`forest/razorpay-orders.js`

```jsx
const { collection } = require('forest-express-mongoose');

collection('razorpayOrders', {
  actions: [],
  fields: [
    {
      field: 'amount',
      type: 'Number',
    },
    {
      field: 'entity',
      type: 'String',
    },
    {
      field: 'amount_paid',
      type: 'String',
    },
    {
      field: 'amount_due',
      type: 'String',
    },
    {
      field: 'currency',
      type: 'INR',
    },
    {
      field: 'receipt',
      type: 'String',
    },
    {
      field: 'status',
      type: 'String',
    },
    {
      field: 'created_at',
      type: 'Date',
    },
  ],
  segments: [],
});
```

#### Add relationships to virtual collections

You need to declare a relationship between the `users` collection and the virtual `razorpayPayments` and `razorpayOrders` collections in the `forest/users.js` file.

```jsx
const { collection } = require('forest-express-mongoose');

collection('users', {
  actions: [],
  fields: [
    {
      field: 'razorpayPayments',
      type: ['String'],
      reference: 'razorpayPayments.id',
    },
  ],
  segments: [],
});
```

### Define route logic for the relationship

You now have to implement the logic to be executed to retrieve and send the information from Razorpay to the UI when the corresponding route is called.

This is done in the file `routes/users.js.` Remember that you need to properly serialize the objects in order for the UI to correctly display them, using the `RecordsSerializer`.

```javascript
const express = require('express');
const {
  PermissionMiddlewareCreator,
  RecordSerializer,
} = require('forest-express-mongoose');
const superagent = require('superagent');
const { orders } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('users');

router.get(
  '/users/:recordId/relationships/razorpayPayments',
  permissionMiddlewareCreator.details(),
  async (request, response, next) => {
    const razorpayPaymentSerializer = new RecordSerializer({
      modelName: 'razorpayPayments',
    });
    const { recordId } = request.params;
    const userOrders = await orders.find({ user: recordId });
    const fetchPaymentsFromApi = [];
    userOrders.forEach((record) => {
      let fetchPayment = superagent
        .get(
          `https://${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}@api.razorpay.com/v1/payments/${record.payment_ref}`
        )
        .then((res) => JSON.parse(res.text));
      fetchPaymentsFromApi.push(fetchPayment);
    });
    return Promise.all(fetchPaymentsFromApi)
      .then((res) => razorpayPaymentSerializer.serialize(res))
      .then((recordsSerialized) =>
        response.send({
          ...recordsSerialized,
          meta: { count: recordsSerialized.data.length },
        })
      )
      .catch((e) => {
        console.log(
          chalk.red('error with razorpay api call =>', e.response.res.text)
        );
        return response.send({});
      });
  }
);

router.get(
  '/users/:recordId/relationships/razorpayOrders',
  permissionMiddlewareCreator.details(),
  async (request, response, next) => {
    const razorpayOrderSerializer = new RecordSerializer({
      modelName: 'razorpayOrders',
    });
    const { recordId } = request.params;
    const userOrders = await orders.find({ user: recordId });
    const fetchPaymentsFromApi = [];
    userOrders.forEach((record) => {
      let fetchPayment = superagent
        .get(
          `https://${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}@api.razorpay.com/v1/orders/${record.order_ref}`
        )
        .then((res) => JSON.parse(res.text));
      fetchPaymentsFromApi.push(fetchPayment);
    });
    return Promise.all(fetchPaymentsFromApi)
      .then((res) => razorpayOrderSerializer.serialize(res))
      .then((recordsSerialized) =>
        response.send({
          ...recordsSerialized,
          meta: { count: recordsSerialized.data.length },
        })
      )
      .catch((e) => {
        console.log(
          chalk.red('error with razorpay api call =>', e.response.res.text)
        );
        return response.send({});
      });
  }
);

module.exports = router;
```
