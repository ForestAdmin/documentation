# Display field with complex info in html format (rich text editor)

{% embed url="https://recordit.co/nPSUe2ogXu" %}

## First step: Display through html

Create a smart field that will return a string containing the html formatted data (here the features name and if they are enabled or not).

This smart field will be declared at the level of the account collection (as we want features status to be visible for each account). The file where the smart field should be declared is contained in a folder forest and should be `forest/accounts.js`

The logic is to add for each feature a new div which includes an element containing the name and an element conditionally formatted (green or red) containing the value true of false.

In order to do that you need to list the fields to iterate on to add the html elements.

```jsx
fields: [{
    field: 'display rights',
    type:  'String',
    get: (account) => {

      //check if the movie has a related characteristics record to return smtg or not
      if (account.right) {

        // list all your fields from the movie_characteristics collection you want to display
        const rightsNameList = ["feature1", "feature2"];

        // create empty string which will be filled with a div per field listed above - this string will be the value returned
        let rightsList = ""

        // add style that will be used to display the movie_characteristics info
        const rightsDivStyle = 'margin: 24px 0px; color: #415574'
        const rightsNameStyle = 'padding: 6px 16px; margin: 12px; background-color:#b5c8d05e; border-radius: 6px'
        const rightsValueStyleRed = 'padding: 6px 12px; background-color:#ff7f7f87; border-radius: 6px'
        const rightsValueStyleGreen = 'padding: 6px 12px; background-color:#7FFF7F; border-radius: 6px'

        // iterate over the list of movie characteristics fields
        for (index = 0; index < rightsNameList.length; index++) {
          const fieldName = rightsNameList[index]
          let rightsValueStyle = rightsValueStyleRed
          if (account.right[fieldName] === true) {
            rightsValueStyle = rightsValueStyleGreen
          }
          // insert the div with the field info to the string that will be returned
          rightsList += `<div style="${rightsDivStyle}">
              <span style="${rightsNameStyle}">${fieldName}</span>
              <span style="${rightsValueStyle}">${account.right[fieldName]}</span>
            </div>`
        }
        return rightsList
      }
    }
  }],
```

## Second step: Update through a smart action

Then to edit, create a smart action (in the same file) that will open a form with an input for each feature to update (prefilled with the current value)

```jsx
actions:[{
    name: 'update rights',
    type: 'single',
    fields: [{
      field: 'feature1',
      type: 'Boolean',
      description: 'insert value to update field',
    },{
      field: 'feature2',
      type: 'Boolean',
      description: 'insert value to update field',
    }],
    values: (context) => {
      async function getRights(context){
        // wait until you fetch the movie record - IMPORTANT do not forget to include the hasone relationship with the movie characteristics table
        let account = await models.accounts.findByPk(context.id, {include:[{model: models.rights}]})
        return account.right
      }
      // Forest will automatically match all of the form fields that have the same name as your movie characteristics fields and prefill with their value
      return getRights(context)
    }
  }],
```

Then define what happens when the form is sent and the route is called. The route needs to be defined in a file `routes/accounts.js`.

You need to get account object and update each field for which a new value has been passed with the relevant value.

{% hint style="warning" %}
The refresh relationship part is needed to refresh the data displayed without having to refresh manually
{% endhint %}

```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const models = require('../models');



router.post('/actions/update-rights', Liana.ensureAuthenticated, (req, res) => {
  let accountId = req.body.data.attributes.ids[0];
  console.log(accountId)
  let fieldList = req.body.data.attributes.values;
  console.log(fieldList)
  return models.accounts
    .findByPk(accountId, {include:[{model: models.rights}]})
    .then((account) => {
      for (var key in fieldList) {
        let fieldValue = fieldList[key]
        account.right.update({ [key]: fieldValue })
      }
      res.send({
        success: 'Characteristics updated',
        refresh: { relationships: ['accounts','rights']},
      })
    });
});

module.exports = router;
```
