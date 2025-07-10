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

# Update point geometry field using a smart field and algolia api

{% hint style="warning" %}
Algolia is sunsetting its Place services. We recommend that you use the Google service instead. [Learn more](https://www.algolia.com/blog/product/sunsetting-our-places-feature/).
{% endhint %}

**Description**: I need to fill in 2 fields in my db for a location: address 1 (a string) and location (a postresql geography point). Although a [widget ](https://docs.forestadmin.com/user-guide/collections/customize-your-fields/edit-widgets)with autocomplete exists to fill an address string in the UI, the location coordinates can only be obtained manually by looking up the address in our search engine which is not optimal.create smart field to edit point field using the address widget and algolia API.

**Approach chosen**: Create a smart field in your Forest Admin backend app that will serve as the input field.

{% code title="forest/events.js" %}

```javascript
const Liana = require('forest-express-sequelize');
const algoliasearch = require('algoliasearch');
const places = algoliasearch.initPlaces(
  process.env.PLACES_APP_ID,
  process.env.PLACES_API_KEY
);

Liana.collection('events', {
  fields: [
    {
      field: 'Location setter',
      type: 'String',
      get: (event) => {
        return event.address;
      },
      set: (event, query) => {
        async function getLocationCoordinates(query) {
          try {
            const location = await places.search({
              query: query,
              type: 'address',
            });
            console.log(
              'search location coordinates result',
              location.hits[0]._geoloc
            );
            return location.hits[0]._geoloc;
          } catch (err) {
            console.log(err);
            console.log(err.debugData);
          }
        }

        async function setEvent(event, query) {
          const coordinates = await getLocationCoordinates(query);
          event.address = query;
          console.log('new address', event.address);
          event.locationGeo = `{"type": "Point", "coordinates": [${coordinates.lat}, ${coordinates.lng}]}`;
          console.log('new location', event.locationGeo);
          return event;
        }

        return setEvent(event, query);
      },
    },
  ],
});
```

{% endcode %}
