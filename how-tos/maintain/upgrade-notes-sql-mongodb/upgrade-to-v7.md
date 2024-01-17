---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v6
  to v7. Please read carefully and integrate the following breaking changes to
  ensure a smooth upgrade.​
---

# Upgrade to v7

## Upgrading to v7

This upgrade unlocks the following feature:

* easier addition of additional databases
* no need to re-authenticate when switching between projects/environments/team
* dynamic smart action forms
* automatic model update

{% hint style="danger" %}
Before upgrading to v7, please take note of the following requirement:

* `express` must be **version 4.17** or higher
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v7, simply run:

{% tabs %}
{% tab title="SQL" %}
```bash
npm install forest-express-sequelize@^7.12.3
```
{% endtab %}

{% tab title="Mongodb" %}
```bash
npm install forest-express-mongoose@^7.9.2
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent is the fastest way to restore your admin panel.
{% endhint %}

{% hint style="info" %}
You must upgrade your agent version in development, then you should commit the code changes (packages.json, source code, .forestadmin-schema.json etc.) to push it on other environments (Production, Staging, Test,...). Pull the code in each server, install, build and restart server
{% endhint %}

## Breaking changes

### Agent initialization&#x20;

In the file `middlewares/forestadmin.js`, the parameters of `Liana.init` have been updated. A few parameters have been deprecated and will either be ignored or throw an error.&#x20;

Two new parameters have also been introduced to ease the addition and management of multiple databases.&#x20;

The below tables list all these parameters:

| Deprecated parameters | Behavior | Replace by   |
| --------------------- | -------- | ------------ |
| `onlyCrudModule`      | Ignored  |              |
| `modelsDir`           | Ignored  |              |
| `sequelize`           | Ignored  |              |
| `mongoose`            | Ignored  |              |
| `secretKey`           | Error    | `envSecret`  |
| `authKey`             | Error    | `authSecret` |

| New parameters  | Description                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| `objectMapping` | static instance of your object mapper (`require('sequelize')` or `require('mongoose')`) |
| `connections`   | map of your existing connections, indexed by a unique name for each connections         |

Here is an example of an updated `middlewares/forestadmin.js` file after the migration:

{% code title="middlewares/forestadmin.js" %}
```javascript
const { objectMapping, connections } = require('../models');

module.exports = async function forestadmin(app) {
  app.use(await Liana.init({
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
  }));

  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};

```
{% endcode %}

#### Models index

The `models/index.js` file should be updated as well, in order to export `objectMapping` & `connections`

{% tabs %}
{% tab title="SQL" %}
{% code title="models/index.js" %}
```javascript
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const databasesConfiguration = require('../config/databases');

const connections = {};
const db = {};

databasesConfiguration.forEach((databaseInfo) => {
  const connection = new Sequelize(databaseInfo.connection.url, databaseInfo.connection.options);
  connections[databaseInfo.name] = connection;

  const modelsDir = databaseInfo.modelsDir || path.join(__dirname, databaseInfo.name);
  fs
    .readdirSync(modelsDir)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
      try {
        const model = connection.import(path.join(modelsDir, file))(connection, Sequelize.DataTypes);
        db[model.name] = model;
      } catch (error) {
        console.error('Model creation error: ' + error);
      }
    });
});

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.objectMapping = Sequelize;
db.connections = connections;

module.exports = db;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="models/index.js" %}
```javascript
const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');

const databasesConfiguration = require('../config/databases');

const connections = {};
const db = {};

databasesConfiguration.forEach((databaseInfo) => {
  const connection = Mongoose.createConnection(databaseInfo.connection.url, databaseInfo.connection.options);
  connections[databaseInfo.name] = connection;

  const modelsDir = databaseInfo.modelsDir || path.join(__dirname, databaseInfo.name);
  fs
    .readdirSync(modelsDir)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
      try {
        const model = require(path.join(modelsDir, file))(connection, Mongoose);
        db[model.modelName] = model;
      } catch (error) {
        console.error(`Model creation error: ${error}`);
      }
    });
});

db.objectMapping = Mongoose;
db.connections = connections;

module.exports = db;
```
{% endcode %}
{% endtab %}
{% endtabs %}

**Introducing database configuration**

A `config/databases.js` file should be added as follows in order to declare the different database connections:

