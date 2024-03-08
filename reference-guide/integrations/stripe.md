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

| Name    | Type   | Description                                                                                                                                                               |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| api_key | string | The API Secret key of your Stripe account. Should normally starts with `sk_`.                                                                                             |
| mapping | string | Indicates how to reconcile your Customer data from your Stripe account and your collection/field from your database. Format must be `model_name.stripe_customer_id_field` |

{% hint style="info" %}
A `stripe` option is also available to use the official [Node.js Stripe library](https://github.com/stripe/stripe-node) NPM package.
{% endhint %}
