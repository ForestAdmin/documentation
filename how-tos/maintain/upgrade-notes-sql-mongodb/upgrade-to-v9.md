---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v8
  to v9. Please read carefully and integrate the following breaking changes to
  ensure a smooth upgrade.​
---

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

This new version (v9) drops the support of the legacy Roles system (v1.0). If you are in this configuration, please follow [this procedure](../migrate-to-the-new-role-system.md) in order to migrate to the new Roles system (v2.0) **before** you attempt to upgrade to version 9.

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

Whether or not your project currently uses the Approval Workflow feature,
you must ensure that all your Smart Actions routes are configured with the Smart Action middleware:
`permissionMiddlewareCreator.smartAction()`.

{% code %}

```javascript
// BEFORE v9, this configuration, although unsecured, was working.
router.post('/actions/mark-as-live', (req, res) => {
  // ...
});

// NOW in v9, this configuration is mandatory to make approvals work as expected.
router.post(
  '/actions/mark-as-live',
  permissionMiddlewareCreator.smartAction(),
  (req, res) => {
    // ...
  }
);
```

{% endcode %}
