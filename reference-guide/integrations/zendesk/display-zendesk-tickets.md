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

# Display Zendesk tickets

This section shows you how to create a smart collection to list the tickets of your Zendesk account.

### Declare the Smart Collection Zendesk Tickets&#x20;

First, we need to declare the smart collection in your project based on the API documentation. As an example, here the smart collection definition for Users:

{% code title="forest/zendesk-tickets.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

// Search on tickets => https://support.zendesk.com/hc/en-us/articles/203663206-Searching-tickets
collection('zendesk_tickets', {
  actions: [],
  fields: [
    {
      field: 'id',
      type: 'Number',
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
      field: 'type',
      type: 'Enum',
      enums: ['problem', 'incident', 'question', 'task'],
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'priority',
      type: 'Enum',
      enums: ['urgent', 'high', 'normal', 'low'],
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['new', 'open', 'pending', 'hold', 'solved', 'closed'],
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'subject',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'description',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'comment_count',
      type: 'Number',
    },
    {
      field: 'is_public',
      type: 'Boolean',
    },
    {
      field: 'satisfaction_rating',
      type: 'Json',
    },
    {
      field: 'tags',
      type: ['String'],
      isFilterable: true, // not => filtering on array is not yet possible
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

In the file `routes/zendesk-tickets.js`, we’ve created a new route to implement the API behind the Smart Collection.

The logic here is to list all the users of your Zendesk account.

{% hint style="info" %}

- Learn more about how to [authenticate, filter and sort with the Zendesk API](https://docs.forestadmin.com/woodshop/how-tos/zendesk-integration/authentication-filtering-and-sorting).
- Find more information about `getTickets` variable definition in [the Github repository](https://github.com/existenz31/forest-zendesk/blob/master/services/zendesk-tickets-service.js).
  {% endhint %}

{% code title="routes/zendesk-tickets.js" %}

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'zendesk_tickets'
);

const { getTickets } = require('../services/zendesk-tickets-service');

// Get a list of Zendesk Tickets
router.get(
  '/zendesk_tickets',
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    getTickets(request, response, next);
  }
);
```

{% endcode %}

### Implement the get Route

The section above help you display the list of all Zendesk tickets. But you'll need to implement also the logic to display the information of a specific ticket.

This is going to be very similar. We just need to implement a new endpoint to get an individual ticket from the Zendesk API.

{% code title="services/zendesk-tickets-services.js" %}

```javascript
async function getTicket(request, response, next) {
  return axios
    .get(
      `${ZENDESK_URL_PREFIX}/api/v2/tickets/${request.params.ticketId}?include=comment_count`,
      {
        headers: {
          Authorization: `Basic ${getToken()}`,
        },
      }
    )
    .then(async (resp) => {
      let record = resp.data.ticket;
      // Serialize the result using the Forest Admin format
      const recordSerializer = new RecordSerializer({
        name: 'zendesk_tickets',
      });
      const recordSerialized = await recordSerializer.serialize(record);
      response.send(recordSerialized);
    })
    .catch(next);
}
```

{% endcode %}

{% code title="routes/zendesk-tickets.js" %}

```javascript
const {
  getTickets,
  getTicket,
} = require('../services/zendesk-tickets-service');

// Get a Zendesk Ticket
router.get(
  '/zendesk_tickets/:ticketId',
  permissionMiddlewareCreator.details(),
  (request, response, next) => {
    getTicket(request, response, next);
  }
);
```

{% endcode %}
