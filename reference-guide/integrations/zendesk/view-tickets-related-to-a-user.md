# View tickets related to a user

Now, let's say we want to access the tickets for a user of my database. We are going to use the email address as the foreign key between the database model (`Users` table) and Zendesk tickets.

First, we need to create the [Smart Relationship](https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship) between `Users` and `zendesk_tickets` as follows:

{% code title="forest/users.js" %}
```javascript
collection('users', {
  actions: [],
  fields: [
    {
      field: 'ze_requested_tickets',
      type: ['String'],
      reference: 'zendesk_tickets.id',
    },
  ],
  segments: [],
});
```
{% endcode %}

Then, we need to implement the Smart Relationship route. This route will query the Zendesk tickets related to the user's email (requested field on `zendesk_tickets`).

{% code title="routes/users.js" %}
```javascript
const {getTickets} = require('../services/zendesk-tickets-service');

router.get('/users/:userId/relationships/ze_requested_tickets', async (request, response, next) => {
    // Get the user email for filtering on requester
    const user = await users.findByPk(request.params.userId);
    const additionalFilter = `requester:${user.email}`;
    getTickets(request, response, next, additionalFilter);
});
```
{% endcode %}

Now, you should see the requested tickets for a user:

![](<../../../.gitbook/assets/image (505).png>)
