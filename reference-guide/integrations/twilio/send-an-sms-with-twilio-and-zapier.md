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

# Send an SMS with Twilio and Zapier

This example shows you how to create a Smart Action `"Send SMS"` that triggers a [Zapier webhook](https://zapier.com/zapbook/webhook/) to send an SMS message with Twilio.

![](<../../../.gitbook/assets/image (548).png>)

## Requirements

- An admin backend running on forest-express-sequelize
- A Zapier account
- [node-fetch](https://www.npmjs.com/package/node-fetch) npm package

## How it works

### Directory: /models

This directory contains the `users.js` file where the model is declared.

{% code title="/models/users.js" %}

```javascript
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  const Users = sequelize.define(
    'users',
    {
      email: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'users',
      timestamps: false,
      schema: process.env.DATABASE_SCHEMA,
    }
  );

  Users.associate = (models) => {};

  return Users;
};
```

{% endcode %}

### **Directory: /forest**

This directory contains the `users.js` file where the Smart Action `Send SMS`is declared.

{% code title="/forest/users.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

collection('users', {
  actions: [
    {
      name: 'Send SMS',
      type: 'single',
    },
  ],
});
```

{% endcode %}

### **Directory: /routes**

This directory contains the `users.js` file where the implementation of the route is handled. The `POST /forest/actions/send-sms` API call is triggered when you click on the Smart Action in the Forest UI. The route implementation retrieves all the necessary data and triggers another API call directly to a [Zapier hook](https://zapier.com/zapbook/webhook/).

{% code title="/routes/users.js" %}

```javascript
const fetch = require('node-fetch');
//...

// Send SMS
router.post('/actions/send-sms', (request, response) => {
  let userId = request.body.data.attributes.ids[0];
  return users
    .findByPk(userId)
    .then((user) => {
      user = user.toJSON();
      return fetch(
        'https://hooks.zapier.com/hooks/catch/4760242/o1uqz0r/silent',
        {
          method: 'POST',
          body: JSON.stringify({
            phoneNumber: user.phoneNumber,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
    })
    .then(() => {
      response.status(204).send();
    });
});

//...

module.exports = router;
```

{% endcode %}
