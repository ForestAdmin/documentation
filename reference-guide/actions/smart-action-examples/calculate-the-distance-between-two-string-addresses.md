# Calculate the distance between two webhooks

**Context**: As a user I want to be able to obtain the distance between two objects that have address information as a string.

{% embed url="https://www.loom.com/share/8b52e54a4f4b41b09b54e71c50814e8a" %}

**Example**: I have a collection `places` that has `lineAddress1`, `addressCity` and `country` fields.

In a smart action called `get distance to another place` called from a specific place, I want to be able to select another place, choosing the locomotion mode and get the distance between the two and duration of trip.

### Implementation

First you need to declare the action and the content of the form.

`forest/places.js`

```jsx
const { collection } = require('forest-express-sequelize');

collection('places', {
  actions: [
    {
      name: 'get distance to other place',
      fields: [{
        field: 'destination',
        reference: 'places.id',
      }, {
        field: 'mode',
        type: 'Enum',
        enums: ['driving', 'bicycling', 'walking'],
      }],
    },
  ],
  fields: [],
  segments: [],
});
```

Then you need to implement the logic of the action. Here we use the service `superagent` to handle api calls.

The process has two main steps:

* call to the places api to retrieve the place\_id identifier corresponding to the string address of the origin and destination (that is computed as a complete address based on the separate `addressLine1`, `addressCity` and `country` fields)
* call to the distance matrix api to retrieve the distance information based on the origin and destination's place\_ids

The result returned to the UI is formatted in html to enable a good display to the user.

`routes/places.js`

```javascript
const express = require('express');
const superagent = require('superagent');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { places } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('places');


router.post('/actions/get-distance-to-other-place', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  let origin = {};
  let destination = {};
  const attr = request.body.data.attributes;
  const where = {
    id: [
      attr.ids[0],
      attr.values.destination,
    ],
  };

  function computeFullAddress(address) {
    return `${address.addressLine1},${address.addressCity}, ${address.country}`;
  }

  function setOriginDestination(addressesArray) {
    addressesArray.forEach((address) => {
      if (`${address.id}` === attr.ids[0]) {
        origin = { address: computeFullAddress(address) };
      } else {
        destination = { address: computeFullAddress(address) };
      }
    });
  }

  function getPlaceId(place) {
    return superagent
      .get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?')
      .query({
        input: place.address,
        inputtype: 'textquery',
        fields: 'place_id,geometry/location',
        key: process.env.GOOGLE_API_KEY,
      })
      .then((res) => {
        const data = JSON.parse(res.text);
        return data.candidates[0].place_id;
      });
  }
	//get the addresses records based on the current record id and the selected destination id
  const addressesRecords = await places.findAll({ where });
	//add the full address to the empty objects origin and destination
  setOriginDestination(addressesRecords);
	// retrieve the place_id for the origin and destination
  const googlePlaceIds = await Promise.all([getPlaceId(origin), getPlaceId(destination)]);
  [origin.placeId, destination.placeId] = googlePlaceIds;
	
	//perform call to the distance matrix api
  return superagent
    .get('https://maps.googleapis.com/maps/api/distancematrix/json?')
    .query({
      origins: `place_id:${origin.placeId}`,
      destinations: `place_id:${destination.placeId}`,
      key: process.env.GOOGLE_API_KEY,
			// the mode here corresponds to the one selected in the action form
      mode: attr.values.mode,
    })
    .then((res) => {
      console.log(res.text);
      return JSON.parse(res.text)})
    .then((results) => {
      response.send({
        html: `
        <strong class="c-form__label--read c-clr-1-2">Distance between</strong>
        <p class="c-clr-1-4 l-mb">${results.origin_addresses[0]}</p>
        <p class="c-clr-1-4 l-mb">and</p>
        <p class="c-clr-1-4 l-mb">${results.destination_addresses[0]}</p>
        <strong class="c-form__label--read c-clr-1-2">Distance</strong>
        <p class="c-clr-1-4 l-mb">${results.rows[0].elements[0].distance.text}</p>
        <strong class="c-form__label--read c-clr-1-2">Duration</strong>
        <p class="c-clr-1-4 l-mb">${results.rows[0].elements[0].duration.text}</p>
        `,
      });
    })
    .catch((e) => console.log(e.response.error));
});

module.exports = router;
```
