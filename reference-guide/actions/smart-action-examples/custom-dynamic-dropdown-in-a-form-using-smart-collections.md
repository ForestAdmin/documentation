{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Custom dynamic dropdown in a form using smart collections

**Context**: I want my users to be able to select an input within a list computed dynamically depending on the current record.

In this example I have a custom action called `report transaction` applicable to records from a `companies` model. I want to allow users to select some information coming from the `transaction` table from a dropdown. The information should be computed from transactions that belong to the current company.

{% embed url="https://www.loom.com/share/0162ee07cc7c4b19b98b6973888dd04c" %}

This cannot be handled properly with the current features of custom action forms. However, you can add an input field that points to a virtual collection. As users can perform a dynamic search on this collection, you can catch the search input and use to build the virtual collection records returned.

In our example, the user needs to enter the id of the record on which the action is triggered to build the selection.

### Custom action definition

Within the custom action, we add a field referencing the custom collection `transactionsInfo`.

`forest/companies.js`

```jsx
const { collection } = require('forest-express-sequelize');

collection('companies', {
  actions: [
    {
      name: 'Report transaction',
      type: 'single',
      fields: [{
        field: 'transaction info',
        description: 'enter company id',
        reference: 'transactionsInfo',
      }],
    },
  ],
  fields: [],
  segments: [],
});
```

### Virtual collection definition

The custom collection `transactionsInfo` includes an `id` field and an `info` field which includes the information we want the users to be able to select and that will be used in the custom action logic.

`forest/transaction-info.js`

```jsx
const { collection } = require('forest-express-sequelize');

collection('transactionsInfo', {
  fields: [{
    field: 'id',
    type: 'Number',
  }, {
    field: 'info',
    type: 'String',
  }],
});
```

### Virtual collection implementation

`routes/transactions-info.js`

```javascript
const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');
const { companies, transactions } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('transactionsInfo');
const recordSerializer = new RecordSerializer({ name: 'transactionsInfo' });

router.get('/transactionsInfo', permissionMiddlewareCreator.list(), async (request, response, next) => {
  // get the current record from the id entered as an input
  let company = null;
  try {
    company = await companies.findByPk(request.query.search);
  } catch (error) {
    return {};
  }
  // based on the record, trigger the logic to build the selection to be proposed
  // here we get info from the related transactions and build transactionsInfo records from them
  const companyTransactions = await transactions.findAll({
    where: { beneficiary_company_id: company.id },
  });
  const selection = [];
  companyTransactions.forEach((transaction) => {
    const record = {
      id: transaction.id,
      info: `ref ${transaction.reference} - amount ${transaction.amount} USD`,
    };
    selection.push(record);
  });
  return recordSerializer.serialize(selection)
    .then((recordsSerialized) => {
      response.send(recordsSerialized);
    });
});

module.exports = router;
```
