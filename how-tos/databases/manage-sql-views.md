# Manage SQL views

In SQL, a view is a virtual table based on the result-set of an SQL statement. Views can provide advantages over tables, such as:

* represent a subset of the data contained in a table (see also[ segments](https://docs.forestadmin.com/user-guide/collections/segments)).
* join and simplify many tables into a single virtual table.
* act as aggregated tables, where the database engine aggregates data (sum, average etc.) and presents the calculated results as part of the data.

{% hint style="info" %}
Forest Admin natively supports SQL views. If you have already implemented views, simply add [the associated models](https://docs.forestadmin.com/documentation/reference-guide/models/enrich-your-models#declaring-a-new-model) to display them on your interface.
{% endhint %}

## Creating the SQL View

To create a view, we use  `CREATE VIEW` statement.&#x20;

In the following example, we look for the **user's email**, **the number of orders** and **the total amount spent**.

```sql
CREATE VIEW customer_stats AS
  SELECT customers.id,
    customers.email,
    count(orders.*) AS nb_orders,
    sum(products.price) AS amount_spent,
    customers.created_at,
    customers.updated_at
  FROM customers
    JOIN orders ON customers.id = orders.customer_id
    JOIN products ON orders.product_id = products.id
  GROUP BY customers.id;
```

## Adding the model

To display the SQL view on your Forest Admin interface, you must add the associated Sequelize model in your application.

{% code title="models/customer_stats.js" %}
```javascript
'use strict';

module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  const CustomerStats = sequelize.define('customer_stats', {
    'amount_spent': {
      type: DataTypes.INTEGER,
    },
    'nb_orders': {
      type: DataTypes.STRING,
    },
    'email': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'customer_stats',
    underscored: true,

    schema: process.env.DATABASE_SCHEMA,
  });

  return CustomerStats;
};
```
{% endcode %}

{% hint style="info" %}
You must restart your server to see the changes on your interface.
{% endhint %}

## Managing the view

Once your SQL view is implemented, you'll be able to filter, search, export and change the order of your fields.

{% hint style="warning" %}
Most of the time SQL views are used as **read-only**. If this is the case, we recommend changing the CRUD permission in your [roles's settings](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles).
{% endhint %}

![](<../../.gitbook/assets/customer-stats-sql-view.png>)
