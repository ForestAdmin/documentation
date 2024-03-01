{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Laravel specific settings

### Publish the configuration

If you would like to publish the configuration of the package, you can run the following command:

```php
php artisan vendor:publish --provider="ForestAdmin\LaravelForestAdmin\ForestServiceProvider" --tag=config
```

### Send apimap on deploy

When you want to deploy your forest admin to production (or other branch different of your local environment), you must run the following command:

```php
php artisan forest:send-apimap
```
This command must be run each time you deploy your application on production.

But you can avoid it and activate the mode "apimap send auto" with the environment variable `FOREST_SEND_APIMAP_AUTOMATIC`.

You have 2 solutions:
- add `FOREST_SEND_APIMAP_AUTOMATIC` to your .env file and set to true
- publish your configuration and set to true the `send_apimap_automatic` into `config/forest.php`


However, beware that if you activate this configuration, you must refresh your forest dashboard after you deploy on production.

{% hint style="info" %}
Depending on your configuration, refreshing the whole application may take a few seconds after your deployment. Using the environment variable is recommended for small projects, whereas the php artisan command is better suited when dealing with bigger projects.
{% endhint %}


### Onboard with Laravel Valet

When using Laravel Valet, you must configure to SSL.
```
valet secure YOUR_PROJECT_NAME
```

Then declare the corresponding url in your .env file into the APP_URL variable.
{% hint style="info" %}
Don't forget the S of https
{% endhint %}
```
APP_URL=https://YOUR_PROJECT_NAME.test
```

{% hint style="warning" %}
With Laravel Valet the apimap is not updated automatically.
We recommend that you set your environment variable FOREST_SEND_APIMAP_AUTOMATIC to true. More information in the previous chapter [Send apimap on deploy](#send-apimap-on-deploy)
{% endhint %}

### Customize models directory structure

The agent fetches the models into the directory specified by the `models_directory` configuration.
{% hint style="info" %}
All class files that doesn't extends the Illuminate\Database\Eloquent\Model are ignored.
{% endhint %}
By default, the value is the main models directory of Laravel 'app/Models', but you can change this configuration and add one or more models directories.

Example
```php
'models_directory'    => ['app/StripeModels', 'app/CustomerModels'],
```

You don't have to specify all the subdirectories, the agent will retrieve them for you.
For example, imagine with the directory structure : `app/StripeModels/Billing` & `app/StripeModels/Orders`, you have just to specify the main directory `app/StripeModels`.

You can also include/exclude models. More information [here](https://docs.forestadmin.com/documentation/how-tos/settings/include-exclude-models)
