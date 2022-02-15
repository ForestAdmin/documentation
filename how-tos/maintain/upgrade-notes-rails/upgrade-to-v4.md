---
description: >-
  The purpose of this note is to help developers to upgrade their liana from v3
  to v4. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
---

# Upgrade to v4

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
In case of a regression introduced in Production after the upgrade, a rollback to your previous liana version 3 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### New JWT authentication token

The information format of the _session token_ have changed in v4.

{% hint style="info" %}
You could be impacted if you use **** the _user session_ in Smart Action controllers or Smart Routes
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

### Liana logout

A consequence of the new session token format is:

{% hint style="warning" %}
Once a liana v4 deployed, **all users of your project will be automatically logged out** and be forced to re-authenticate to generate a newly formatted token. ​
{% endhint %}

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

* [Rails changelog](https://github.com/ForestAdmin/forest-rails/blob/master/CHANGELOG.md#release-400---2019-10-04)
