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

# Calculate the distance between two string addresses

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
      fields: [
        {
          field: 'destination',
          reference: 'places.id',
        },
        {
          field: 'mode',
          type: 'Enum',
          enums: ['driving', 'bicycling', 'walking'],
        },
      ],
    },
  ],
  fields: [],
  segments: [],
});
```

Then you need to implement the logic of the action. Here we use the service `superagent` to handle api calls.

The process has two main steps:

- call to the places api to retrieve the place_id identifier corresponding to the string address of the origin and destination (that is computed as a complete address based on the separate `addressLine1`, `addressCity` and `country` fields)
- call to the distance matrix api to retrieve the distance information based on the origin and destination's place_ids

The result returned to the UI is formatted in html to enable a good display to the user.

`routes/places.js`

```javascript
const express = require('express');
const superagent = require('superagent');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { places } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('places');

router.post(
  '/actions/get-distance-to-other-place',
  permissionMiddlewareCreator.smartAction(),
  async (request, response, next) => {
    let origin = {};
    let destination = {};
    const attr = request.body.data.attributes;
    const where = {
      id: [attr.ids[0], attr.values.destination],
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
        .get(
          'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?'
        )
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
    const googlePlaceIds = await Promise.all([
      getPlaceId(origin),
      getPlaceId(destination),
    ]);
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
        return JSON.parse(res.text);
      })
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
  }
);

module.exports = router;
```
