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

# Impersonate a user

This example shows you how to create a Smart Action `"Impersonate"` to login as one of your customers.

It can be useful to help your customers debug an issue or to get a better understanding of what they see on their account (in your app).

![](<../../../.gitbook/assets/image (495).png>)

## Requirements

- An admin backend running on forest-express-sequelize/forest-express-mongoose

## How it works

### Directory: /models

This directory contains the `users.js` file where the model is declared.

{% tabs %}
{% tab title="Sequelize" %}
{% code title="/models/users.js" %}

```javascript
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  const Users = sequelize.define('users', {
    email: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    //...
  }, {
    tableName: 'users',
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });
​
  Users.associate = (models) => {
  };
​
  return Users;
};
```

{% endcode %}
{% endtab %}

{% tab title="Mongoose" %}
{% code title="/models/users.js" %}

```javascript
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  'email': String,
  'createdAt': Date,
  ...
}, {
  timestamps: false,
});

module.exports = mongoose.model('users', schema, 'users');
```

{% endcode %}
{% endtab %}
{% endtabs %}

### **Directory: /forest**

This directory contains the `users.js` file where the Smart Action `Impersonate`is declared.

{% tabs %}
{% tab title="Sequelize" %}
{% code title="/forest/users.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

collection('users', {
  actions: [
    {
      name: 'Impersonate',
      type: 'single',
    },
  ],
});
```

{% endcode %}
{% endtab %}

{% tab title="Mongoose" %}
{% code title="/forest/users.js" %}

```javascript
const { collection } = require('forest-express-mongoose');

collection('users', {
  actions: [
    {
      name: 'Impersonate',
      type: 'single',
    },
  ],
});
```

{% endcode %}
{% endtab %}
{% endtabs %}

### **Directory: /routes**

This directory contains the `users.js` file where the implementation of the route is handled. The `POST /forest/actions/impersonate` API call is triggered when you click on the Smart Action in the Forest UI.&#x20;

{% tabs %}
{% tab title="Sequelize" %}
{% code title="routes/users.js" %}

```javascript
router.post('/actions/impersonate',
  (req, res) => {
    let userId = req.body.data.attributes.ids[0];
​
    response.send({
      webhook: { // This is the object that will be used to fire http calls.
        url: 'https://my-app-url/login', // The url of the company providing the service.
        method: 'POST', // The method you would like to use (typically a POST).
        headers: { }, // You can add some headers if needed (you can remove it).
        body: { // A body to send to the url (only JSON supported).
          adminToken: 'your-admin-token',
        },
      },
      success: `Impersonating user ${userId}`, // The success message that will be toasted.
      redirectTo: 'https://my-app-url/', // Force the redirection to your app if needed.
    });
​
});
​
module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Mongoose" %}
{% code title="/routes/users.js" %}

```javascript
router.post('/actions/impersonate', (req, res) => {
  let userId = req.body.data.attributes.ids[0];

  response.send({
    webhook: {
      // This is the object that will be used to fire http calls.
      url: 'https://my-app-url/login', // The url of the company providing the service.
      method: 'POST', // The method you would like to use (typically a POST).
      headers: {}, // You can add some headers if needed (you can remove it).
      body: {
        // A body to send to the url (only JSON supported).
        adminToken: 'your-admin-token',
      },
    },
    success: `Impersonating user ${userId}`, // The success message that will be toasted.
    redirectTo: 'https://my-app-url/', // Force the redirection to your app if needed.
  });
});

module.exports = router;
```

{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
This is useful for authentication using cookies. By using this example, you're performing the login request directly from the browser. Thus, the cookies will be automatically sent from your own service to the browser (as you'd normally do with your own app).
{% endhint %}
