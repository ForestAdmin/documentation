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

# Mixpanel

The Mixpanel integration allows you to fetch Mixpanel’s events and display them at a record level into Forest.

{% tabs %}
{% tab title="SQL" %}
To benefit from Mixpanel integration, you need to add the package `mixpanel-data-export` before going further.

Then, add the following code to your `app.js` file. In our example we will map the `customers.email` with the data coming from Mixpanel. You may replace by your own relevant collection(s).

By default, Mixpanel is sending the following fields: id, event, date, city, region, country, timezone, os, osVersion, browser, browserVersion. If you want to add other fields from Mixpanel, you have to add them in `customProperties`:

{% code title="middlewares/forestadmin.js" %}

```javascript
...
const { objectMapping, connections } = require('../models');

module.exports = function (app) {
  app.use(Liana.init({
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
    integrations: {
      mixpanel: {
        apiKey: process.env.MIXPANEL_API_KEY,
        apiSecret: process.env.MIXPANEL_SECRET_KEY,
        mapping: ['customers.email'],
        customProperties: ['Campaign Source', 'plan', 'tutorial complete'],
        mixpanel: require('mixpanel-data-export')
      },
    },
  }));

  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
To benefit from Mixpanel integration, you need to add the package `mixpanel-data-export` before going further.

Then, add the following code to your `app.js` file. In our example we will map the `customers.email` with the data coming from Mixpanel. You may replace by your own relevant collection(s).

By default, Mixpanel is sending the following fields: id, event, date, city, region, country, timezone, os, osVersion, browser, browserVersion. If you want to add other fields from Mixpanel, you have to add them in `customProperties`:

{% code title="middlewares/forestadmin.js" %}

```javascript
...
const { objectMapping, connections } = require('../models');

module.exports = function (app) {
  app.use(Liana.init({
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
    integrations: {
      mixpanel: {
        apiKey: process.env.MIXPANEL_API_KEY,
        apiSecret: process.env.MIXPANEL_SECRET_KEY,
        mapping: ['customers.email'],
        customProperties: ['Campaign Source', 'plan', 'tutorial complete'],
        mixpanel: require('mixpanel-data-export')
      },
    },
  }));

  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
```

{% endcode %}
{% endtab %}

{% tab title="Rails" %}
To benefit from Mixpanel integration, you need to add the `gem 'mixpanel_client'` to your Gemfile.

Then, add the following code to your initializer. In our example we will map the `Customer.email` with the data coming from Mixpanel. You may replace by your own relevant collection(s).

By default, Mixpanel is sending the following fields: id, event, date, city, region, country, timezone, os, osVersion, browser, browserVersion. If you want to add other fields from Mixpanel, you have to add them in `customProperties`:

{% code title="/config/initializers/forest_liana.rb" %}

```ruby
ForestLiana.env_secret = Rails.application.secrets.forest_env_secret
ForestLiana.auth_secret = Rails.application.secrets.forest_auth_secret

ForestLiana.integrations = {
  mixpanel: {
    api_key: 'YOUR MIXPANEL API KEY',
    api_secret: 'YOUR MIXPANEL SECRET KEY',
    mapping: ['Customer.email'],
    custom_properties: ['Campaign Source', 'plan', 'tutorial complete'],
  }
}
```

{% endcode %}
{% endtab %}
{% endtabs %}

You will then be able to see the Mixpanel events on a record, a `Customer` in our example.

![](<../../.gitbook/assets/image (68).png>)

{% hint style="info" %}
You'll need to install the [Mixpanel Data Export](https://www.npmjs.com/package/mixpanel-data-export) package to run the Mixpanel integration
{% endhint %}
