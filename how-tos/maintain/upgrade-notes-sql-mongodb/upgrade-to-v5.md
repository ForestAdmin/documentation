---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v4
  to v5. Please read carefully and integrate the following breaking changes to
  ensure a smooth upgrade.​
---

# Upgrade to v5

## Upgrading to v5

{% hint style="danger" %}
Before upgrading to v5, consider the below **breaking changes**.
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v5, simply run:

{% tabs %}
{% tab title="SQL" %}
```bash
npm install forest-express-sequelize@^5.0.0
```
{% endtab %}

{% tab title="Mongodb" %}
```bash
npm install forest-express-mongoose@^5.0.0
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

### Smart Actions defined with custom routes

If your Forest Admin configuration contains Smart Actions using POST or PUT method with a custom `endpoint`, you'll have to adapt your Smart Action code.

Here is an example of Smart Action to adapt:

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/companies.js" %}
```javascript
const Liana = require('forest-express-sequelize');

Liana.collection('companies', {
  actions: [{
    name: 'Mark as live',
    httpMethod: 'POST',
    endpoint: 'my-custom-route/mark-as-live', // custom route
  }],
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/forest/companies.js" %}
```javascript
const Liana = require('forest-express-mongoose');

Liana.collection('companies', {
  actions: [{
    name: 'Mark as live',
    httpMethod: 'POST',
    endpoint: 'my-custom-route/mark-as-live', // custom route
  }],
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/companies.js" %}
```javascript
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const models = require('../models');

router.post('/my-custom-route/mark-as-live', Liana.ensureAuthenticated,
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId }})
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
});

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/companies.js" %}
```javascript
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-mongoose');
const models = require('../models');

router.post('/my-custom-route/mark-as-live', Liana.ensureAuthenticated,
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId }})
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
});

module.exports = router;
```
{% endcode %}
{% endtab %}
{% endtabs %}

To make sure it doesn't break when you upgrade to v5, you must use the`bodyParser.json()` middleware in the route configuration:

```javascript
router.post('/my-custom-route/mark-as-live', Liana.ensureAuthenticated, bodyParser.json(),
```

The v5-compatible result would look like this:

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/companies.js" %}
```javascript
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const models = require('../models');
const bodyParser = require('body-parser'); // NOTICE: Require the body-parser dependency.

router.post('/my-custom-route/mark-as-live', Liana.ensureAuthenticated, bodyParser.json(),
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId }})
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
});

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/companies.js" %}
```javascript
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-mongoose');
const models = require('../models');
const bodyParser = require('body-parser'); // NOTICE: Require the body-parser dependency.

router.post('/my-custom-route/mark-as-live', Liana.ensureAuthenticated, bodyParser.json(),
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId }})
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
});

module.exports = router;
```
{% endcode %}
{% endtab %}
{% endtabs %}

## Important Notice

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

* [Express-sequelize changelog](https://github.com/ForestAdmin/forest-express-sequelize/blob/master/CHANGELOG.md#release-500---2019-10-31)
* [Express-mongoose changelog](https://github.com/ForestAdmin/forest-express-mongoose/blob/master/CHANGELOG.md#release-500---2019-10-31)
