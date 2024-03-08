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
