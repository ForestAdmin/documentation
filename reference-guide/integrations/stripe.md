{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Stripe

Configuring the Stripe integration for Forest allows you to have your **customer’s payments, invoices, cards and subscriptions** **(1)** alongside the corresponding customer from your application. A `Refund` Smart Action **(2,3)** is also implemented out-of-the-box.

![](<../../.gitbook/assets/image (67).png>)

{% tabs %}
{% tab title="SQL" %}
On our Live Demo, we’ve configured the Stripe integration on the `customers` collection. The Stripe Customer ID is already stored on the database under the field `stripe_id`.

{% code title="middlewares/forestadmin.js" %}
```javascript
...
const { objectMapping, connections } = require('../models');
​
module.exports = function (app) {
  app.use(Liana.init({
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
    integrations: {
      stripe: {
        apiKey: process.env.STRIPE_SECRET_KEY,
        mapping: 'customers.stripe_id',
        stripe: require('stripe')
      }
    }
  }));
​
  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
On our Live Demo, we’ve configured the Stripe integration on the `customers` collection. The Stripe Customer ID is already stored on the database under the field `stripe_id`.

{% code title="middlewares/forestadmin.js" %}
```javascript
...
const { objectMapping, connections } = require('../models');​

module.exports = function (app) {
  app.use(Liana.init({
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
    integrations: {
      stripe: {
        apiKey: process.env.STRIPE_SECRET_KEY,
        mapping: 'customers.stripe_id',
        stripe: require('stripe')
      }
    }
  }));

  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
On our Live Demo, we’ve configured the Stripe integration on the `Customer` collection. The Stripe Customer ID is already stored on the database under the field `stripe_id`.

{% code title="/config/initializers/forest_liana.rb" %}
```ruby
ForestLiana.env_secret = Rails.application.secrets.forest_env_secret
ForestLiana.auth_secret = Rails.application.secrets.forest_auth_secret

ForestLiana.integrations = {
  stripe: {
    api_key: ENV['STRIPE_SECRET_KEY'],
    mapping: 'Customer.stripe_id'
  }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

#### Available options

Here are the complete list of available options to customize your Stripe integration.

| Name     | Type   | Description                                                                                                                                                               |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| api\_key | string | The API Secret key of your Stripe account. Should normally starts with `sk_`.                                                                                             |
| mapping  | string | Indicates how to reconcile your Customer data from your Stripe account and your collection/field from your database. Format must be `model_name.stripe_customer_id_field` |

{% hint style="info" %}
A `stripe` option is also available to use the official [Node.js Stripe library](https://github.com/stripe/stripe-node) NPM package.
{% endhint %}
