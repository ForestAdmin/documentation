# Display Dwolla customers

<!-- markdown-link-check-disable -->

This example shows you how to create a smart collection to list the customers of your [Dwolla](https://www.dwolla.com/) account.

<!-- markdown-link-check-enable -->

## 1. Define the smart collection

Filterable fields are flagged using `isFilterable: true`. You will need to enable this option using the collection settings in the [Layout Editor](https://docs.forestadmin.com/user-guide/getting-started/master-your-ui/using-the-layout-editor-mode).&#x20;

Customers have `isSearchable` flag enabled: it means the search input field will be activated on the collection UI.

```javascript
// forest/dwolla-customers.js
const { collection } = require('forest-express-sequelize');

collection('dwollaCustomers', {
  isSearchable: true,
  actions: [],
  fields: [
    {
      field: 'id',
      type: 'String',
    },
    {
      field: 'firstName',
      type: 'String',
    },
    {
      field: 'lastName',
      type: 'String',
    },
    {
      field: 'fullName',
      type: 'String',
      get: (customer) => {
        return customer.firstName + ' ' + customer.lastName;
      },
    },
    {
      field: 'type',
      type: 'Enum',
      enums: ['unverified', 'personal', 'business', 'receive-only'],
    },
    {
      field: 'email',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'businessName',
      type: 'String',
      isFilterable: true,
    },
    {
      field: 'created', //created_at
      type: 'Date',
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['unverified', 'suspended', 'retry', 'document', 'verified'],
      isFilterable: true,
    },
    {
      field: 'fundingSources',
      type: ['String'],
      reference: 'dwollaFundingSources.id',
    },
    {
      field: 'transfers',
      type: ['String'],
      reference: 'dwollaTransfers.id',
    },
  ],
  segments: [],
});
```

## 2. Implement the route

The Customers routes implement the Get List and Get One, plus the [smart relationships (HasMany)](https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship#creating-a-hasmany-smart-relationship):

* Funding Sources
* Transfers

These routes use the Dwolla service described in [another section](https://docs.forestadmin.com/woodshop/how-tos/dwolla-integration/dwolla-servive).

```javascript
// routes/customers.js
const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');

const DwollaService = require('../services/dwolla-service');
let dwollaService = new DwollaService(process.env.DWOLLA_APP_KEY, process.env.DWOLLA_APP_SECRET, process.env.DWOLLA_ENVIRONMENT);

const MODEL_NAME = 'dwollaCustomers';

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${MODEL_NAME}`);

// Get a list of Customers
router.get(`/${MODEL_NAME}`, permissionMiddlewareCreator.list(), (request, response, next) => {

  dwollaService.getCustomers(request.query)
  .then(async result => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordsSerialized = await recordSerializer.serialize(result.list);
    response.send({ ...recordsSerialized, meta:{ count: result.count }});
  })
  .catch(next);

});

// Get a Customer
router.get(`/${MODEL_NAME}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getCustomer(recordId)
  .then(async record => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);
  })
  .catch(next);

});

router.get(`/${MODEL_NAME}/:recordId/relationships/fundingSources`, (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getCustomerFundingSources(recordId, request.query)
  .then(async result => {
    const recordSerializer = new RecordSerializer({ name: 'dwollaFundingSources' });
    const recordsSerialized = await recordSerializer.serialize(result.list);
    response.send({ ...recordsSerialized, meta:{ count: result.count }});
  })
  .catch(next);
});

router.get(`/${MODEL_NAME}/:recordId/relationships/transfers`, (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getCustomerTransfers(recordId, request.query)
  .then(async result => {
    const recordSerializer = new RecordSerializer({ name: 'dwollaTransfers' });
    const recordsSerialized = await recordSerializer.serialize(result.list);
    response.send({ ...recordsSerialized, meta:{ count: result.count }});
  })
  .catch(next);
});

module.exports = router;
```
