{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Link users and Dwolla customers

The implementation of this [smart relationship (belongsTo](../../models/relationships/create-a-smart-relationship/#creating-a-belongsto-smart-relationship)) relies on a Dwolla service that will retrieve the Dwolla customer based on the user's email. The Dwolla service is described in [another section](dwolla-service.md).

```javascript
// forest/users.js
const { collection } = require('forest-express-sequelize');

const DwollaService = require('../services/dwolla-service');
let dwollaService = new DwollaService(process.env.DWOLLA_APP_KEY, process.env.DWOLLA_APP_SECRET, process.env.DWOLLA_ENVIRONMENT);

collection('users', {
  actions: [],
  fields: [
    {
      field: 'dwollaCustomer',
      type: 'String',
      reference: 'dwollaCustomers.id',
      get: function (user) {
        return dwollaService.getCustomerSmartRelationship(user);
      }
    },
  ],
  segments: [],
});
```
