---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v7
  to v8. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
---

# Upgrade to v8

{% hint style="warning" %}

Please be aware that while Forest Admin make every effort to ensure that our platform updates are broadly compatible and offer detailed instructions for upgrading, Forest Admin cannot guarantee that custom code developed by the developers will always be compatible with new versions of our software. This includes any custom modifications or extensions to core functionalities, such as method overrides or custom integrations. It is the responsibility of the developers to review and test their custom code to ensure compatibility with each new version. Our team provides comprehensive upgrade guides to assist in this process, but these cannot encompass the unique customizations that may be present in each customer's environment. Therefore, Forest Admin strongly recommend establishing a thorough testing protocol for your specific customizations to safeguard against potential issues during the upgrade process.

{% endhint %}

This upgrade unlocks the following features:

* Use templating in the filters of Chart components
* Add conditions to your role permissions

## Upgrading to v8

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v8, first update your project according to the [_Breaking Changes_](../upgrade-notes-rails/upgrade-to-v8.md#breaking-changes) section below.&#x20;

If you're upgrading from an older version, please make sure you've also read the previous upgrade notes ([v7](upgrade-to-v7.md), [v6](upgrade-to-v6.md),..)

To upgrade to v8, **update the version in your Gemfile**, then run the following and update your project as shown in the _Breaking Changes_ section below.

```javascript
bundle install
```

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent version 7 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

This new version (v8) does not support the old role system. If you are still using the old role system, please follow [this procedure](../migrate-to-the-new-role-system.md) in order to migrate to the new role system **before** you attempt to upgrade to version 8.

{% hint style="warning" %}
**How do I know if I'm using the old or new role system?**

If you have access to roles (Project settings > Roles) as designed below...\
\
![](<../../../.gitbook/assets/image (10).png>)\
\
then you are using the new role system and can go ahead with the upgrade to v8.
{% endhint %}


In your code, if you were using the ```ForestLiana::PermissionsChecker``` for check the permission on overriding route.
You need to replace ```PermissionsChecker.new(...)``` by ```ForestLiana::Ability::forest_authorize!(action, forest_user, @resource)```.

An example can be found [here](../../../reference-guide/routes/override-a-route.md).

You must also ensure that the controllers that manage your smart actions extend from the `ForestLiana::SmartActionsController` controller.
