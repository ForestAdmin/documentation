{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Searchable smart collection with records fetched from hubspot API

**Context:** Create a smart collection fetching the 10 first companies records from hubspot or the ones matching a search criteria

First step is to declare the collection and the fields that should be expected to be found for this collection.

```jsx
const Liana = require('forest-express-sequelize');
const models = require('../models');

Liana.collection('hubspot_companies', {
	isSearchable: true,
	fields: [{
		field: 'id',
		type:'Number',
	}, {
		field: 'name',
		type: 'String',
	}],
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

router.get('/hubspot_companies', Liana.ensureAuthenticated, (req, res, next) => {

// set pagination parameters when exist (default limit is 250 as it is the max allowed by Hubspot)
	let limit = 250
	let offset = 0
	req.query.page ? limit = parseInt(req.query.page.size) : limit
	req.query.page ? offset = (parseInt(req.query.page.number) - 1) * limit : offset

	// set search terms when exist
	let search = null
	req.query.search ? search = req.query.search : search

	// define the serializer used to format the payload
	const hubspotCompaniesSerializer = new JSONAPISerializer('hubspotCompanies', {
		attributes: ['name'],
		keyForAttribute: 'underscore_case',
		id: 'companyId',
		transform: function (record) {
		record.name = record['properties']['name']['value'];
		return record;
		}
	});

	// implement function to call hubspot API and return companies
	async function getCompanies() {
		return hubspot_companies = await superagent
			.get(`https://api.hubapi.com/companies/v2/companies/paged?hapikey=${process.env.HUBSPOT_API}&properties=name&limit=${limit}&offset=${limit}`)
			.then(response => {
				// parsing the answer from the API
				companiesJSON = JSON.parse(response.res.text).companies
				// serializing the companies to comply with the format expected by the Forest server
				serializedCompanies = hubspotCompaniesSerializer.serialize(companiesJSON)
				// return all data or data with a name containing the searched terms from the companies fetched
				if (search) {
				serializedCompanies.data = serializedCompanies.data.filter(function(item) {
					return item.attributes.name.toUpperCase().includes(search.toUpperCase());
				});
				return serializedCompanies
				} else {
				return serializedCompanies
				}
			})
	}


	async function sendCompaniesPayload() {
		let hubspotCompanies = await getCompanies()
		// defining the count of companies fetched
		let count = hubspotCompanies.data.length
		return res.send({...hubspotCompanies, meta:{ count: count }})
	}

	sendCompaniesPayload()

});


module.exports = router;
```
