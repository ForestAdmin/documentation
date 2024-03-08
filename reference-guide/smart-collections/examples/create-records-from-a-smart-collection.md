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

# Create records from a Smart collection

**Context**: As a user I want to be able to add new records to a number of collections based on the input made in a smart collection creation form

Example: In this example I have the following data model:

Property ← building ← lot → owner

The smart collection called `ownerProperties` features records including:

- the firstName and lastName of the owner
- the reference of the property

In my use case I want to be able to create a new lot, owner, building and property based on the input of the form.

{% embed url="https://www.loom.com/share/e830243622484c998fc7fc6c7ff0f214?from_recorder=1" %}

### Definition of the smart collection

The smart collection is declared this way in a `forest/owner-properties.js` file.

```jsx
const { collection } = require('forest-express-sequelize');

collection('ownerProperties', {
  actions: [],
  fields: [
    {
      field: 'ownerFirstName',
      type: 'String',
    },
    {
      field: 'ownerLastName',
      type: 'String',
    },
    {
      field: 'ownerProperty',
      type: 'String',
    },
  ],
  segments: [],
});
```

### Definition of the routes

Below is the `routes/owner-properties.js` file that includes the logic for the `GET` and `POST` calls made on the smart collection.

```jsx
const express = require('express');
const {
  PermissionMiddlewareCreator,
  RecordSerializer,
} = require('forest-express-sequelize');
const models = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'ownerProperties'
);
const recordsSerializer = new RecordSerializer({ name: 'ownerProperties' });

const include = [
  {
    model: models.owners,
    as: 'owner',
  },
  {
    model: models.buildings,
    as: 'building',
    include: [
      {
        model: models.properties,
        as: 'property',
      },
    ],
  },
];

function ownerPropertyGetter(id) {
  return models.lots.findByPk(id, { include }).then(async (lot) => {
    let ownerProperty = {
      id: lot.id,
      ownerFirstName: lot.owner.firstName,
      ownerLastName: lot.owner.lastName,
      ownerProperty: lot.building.property.name,
    };
    return recordsSerializer.serialize(ownerProperty);
  });
}

// Create records from the owner, lot, building and property collections from create form
router.post(
  '/ownerProperties',
  permissionMiddlewareCreator.create(),
  (request, response, next) => {
    const { attributes } = request.body.data;
    const fields = {
      owner: {
        firstName: attributes.ownerFirstName,
        lastName: attributes.ownerLastName,
      },
      building: {
        property: {
          name: attributes.ownerProperty,
        },
      },
    };

    return models.lots.create(fields, { include }).then(async (lot) => {
      // don't forget to return the object newly created to ensure a smooth redirection
      const serializedRecord = await ownerPropertyGetter(lot.id);
      return response.send(serializedRecord);
    });
  }
);

// Get a list of owner-properties
router.get(
  '/ownerProperties',
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    const limit = parseInt(request.query.page.size) || 20;
    const offset = (parseInt(request.query.page.number) - 1) * limit;

    const findAllQuery = models.lots.findAll({
      include,
      limit,
      offset,
    });
    const countQuery = models.lots.count({ include });

    Promise.all([findAllQuery, countQuery])
      .then(async ([lotsList, count]) => {
        const records = [];
        lotsList.forEach((lot) => {
          let ownerProperty = {
            id: lot.id,
            ownerFirstName: lot.owner.firstName,
            ownerLastName: lot.owner.lastName,
            ownerProperty: lot.building.property.name,
          };
          records.push(ownerProperty);
        });
        const serializedRecords = await recordsSerializer.serialize(records);
        response.send({ ...serializedRecords, meta: { count } });
      })
      .catch((err) => next(err));
  }
);

// Get an owner property
router.get(
  '/ownerProperties/:recordId',
  permissionMiddlewareCreator.details(),
  (request, response, next) => {
    return ownerPropertyGetter(request.params.recordId).then(
      (serializedRecord) => response.send(serializedRecord)
    );
  }
);

module.exports = router;
```

The objects that are serialized to be returned to the UI are constructed as such:

```jsx
lots {
  dataValues: {
    id: 1,
    lotNumber: 1,
    buildingIdKey: 1,
    ownerIdKey: 1,
    owner: owners {
      dataValues: {
		    id: 1,
		    firstName: 'Pete',
		    lastName: 'Maravich',
		    email: 'user@example.com'
	  },
		...
    building: buildings {
      dataValues: {
		    id: 1,
		    name: 'Sevres',
		    addressLine1: '80 rue de Sevres',
		    number: 1,
		    centralHeating: true,
		    propertyIdKey: 1,
				property: properties {
			    dataValues: {
		      id: 1,
		      name: 'Laennec',
		      addressCity: 'Paris',
		      addressLine1: '102 rue de Sevres',
		      numberOfBuildings: 6,
		      status: null
		    },
			...
    }
  },
...
}
```

### Make the smart collection visible and enable the create form

By default, a smart collection newly created is hidden in the UI, does not enable create, update and delete operations and all its fields are set as read only.

To make the collection fully functional in the UI you need to following these steps:

{% embed url="https://www.loom.com/share/b5bdf987cf774c06a8d94808c931cedd?from_recorder=1" %}
