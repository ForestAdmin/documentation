# Print a status object in a single line field

**Context**: as a user I want to display in a single field all the lines from a status object from a user's record.

Example of a user document:

```jsx
{
    "_id" : ObjectId("5ed65502ade8bf99a79a0be5"),
    "date_added" : ISODate("2020-06-02T14:32:50.360Z"),
    "email" : "demo@emitwise.com",
    "client" : ObjectId("5ec5146d4bd6a122bd5dee25"),
    "first_name" : "Eduardo",
    "last_name" : "Gomez",
    "avatar_link" : "<https://eu.ui-avatars.com/api/?background=ffffff&color=000&name=Eduardo+Gomez>",
    "has_consented_to_cookies" : false,
    "has_seen_reportwise_welcome" : false,
    "user_type" : "pro",
    "is_in_demo_mode" : true,
    "onboarding_progress" : {
        "registered" : true,
        "payment_complete" : false,
        "data_uploaded" : false,
        "location_data_added" : false,
        "data_processed" : false,
        "complete" : false
    }
}
```

`forest/companies.js`

```jsx
const { collection } = require('forest-express-mongoose');
const { customFieldsStyles } = require('../style/fields-style.js');

// This file allows you to add to your Forest UI:
// - Smart actions: <https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions>
// - Smart fields: <https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields>
// - Smart relationships: <https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship>
// - Smart segments: <https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments>
collection('user', {
  actions: [],
  fields: [
    {
      field: 'status',
      type: 'String',
      get: (user) => {
        // check if the user has a subdocument to return
        if (user.onboarding_progress) {
          // list all your fields from the subdocument you want to display
          const fieldsNameList = ['registered',
            'payment_complete',
            'data_uploaded',
            'location_data_added',
            'data_processed',
            'complete'];
          // create empty string which will be filled with a div per field listed above - this string will be the value returned
          let fieldValueList = '';
          // 
          // iterate over the list of fields and add style that will be used to display the subdocument fields
          for (index = 0; index < fieldsNameList.length; index++) {
            const fieldName = fieldsNameList[index];
            let fieldValueStyle = customFieldsStyles.fieldValueStyleRed;
            if (user.onboarding_progress[fieldName] === true) {
              fieldValueStyle = customFieldsStyles.fieldValueStyleGreen;
            }
            // insert the div with the field info to the string that will be returned
            fieldValueList += `<div style="${customFieldsStyles.fieldDivStyle}">
                <span style="${customFieldsStyles.fieldNameStyle}">${fieldName}</span>
                <span style="${fieldValueStyle}">${user.onboarding_progress[fieldName]}</span>
              </div>`;
          }
          return fieldValueList;
        }
      },
    },
    {
      field: 'visualizations',
      type: ['String'],
      reference: 'visualization._id',
    },
  ],
  segments: [],
});
```

`style/fields-style.js`

```javascript
exports.customFieldsStyles = {
  fieldDivStyle: 'margin: 24px 0px; color: #415574',
  fieldNameStyle: 'padding: 6px 16px; margin: 12px; background-color:#b5c8d05e; border-radius: 6px',
  fieldValueStyle: 'padding: 6px 16px; margin: 12px; border-radius: 6px',
  fieldValueStyleRed: 'padding: 6px 12px; background-color:#ff7f7f87; border-radius: 6px',
  fieldValueStyleGreen: 'padding: 6px 12px; background-color:#7FFF7F; border-radius: 6px',
};
```
