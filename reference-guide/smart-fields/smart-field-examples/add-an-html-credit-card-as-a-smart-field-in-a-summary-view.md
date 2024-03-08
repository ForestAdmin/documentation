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
      field: 'Creditcard',
      type: 'String',
      get: (company) => {
        if (company.creditCard) {
          return `<div class="card-wrapper">
              <div class="card-container" style="font-size: 14px; border-radius: 10px; width: 250px; height: 140px; background-color: #444857; color: white; padding: 10px">
                <div class="card-number-container" style="margin-top: 5px">
                    <div class="card-info-title" style="color: #9399af; ">card number</div>
                    <div class="card-info-value" style="font-size: 12px">${company.creditCard.card_number
                      .match(/.{1,4}/g)
                      .join(' ')}</div>
                </div>
                <div class="card-name-date-container" style= "display: flex; margin-top: 20px">
                  <div class="card-name-container">
                    <div class="card-info-title" style="color: #9399af; ">card holder</div>
                    <div class="card-info-value" style="font-size: 12px">${
                      company.creditCard.card_holder
                        ? company.creditCard.card_holder
                        : company.name
                    }</div>
                  </div>
                  <div class="card-date-container" style="margin: auto">
                    <div class="card-info-title" style="color: #9399af; ">expires at</div>
                    <div class="card-info-value" style="font-size: 12px">${
                      company.creditCard.expiry_date
                    }</div>
                  </div>
                </div>
              </div>
            </div>`;
        }
      },
    },
  ],
  segments: [],
});
```

Use the rich text editor widget in order to interpret HTML in your field.

![](<../../../.gitbook/assets/image (489).png>)
