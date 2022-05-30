# Display Dwolla transfers

This example shows you how to create a smart collection to list the transfers of your [Dwolla](https://www.dwolla.com/) account.

## 1. Define the smart collection <a href="#requirements" id="requirements"></a>

Filterable fields are flagged using `isFilterable: true`. You will need to enable this option using the collection settings in the [Layout Editor](https://docs.forestadmin.com/documentation/reference-guide/views/using-the-layout-editor-mode).&#x20;

Transfers have the  `onlyForRelationships` enabled: it means that these 2 collections are only accessible via the Dwolla customer relationships.

```javascript
// forest/dwolla-transfers.js
const { collection } = require('forest-express-sequelize');

collection('dwollaTransfers', {
  onlyForRelationships: true,
  isSearchable: true,
  actions: [],
  fields: [
    {
      field: 'id', 
      type: 'String',
      isSortable: true,
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['processed', 'pending', 'cancelled', 'failed'],
      isFilterable: true,
    },
    {
      field: 'amount',
      type: 'Json', 
    },
    {
      field: 'amountReadable',
      type: 'String',
      get: (transfer) =>{
        if (!transfer.amount) return null;
        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: transfer.amount.currency,        
          // These options are needed to round to whole numbers if that's what you want.
          //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
          //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        return formatter.format(transfer.amount.value);
      }
    },
    {
      field: 'metadata',
      type: 'Json',        
    },    
    {
      field: 'clearing',
      type: 'Json',        
    },
    {
      field: 'clearing',
      type: 'Json',        
    },
    {
      field: 'achDetails',
      type: 'Json',
    },
    {
      field: 'correlationId',
      type: 'String',
      isFilterable: true,
    },    
    {
      field: 'individualAchId',
      type: 'String',
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

## 2. Implement the route <a href="#requirements" id="requirements"></a>

This route use the Dwolla service described in [another section](dwolla-service.md).

```javascript
// routes/transfers.js
const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');

const DwollaService = require('../services/dwolla-service');
let dwollaService = new DwollaService(process.env.DWOLLA_APP_KEY, process.env.DWOLLA_APP_SECRET, process.env.DWOLLA_ENVIRONMENT);

const MODEL_NAME = 'dwollaTransfers';

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${MODEL_NAME}`);

// Get a Transfer
router.get(`/${MODEL_NAME}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getTransfer(recordId)
  .then(async record => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);
  })
  .catch(next);

});

module.exports = router;
```
