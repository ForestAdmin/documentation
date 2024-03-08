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

# Bonus: Direct link to Zendesk + change priority of a ticket

## Create a Direct Link to Zendesk

The next step is to build a direct link to the Zendesk Ticket using a URL. We are going to implement a smart field for this. To build the URL, we simply use Zendesk's convention: `ZENDESK_URL_PREFIX/agent/tickets/ticketId`

{% code title="forest/zendesk_tickets.js" %}

```javascript
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

collection('zendesk_tickets', {
  actions: [],
  fields: [{
    field: 'direct_url',
    type: 'String',
    get: (ticket) => {
      return `${ZENDESK_URL_PREFIX}/agent/tickets/${ticket.id}`;
    },
  },
  ...
  ],
  segments: [],
});
```

{% endcode %}

Once the smart field is added, just set up the Display Widget in Forest UI to allow the display of the URL as a Link:

![](<../../../.gitbook/assets/image (497).png>)

## Change the priority of a ticket

Let's say your operations team wants to change the priority of Zendesk tickets directly from Forest Admin.

For doing so, let's create a simple [Smart Action](https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions) like this:

{% code title="forest/zendesk_tickets.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

// Search on tickets => https://support.zendesk.com/hc/en-us/articles/203663206-Searching-tickets
collection('zendesk_tickets', {
  actions: [{
    name: 'Change Priority',
    type: 'single',
    endpoint: '/forest/actions/zendesk-ticket-change-priority',
    fields: [
      {
        field: 'New Ticket Priority',
        description: 'What is the new priority?',
        type: 'Enum',
        enums: ['urgent', 'high', 'normal', 'low'],
        isRequired: true
      },
    ],
  }],
  fields: [
    ...
  ],
  segments:[]
}
```

{% endcode %}

Implement the `updateTicket` service according to the [Zendesk API](https://developer.zendesk.com/rest_api/docs/support/tickets#update-ticket):

{% code title="services/zendesk-tickets-service.js" %}

```javascript
async function updateTicket(ticketId, newValues) {
  const body = {
    ticket: newValues,
  };
  return axios
    .put(`${ZENDESK_URL_PREFIX}/api/v2/tickets/${ticketId}`, body, {
      headers: {
        Authorization: `Basic ${getToken()}`,
      },
    })
    .then(async (resp) => {
      let record = resp.data.ticket;
      return record;
    });
}
```

{% endcode %}

And now, we need to implement the route to handle this Smart Action:

{% code title="routes/zendesk_tickets.js" %}

```javascript
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'companies'
);
const {
  getTickets,
  getTicket,
  updateTicket,
} = require('../services/zendesk-tickets-service');

router.post(
  '/actions/zendesk-ticket-change-priority',
  permissionMiddlewareCreator.smartAction(),
  (request, response, next) => {
    const ticketId = request.body.data.attributes.ids[0];
    const newValues = {
      priority: request.body.data.attributes.values['New Ticket Priority'],
    };

    updateTicket(ticketId, newValues)
      // eslint-disable-next-line no-unused-vars
      .then(async function (recordUpdated) {
        response.send({
          success: 'Ticket Priority changed!',
        });
      })
      .catch(next);
  }
);
```

{% endcode %}

{% hint style="success" %}
You now have full integration with Zendesk!\
\
To go further, please [check our Github repository and explore how to](https://github.com/existenz31/forest-zendesk):

- Get the Assignee, Submitter & Requester users for a Zendesk Ticket
- Get the Zendesk User for a User
- Get the requested tickets for a Zendesk User
- and more...
  {% endhint %}