{% tabs %}
{% tab title="SQL" %}
```javascript
const path = require('path');

const databaseOptions = {
  logging: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? console.log : false,
  pool: { maxConnections: 10, minConnections: 1 },
  dialectOptions: {},
};
if (process.env.DATABASE_SSL && JSON.parse(process.env.DATABASE_SSL.toLowerCase())) {
  const rejectUnauthorized = process.env.DATABASE_REJECT_UNAUTHORIZED;
  if (rejectUnauthorized && (JSON.parse(rejectUnauthorized.toLowerCase()) === false)) {
    databaseOptions.dialectOptions.ssl = { rejectUnauthorized: false };
  } else {
    databaseOptions.dialectOptions.ssl = true;
  }
}
module.exports = [{
  name: 'default',
  modelsDir: path.resolve(__dirname, '../models'),
  connection: {
    url: process.env.DATABASE_URL,
    options: { ...databaseOptions },
  },
}];
```
{% endtab %}

{% tab title="Mongodb" %}
```javascript
const path = require('path');

const databaseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
module.exports = [{
  name: 'default',
  modelsDir: path.resolve(__dirname, '../models'),
  connection: {
    url: process.env.DATABASE_URL,
    options: { ...databaseOptions },
  },
}];
```
{% endtab %}
{% endtabs %}

{% hint style="danger" %}
Calling `sequelize` with one of the 2 following syntaxes will not work anymore:

`const { sequelize } = require('../models');` ❌

`const models = require('../models');`\
`const sequelize = models.sequelize; ❌`

Instead, you should now use

`const sequelize = require('../models').connections.default;`
{% endhint %}

#### Mongoose specific changes

If you made the above recommended changes in your `models/index.js` file, your Mongoose model files should now be written this way:

{% code title="/models/companies.js" %}
```javascript
// Models are now returned from a function
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
     'country': String,
     ...
  });
  return mongoose.model('companies', schema, 'companies');
};
```
{% endcode %}

### Authentication

One of the changes introduced by the v7 is that you no longer need to re-authenticate when switching between projects/environments/team. In order to support this easier authentication flow, the changes described below need to be made.

#### New environment variable

A new environment variable called `APPLICATION_URL` is required and must be added to your `.env` file.

{% hint style="info" %}
`http://localhost:3310` is the default value to be set for the `APPLICATION_URL`. If you specified a specific url for your application in place of the default one (for example for an install on a remote machine), this url should be the value set.
{% endhint %}

#### New CORS condition

A change in your `app.js` is required to modify how CORS are handled. The value `'null'` must be accepted for authentication endpoints (**lines 11-17**).

```javascript
let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];
if (process.env.CORS_ORIGINS) {
  allowedOrigins = allowedOrigins.concat(process.env.CORS_ORIGINS.split(','));
}
const corsConfig = {
  origin: allowedOrigins,
  allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
  maxAge: 86400, // NOTICE: 1 day
  credentials: true,
};
app.use('/forest/authentication', cors({
  ...corsConfig,
  // The null origin is sent by browsers for redirected AJAX calls
  // we need to support this in authentication routes because OIDC
  // redirects to the callback route
  origin: corsConfig.origin.concat('null')
}));
app.use(cors(corsConfig));
```

#### Running up multiple server instances

If you're running multiple instances of your agent (with a load balancer for example), you will need to set up a static client id.

{% hint style="warning" %}
**Without a static client id, authentication will fail whenever a user makes a request to a different instance than the one he logged into.**
{% endhint %}

First you will need to obtain a client id for your environment by running the following command:

```
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer FOREST_ENV_SECRET" \
     -X POST \
     -d '{"token_endpoint_auth_method": "none", "redirect_uris": ["APPLICATION_URL/forest/authentication/callback"]}' \
     https://api.forestadmin.com/oidc/reg
```

Then assign the `client_id` value from the response (it's a JWT) to a `FOREST_CLIENT_ID` variable in your **.env** file.

## Important Notice

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

* [Express-sequelize changelog](https://github.com/ForestAdmin/forest-express-sequelize/blob/master/CHANGELOG.md#release-600---2020-03-17)
* [Express-mongoose changelog](https://github.com/ForestAdmin/forest-express-mongoose/blob/master/CHANGELOG.md#release-600---2020-03-17)
