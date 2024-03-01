{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Display Hubspot companies

This example shows you how to create a smart collection to list the companies of your Hubspot account.

<!-- markdown-link-check-disable -->

{% embed url="https://1726799947-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-M0vHiS-1S9Hw3djvoTw%2F-MJBsYyaWtLJBqiVmjEn%2F-MJBuFL3UHMbW0EMqiJi%2Fhubspot%20list%20companies.gif?alt=media&token=f19240f1-fbee-49bf-ac60-e76261d165d4" %}

<!-- markdown-link-check-enable -->

## Requirements

* An admin backend running on forest-express-sequelize
* [superagent](https://www.npmjs.com/package/superagent) npm package
* a Hubspot account

## How it works

### Directory: /forest

This directory contains the `hubspot-companies.js` file where the collection is declared.

{% code title="/forest/hubspot-companies.js" %}
```javascript
const collection = require('forest-express-sequelize');

collection('hubspot_companies', {
  isSearchable: true,
  fields: [
    {
      field: 'id',
      type: 'Number',
    }, {
      field: 'name',
      type: 'String',
    }, {
      field: 'hubspot_link',
      type: 'String',
    },
  ],
});
```
{% endcode %}

### Directory: /routes

This directory contains the `hubspot-companies.js` file where the serializer for the collection and logic to get records is defined.&#x20;

Companies information are obtained by making a [get all companies](https://developers.hubspot.com/docs/methods/companies/get-all-companies) call to the Hubspot API.

{% hint style="info" %}
The Hubspot API key is defined in the `.env` file and requested through the expression `process.env.HUBSPOT_API`.
{% endhint %}

{% code title="/routes/hubspot-companies.js" %}
```javascript
const Liana = require('forest-express-sequelize');
const express = require('express');
const superagent = require('superagent');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const router = express.Router();

// define the serializer used to format the payload
const hubspotCompaniesSerializer = new JSONAPISerializer('hubspotCompanies', {
  attributes: ['name', 'hubspotLink'],
  keyForAttribute: 'underscore_case',
  id: 'companyId',
  transform(record) {
    record.name = record.properties.name.value;
    record.hubspotLink = `https://app.hubspot.com/contacts/6332498/company/${record.companyId}`;
    return record;
  },
});

function getHubspotCompaniesList(limit, offset) {
  return superagent
    .get(`https://api.hubapi.com/companies/v2/companies/paged?hapikey=${process.env.HUBSPOT_API}&properties=name&limit=${limit}&offset=${offset}`)
    .then((response) => JSON.parse(response.res.text));
}

async function getAllHubspotCompanies() {
  let allHubspotCompanies = [];
  let hasMore = true;
  let offset = '';
  while (hasMore) {
    let getCompaniesResponse = await getHubspotCompaniesList(250, offset);
    allHubspotCompanies = allHubspotCompanies.concat(getCompaniesResponse.companies);
    offset = getCompaniesResponse.offset;
    hasMore = getCompaniesResponse['has-more'];
  }
  return allHubspotCompanies;
}

function searchHubspotCompanies(companies, search) {
  return companies.filter((item) => {
    return item.properties.name.value.toUpperCase().includes(search.toUpperCase());
  });
}

router.get('/hubspot_companies', Liana.ensureAuthenticated, async (req, res, next) => {
  // set pagination parameters when exist (default limit is 250 as it is the max allowed by Hubspot)
  let limit = req.query.page ? parseInt(req.query.page.size) : 20;
  let offset = req.query.page ? (parseInt(req.query.page.number) - 1) * limit : 0;

  // set search terms when exist
  let search = null;
  search = req.query.search ? req.query.search : search;

  let hubspotCompanies = await getAllHubspotCompanies();
  if (search) {
    hubspotCompanies = searchHubspotCompanies(hubspotCompanies, search);
  }
  const count = hubspotCompanies ? hubspotCompanies.length : null;
  const paginateHubspotCompanies = hubspotCompanies.slice(offset, offset + limit);
  const serializedCompanies = hubspotCompaniesSerializer.serialize(paginateHubspotCompanies);
  return res.send({ ...serializedCompanies, meta: { count } });
});

module.exports = router;
```
{% endcode %}
