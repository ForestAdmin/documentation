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

# Create a Hubspot company

This example shows you how to create a Smart Action `"Create company in Hubspot"` that generates a company in Hubspot based on information from your database.

<!-- markdown-link-check-disable -->

{% embed url="https://1726799947-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-M0vHiS-1S9Hw3djvoTw%2F-MJBsYyaWtLJBqiVmjEn%2F-MJBtr8rE89NYlQUwDG3%2Fhubspot%20company%20create.gif?alt=media&token=4e66aa07-65c4-4a2b-9466-e7bacfb9a7c9" %}

<!-- markdown-link-check-ensable -->

## Requirements

- An admin backend running on forest-express-sequelize
- [superagent](https://www.npmjs.com/package/superagent) npm package
- a Hubspot account

## How it works

### Directory: /models

This directory contains the `companies.js` file where the collection is declared.

{% code title="/models/companies.js" %}

```javascript
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  const Companies = sequelize.define(
    'companies',
    {
      description: {
        type: DataTypes.STRING,
      },
      industry: {
        type: DataTypes.STRING,
      },
      headquarters: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['lead', 'customer', 'churn'],
      },
      crmId: {
        type: DataTypes.BIGINT,
      },
    },
    {
      tableName: 'companies',
      underscored: true,
      timestamps: false,
      schema: process.env.DATABASE_SCHEMA,
      paranoid: true,
    }
  );

  return Companies;
};
```

{% endcode %}

### Directory: /forest

This directory contains the `companies.js` file where the smart action is declared. A smart field has also been added to add a link to the company's Hubspot profile if the company's `crmId` field is not `null`.

{% code title="/forest/hubspot-companies.js" %}

```javascript
const { collection } = require('forest-express-sequelize');
​
collection('companies', {
  actions: [{
      name: 'Create company in Hubspot',
      type: 'single',
    }],
  fields: [{
      // adding a field that will allow to be directed on click to the company's profile in hubspot
      field: 'crm link',
      type: 'String',
      get: (company) => company.crmId ?
        'https://app.hubspot.com/contacts/6332498/company/' + company.dataValues.crmId : null
    }],
  segments: [],
});
```

{% endcode %}

### Directory: /routes

This directory contains the `companies.js` file where the smart action logic is implemented.&#x20;

In this logic a Hubspot company instance is created through a /post create company call to the Hubspot API.

{% hint style="info" %}
The Hubspot API key is defined in the `.env` file and requested through the expression `process.env.HUBSPOT_API`.
{% endhint %}

{% code title="/routes/hubspot-companies.js" %}

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { companies } = require('../models');
const superagent = require('superagent');

const router = express.Router();

// function that returns a sequelize object
function getRecord(collection, recordId) {
  return collection.findOne({ where: { id: recordId } });
}

// function that update a company record crmId with the hubspot companyId
function setCrmId(record, hubspotId) {
  record.crmId = hubspotId;
  return record.save();
}

// function that creates a company in Hubspot through the hubspot API
function createHubspotCompany(company) {
  return superagent
    .post(
      `https://api.hubapi.com/companies/v2/companies?hapikey=${process.env.HUBSPOT_API}`
    )
    .send({
      properties: [
        {
          name: 'name',
          value: company.name,
        },
        {
          name: 'description',
          value: company.description,
        },
        {
          name: 'city',
          value: company.headquarters,
        },
        {
          name: 'industry',
          value: company.industry,
        },
      ],
    })
    .then((response) => JSON.parse(response.res.text));
}

router.post('/actions/create-company-in-Hubspot', async (req, res) => {
  const companyId = req.body.data.attributes.ids[0];
  const company = await getRecord(companies, companyId);

  if (company.crmId) {
    return res
      .status(400)
      .send({
        error: 'A lead from Hubspot is already assigned to this company',
      });
  }
  try {
    const hubspotCompany = await createHubspotCompany(company);
    await setCrmId(company, hubspotCompany.companyId);
  } catch (err) {
    console.log('error => ', err);
    res.status(400).send({ error: 'could not create lead' });
  }
  return res.send({ success: 'Lead has been created in Hubspot!' });
});
```

{% endcode %}
