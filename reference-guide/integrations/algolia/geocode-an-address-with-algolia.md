{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Geocode an address with Algolia

This example shows you how to use an autocomplete address smart field to update a PostreSQL geography point (lat, long).

{% embed url="https://youtu.be/SWldaV29s9U" %}

## Requirements

* An admin backend running on forest-express-sequelize
* An algolia account
* [algoliasearch](https://www.npmjs.com/package/algoliasearch) npm package

## How it works

### Directory: /models

This directory contains the `events.js` file where the model is declared.

{% code title="models/events.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('events', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    locationGeo: {
      type: DataTypes.GEOMETRY('POINT', 4326),
    },
    address: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'events',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.removeAttribute('id');
  Model.associate = () => {};

  return Model;
};
```
{% endcode %}

### Directory: /forest

This directory contains the `events.js` file where the Smart Field `Location setter`is declared.\
\
This smart field will be used to update the value of the `address`and `locationGeo` fields.

{% code title="/forest/events.js" %}
```javascript
const algoliasearch = require('algoliasearch');

const places = algoliasearch.initPlaces(process.env.PLACES_APP_ID, process.env.PLACES_API_KEY);

async function getLocationCoordinates(query) {
  try {
    const location = await places.search({ query, type: 'address' });
    console.log('search location coordinates result', location.hits[0]._geoloc);
    return location.hits[0]._geoloc;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function setEvent(event, query) {
  const coordinates = await getLocationCoordinates(query);
  event.address = query;
  event.locationGeo = `{"type": "Point", "coordinates": [${coordinates.lat}, ${coordinates.lng}]}`;
  console.log('new address', event.address);
  console.log('new location', event.locationGeo);
  return event;
}

collection('events', {
  fields: [{
    field: 'Location setter',
    type: 'String',
    // Get the data to be displayed.
    get: (event) => event.address,
    // Update using Algolia.
    set: (event, query) => setEvent(event, query),
  }],
});
```
{% endcode %}

{% hint style="info" %}
The field `Location setter` should use the [address edit widget](https://docs.forestadmin.com/user-guide/collections/customize-your-fields/edit-widgets#address) to enable address autocomplete.
{% endhint %}
