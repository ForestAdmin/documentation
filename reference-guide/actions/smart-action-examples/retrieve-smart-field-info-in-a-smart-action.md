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

# Retrieve smart field info in a smart action

Example of retrieving a Smart field into a Smart action

{% code title="forest/users.js" %}

```javascript
const Liana = require('forest-express-sequelize');

Liana.collection('users', {
  fields: [
    {
      field: 'fullemail',
      type: 'String',
      get: (user) => {
        return user.email + ' + ' + 'hello';
      },
    },
  ],
  actions: [
    {
      name: 'test',
      type: 'single',
    },
  ],
});

// routes/users.js
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const models = require('../models');

router.post('/actions/test', Liana.ensureAuthenticated, (req, res, next) => {
  const userId = req.body.data.attributes.ids[0];
  return models.users
    .findByPk(userId)
    .then((user) =>
      new Liana.ResourceSerializer(
        Liana,
        models.users,
        user,
        null,
        {},
        {}
      ).perform()
    )
    .then((userSerialized) => {
      // NOTICE: Liana.ResourceSerializer will compute all Smart Field values of the record.
      return res.send({
        success: `Top Top ${userSerialized.data.attributes.fullemail}`,
      });
    })
    .catch(next);
});

module.exports = router;
```

{% endcode %}
