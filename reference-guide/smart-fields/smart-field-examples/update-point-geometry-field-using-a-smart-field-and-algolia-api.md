# Update point geometry field using a smart field and algolia api

**Description**: I need to fill in 2 fields in my db for a location: address 1 (a string) and location (a postresql geography point). Although a [widget ](https://docs.forestadmin.com/user-guide/collections/customize-your-fields/edit-widgets)with autocomplete exists to fill an address string in the UI, the location coordinates can only be obtained manually by looking up the address in our search engine which is not optimal.create smart field to edit point field using the address widget and algolia API.

{% embed url="https://recordit.co/2Tj4TDtgeo" %}

**Approach chosen**: Create a smart field in your Forest Admin backend app that will serve as the input field.

{% code title="forest/events.js" %}
```javascript
const Liana = require('forest-express-sequelize');
const algoliasearch = require('algoliasearch');
const places = algoliasearch.initPlaces(process.env.PLACES_APP_ID, process.env.PLACES_API_KEY);

Liana.collection('events', {
  fields: [{
    field: 'Location setter',
    type: 'String',
    get: (event) => {
      return event.address
    },
    set: (event, query) => {
      async function getLocationCoordinates(query){
          try {
            const location = await places.search({query: query, type:'address'});
            console.log('search location coordinates result', location.hits[0]._geoloc);
            return location.hits[0]._geoloc
          } catch (err) {
            console.log(err);
            console.log(err.debugData);
          }
      }

      async function setEvent(event, query) {
        const coordinates = await getLocationCoordinates(query)
        event.address = query
        console.log('new address', event.address)
        event.locationGeo = `{"type": "Point", "coordinates": [${coordinates.lat}, ${coordinates.lng}]}`
        console.log('new location', event.locationGeo)
        return event
      }

      return setEvent(event, query)
    }
  }],
});
```
{% endcode %}
