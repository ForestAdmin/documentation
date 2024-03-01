{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

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
