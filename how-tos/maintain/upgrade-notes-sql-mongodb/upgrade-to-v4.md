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
In case of a regression introduced in Production after the upgrade, a rollback to your previous liana version 3 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### New JWT authentication token

The information format of the _session token_ have changed in v4.

{% hint style="info" %}
You could be impacted if you use **** the _user session_ in Smart Action controllers or Smart Routes
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

The minimal version supported by the liana v4 is **MongoDB v3.2** (December 2015).

{% hint style="danger" %}
If your project uses an older MongoDB version, **you should not upgrade to v4**.
{% endhint %}

The way the liana implements the resources filtering changed and this new implementation uses features that does not exist in MongoDB versions older than 3.2.

#### Smart Field search implementation

The Smart Field search implementation has changed:

* The function signature now has only one `search` parameter.
* The expected value to be returned is a hash of the conditions (instead of the `query` object).

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

If you had a `reference` property in a [Smart relationship](../../../reference-guide/relationships/create-a-smart-relationship/#creating-a-belongsto-smart-relationship) you implemented, the syntax has changed:

{% code title="Before (v3)" %}
```javascript
reference: 'Address'
```
{% endcode %}

{% code title="After (v4)" %}
```javascript
reference: 'Address._id'
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

* [Express-sequelize changelog](https://github.com/ForestAdmin/forest-express-sequelize/blob/master/CHANGELOG.md#release-400---2019-10-04)
* [Express-mongoose changelog](https://github.com/ForestAdmin/forest-express-mongoose/blob/master/CHANGELOG.md#release-400---2019-10-04)
