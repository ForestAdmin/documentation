# Intercom

Configuring the Intercom integration allows you to display your user’s session data (location, browser type, …) and conversations.

{% hint style="warning" %}
In order for your intercom integration to work properly, you will have to use the version 2 of intercom API. To do so, you'll need go to the intercom developer hub and ensure that the app registered to retrieve your API key uses the intercom API version 2.0.
{% endhint %}

![](<../../.gitbook/assets/image (352).png>)

First, add the intercom client as a dependency to your project:

{% tabs %}
{% tab title="SQL" %}
```bash
npm install intercom-client@2.11
```
{% endtab %}

{% tab title="Mongodb" %}
```
npm install intercom-client@2.11
```
{% endtab %}

{% tab title="Rails" %}
{% code title="Gemfile" %}
```ruby
gem 'intercom'
```
{% endcode %}
{% endtab %}
{% endtabs %}

Then, you need to add the intercom integration:

{% tabs %}
{% tab title="SQL" %}
{% code title="middlewares/forestadmin.js" %}
```javascript
...
const intercomClient = require('intercom-client');
const { objectMapping, connections } = require('../models');

module.exports = async function (app) {
  app.use(await Liana.init({
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
    integrations: {
      intercom: {
        accessToken: process.env.INTERCOM_ACCESS_TOKEN,
        intercom: intercomClient,
        mapping: ['users.email'],
      },
    },
  }));

  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="middlewares/forestadmin.js" %}
```javascript
...
const intercomClient = require('intercom-client');
const { objectMapping, connections } = require('../models');

module.exports = async function (app) {
  app.use(await Liana.init({
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
    integrations: {
      intercom: {
        accessToken: process.env.INTERCOM_ACCESS_TOKEN,
        intercom: intercomClient,
        mapping: ['users.email'],
      },
    },
  }));

  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
```
{% endcode %}
{% endtab %}

{% tab title="" %}
{% code title="/config/initializers/forest_liana.rb" %}
```ruby
ForestLiana.integrations = {
  # ...
  intercom: {
    access_token: ENV['INTERCOM_ACCESS_TOKEN'],
    mapping: ['Customer']
  }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

* `intercom` is used to pass the intercom client version. To do so, you have to require the previously installed client, as in the example.
* `accessToken` should be defined in your environment variable and is provided by intercom.
* `mapping` refers to the collection and field name you want to map to intercom data. It can either be a field that contain emails that refer to intercom users or a field that contain ids mapping the `external_id` in Intercom API.

{% hint style="info" %}
You will have to restart your server to see Intercom plugged to your project.
{% endhint %}

![](<../../.gitbook/assets/image (353).png>)

### Others
