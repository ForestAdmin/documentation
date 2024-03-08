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

# Handle enums with alias labels in a smart action

**Context**: As a user to choose the input for a smart action field from a list of labels and I want a label to be pre-selected depending on the record's information. The labels do not correspond to the value to be updated in the database.

**Example**: I have a collection `companies` that has a `status` field. The status value in the database can be `rejected` or `live`.

In a smart action called update company status I want users to be able to select an alias value (i.e. `'rejeté'` for `rejected` and `'validé'` for `live`).

### Implementation

In order not to duplicate the matching to be made between the different values from the UI to the database and the other way around, I create a `company-status-handler` file that will allow me to handle the conversion.

`services/companies-status-handler.js`

```jsx
exports.statusValueMatching = {
  rejected: 'rejeté',
  live: 'validé',
};

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

exports.convertStatusValue = (status, source) => {
  if (source === 'database') {
    return this.statusValueMatching[status];
  }
  return getKeyByValue(this.statusValueMatching, status);
};
```

`forest/companies.js`

```jsx
const { collection } = require('forest-express-sequelize');

const {
  convertStatusValue,
  statusValueMatching,
} = require('../services/companies-status-handler');

collection('companies', {
  actions: [
    {
      name: 'Update company status',
      type: 'single',
      fields: [
        {
          field: 'Statut',
          type: 'Enum',
          enums: Object.values(statusValueMatching),
        },
      ],
      values: (company) => {
        company.Statut = convertStatusValue(company.status, 'database');
        return company;
      },
    },
  ],
  fields: [],
  segments: [],
});
```

`routes/companies.js`

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { companies } = require('../models');
const { convertStatusValue } = require('../services/companies-status-handler');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'companies'
);

router.post('/actions/update-company-status', (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  const attr = request.body.data.attributes;
  companies
    .update(
      { status: convertStatusValue(attr.values.Statut, 'front') },
      { where: { id: attr.ids[0] } }
    )
    .then(() => response.send({ success: 'company updated' }));
});

module.exports = router;
```
