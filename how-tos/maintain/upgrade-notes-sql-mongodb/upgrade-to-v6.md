---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v5
  to v6. Please read carefully and integrate the following breaking changes to
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

# Upgrade to v6

## Upgrading to v6

{% hint style="danger" %}
Before upgrading to v6, consider the below **breaking changes**.
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v6, simply run:

{% tabs %}
{% tab title="SQL" %}

```bash
npm install forest-express-sequelize@^6.0.0
```

{% endtab %}

{% tab title="Mongodb" %}

```bash
npm install forest-express-mongoose@^6.0.0
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### Agent initialization

The agent initialization now **returns a promise**. This solves an issue wherein exposed agents were not yet initialized and thus returning 404s.

You must update the following 2 files:

{% code title="middlewares/forestadmin.js (lines 6-7)" %}

```javascript
// BEFORE
module.exports = function (app) {
  app.use(Liana.init({

// AFTER
module.exports = async function (app) {
  app.use(await Liana.init({
```

{% endcode %}

{% code title="app.js (line 56)" %}

```javascript
// BEFORE
resolve: Module => new Module(app),

// AFTER
resolve: Module => Module(app),
```

{% endcode %}

### Select all feature

This version also introduces the new Select all behavior. Once you've updated your **bulk** Smart Actions according to the below changes, you'll be able to choose between selecting **all** the records or only those displayed on the current page.

{% code title="/routes/companies.js" %}

```javascript
// BEFORE
router.post('/actions/mark-as-live', permissionMiddlewareCreator.smartAction(), (req, res) => {
  let companyId = req.body.data.attributes.ids[0];

  return companies
    .update({ status: 'live' }, { where: { id: companyId }})
    .then(() => {
      res.send({ success: 'Company is now live!' });
    });
});

// AFTER
import { RecordsGetter } from "forest-express-sequelize";

...

router.post('/actions/mark-as-live', permissionMiddlewareCreator.smartAction(), (req, res) => {
  return new RecordsGetter(companies).getIdsFromRequest(req)
    .then((companyIds) => {
      return companies
        .update({ status: 'live' }, { where: { id: companyIds }})
        .then(() => {
          res.send({ success: 'Company is now live!' });
        });
    });
});
```

{% endcode %}

{% hint style="warning" %}
If you altered the default DELETE behavior by overriding or extending it, you'll have to do so as well with the new [BULK DELETE route](../../../reference-guide/routes/default-routes.md#delete-a-list-of-records).
{% endhint %}

## Important Notice

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

- [Express-sequelize changelog](https://github.com/ForestAdmin/forest-express-sequelize/blob/master/CHANGELOG.md#release-600---2020-03-17)
- [Express-mongoose changelog](https://github.com/ForestAdmin/forest-express-mongoose/blob/master/CHANGELOG.md#release-600---2020-03-17)
