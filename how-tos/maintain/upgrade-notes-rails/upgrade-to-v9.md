---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v7
  to v8. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
---

# Upgrade to v9

{% hint style="warning" %}

Please be aware that while Forest Admin make every effort to ensure that our platform updates are broadly compatible and offer detailed instructions for upgrading, Forest Admin cannot guarantee that custom code developed by the developers will always be compatible with new versions of our software. This includes any custom modifications or extensions to core functionalities, such as method overrides or custom integrations. It is the responsibility of the developers to review and test their custom code to ensure compatibility with each new version. Our team provides comprehensive upgrade guides to assist in this process, but these cannot encompass the unique customizations that may be present in each customer's environment. Therefore, Forest Admin strongly recommend establishing a thorough testing protocol for your specific customizations to safeguard against potential issues during the upgrade process.

{% endhint %}

This upgrade unlocks the following feature:

* Support polymorphic associations

## Upgrading to v9

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v9, first update your project according to the [_Breaking Changes_](../upgrade-notes-rails/upgrade-to-v9.md#breaking-changes) section below.&#x20;

If you're upgrading from an older version, please make sure you've also read the previous upgrade notes ([v8](upgrade-to-v8.md), [v7](upgrade-to-v7.md), [v6](upgrade-to-v6.md),..)

To upgrade to v9, **update the version in your Gemfile**, then run the following and update your project as shown in the _Breaking Changes_ section below.

```javascript
bundle install
```

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent version 8 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

This new version introduces support for polymorphic associations.

It's now easier to create or update polymorphic associations using the polymorphic record selection component.\
\
![](<../../../.gitbook/assets/image (550).png>)\
\
It's also easier to navigate between related records through the related link.\
\
![](<../../../.gitbook/assets/image (551).png>)\
\

{% hint style="warning" %}
The <record>_type and <record>_id fields are no longer returned by the API. As a result, if you have configured a segment or scope with filters on these fields, they will no longer work.
{% endhint %}

