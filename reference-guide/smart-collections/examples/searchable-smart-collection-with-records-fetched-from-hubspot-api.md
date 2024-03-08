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

# Searchable smart collection with records fetched from hubspot API

**Context:** Create a smart collection fetching the 10 first companies records from hubspot or the ones matching a search criteria

First step is to declare the collection and the fields that should be expected to be found for this collection.

```jsx
const Liana = require('forest-express-sequelize');
const models = require('../models');

Liana.collection('hubspot_companies', {
  isSearchable: true,
  fields: [
    {
      field: 'id',
      type: 'Number',
    },
    {
      field: 'name',
      type: 'String',
    },
  ],
});
```

Next step is to define the logic to retrieve the data of the smart collection in a `routes/your-model.js` file.

You first need to set variables according to the context to ensure the query follows the UX (nb of records per page, index of the page you're on, search performed or not)

You then need to define a serializer adapted to the format of the data that will be passed and the expected fields of the collection.

Finally you need to implement the API call, serialize the data obtained, filter depending on the search performed and return the payload.

NB: I used the `superagent` module for the API call

```javascript
const Liana = require('forest-express-sequelize');
const express = require('express');
const router = express.Router();
const models = require('../models');
const P = require('bluebird');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const superagent = require('superagent');

router.get(
  '/hubspot_companies',
  Liana.ensureAuthenticated,
  (req, res, next) => {
    // set pagination parameters when exist (default limit is 250 as it is the max allowed by Hubspot)
    let limit = 250;
    let offset = 0;
    req.query.page ? (limit = parseInt(req.query.page.size)) : limit;
    req.query.page
      ? (offset = (parseInt(req.query.page.number) - 1) * limit)
      : offset;

    // set search terms when exist
    let search = null;
    req.query.search ? (search = req.query.search) : search;

    // define the serializer used to format the payload
    const hubspotCompaniesSerializer = new JSONAPISerializer(
      'hubspotCompanies',
      {
        attributes: ['name'],
        keyForAttribute: 'underscore_case',
        id: 'companyId',
        transform: function (record) {
          record.name = record['properties']['name']['value'];
          return record;
        },
      }
    );

    // implement function to call hubspot API and return companies
    async function getCompanies() {
      return (hubspot_companies = await superagent
        .get(
          `https://api.hubapi.com/companies/v2/companies/paged?hapikey=${process.env.HUBSPOT_API}&properties=name&limit=${limit}&offset=${limit}`
        )
        .then((response) => {
          // parsing the answer from the API
          companiesJSON = JSON.parse(response.res.text).companies;
          // serializing the companies to comply with the format expected by the Forest server
          serializedCompanies =
            hubspotCompaniesSerializer.serialize(companiesJSON);
          // return all data or data with a name containing the searched terms from the companies fetched
          if (search) {
            serializedCompanies.data = serializedCompanies.data.filter(
              function (item) {
                return item.attributes.name
                  .toUpperCase()
                  .includes(search.toUpperCase());
              }
            );
            return serializedCompanies;
          } else {
            return serializedCompanies;
          }
        }));
    }

    async function sendCompaniesPayload() {
      let hubspotCompanies = await getCompanies();
      // defining the count of companies fetched
      let count = hubspotCompanies.data.length;
      return res.send({ ...hubspotCompanies, meta: { count: count } });
    }

    sendCompaniesPayload();
  }
);

module.exports = router;
```
