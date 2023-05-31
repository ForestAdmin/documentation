---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v8
  to v9. Please read carefully and integrate the following breaking changes to
  ensure a smooth upgrade.​
---

# Upgrade to v9

This upgrade unlocks the following features:

* Use templating in the filters of Chart components
* Add conditions to your role permissions

## Upgrading to v9

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v9, first update your project according to the [_Breaking Changes_](../upgrade-notes-rails/upgrade-to-v7.md#breaking-change) section below.&#x20;

If you're upgrading from an older version, please make sure you've also read the previous upgrade notes ([v8](upgrade-to-v8-1.md), [v7](upgrade-to-v7.md),..)

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

This new version (v9) does not support the old role system. If you are in the case, please follow [this procedure](../migrate-to-the-new-role-system.md) in order to migrate to the new role system **before** you attempt to upgrade to version 9.

{% hint style="warning" %}
**How do I know if I'm using the old or new role system?**

If you have access to roles (Project settings > Roles) as designed below...\
\
![](<../../../.gitbook/assets/image (10).png>)\
\
then you are using the new role system and can go ahead with the upgrade to v9.
{% endhint %}
