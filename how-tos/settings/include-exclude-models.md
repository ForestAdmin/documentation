# Include/exclude models

By default, all models declared in your app are analyzed by the Forest Admin agent in order to display them as collections in your admin panel.

You can exclude some of them from the analysis to never send their metadata to Forest Admin. By doing this, these models will therefore never be available in your admin panel.

To do so, add the following code to **either** define which models are included **or** excluded.

{% tabs %}
{% tab title="SQL" %}
#### Include models

{% code title="middlewares/forestadmin.js" %}
```javascript
...

app.use(require('forest-express-sequelize').init({
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  objectMapping,
  connections,
  includedModels: ['customers']
}));

...
```
{% endcode %}

#### Exclude models

{% code title="middlewares/forestadmin.js" %}
```javascript
...

app.use(require('forest-express-sequelize').init({
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  objectMapping,
  connections,
  excludedModels: ['documents', 'transactions']
}));

...
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
#### Include models

{% code title="middlewares/forestadmin.js" %}
```javascript
...

app.use(require('forest-express-mongoose').init({
  modelsDir: __dirname + '/models',
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  sequelize: require('./models').sequelize,
  includedModels: ['customers']
}));

...
```
{% endcode %}

#### Exclude models

{% code title="middlewares/forestadmin.js" %}
```javascript
...

app.use(require('forest-express-mongoose').init({
  modelsDir: __dirname + '/models',
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  sequelize: require('./models').sequelize,
  excludedModels: ['documents', 'transactions']
}));

...
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/config/initializers/forest_liana.rb" %}
```ruby
ForestLiana.env_secret = Rails.application.secrets.forest_env_secret
ForestLiana.auth_secret = Rails.application.secrets.forest_auth_secret

# ...

# in the [] you may add the precise list of all models you want to see in Forest
ForestLiana.included_models = ['Customer'];

# or second possibility below :

# in the [] you may add the precise list of all models you do not want to see in Forest
ForestLiana.excluded_models = ['Document', 'Transaction'];
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="/project/settings.py" %}
```python
# ...
FOREST = {
    'FOREST_ENV_SECRET': os.environ.get('FOREST_ENV_SECRET'),
    'FOREST_AUTH_SECRET': os.environ.get('FOREST_AUTH_SECRET'),
    # in the [] you may add the precise list of all models you want to see in Forest
    'INCLUDED_MODELS': ['Customer']
    # in the [] you may add the precise list of all models you do not want to see in Forest
    'EXCLUDED_MODELS': ['Customer', 'Transaction'],
}
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="config/forest.php" %}
```php
<?php

use App\Models\Customer;
use App\Models\Document;
use App\Models\Transaction;

return [
    ...
    // in the [] you may add the precise list of all models you want to see in Forest
    'included_models' => [Customer::class],
    // in the [] you may add the precise list of all models you do not want to see in Forest
    'excluded_models' => [Document::class, Transaction::class],
];
```
{% endcode %}
{% endtab %}
{% endtabs %}
