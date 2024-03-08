---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v3
  to v4. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
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

# Upgrade to v4

{% hint style="warning" %}

Please be aware that while Forest Admin make every effort to ensure that our platform updates are broadly compatible and offer detailed instructions for upgrading, Forest Admin cannot guarantee that custom code developed by the developers will always be compatible with new versions of our software. This includes any custom modifications or extensions to core functionalities, such as method overrides or custom integrations. It is the responsibility of the developers to review and test their custom code to ensure compatibility with each new version. Our team provides comprehensive upgrade guides to assist in this process, but these cannot encompass the unique customizations that may be present in each customer's environment. Therefore, Forest Admin strongly recommend establishing a thorough testing protocol for your specific customizations to safeguard against potential issues during the upgrade process.

{% endhint %}

## Upgrading to v4

{% hint style="danger" %}
Before upgrading to v4, consider the below **breaking changes**.
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v4, **update the version in your Gemfile**, then run:

```javascript
bundle install
```

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent version 3 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### New JWT authentication token

The information format of the _session token_ have changed in v4.

{% hint style="info" %}
You could be impacted if you use the _user session_ in Smart Action controllers or Smart Routes
{% endhint %}

**Calling `forest_user` in v3**

{% code title="v3 format" %}

```javascript
{
  "id": "172",
  "type": "users",
  "data": {
    "email": "angelicabengtsson@doha2019.com",
    "first_name": "Angelica",
    "last_name": "Bengtsson",
    "teams": ["Pole Vault"],
  },
  "relationships": {
    "renderings": {
      "data": [{
        "type": "renderings",
        "id": "4998",
      }],
    },
  },
  "iat": 1569913709,
  "exp": 1571123309
}
```

{% endcode %}

**Calling `forest_user` in v4**

{% code title="v4 format" %}

```javascript
{
  "id": "172",
  "email": "angelicabengtsson@doha2019.com",
  "firstName": "Angelica",
  "lastName": "Bengtsson",
  "team": "Pole Vault",
  "renderingId": "4998",
  "iat": 1569913709,
  "exp": 1571123309
}
```

{% endcode %}

Consequently, the user information is now accessible as described below:

| Property     | v3                                                | v4                        |
| ------------ | ------------------------------------------------- | ------------------------- |
| email        | `forest_user.data.email`                          | `forest_user.email`       |
| first name   | `forest_user.data.first_name`                     | `forest_user.firstName`   |
| last name    | `forest_user.data.last_name`                      | `forest_user.lastName`    |
| team         | `forest_user.data.teams[0]`                       | `forest_user.team`        |
| rendering id | `forest_user.relationships.renderings.data[0].id` | `forest_user.renderingId` |

### New filters query parameters format

The **query parameters** sent for **filtering** purposes have changed in v4.

{% hint style="info" %}
You could be impacted if you have custom filter implementations.
{% endhint %}

Below are a few example of the new filter conditions format you can access using`params[:filters]`:

{% code title="Simple condition example:" %}

```javascript
{
  "field": "planLimitationReachedAt",
  "operator": "previous_year_to_date",
  "value": null
}
```

{% endcode %}

{% code title="Multiple conditions example:" %}

```javascript
{
  "aggregator": "and",
  "conditions": [{
    "field": "planLimitationReachedAt",
    "operator": "previous_year_to_date",
    "value": null
  }, {
    "field": "planLimitationStatus",
    "operator": "equal",
    "value": "warning"
  }]
}
```

{% endcode %}

## Important Notice

### Agent logout

A consequence of the new session token format is:

{% hint style="warning" %}
Once an agent v4 deployed, **all users of your project will be automatically logged out** and be forced to re-authenticate to generate a newly formatted token. ​
{% endhint %}

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

- [Rails changelog](https://github.com/ForestAdmin/forest-rails/blob/master/CHANGELOG.md#release-400---2019-10-04)
