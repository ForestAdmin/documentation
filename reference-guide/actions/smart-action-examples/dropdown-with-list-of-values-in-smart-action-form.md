# Dropdown with list of values in smart action form

**Context**: Within a smart action form, I want to enable my users to choose the value of an input field within a set of predefined values.

![](<../../../.gitbook/assets/image (522).png>)

Here I have a smart action called `change status` for the collection `companies`. I want users to be able to only select the new status from a list of possible options.

`forest/companies.js`

```javascript
const { collection } = require('forest-express-sequelize');

collection('companies', {
  actions: [
    {
      name: 'Change status',
      type: 'single',
      fields: [{
        field: 'New status',
        type: 'Enum',
        isRequired: true,
        enums: ['Pending', 'Live'],
      }],
    },
  ],
  fields: [],
  segments: [],
});
```
