{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Add an HTML credit card as a smart field in a summary view

![](<../../../.gitbook/assets/image (520).png>)

**Context:** As a user I want to display the credit card infos of a client in a nice and visual way

`forest/companies.js`

```jsx
const { collection } = require('forest-express-sequelize');
const { companies, documents } = require('../models');

// This file allows you to add to your Forest UI:
// - Smart actions: <https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions>
// - Smart fields: <https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields>
// - Smart relationships: <https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship>
// - Smart segments: <https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments>
collection('companies', {
  actions: [],
  fields: [
  {
    field: "Creditcard",
    type: "String",
    get: (company) => {
      if (company.creditCard) {
        return `<div class="card-wrapper">
              <div class="card-container" style="font-size: 14px; border-radius: 10px; width: 250px; height: 140px; background-color: #444857; color: white; padding: 10px">
                <div class="card-number-container" style="margin-top: 5px">
                    <div class="card-info-title" style="color: #9399af; ">card number</div>
                    <div class="card-info-value" style="font-size: 12px">${company.creditCard.card_number.match(/.{1,4}/g).join(' ')}</div>
                </div>
                <div class="card-name-date-container" style= "display: flex; margin-top: 20px">
                  <div class="card-name-container">
                    <div class="card-info-title" style="color: #9399af; ">card holder</div>
                    <div class="card-info-value" style="font-size: 12px">${company.creditCard.card_holder ? company.creditCard.card_holder : company.name}</div>
                  </div>
                  <div class="card-date-container" style="margin: auto">
                    <div class="card-info-title" style="color: #9399af; ">expires at</div>
                    <div class="card-info-value" style="font-size: 12px">${company.creditCard.expiry_date}</div>
                  </div>
                </div>
              </div>
            </div>`
      }

    },
  },
 ],
  segments: [],

});
```

Use the rich text editor widget in order to interpret HTML in your field.

![](<../../../.gitbook/assets/image (489).png>)
