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

# Scope on a smart field extracting a json's column attribute

**Context**: As a user, I want to scope a table's records based on the value of an attribute nested within a json column.

**Example**: I have a table `users` that includes a JSONB column named `contact`. The `contact` json can include a `phone`, `email` or `country` attribute. Since I want to scope my collection by `country`, I created a smart field called `country` that returns the value of the country attribute and I implemented a filter feature for this field.

{% embed url="https://chiseled-mist-56d.notion.site/image/http%3A%2F%2Fg.recordit.co%2FUeJ7i6T6ik.gif?cache=v2&id=f3417df4-5ed8-4cd4-81a4-6b1567644d30&spaceId=909b2fa6-5d71-45d9-90af-fc4fdbc6d23e&table=block&userId=" %}

{% embed url="https://chiseled-mist-56d.notion.site/image/http%3A%2F%2Fg.recordit.co%2Fe5Vddalzfq.gif?cache=v2&id=59b11e4d-4368-4de4-baae-6c8640f23886&spaceId=909b2fa6-5d71-45d9-90af-fc4fdbc6d23e&table=block&userId=" %}

### Implementation

The smart field definition and the filtering logic are defined as follows in the `forest/users.js` file of my admin backend.

```jsx
const { collection } = require('forest-express-sequelize');
const models = require('../models');

const { Op } = models.objectMapping;

collection('users', {
  actions: [],
  fields: [
    {
      field: 'country',
      isFilterable: true,
      type: 'String',
      get: (record) => record.contact.country,
      filter({ condition, where }) {
        switch (condition.operator) {
          case 'equal':
            return {
              'contact.country': { [Op.eq]: condition.value },
            };
          // ... And so on with the other operators not_equal, starts_with, etc.

          default:
            return null;
        }
      },
    },
  ],
  segments: [],
});
```

{% hint style="warning" %}
In order to make your smart field filterable in the UI, you both need to add the `isFilterable: true` option in the field's declaration and to enable filtering on this field in the field settings in the UI.
{% endhint %}
