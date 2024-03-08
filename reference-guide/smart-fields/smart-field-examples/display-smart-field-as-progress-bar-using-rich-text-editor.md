{% hint style="warning" %}
Please be sure of your agent type and version and pick the right documentation accordingly.
{% endhint %}

{% tabs %}
{% tab title="Node.js" %}
{% hint style="danger" %}
This is the documentation of the `forest-express-sequelize` and `forest-express-mongoose` Node.js agents that will soon reach end-of-support.

`forest-express-sequelize` v9 and `forest-express-mongoose` v9 are replaced by [`@forestadmin/agent`](https://docs.forestadmin.com/developer-guide-agents-nodejs/) v1.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="Ruby on Rails" %}
{% hint style="success" %}
This is still the latest Ruby on Rails documentation of the `forest_liana` agent, you’re at the right place, please read on.
{% endhint %}
{% endtab %}

{% tab title="Python" %}
{% hint style="danger" %}
This is the documentation of the `django-forestadmin` Django agent that will soon reach end-of-support.

If you’re using a Django agent, notice that `django-forestadmin` v1 is replaced by [`forestadmin-agent-django`](https://docs.forestadmin.com/developer-guide-agents-python) v1.

If you’re using a Flask agent, go to the [`forestadmin-agent-flask`](https://docs.forestadmin.com/developer-guide-agents-python) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="PHP" %}
{% hint style="danger" %}
This is the documentation of the `forestadmin/laravel-forestadmin` Laravel agent that will soon reach end-of-support.

If you’re using a Laravel agent, notice that `forestadmin/laravel-forestadmin` v1 is replaced by [`forestadmin/laravel-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v3.

If you’re using a Symfony agent, go to the [`forestadmin/symfony-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}
{% endtabs %}

# Display smart field as progress bar using rich text editor

{% embed url="https://recordit.co/C86PbaN8Uy" %}

```javascript
const Liana = require('forest-express-sequelize');
const models = require('../models/');
const express = require('express');
const router = express.Router();

Liana.collection('orders', {
  fields: [
    {
      field: 'progressBar',
      type: 'String',
      get: (order) => {
        //set your value and max value
        var progressValue = yourProgressValue;
        var maxValue = yourMaxValue;
        var percentage = (progressValue / maxValue) * 100;
        return `<div style='position:relative;'><span style='text-align:left; width:100%;'>0</span><span style='text-align:right; width:100%; position:absolute;'>${maxValue}</span><meter min='0' low='40' high='80' max='${maxValue}' value='${progressValue}' style='width:100%'></meter><br><span style='width:10%; position:absolute; left:calc(${percentage}% - 5%); text-align:center;'>${progressValue}</span></div>`;
      },
    },
  ],
});
```
