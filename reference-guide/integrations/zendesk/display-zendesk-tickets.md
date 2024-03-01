{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

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
  fields: [{
    field: 'id',
    type: 'Number',
    isFilterable: true,
  }, {
    field: 'created_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'updated_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'type',
    type: 'Enum',
    enums: ['problem', 'incident', 'question', 'task'],
    isFilterable: true,
    isSortable: true,
  }, {
    field: 'priority',
    type: 'Enum',
    enums: ['urgent', 'high', 'normal', 'low'],
    isFilterable: true,
    isSortable: true,
  }, {
    field: 'status',
    type: 'Enum',
    enums: ['new', 'open', 'pending', 'hold', 'solved', 'closed'],
    isFilterable: true,
    isSortable: true,
  }, {
    field: 'subject',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'description',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'comment_count',
    type: 'Number',
  }, {
    field: 'is_public',
    type: 'Boolean',
  }, {
    field: 'satisfaction_rating',
    type: 'Json',
  }, {
    field: 'tags',
    type: ['String'],
    isFilterable: true, // not => filtering on array is not yet possible
  }, ],
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
* Learn more about how to [authenticate, filter and sort with the Zendesk API](https://docs.forestadmin.com/woodshop/how-tos/zendesk-integration/authentication-filtering-and-sorting).
* Find more information about `getTickets` variable definition in [the Github repository](https://github.com/existenz31/forest-zendesk/blob/master/services/zendesk-tickets-service.js).
{% endhint %}

{% code title="routes/zendesk-tickets.js" %}
```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('zendesk_tickets');


const {getTickets} = require('../services/zendesk-tickets-service');

// Get a list of Zendesk Tickets
router.get('/zendesk_tickets', permissionMiddlewareCreator.list(), (request, response, next) => {
  getTickets(request, response, next);
});
```
{% endcode %}

### Implement the get Route

The section above help you display the list of all Zendesk tickets. But you'll need to implement also the logic to display the information of a specific ticket.

This is going to be very similar. We just need to implement a new endpoint to get an individual ticket from the Zendesk API.

{% code title="services/zendesk-tickets-services.js" %}
```javascript
async function getTicket(request, response, next) {
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/tickets/${request.params.ticketId}?include=comment_count`, {
    headers: {
      'Authorization': `Basic ${getToken()}`
    },
  })
  .then( async (resp) => {
    let record = resp.data.ticket;
    // Serialize the result using the Forest Admin format
    const recordSerializer = new RecordSerializer({ name: 'zendesk_tickets' });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);
  })
  .catch(next);

}
```
{% endcode %}

{% code title="routes/zendesk-tickets.js" %}
```javascript
const {getTickets, getTicket} = require('../services/zendesk-tickets-service');

// Get a Zendesk Ticket
router.get('/zendesk_tickets/:ticketId', permissionMiddlewareCreator.details(), (request, response, next) => {
  getTicket(request, response, next);
});
```
{% endcode %}
