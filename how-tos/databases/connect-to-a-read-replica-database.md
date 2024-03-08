---
description: ⚠️ This tutorial is for SQL databases only.
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

# Connect to a read replica database

A read replica is a copy of the master that reflects changes to the master instance in almost real time.\
\
For performance reasons, you can specify one or more servers to act as read replicas, and one server to act as the write master, which handles all writes and updates and propagates them to the replicas.\
\
For example, your read replica will be used while displaying the table view of your records or accessing your Forest Admin dashboard.

As your Admin Backend relies on the Sequelize ORM, it's quite easy to configure a[ read replication](https://sequelize.org/master/manual/read-replication.html).

{% hint style="warning" %}
Those code snippets are an example. It is strongly advised to use environment variables for your database connection credentials.
{% endhint %}

{% code title="config/databases.js" %}

```javascript
const path = require('path');

let databaseOptions = {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialect: 'postgresql',
  port: 5435,
  replication: {
    read: [
      {
        host: 'ec2-52-219-116-175.us-west-1.compute.amazonaws.com',
        username: 'userRead',
        password: 'passwordUserRead',
        database: 'databaseReplicate',
      },
    ],
    write: {
      host: 'ec2-52-219-125-185.eu-west-1.compute.amazonaws.com',
      username: 'userWrite',
      password: 'passwordUserWrite',
      database: 'databaseMaster',
    },
  },
  pool: {
    maxConnections: 10,
    minConnections: 1,
  },
  dialectOptions: {},
};

module.exports = [
  {
    name: 'default',
    modelsDir: path.resolve(__dirname, '../models'),
    connection: {
      options: { ...databaseOptions },
    },
  },
];
```

{% endcode %}

{% code title="models/index.js" %}

```javascript
...
databasesConfiguration.forEach((databaseInfo) => {
  let connection;
  if(databaseInfo.connection.options.replication) {
    connection = new Sequelize(databaseInfo.connection.options);
  } else {
    connection = new Sequelize(databaseInfo.connection.url, databaseInfo.connection.options);
  }

  connections[databaseInfo.name] = connection;

  ...
});
...
```

{% endcode %}
