{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}
# Create Charts with AWS Redshift

This example shows you how to create a graph based on AWS Redshift.&#x20;

This could be useful if you want to avoid making graphs directly from your production database.

{% hint style="info" %}
This tutorial is based on [this database sample](https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-create-sample-db.html).
{% endhint %}

We'll create 2 charts:

1. Number of users (_single value chart_)
2. Top 5 buyers (_leaderboard chart_)

## Connect to a Redshift Database

Install the [NodeJS package](https://www.npmjs.com/package/node-redshift) for your Forest Admin project

```bash
node install node-redshift --save
```

Create the database client and set up the credentials variables cf. package documentation: [https://www.npmjs.com/package/node-redshift](https://www.npmjs.com/package/node-redshift).

```javascript
var Redshift = require('node-redshift');

var clientCredentials = {
  host: process.env.REDSHIFT_HOST,
  port: process.env.REDSHIFT_PORT,
  database: process.env.REDSHIFT_DATABASE,
  user: process.env.REDSHIFT_DB_USER,
  password: process.env.REDSHIFT_DB_PASSWORD,
};

const redshiftClient = new Redshift(clientCredentials);
```

{% hint style="warning" %}
Configure your database credentials in your env variables
{% endhint %}

## Create the Single Value Chart

Step 1 - Create a Single Value Smart Chart in the Forest Admin Project Dashboard.

[Learn more about Smart Chart](create-a-smart-chart.md)

![](<../../.gitbook/assets/image (492).png>)

Step 2 - Create the route to handle the Smart Chart

{% code title="routes/dashboard.js" %}
```javascript
const express = require('express');
const router = express.Router();
const Liana = require('forest-express');

...

router.post('/stats/nb-users', Liana.ensureAuthenticated, async (request, response) => {

  const query = `
    SELECT count(*) as nb
    FROM users
  `;

  const data = await redshiftClient.query(query);

  let json = new Liana.StatSerializer({
    value: data.rows[0].nb
  }).perform();

  response.send(json);

});
```
{% endcode %}

## Create the Leaderboard Chart

Step 1 - Create a Leaderboard Smart Chart in the Forest Admin Project Dashboard.

Learn more about [Smart charts](create-a-smart-chart.md)

![](<../../.gitbook/assets/image (543).png>)



Step 2 - Create the route to handle the Smart Chart

{% code title="routes/dashboard.js" %}
```javascript
const express = require('express');
const router = express.Router();
const Liana = require('forest-express');

...

router.post('/stats/top-5-buyers', Liana.ensureAuthenticated, async (request, response) => {

  const query = `
    SELECT firstname || ' ' || lastname AS key, total_quantity AS value
    FROM   (SELECT buyerid, sum(qtysold) total_quantity
            FROM  sales
            GROUP BY buyerid
            ORDER BY total_quantity desc limit 5) Q, users
    WHERE Q.buyerid = userid
    ORDER BY Q.total_quantity desc
  `;

  const data = await redshiftClient.query(query);

  let leaderboard = data.rows;
  let json = new Liana.StatSerializer({
    value: leaderboard
  }).perform();

  response.send(json);

});
```
{% endcode %}

## Result

![](<../../.gitbook/assets/image (544).png>)
