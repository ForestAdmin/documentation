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

# Add validation to a smart field edition

**Context**: I want to make sure that my users can only enter a value satisfying a certain set of conditions when editing a smart field.

Here I'm working on a collection `customers` and the smart field `'must-be-kuku'` should only accept the value `kuku`.

{% embed url="https://www.loom.com/share/22641b6c62d9469ea244e12b4557f02e" %}

`forest/customers.js`

```jsx
const { collection } = require('forest-express-sequelize');
const models = require('../models');

// This file allows you to add to your Forest UI:
// - Smart actions: <https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions>
// - Smart fields: <https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields>
// - Smart relationships: <https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship>
// - Smart segments: <https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments>
collection('customers', {
  actions: [],
  fields: [
    {
      field: 'must-be-kuku',
      type: 'String',
      get(customer) {
        return 'kuku';
      },
      set(customer, value) {},
    },
  ],
  segments: [],
});
```

At the route level I need to check the user input from the edit form in the UI and check the value that has been entered into the field `'must-be-kuku'`.

`routes/customers.js`

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { customers } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'customers'
);

// Update a Customer
router.put(
  '/customers/:recordId',
  permissionMiddlewareCreator.update(),
  (request, response, next) => {
    if (request.body.data.attributes['must-be-kuku'] !== 'kuku') {
      return response.status(403).send('should have been kuku!');
    }
    next();
  }
);

module.exports = router;
```
