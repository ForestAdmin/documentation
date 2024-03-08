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
const { getTickets } = require('../services/zendesk-tickets-service');

router.get(
  '/users/:userId/relationships/ze_requested_tickets',
  async (request, response, next) => {
    // Get the user email for filtering on requester
    const user = await users.findByPk(request.params.userId);
    const additionalFilter = `requester:${user.email}`;
    getTickets(request, response, next, additionalFilter);
  }
);
```

{% endcode %}

Now, you should see the requested tickets for a user:

![](<../../../.gitbook/assets/image (505).png>)
