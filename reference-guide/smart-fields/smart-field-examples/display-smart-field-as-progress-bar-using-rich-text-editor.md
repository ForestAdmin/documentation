{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Display smart field as progress bar using rich text editor

{% embed url="https://recordit.co/C86PbaN8Uy" %}

```javascript
const Liana = require('forest-express-sequelize');
const models = require('../models/');
const express = require('express');
const router = express.Router();

Liana.collection('orders', {

  fields: [{
    field: "progressBar",
    type: "String",
    get: (order) => {
      //set your value and max value
      var progressValue = yourProgressValue;
      var maxValue = yourMaxValue;
      var percentage = (progressValue / maxValue) * 100;
      return `<div style='position:relative;'><span style='text-align:left; width:100%;'>0</span><span style='text-align:right; width:100%; position:absolute;'>${maxValue}</span><meter min='0' low='40' high='80' max='${maxValue}' value='${progressValue}' style='width:100%'></meter><br><span style='width:10%; position:absolute; left:calc(${percentage}% - 5%); text-align:center;'>${progressValue}</span></div>`;
    }
  }],
});
```
