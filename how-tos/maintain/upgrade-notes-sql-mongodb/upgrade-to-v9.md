---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v8
  to v9. Please read carefully and integrate the following breaking changes to
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

# Upgrade to v9

{% hint style="info" %}
Please follow the recommended procedure to upgrade your agent version by following [this note](../push-your-new-version-to-production.md).
{% endhint %}

This upgrade unlocks the following features:

- Use templating in the filters of Chart components
- Add conditions to your role permissions

## Upgrading to v9

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v9, first update your project according to the [_Breaking Changes_](upgrade-to-v9.md#breaking-changes) section below.&#x20;

If you're upgrading from an older version, please make sure you've also read the previous upgrade notes ([v8](upgrade-to-v8.md), [v7](upgrade-to-v7.md),..)

Once you're done with the above steps, run the following:

{% tabs %}
{% tab title="SQL" %}

```
npm install "forest-express-sequelize@^9.0.0"
```

{% endtab %}

{% tab title="MongoDB" %}

```
npm install "forest-express-mongoose@^9.0.0"
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### Roles v2.0

This new version (v9) drops the support of the legacy Roles system (v1.0). If you are in this legacy configuration, please follow [this procedure](../migrate-to-the-new-role-system.md) in order to migrate to the new Roles system (v2.0) **before** you attempt to upgrade to version 9.

{% hint style="warning" %}
**How do I know if I'm using the legacy or new Roles system?**

If you have access to Roles (Project settings > Roles) as designed below...\
\
![](<../../../.gitbook/assets/image (10).png>)\
\
then you are using the new Role system.
{% endhint %}

### Approval Workflow

{% hint style="danger" %}
This new major version makes the configuration, described below, mandatory to ensure that actions are not triggered directly and approvals requests are properly created for the reviewers.
{% endhint %}

**Whether or not** your project currently uses the Approval Workflow feature,
you must ensure that all your Smart Actions routes are configured with the Smart Action middleware:
`permissionMiddlewareCreator.smartAction()`.

{% code %}

```javascript
// BEFORE v9, this configuration, although unsecured, was working.
router.post('/actions/mark-as-live', (req, res) => {
  // ...
});

// NOW in v9, this configuration is mandatory to make approvals work as expected.
const { PermissionMiddlewareCreator } = require('forest-express-xxx');
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'companies'
);

router.post(
  '/actions/mark-as-live',
  permissionMiddlewareCreator.smartAction(),
  (req, res) => {
    // ...
  }
);
```

{% endcode %}
