{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

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
  fields: [{
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
  }],
  segments: [],
});
```

{% hint style="warning" %}
In order to make your smart field filterable in the UI, you both need to add the `isFilterable: true` option in the field's declaration and to enable filtering on this field in the field settings in the UI.
{% endhint %}
