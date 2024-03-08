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

# Azure Table Storage

{% hint style="success" %}
This How to is based on the [Medium article](https://avarnon.medium.com/exposing-azure-table-storage-through-forest-admin-2d601752f9b1) by [Andrew Varnon](https://avarnon.medium.com/)
{% endhint %}

The implementation is done using a [Smart Collection](https://docs.forestadmin.com/documentation/reference-guide/collections/create-a-smart-collection) and a CRUD service that will wrap the [Azure Table Storage API](https://docs.microsoft.com/en-us/rest/api/storageservices/table-service-rest-api).

### The Table Storage Definition

You can use the new [Azure Data Explorer](https://azure.microsoft.com/en-us/services/data-explorer/) to create and populate a Table Storage in your [Azure Storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview).&#x20;

![](<../../.gitbook/assets/image (515).png>)

In our example, we are going to use the Table Customers with the fields:

- **Id**: PartitionKey + RowKey
- **Timestamp** (updated at)
- **Email** as String
- **FirstName** as String
- **LastName** as String

### Install Azure `data-tables` package

```haskell
npm install @azure/data-tables --save
```

### Smart Collection definition

```javascript
const { collection } = require('forest-express-sequelize');

collection('customers', {
  fields: [
    {
      field: 'id',
      type: 'String',
      get: (customer) => `${customer.partitionKey}|${customer.rowKey}`,
    },
    {
      field: 'partitionKey',
      type: 'String',
    },
    {
      field: 'rowKey',
      type: 'String',
    },
    {
      field: 'timestamp',
      type: 'Date',
    },
    {
      field: 'Email',
      type: 'String',
    },
    {
      field: 'LastName',
      type: 'String',
    },
    {
      field: 'FirstName',
      type: 'String',
    },
  ],
});
```

### The Azure Data Tables Service Wrapper

```javascript
const { TableClient } = require('@azure/data-tables');

const getClient = (tableName) => {
  const client = TableClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    tableName
  );
  return client;
};

const azureTableStorageService = {
  deleteEntityAsync: async (tableName, partitionKey, rowKey) => {
    const client = getClient(tableName);
    await client.deleteEntity(partitionKey, rowKey);
  },

  getEntityAsync: async (tableName, partitionKey, rowKey) => {
    const client = getClient(tableName);
    return client.getEntity(partitionKey, rowKey);
  },

  listEntitiesAsync: async (tableName, options) => {
    const client = getClient(tableName);
    var azureResponse = await client.listEntities();

    let iterator = await azureResponse.byPage({
      maxPageSize: options.pageSize,
    });

    for (let i = 1; i < options.pageNumber; i++) iterator.next(); // Skip pages

    let entities = await iterator.next();
    let records = entities.value.filter((entity) => entity.etag);

    // Load an extra page if we need to allow (Next Page)
    const entitiesNextPage = await iterator.next();
    let nbNextPage = 0;
    if (entitiesNextPage && entitiesNextPage.value) {
      nbNextPage = entitiesNextPage.value.filter(
        (entity) => entity.etag
      ).length;
    }

    // Azure Data Tables does not provide a row count.
    // We just inform the user there is a new page with at least x items
    const minimumRowEstimated =
      (options.pageNumber - 1) * options.pageSize + records.length + nbNextPage;

    return { records, count: minimumRowEstimated };
  },

  createEntityAsync: async (tableName, entity) => {
    const client = getClient(tableName);
    delete entity['__meta__'];
    await client.createEntity(entity);
    return client.getEntity(entity.partitionKey, entity.rowKey);
  },

  updateEntityAsync: async (tableName, entity) => {
    const client = getClient(tableName);
    await client.updateEntity(entity, 'Replace');
    return client.getEntity(entity.partitionKey, entity.rowKey);
  },
};

module.exports = azureTableStorageService;
```

### Routes definition

```javascript
const express = require('express');
const {
  PermissionMiddlewareCreator,
  RecordCreator,
  RecordUpdater,
} = require('forest-express');
const { RecordSerializer } = require('forest-express');

const router = express.Router();

const COLLECTION_NAME = 'customers';
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  COLLECTION_NAME
);
const recordSerializer = new RecordSerializer({ name: COLLECTION_NAME });

const azureTableStorageService = require('../services/azure-table-storage-service');

// Get a list of Customers
router.get(
  `/${COLLECTION_NAME}`,
  permissionMiddlewareCreator.list(),
  async (request, response, next) => {
    const pageSize = parseInt(request.query.page.size) || 15;
    const pageNumber = parseInt(request.query.page.number);

    azureTableStorageService
      .listEntitiesAsync(COLLECTION_NAME, { pageSize, pageNumber })
      .then(async ({ records, count }) => {
        const recordsSerialized = await recordSerializer.serialize(records);
        response.send({ ...recordsSerialized, meta: { count } });
      })
      .catch((e) => {
        console.error(e);
        next(e);
      });
  }
);

// Get a Customer
router.get(
  `/${COLLECTION_NAME}/:recordId`,
  permissionMiddlewareCreator.details(),
  async (request, response, next) => {
    const parts = request.params.recordId.split('|');
    azureTableStorageService
      .getEntityAsync(COLLECTION_NAME, parts[0], parts[1])
      .then((record) => recordSerializer.serialize(record))
      .then((recordSerialized) => response.send(recordSerialized))
      .catch((e) => {
        console.error(e);
        next(e);
      });
  }
);

// Create a Customer
router.post(
  `/${COLLECTION_NAME}`,
  permissionMiddlewareCreator.create(),
  async (request, response, next) => {
    const recordCreator = new RecordCreator(
      { name: COLLECTION_NAME },
      request.user,
      request.query
    );
    recordCreator
      .deserialize(request.body)
      .then((recordToCreate) => {
        return azureTableStorageService.createEntityAsync(
          COLLECTION_NAME,
          recordToCreate
        );
      })
      .then((record) => recordSerializer.serialize(record))
      .then((recordSerialized) => response.send(recordSerialized))
      .catch((e) => {
        console.error(e);
        next(e);
      });
  }
);

// Update a Customer
router.put(
  `/${COLLECTION_NAME}/:recordId`,
  permissionMiddlewareCreator.update(),
  async (request, response, next) => {
    const parts = request.params.recordId.split('|');
    const recordUpdater = new RecordUpdater(
      { name: COLLECTION_NAME },
      request.user,
      request.query
    );
    recordUpdater
      .deserialize(request.body)
      .then((recordToUpdate) => {
        recordToUpdate.partitionKey = parts[0];
        recordToUpdate.rowKey = parts[1];
        return azureTableStorageService.updateEntityAsync(
          COLLECTION_NAME,
          recordToUpdate
        );
      })
      .then((record) => recordSerializer.serialize(record))
      .then((recordSerialized) => response.send(recordSerialized))
      .catch((e) => {
        console.error(e);
        next(e);
      });
  }
);

// Delete a list of Customers
router.delete(
  `/${COLLECTION_NAME}`,
  permissionMiddlewareCreator.delete(),
  async (request, response, next) => {
    try {
      for (const key of request.body.data.attributes.ids) {
        const parts = key.split('|');
        await azureTableStorageService.deleteEntityAsync(
          COLLECTION_NAME,
          parts[0],
          parts[1]
        );
      }
      response.status(204).send();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

module.exports = router;
```
