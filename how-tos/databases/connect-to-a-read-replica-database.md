---
description: ⚠️ This tutorial is for SQL databases only.
---

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
    read: [{
      host: 'ec2-52-219-116-175.us-west-1.compute.amazonaws.com',
      username: 'userRead',
      password: 'passwordUserRead',
      database: 'databaseReplicate',
    }],
    write: {
      host: 'ec2-52-219-125-185.eu-west-1.compute.amazonaws.com',
      username: 'userWrite',
      password: 'passwordUserWrite',
      database: 'databaseMaster',
    }
  },
  pool: {
    maxConnections: 10,
    minConnections: 1,
  },
  dialectOptions: {}
};

module.exports = [{
  name: 'default',
  modelsDir: path.resolve(__dirname, '../models'),
  connection: {
    options: { ...databaseOptions },
  },
}];
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
