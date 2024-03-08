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

# Display Zendesk users

This section shows you how to create a smart collection to list the users of your Zendesk account.

### Declare the Smart Collection Zendesk Users&#x20;

Zendesk API allows to access different data:

- [Users](https://developer.zendesk.com/rest_api/docs/support/users)
- [Tickets & Comments](https://developer.zendesk.com/rest_api/docs/support/tickets)
- [Organizations](https://developer.zendesk.com/rest_api/docs/support/organizations) and [Groups](https://developer.zendesk.com/rest_api/docs/support/groups)

First, we need to declare the smart collection in your project based on the API documentation. As an example, here the smart collection definition for Users:

{% code title="forest/zendesk-users.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

// Search on users => https://support.zendesk.com/hc/en-us/articles/203663216-Searching-users-groups-and-organizations#topic_duj_sbb_vc
collection('zendesk_users', {
  isSearchable: true,
  actions: [],
  fields: [
    {
      field: 'id',
      type: 'String',
      isFilterable: false, // Zendesk API does not provide such capacity with the API
    },
    {
      field: 'name',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'alias',
      type: 'String',
    },
    {
      field: 'email',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'role',
      type: 'Enum',
      enums: ['end-user', 'agent', 'admin'],
      isFilterable: true,
    },
    {
      field: 'role_type',
      type: 'Number',
    },
    {
      field: 'phone',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'whatsapp',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'last_login_at',
      type: 'Date',
    },
    {
      field: 'verified',
      type: 'Boolean',
    },
    {
      field: 'active',
      type: 'Boolean',
    },
    {
      field: 'suspended',
      type: 'Boolean',
      isFilterable: true,
    },
    {
      field: 'created_at',
      type: 'Date',
      isSortable: true,
    },
    {
      field: 'updated_at',
      type: 'Date',
      isSortable: true,
    },
    {
      field: 'last_login_at',
      type: 'Date',
    },
    {
      field: 'notes',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'details',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'tags',
      type: ['String'],
      isFilterable: true, // is it possible? => no arrays are not yet filterable
    },
    {
      field: 'time_zone',
      type: 'String',
    },
    {
      field: 'moderator',
      type: 'Boolean',
    },
    {
      field: 'external_id',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'only_private_comments',
      type: 'Boolean',
    },
    {
      field: 'photo_url',
      type: 'File',
      get: (user) => {
        return user.photo ? user.photo.content_url : null;
      },
    },
  ],
  segments: [],
});
```

{% endcode %}

{% hint style="info" %}
Some fields are available for filtering or sorting using the Zendesk API. To allow this on the Forest UI, simply add the keywords `isFilterable` and `isSortable` in your field definition.
{% endhint %}

### Implement the Smart Collection route

In the file `routes/zendesk-users.js`, we’ve created a new route to implement the API behind the Smart Collection.

The logic here is to list all the users of your Zendesk account.

{% hint style="info" %}

- Learn more about how to [authenticate, filter and sort with the Zendesk API](https://docs.forestadmin.com/woodshop/how-tos/zendesk-integration/authentication-filtering-and-sorting).
- Find more information about `getUsers` variable definition in [the Github repository](https://github.com/existenz31/forest-zendesk/blob/master/services/zendesk-users-service.js).
  {% endhint %}

{% code title="routes/zendesk-users.js" %}

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'zendesk_tickets'
);

const { getUsers } = require('../services/zendesk-users-service');

// Get a list of Zendesk Users
router.get(
  '/zendesk_users',
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    getUsers(request, response, next);
  }
);
```

{% endcode %}

### Implement the get Route

The section above help you display the list of all Zendesk users. But you'll need to implement also the logic to display the information of a specific user.

We just need to implement a new endpoint to get an individual user from the Zendesk API.

{% code title="services/zendesk-users-services.js" %}

```javascript
async function getUser(request, response, next) {
  return axios
    .get(
      `${ZENDESK_URL_PREFIX}/api/v2/users/${request.params.userId}?include=comment_count`,
      {
        headers: {
          Authorization: `Basic ${getToken()}`,
        },
      }
    )
    .then(async (resp) => {
      let record = resp.data.user;
      // Serialize the result using the Forest Admin format
      const recordSerializer = new RecordSerializer({ name: 'zendesk_users' });
      const recordSerialized = await recordSerializer.serialize(record);
      response.send(recordSerialized);
    })
    .catch(next);
}
```

{% endcode %}

{% code title="routes/zendesk-users.js" %}

```javascript
const { getUsers, getUser } = require('../services/zendesk-tickets-service');

// Get a Zendesk Ticket
router.get(
  '/zendesk_users/:userId',
  permissionMiddlewareCreator.details(),
  (request, response, next) => {
    getUser(request, response, next);
  }
);
```

{% endcode %}
