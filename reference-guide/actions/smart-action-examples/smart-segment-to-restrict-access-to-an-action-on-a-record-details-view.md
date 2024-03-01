{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Smart segment to restrict access to an action on a record details view

**Context**: As a user, I want to enable or not a smart action for a record depending on the value of a smart field.

In this example, the user wants to enable the access to a smart action called `restricted action` for a collection `customers` solely for customers that have registered `orders`. In our data models a customer hasMany orders.

{% embed url="https://www.loom.com/share/65e2b2fe61c24bdc9ee4882c75cd1421" %}

The behavior observed above corresponds to this implementation in the file `customers.js`

```jsx
const { collection } = require('forest-express-sequelize');
const models = require('../models');
const { Op } = models.Sequelize;

collection('customers', {
  actions: [
    {
      name: 'Restricted action',
    },
  ],
  fields: [
    {
      field: 'ordersNumber',
      type: 'Number',
      get(customer) {
        return models.orders
          .count({ where: { customer_id: customer.id } })
          .then((nb) => nb);
      },
    },
  ],
  segments: [
    {
      name: 'Customers with orders',
      where: (query) => {
        const recordId = JSON.parse(query.filters).value;
        return models.orders
          .count({ where: { customer_id: recordId } })
          .then((ordersNumber) => {
            if (ordersNumber > 0) {
              return { id: { [Op.in]: [recordId] } };
            }
            return { id: { [Op.in]: [null] } };
          });
      },
    },
  ],
});
```

This works only at the level of a records details view as we are looking to catch the query made to ensure that the action should be visible. This query is structured this way and allows us to implement the logic above by retrieving the record id present in the filter:

```javascript
{
  segment: 'Customers with orders',
  filters: '{"field":"id","operator":"equal","value":"67573"}',
  timezone: 'Europe/Paris'
}
```
