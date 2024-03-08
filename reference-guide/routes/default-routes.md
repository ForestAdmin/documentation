---
description: >-
  ⚠️ This page is relevant only if you installed Forest Admin directly on a
  database (SQL/Mongodb). If you installed in a Rails app, the default routes
  are managed within your Rails app.
---

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

# Default routes

Forest Admin's default routes are generated in the `routes` folder at installation.

Below we've detailed what the `next()` statement does. Those snippets can be used when overriding those routes, as explained [here](override-a-route.md).

### Create a record

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordCreator,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Create a Company - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
router.post('/companies', permissionMiddlewareCreator.create(), (request, response, next) => {
  const { body, query, user } = request;
  const recordCreator = new RecordCreator(companies, user, query);

  recordCreator.deserialize(body)
    .then(recordToCreate => recordCreator.create(recordToCreate))
    .then(record => recordCreator.serialize(record))
    .then(recordSerialized => response.send(recordSerialized))
    .catch(next);
});

...
```

{% endcode %}

### Update a record

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordUpdater,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Update a Company - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
router.put('/companies/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  const { body, params, query, user } = request;
  const recordUpdater = new RecordUpdater(companies, user, query);

  recordUpdater.deserialize(body)
    .then(recordToUpdate => recordUpdater.update(recordToUpdate, params.recordId))
    .then(record => recordUpdater.serialize(record))
    .then(recordSerialized => response.send(recordSerialized))
    .catch(next);
});

...
```

{% endcode %}

{% hint style="info" %}
Note that the **update** of `belongsTo` fields is managed by [another route](default-routes.md#relationship-routes).
{% endhint %}

### Delete a record

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordRemover,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Delete a Company - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
router.delete('/companies/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  const { params, query, user } = request;
  const recordRemover = new RecordRemover(companies, user, query);

  recordRemover.remove(params.recordId)
    .then(() => response.status(204).send())
    .catch(next);
});

...
```

{% endcode %}

### Get a list of records

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordsGetter,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Get a list of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
router.get('/companies', permissionMiddlewareCreator.list(), (request, response, next) => {
  const { query, user } = request;
  const recordsGetter = new RecordsGetter(companies, user, query);

  recordsGetter.getAll()
    .then(records => recordsGetter.serialize(records))
    .then(recordsSerialized => response.send(recordsSerialized))
    .catch(next);
});

...
```

{% endcode %}

### Get a number of records

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordsCounter,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Get a number of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
router.get('/companies/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  const { query, user } = request;
  const recordsCounter = new RecordsCounter(companies, user, query);

  recordsCounter.count(request.query)
    .then(count => response.send({ count }))
    .catch(next);
});

...
```

{% endcode %}

### Get a record

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordGetter,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Get a Company - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
router.get('/companies/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  const { params, query, user } = request;
  const recordGetter = new RecordGetter(companies, user, query);

  recordGetter.get(params.recordId)
    .then(record => recordGetter.serialize(record))
    .then(recordSerialized => response.send(recordSerialized))
    .catch(next);
});

```

{% endcode %}

### Export a list of records

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordsExporter,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Export a list of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
router.get('/companies.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  const { query, user } = request;
  const recordsExporter = new RecordsExporter(companies, user, query);

  recordsExporter
    .streamExport(response)
    .catch(next);
});
```

{% endcode %}

### Delete a list of records

{% code title="/routes/companies.js" %}

```javascript
...

const {
  PermissionMiddlewareCreator,
  RecordsRemover,
} = require('forest-express-sequelize');
const { companies } = require('../models');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

...

// Delete a list of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
router.delete('/companies', permissionMiddlewareCreator.delete(), (request, response, next) => {
  const { query, user } = request;

  const recordsGetter = new RecordsGetter(companies, user, query);
  const recordsRemover = new RecordsRemover(companies, user, query);

  recordsGetter.getIdsFromRequest(request)
    .then((ids) => recordsRemover.remove(ids))
    .then(() => response.status(204).send())
    .catch(next);
});
```

{% endcode %}

### Other available routes

Some other routes exist but are not generated automatically because it's less likely that you'll need to extend or override them.

Here is the list:

#### Relationship routes

**GET** /forest/{modelName}/{id}/relationships/{hasManyRelationName}\
⟶ **List** has many relationships

**GET** /forest/{modelName}/{id}/relationships/{hasManyRelationName}/count\
⟶ **Count** has many relationships

**PUT** /forest/{modelName}/{id}/relationships/{belongsToRelationName}\
⟶ **Update** a belongs to field

**POST** /forest/{modelName}/{id}/relationships/{hasManyRelationName}\
⟶ **Add** existing records to has many relationship

**GET** /forest/{modelName}/{id}/relationships/{hasManyRelationName}.csv\
⟶ **Export** all has many relationships

**PUT** /forest/{modelName}/{id}/relationships/{embeddedRelationName}/{index}\
⟶ **Update** an embedded document (inside a list)

**DELETE** /forest/{modelName}/{id}/relationships/{hasManyRelationName}\
⟶ **Dissociate** records from relations

#### Action routes

**POST** /forest/actions/{actionNameDasherized}/values\
⟶ **Get** the default values for this action
