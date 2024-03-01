{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Sort by smart field that includes value from a belongsTo relationship

**Context**: As a user I want to be able to sort records based on a smart field where the smart field includes data from the current record's parent.

**Example**: Here I have a model `orders` that has a belongsTo relationship with the `customers` model.

I have a smart field in the `orders` model called `customer email` that returns the value of the parent customer's email field. I want to sort the orders by the `customer email` smart field.

### Implementation

`forest/orders.js`

```jsx
const { collection } = require('forest-express-sequelize');
const models = require('../models');

collection('orders', {
  actions: [],
  fields: [{
    field: 'customer email',
    get: (order) => models.customers
      .findByPk(order.customer.dataValues.id)
      .then((customer) => customer.email),
    isSortable: true,
  }],
  segments: [],
});
```

`routes/orders.js`

```javascript
router.get('/orders', permissionMiddlewareCreator.list(), (request, response, next) => {
  if (request.query.sort.includes('customer email')) {
    request.query.sort = request.query.sort.includes('-') ? '-customer.email' : 'customer.email';
  }
  next();
});
```
