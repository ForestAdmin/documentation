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

## Upgrading to v4

{% hint style="danger" %}
Before upgrading to v4, consider the below **breaking changes**.
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v4, simply run:

{% tabs %}
{% tab title="SQL" %}

```javascript
npm install forest-express-sequelize@4.0.2
```

{% endtab %}

{% tab title="Mongoose" %}

```javascript
npm install forest-express-mongoose@4.1.2
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent version 3 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### New JWT authentication token

The information format of the _session token_ have changed in v4.

{% hint style="info" %}
You could be impacted if you use the _user session_ in Smart Action controllers or Smart Routes
{% endhint %}

**Calling `req.user` in v3**

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

**Calling `req.user` in v4**

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

| Property     | v3                                             | v4                     |
| ------------ | ---------------------------------------------- | ---------------------- |
| email        | `req.user.data.email`                          | `req.user.email`       |
| first name   | `req.user.data.first_name`                     | `req.user.firstName`   |
| last name    | `req.user.data.last_name`                      | `req.user.lastName`    |
| team         | `req.user.data.teams[0]`                       | `req.user.team`        |
| rendering id | `req.user.relationships.renderings.data[0].id` | `req.user.renderingId` |

### New filters query parameters format

The **query parameters** sent for **filtering** purposes have changed in v4.

{% hint style="info" %}
You could be impacted if you have custom filter implementations.
{% endhint %}

Below are a few example of the new filter conditions format you can access using`req.params.filters`:

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

### MongoDB

{% hint style="info" %}
This section is dedicated to breaking changes on projects using MongoDB connections.
{% endhint %}

#### MongoDB version support

The minimal version supported by the agent v4 is **MongoDB v3.2** (December 2015).

{% hint style="danger" %}
If your project uses an older MongoDB version, **you should not upgrade to v4**.
{% endhint %}

The way the agent implements the resources filtering changed and this new implementation uses features that does not exist in MongoDB versions older than 3.2.

#### Smart Field search implementation

The Smart Field search implementation has changed:

- The function signature now has only one `search` parameter.
- The expected value to be returned is a hash of the conditions (instead of the `query` object).

See the following implementation migration example:

{% code title="Before (v3)" %}

```javascript
 search(query, search) {
  let names = search.split(' ');
​
  query._conditions.$or.push({
    firstname: names[0],
    lastname: names[1]
  });
​
  return query;
}
```

{% endcode %}

{% code title="After (v4)" %}

```javascript
search(search) {
  let names = search.split(' ');
​
  return {
    firstname: names[0],
    lastname: names[1]
  };
}
```

{% endcode %}

#### Condition operator changes

For consistency reasons, `contains`, `starts with` and `ends with` operators are now **case sensitive**.

#### Smart relationships reference syntax

If you had a `reference` property in a [Smart relationship](../../../reference-guide/models/relationships/create-a-smart-relationship/#creating-a-belongsto-smart-relationship) you implemented, the syntax has changed:

{% code title="Before (v3)" %}

```javascript
reference: 'Address';
```

{% endcode %}

{% code title="After (v4)" %}

```javascript
reference: 'Address._id';
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

- [Express-sequelize changelog](https://github.com/ForestAdmin/forest-express-sequelize/blob/master/CHANGELOG.md#release-400---2019-10-04)
- [Express-mongoose changelog](https://github.com/ForestAdmin/forest-express-mongoose/blob/master/CHANGELOG.md#release-400---2019-10-04)
