# Impersonate a user



This example shows you how to create a Smart Action `"Impersonate"` to login as one of your customers.

It can be useful to help your customers debug an issue or to get a better understanding of what they see on their account (in your app).

![](<../../../.gitbook/assets/image (495).png>)

## Requirements

* An admin backend running on forest-express-sequelize/forest-express-mongoose

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
  actions: [{
    name: 'Impersonate',
    type: 'single'
  }],
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongoose" %}
{% code title="/forest/users.js" %}
```javascript
const { collection } = require('forest-express-mongoose');

collection('users', {
  actions: [{
    name: 'Impersonate',
    type: 'single'
  }],
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
router.post('/actions/impersonate',
  (req, res) => {
    let userId = req.body.data.attributes.ids[0];

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

});

module.exports = router;
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
This is useful for authentication using cookies. By using this exemple, you're performing the login request directly from the browser. Thus, the cookies will be automatically sent from your own service to the browser (as you'd normally do with your own app).
{% endhint %}
