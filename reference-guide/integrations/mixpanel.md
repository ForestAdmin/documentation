{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

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
