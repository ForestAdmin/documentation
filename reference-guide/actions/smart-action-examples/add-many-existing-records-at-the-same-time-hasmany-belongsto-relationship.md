---
description: >-
  This example shows how to associate multiple existing records at once to a
  record using a simple smart action.
---

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

# Add many existing records at the same time (hasMany-belongsTo relationship)

![](../../../.gitbook/assets/bulk-add-records.gif)

### Requirements

- An admin backend running on `forest-express-sequelize`
- Relationship **One-To-Many** between two collections (in this example an organization **hasMany** companies <-> a company **belongsTo** an organization)

## How it works

### Directory: **/forest**

Create a new smart action in the forest file of the collection with the **hasMany relationship** (organizations in this example).

This smart action will be usable on a single record (`type: 'single'`). We will create two fields in the smart action form, one will be used for the **search** on the referenced collection and the second will be used to see the **selection** made by the operator.

```javascript
const { collection } = require('forest-express-sequelize');
const { companies } = require('../models');

collection('organizations', {
  actions: [
    {
      name: 'Associate companies',
      type: 'single',
      fields: [
        {
          field: 'search',
          type: 'String',
          reference: 'companies',
          isRequired: false,
          hook: 'onSearchChange',
        },
        {
          field: 'selection',
          type: ['String'],
          isReadOnly: true,
          isRequired: true,
          hook: 'onSelectionChange',
        },
      ],
      hooks: {
        change: {
          onSearchChange: async ({ fields }) => {
            // Retrieve fields
            const selection = fields.find(
              (field) => field.field === 'selection'
            );
            const search = fields.find((field) => field.field === 'search');

            if (!!search.value) {
              // Retrieve the company name by querying the DB
              const { name: searchValue } =
                (await companies.findByPk(search.value)) || {};

              // Adding company names when searching matches
              if (searchValue) {
                const allAddedValues = [
                  ...(selection.previousValue || []),
                  searchValue,
                ]; // ...() spread the array

                // Unique array values using a set
                selection.value = [...new Set(allAddedValues)];
                // Allow user to interact with selection field
                selection.isReadOnly = false;

                // Reset search value
                search.value = '';
              }
            }

            return fields;
          },
          onSelectionChange: async ({ fields }) => {
            // This hooks is needed to allow company removal from selection
            const selectionField = fields.find(
              (field) => field.field === 'selection'
            );

            // Enable or disable user interactions
            if (selectionField.value?.length > 0) {
              selectionField.isReadOnly = false;
            } else {
              selectionField.isReadOnly = true;
            }

            return fields;
          },
        },
      },
    },
  ],
  fields: [],
  segments: [],
});
```

### **Directory: /routes**

When the user validates the action, this route is called. We will use the **selection** to retrieve all companies' ids and then updates all companies `organizationId` field to create the associations.\
\
_In addition, once the smart action has been successfully run, it refreshes the relationship to properly display newly added associations._

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const {
  companies,
  objectMapping: { Op },
} = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'organizations'
);

// Associate companies smart action route
router.post(
  '/actions/associate-companies',
  permissionMiddlewareCreator.smartAction(),
  async (req, res) => {
    const {
      body: {
        data: { attributes },
      },
    } = req;
    const companyNames = attributes.values['selection'];

    // Retrieve all companies ids using the company names sent by the action form
    const companyIds = (
      await companies.findAll({
        where: { name: { [Op.in]: companyNames } },
        attributes: ['id'],
      })
    ).map((company) => company.id);

    // Retrieve organization id from the request
    const organizationId = attributes.ids[0];

    // Update the companies to add the belongsTo association
    await companies.update(
      { organizationId: organizationId },
      { where: { id: companyIds } }
    );

    // Send success toasted and refresh the related data in the Summary
    res.send({
      success: 'Companies have been added!',
      refresh: { relationships: ['companies'] },
    });
  }
);

module.exports = router;
```
