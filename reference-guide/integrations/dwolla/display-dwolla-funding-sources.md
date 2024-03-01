{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Display Dwolla funding sources

## 1. Define the smart collection

Filterable fields are flagged using `isFilterable: true`. You will need to enable this option using the collection settings in the [Layout Editor](https://docs.forestadmin.com/user-guide/getting-started/master-your-ui/using-the-layout-editor-mode).&#x20;

Funding Sources have the  `onlyForRelationships` enabled: it means that these 2 collections are only accessible via the Dwolla customer relationships.

```javascript
// forest/dwolla-funding-sources.js
const { collection } = require('forest-express-sequelize');

collection('dwollaFundingSources', {
  onlyForRelationships: true,
  actions: [],
  fields: [
    {
      field: 'id',
      type: 'String',
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['unverified', 'verified']
    },
    {
      field: 'type',
      type: 'Enum',
      enums: ['bank', 'balance']
    },
    {
      field: 'bankAccountType',
      type: 'Enum',
      enums: ['checking', 'savings', 'general-ledger', 'loan']
    },
    {
      field: 'name',
      type: 'String',
    },
    {
      field: 'balance',
      type: 'Json',
    },
    {
      field: 'balanceReadable',
      type: 'String',
      get: (fundingSource) =>{
        if (!fundingSource.balance) return null;
        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: fundingSource.balance.currency,
        });
        return formatter.format(fundingSource.balance.value);
      }
    },
    {
      field: 'removed',
      type: 'Boolean',
    },
    {
      field: 'channels',
      type: ['String'],
    },
    {
      field: 'bankName',
      type: 'String',
    },
    {
      field: 'fingerprint',
      type: 'String',
    },
    {
      field: 'created', //created_at
      type: 'Date',
    },
  ],
  segments: [],
});
```

## 2. Implement the route

This route use the Dwolla service described in [another section](dwolla-service.md).

```javascript
// routes/funding-sources.js
const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');

const DwollaService = require('../services/dwolla-service');
let dwollaService = new DwollaService(process.env.DWOLLA_APP_KEY, process.env.DWOLLA_APP_SECRET, process.env.DWOLLA_ENVIRONMENT);

const MODEL_NAME = 'dwollaFundingSources';

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${MODEL_NAME}`);

// Get a FundingSource
router.get(`/${MODEL_NAME}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getFundingSource(recordId)
  .then(async record => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);
  })
  .catch(next);

});

module.exports = router;
```
