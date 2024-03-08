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

# Interact with your Elasticsearch data

### Creating the Smart Collection

Let's take a simple example from Kibana, we will use [a set of fictitious accounts with randomly generated data.](https://download.elastic.co/demos/kibana/gettingstarted/accounts.zip) You can easily import the data using Kibana Home page section **Ingest your data**.

When it's done we can start looking at how to play with those data in Forest Admin.

{% tabs %}
{% tab title="forest-express-sequelize" %}
First, we declare the `bank-accounts` collection in the `forest/` directory. In this Smart Collection, all fields are related to document mapping attributes except the field `id` that is computed using the document `_id`.&#x20;

You can check out the list of [available field options](https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields#available-field-options) if you need them.

{% hint style="warning" %}
You **MUST** declare an `id` field when creating a Smart Collection. The value of this field for each record **MUST** be unique. On the following example, we simply use the UUID provided on every Elasticsearch documents.
{% endhint %}

{% code title="/forest/bank-accounts.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

collection('bank-accounts', {
  isSearchable: false,
  fields: [
    {
      field: 'id',
      type: 'string',
    },
    {
      field: 'account_number',
      type: 'Number',
      isFilterable: true,
    },
    {
      field: 'address',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'firstname',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'lastname',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'age',
      type: 'Number',
      isFilterable: true,
    },
    {
      field: 'balance',
      type: 'Number',
      isFilterable: true,
    },
    {
      field: 'city',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'employer',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'email',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'gender',
      type: 'Enum',
      isFilterable: true,
      enums: ['M', 'F'],
    },
    {
      field: 'state',
      type: 'String',
      isFilterable: true,
    },
  ],
});
```

{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can add the option `isSearchable: true` to your collection to display the search bar. Note that you will have to implement the search yourself by including it into your own `GET` logic.
{% endhint %}

### Implementing the routes

It's not an easy job to connect several data sources in the same structure. To accommodate you in this journey we already provide you a simple service [`ElasticsearchHelper`](https://docs.forestadmin.com/woodshop/how-tos/create-a-smart-collection-with-elasticsearch/elasticsearch-service-utils) that handles all the logic to connect with your Elasticsearch data.

\
Before getting further, in order to search your data using filters, we need to define the Elasticsearch configuration.

| Name             | Type             | Description                                                                                                                                                                                                     |
| ---------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| index            | string           | The name of your Elasticsearch index.                                                                                                                                                                           |
| filterDefinition | string           | Type of your Elasticsearch fields. Can be `number`, `date`, `text`,`keyword`                                                                                                                                    |
| sort             | array of objects | (optional) Required only to sort your data. [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/7.12/sort-search-results.html) `Example: [ { createdAt: { order: 'desc' } }]` |
| mappingFunction  | function         | (optional) Required only to modify the data retrieved from Elasticsearch. `Example: (id, source) => { id,  ...source}`                                                                                          |

{% code title="/routes/bank-accounts.js" %}

```javascript
const express = require('express');
const router = express.Router();

const {
  RecordSerializer,
  RecordCreator,
  RecordsGetter,
  RecordUpdater,
  PermissionMiddlewareCreator,
} = require('forest-express-sequelize');

const ElasticsearchHelper = require('../service/elasticsearch-helper');
const { FIELD_DEFINITIONS } = require('../utils/filter-translator');

const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'bank-accounts'
);

const configuration = {
  index: 'bank-accounts',
  filterDefinition: {
    account_number: FIELD_DEFINITIONS.number,
    address: FIELD_DEFINITIONS.keyword,
    age: FIELD_DEFINITIONS.number,
    balance: FIELD_DEFINITIONS.number,
    city: FIELD_DEFINITIONS.keyword,
    email: FIELD_DEFINITIONS.keyword,
    employer: FIELD_DEFINITIONS.keyword,
    firstname: FIELD_DEFINITIONS.keyword,
    lastname: FIELD_DEFINITIONS.keyword,
    employer: FIELD_DEFINITIONS.keyword,
    state: FIELD_DEFINITIONS.keyword,
    gender: FIELD_DEFINITIONS.keyword,
  },
};

const elasticsearchHelper = new ElasticsearchHelper(configuration);

// Routes implementation

module.exports = router;
```

{% endcode %}

{% hint style="info" %}
Our custom filter translator only support `number`, `keyword`, `text`, `date` data types. Nonetheless, you can implement more filter mapper type in the`utils/filter-translator.js`
{% endhint %}

### Implementing the GET (all records)

In the file `routes/bank-accounts.js`, we’ve created a new route to implement the API behind the Smart Collection.

The logic here is to list all the BankAccount records. We use a custom service `service/elasticsearch-helper.js` for this example. The implementation code of this service is available here.

Finally, the last step is to serialize the response data in the expected format which is simply a standard [JSON API](http://jsonapi.org/) document. You are lucky `forest-express-sequelize` already does this for you using the RecordSerializer.

{% code title="/routes/bank-accounts.js" %}

```javascript
// Imports and ElasticsearchHelper base definition ...

router.get('/bank-accounts', async (request, response, next) => {
  try {
    const pageSize = Number(request?.query?.page?.size) || 20;
    const page = Number(request?.query?.page?.number) || 1;
    // search is not handle in this example
    // const search = request.query?.search;
    const options = { timezone: request.query?.timezone };

    let filters;
    try {
      filters = request.query?.filters && JSON.parse(request.query.filters);
    } catch (e) {
      filters = undefined;
    }

    const result = await elasticsearchHelper.functionSearch({
      page,
      pageSize,
      filters: filters || undefined,
      options,
    });

    const serializer = new RecordSerializer({ name: 'bank-accounts' });

    response.send({
      ...(await serializer.serialize(result.results)),
      meta: {
        count: result.count,
      },
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
```

{% endcode %}

### Implementing the GET (a specific record)

To access the details view of a Smart Collection record, you have to catch the GET API call on a specific record. One more time, we use a custom service that encapsulates the Elasticsearch business logic for this example.

{% code title="/routes/bank-accounts.js" %}

```javascript
// Imports and ElasticsearchHelper base definition ...

router.get('/bank-accounts/:id', async (request, response, next) => {
  try {
    const bankAccount = await elasticsearchHelper.getRecord(request.params.id);
    const serializer = new RecordSerializer({ name: 'bank-accounts' });

    response.send(await serializer.serialize(bankAccount));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
```

{% endcode %}

### Implementing the PUT

To handle the update of a record we have to catch the PUT API call.&#x20;

{% code title="/routes/bank-accounts.js" %}

```javascript
// Imports and ElasticsearchHelper base definition ...

router.put(
  '/bank-accounts/:id',
  permissionMiddlewareCreator.update(),
  (request, response, next) => {
    const updater = new RecordUpdater(
      { name: 'bank-accounts' },
      req.user,
      req.query
    );

    updater
      .deserialize(request.body)
      .then((recordToUpdate) =>
        elasticsearchHelper.updateRecord(recordToUpdate)
      )
      .then((record) => updater.serialize(record))
      .then((recordSerialized) => response.send(recordSerialized))
      .catch(next);
  }
);

module.exports = router;
```

{% endcode %}

### Implementing the DELETE

Now we are able to see all the bank accounts on Forest Admin, it’s time to implement the DELETE HTTP method in order to remove the documents on Elasticsearch when the authorized user needs it.

#### Delete a list a single record

{% tabs %}
{% tab title="forest-express-sequelize" %}
{% code title="/routes/bank-accounts.js" %}

```javascript
// Imports and ElasticsearchHelper base definition ...

router.delete(
  '/bank-accounts/:id',
  permissionMiddlewareCreator.delete(),
  async (request, response, next) => {
    try {
      await elasticsearchHelper.removeRecord(request.params.id);
      response.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
```

{% endcode %}
{% endtab %}
{% endtabs %}

#### Delete a list of records

{% tabs %}
{% tab title="forest-express-sequelize" %}
{% code title="/routes/bank-accounts.js" %}

```javascript
// Imports and ElasticsearchHelper base definition ...

router.delete(
  '/bank-accounts',
  permissionMiddlewareCreator.delete(),
  async (request, response, next) => {
    const getter = new RecordsGetter(
      { name: 'bank-accounts' },
      request.user,
      request.query
    );
    const ids = await getter.getIdsFromRequest(request);

    try {
      await elasticsearchHelper.removeRecords(ids);
      response.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
```

{% endcode %}
{% endtab %}
{% endtabs %}

### Implementing the POST

To create a record we have to catch the POST API call.&#x20;

{% tabs %}
{% tab title="forest-express-sequelize" %}
{% code title="/routes/bank-accounts.js" %}

```javascript
// Imports and ElasticsearchHelper base definition ...

router.post(
  '/bank-accounts',
  permissionMiddlewareCreator.create(),
  (request, response, next) => {
    const recordCreator = new RecordCreator(
      { name: 'bank-accounts' },
      request.user,
      request.query
    );

    recordCreator
      .deserialize(request.body)
      .then((recordToCreate) =>
        elasticsearchHelper.createRecord(recordToCreate)
      )
      .then((record) => recordCreator.serialize(record))
      .then((recordSerialized) => response.send(recordSerialized))
      .catch(next);
  }
);

module.exports = router;
```

{% endcode %}
{% endtab %}
{% endtabs %}
