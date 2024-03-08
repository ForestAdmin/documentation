---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v4
  to v5. Please read carefully and integrate the following breaking changes to
  ensure a smooth upgrade.​
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
  actions: [
    {
      name: 'Mark as live',
      httpMethod: 'POST',
      endpoint: 'my-custom-route/mark-as-live', // custom route
    },
  ],
});
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/forest/companies.js" %}

```javascript
const Liana = require('forest-express-mongoose');

Liana.collection('companies', {
  actions: [
    {
      name: 'Mark as live',
      httpMethod: 'POST',
      endpoint: 'my-custom-route/mark-as-live', // custom route
    },
  ],
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

router.post(
  '/my-custom-route/mark-as-live',
  Liana.ensureAuthenticated,
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId } })
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
  }
);

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

router.post(
  '/my-custom-route/mark-as-live',
  Liana.ensureAuthenticated,
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId } })
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
  }
);

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

router.post(
  '/my-custom-route/mark-as-live',
  Liana.ensureAuthenticated,
  bodyParser.json(),
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId } })
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
  }
);

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

router.post(
  '/my-custom-route/mark-as-live',
  Liana.ensureAuthenticated,
  bodyParser.json(),
  (req, res) => {
    let companyId = req.body.data.attributes.ids[0];

    return models.companies
      .update({ status: 'live' }, { where: { id: companyId } })
      .then(() => {
        res.send({ success: 'Company is now live!' });
      });
  }
);

module.exports = router;
```

{% endcode %}
{% endtab %}
{% endtabs %}

## Important Notice

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

- [Express-sequelize changelog](https://github.com/ForestAdmin/forest-express-sequelize/blob/master/CHANGELOG.md#release-500---2019-10-31)
- [Express-mongoose changelog](https://github.com/ForestAdmin/forest-express-mongoose/blob/master/CHANGELOG.md#release-500---2019-10-31)
