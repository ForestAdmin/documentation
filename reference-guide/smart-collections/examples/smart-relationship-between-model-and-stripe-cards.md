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

# Smart relationship between model and stripe cards

**Context**: as a user I want to display stripe cards associated to a user using the Stripe API.

### Implementation

First step is to declare the smart collection user_stripe_cards in a `user-stripe-cards.js` file in the forest folder.

```jsx
const { collection } = require('forest-express-sequelize');
const models = require('../models');

collection('users_stripe_cards', {
  isSearchable: true,
  fields: [
    {
      field: 'id',
      type: 'String',
    },
    {
      field: 'country',
      type: 'String',
    },
    {
      field: 'brand',
      type: 'String',
    },
    {
      field: 'exp_month',
      type: 'Number',
    },
    {
      field: 'exp_year',
      type: 'Number',
    },
    {
      field: 'last4',
      type: 'Number',
    },
  ],
});
```

Next step is to add the smart relationship between users and stripe cards in the `forest/users.js` file.

```jsx
collection('users', {
  actions: [],
  fields: [
    {
      field: 'stripe-cards',
      type: ['String'],
      reference: 'users_stripe_cards.id',
    },
  ],
  segments: [],
});
```

Final step is to implement the route for the relationship for the cards to be displayed as related data of a user. This is done in the `routes/users.js` file.

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { users, usersData } = require('../models');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('users');

router.get(
  '/users/:userId/relationships/stripe-cards',
  async (request, response, next) => {
    const UserStripeCardSerializer = new JSONAPISerializer(
      'users_stripe_cards',
      {
        attributes: ['country', 'brand', 'exp_year', 'exp_month', 'last4'],
      }
    );
    const { userId } = request.params;
    const stripeId = await usersData
      .findOne({
        where: { userId },
      })
      .then((userData) => userData.stripeId)
      .catch(() => null);
    const cardsInfo = await stripe.customers.listSources(stripeId, {
      object: 'card',
      limit: 3,
    });
    const data = UserStripeCardSerializer.serialize(cardsInfo.data);
    return response.send(data);
  }
);

module.exports = router;
```
