---
description: >-
  ⚠️ This page is relevant only if you installed Forest Admin directly on a
  database (SQL/Mongodb). If you installed in a Rails app, check the "Override a
  route" page.
---

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

# Extend a route

Extending a route is a clean way to achieve more by building on top of Forest Admin's existing routes.

To extend a route, simply **add** **your own logic before the `next()` statement:**

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/companies.js" %}

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Create a Action Approval - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#create-a-record
router.post('/companies', permissionMiddlewareCreator.create(), (req, res, next) => {
  // >> Add your logic here <<
  next();
});

...

module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/companies.js" %}

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-mongoose');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Create a Action Approval - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#create-a-record
router.post('/companies', permissionMiddlewareCreator.create(), (req, res, next) => {
  // >> Add your logic here <<
  next();
});

...

module.exports = router;
```

{% endcode %}
{% endtab %}
{% endtabs %}

### Adding logic with an API call

The most simple way to trigger your business app's (or any external app's) logic is with an API call!

In the following example, we override the `CREATE` route so that a credit card is created whenever a new customer is created in Forest Admin:

<figure><img src="../../.gitbook/assets/extend_a_route_1.jpg" alt=""><figcaption></figcaption></figure>

{% code title="/routes/customers.js" %}

```javascript
...

// Require superagent once you've installed it (npm install superagent)
const superagent = require('superagent');

...

router.post('/customers', permissionMiddlewareCreator.create(), (req, res, next) => {
  // Prepare the API call using the Forest Admin's posted data
  superagent
    .post('https://my-company/create-card')
    // Don't forget to authenticate your request using the relevant authentication method
    .set('X-API-Key', '**********')
    .end((err, res) => {
      // Call next() to execute Forest Admin's default behavior
      next();
    });
});

...

module.exports = router;
```

{% endcode %}

### Adding logic with a message broker

Using a message broker - such as RabbitMQ or Kafka - to broadcast events is current practice.

Here is how you could be using [RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html) to handle `orders` synchronization across multiple channels:

<figure><img src="../../.gitbook/assets/extend_a_route_2.jpg" alt=""><figcaption></figcaption></figure>

{% code title="/routes/orders.js" %}

```javascript
...

const amqp = require('amqplib/callback_api');

...

router.put('/orders/:orderId', permissionMiddlewareCreator.update(), (req, res, next) => {
    // Prepare your message from Forest Admin's updated data
	var orderId = req.body.data.id;
	var orderStatus = req.body.data.attributes.shipping_status;
	var message = 'Order ' + orderId + ' shipping status is now: ' + orderStatus;
	var queue = 'orders_sync_queue';

    // Connect to your Rabbitmq remote instance and publish your message
    amqp.connect('amqp://{your_rabbitmq_host}', function(error0, connection) {
	    if (error0) {
	        throw error0;
	    }
	    connection.createChannel(function(error1, channel) {
	        if (error1) {
	            throw error1;
	        }
	        channel.assertQueue(queue, {
	            durable: false
	        });
	        channel.sendToQueue(queue, Buffer.from(message));
	    });
	    setTimeout(function() {
	        connection.close();
	    }, 500);
	});

  // Call next() to execute Forest Admin's default behavior
  next();
});

...

module.exports = router;
```

{% endcode %}

### Adding logic after Forest Admin's default behavior

At some point, you may want to trigger your remote logic **after** Forest Admin's logic.

To achieve this, you can manually recreate `next()`'s behavior by using the snippets of [default routes](default-routes.md), then append your own logic.
