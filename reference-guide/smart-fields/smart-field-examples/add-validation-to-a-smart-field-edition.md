# Add validation to a smart field edition

**Context**: I want to make sure that my users can only enter a value satisfying a certain set of conditions when editing a smart field.

Here I'm working on a collection `customers` and the smart field `'must-be-kuku'` should only accept the value `kuku`.

{% embed url="https://www.loom.com/share/22641b6c62d9469ea244e12b4557f02e" %}

`forest/customers.js`

```jsx
const { collection } = require('forest-express-sequelize');
const models = require('../models');

// This file allows you to add to your Forest UI:
// - Smart actions: <https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions>
// - Smart fields: <https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields>
// - Smart relationships: <https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship>
// - Smart segments: <https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments>
collection('customers', {
  actions: [
  ],
  fields: [
    {
      field: 'must-be-kuku',
      type: 'String',
      get (customer) {
        return 'kuku';
      },
      set (customer, value) {},
    },
  ],
  segments: [
  ],
});
```

At the route level I need to check the user input from the edit form in the UI and check the value that has been entered into the field `'must-be-kuku'`.

`routes/customers.js`

```javascript
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { customers } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('customers');

// Update a Customer
router.put('/customers/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  if (request.body.data.attributes['must-be-kuku'] !== 'kuku') {
    return response.status(403).send('should have been kuku!');
  }
  next();
});

module.exports = router;
```
