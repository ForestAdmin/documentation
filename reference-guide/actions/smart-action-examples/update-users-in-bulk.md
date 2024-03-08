---
description: >-
  This example shows how to bulk update users
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

# Anonymize users in bulk

As usual, you must declare the action on your collection.

{% code title="forest/users.js" %}

```javascript
// forest/users.js
const Liana = require('forest-express-sequelize');

Liana.collection('users', {
  actions: [
    {
      name: 'Anonymize',
      type: 'single',
    },
  ],
});
```

{% endcode %}

ou can then implement the post action as you need. Here the records are simply updated in bulk through the `sequelize` ORM.
{% code title="routes/users.js" %}

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const models = require('../models');
const {
  ensureAuthenticated,
  RecordsGetter,
} = require('forest-express-sequelize');

router.post(
  '/actions/anonymize',
  ensureAuthenticated,
  parseRequestBody,
  async (request, response) => {
    const { query, user } = request;
    const recordsGetter = new RecordsGetter(models.user, user, query);
    const records = await recordsGetter.getAll();

    try {
      await models.user.update(
        {
          firstName: '*** Anonymized First Name ***',
          lastName: '*** Anonymized Last Name ***',
        },
        { where: { id: records.map((record) => record.id) } }
      );
      response.send({ success: 'User(s) anonymized' });
    } catch (e) {
      return response
        .status(400)
        .send({ error: `Failure during user anonymization: ${e.message}` });
    }
  }
);

module.exports = router;
```

{% endcode %}
